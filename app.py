#!/usr/bin/env python3
"""
Privacy-First Real-Time Chat Application
Enhanced with Private Room + Invite Code System
Zero Data Retention - Fully Ephemeral

FIXED VERSION - WebSocket Connection Stable
"""

import os
import secrets
import string
import random
from datetime import datetime
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room

# ============================================================================
# FLASK APPLICATION INITIALIZATION
# ============================================================================

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(32)

# SocketIO Configuration - Fixed for stable WebSocket connections
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode='threading',  # Use threading mode for compatibility
    ping_timeout=60,
    ping_interval=25,
    max_http_buffer_size=50 * 1024 * 1024,  # 50MB for file transfers
    logger=False,
    engineio_logger=False,
    manage_session=False
)

# ============================================================================
# IN-MEMORY VOLATILE STORAGE (Cleared on restart/disconnect)
# NO PERSISTENCE - Privacy compliant
# ============================================================================

# Active users: {sid: {'username': str, 'room_code': str, 'color': str}}
active_users = {}

# Active rooms: {room_code: {'name': str, 'users': set(), 'created_by': str, 'is_private': bool}}
active_rooms = {
    'GLOBAL': {
        'name': 'Global Lobby',
        'users': set(),
        'created_by': 'System',
        'created_at': datetime.now(),
        'is_private': False
    }
}

# Typing status: {sid: bool}
typing_users = {}

# User colors for visual distinction
USER_COLORS = [
    '#00D9FF', '#FF00E5', '#00FF88', '#FFD600', '#FF6B35',
    '#A855F7', '#EC4899', '#14B8A6', '#F97316', '#8B5CF6',
    '#06B6D4', '#D946EF', '#22C55E', '#EAB308', '#EF4444',
    '#6366F1', '#84CC16', '#F43F5E', '#0EA5E9', '#10B981'
]

color_index = 0

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def get_next_color():
    """Assign rotating colors to users"""
    global color_index
    color = USER_COLORS[color_index % len(USER_COLORS)]
    color_index += 1
    return color


def generate_room_code(length=6):
    """Generate a unique random room code"""
    characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'  # Removed confusing chars
    while True:
        code = ''.join(random.choices(characters, k=length))
        if code not in active_rooms:
            return code


def get_active_users_list(room_code=None):
    """Get list of active users, optionally filtered by room"""
    users = []
    for sid, data in active_users.items():
        if room_code is None or data.get('room_code') == room_code:
            users.append({
                'username': data['username'],
                'color': data['color'],
                'sid': sid,
                'room_code': data.get('room_code')
            })
    return users


def get_rooms_list(include_private=False):
    """Get list of active rooms with user counts"""
    rooms_list = []
    for room_code, data in active_rooms.items():
        if not include_private and data.get('is_private', False):
            continue
        rooms_list.append({
            'code': room_code,
            'name': data['name'],
            'users': len(data['users']),
            'created_by': data['created_by'],
            'is_private': data.get('is_private', False)
        })
    return rooms_list


def cleanup_empty_rooms():
    """Remove empty private rooms"""
    rooms_to_delete = []
    for room_code, data in active_rooms.items():
        if room_code != 'GLOBAL' and len(data['users']) == 0:
            rooms_to_delete.append(room_code)
    
    for room_code in rooms_to_delete:
        del active_rooms[room_code]
        print(f'[CLEANUP] Room {room_code} deleted (empty)')


def validate_room_code(code):
    """Validate room code format"""
    if not code:
        return False
    code = code.upper().strip()
    if len(code) < 4 or len(code) > 8:
        return False
    if not code.isalnum():
        return False
    return True


def get_typing_users(room_code):
    """Get list of users currently typing in a room"""
    typing = []
    for sid, is_typing in typing_users.items():
        if is_typing and sid in active_users:
            user_data = active_users[sid]
            if user_data.get('room_code') == room_code:
                typing.append(user_data['username'])
    return typing


# ============================================================================
# ROUTES
# ============================================================================

@app.route('/')
def index():
    """Serve the main chat interface"""
    return render_template('index.html')


@app.route('/health')
def health():
    """Health check endpoint for deployment"""
    return {
        'status': 'healthy',
        'users': len(active_users),
        'rooms': len(active_rooms)
    }, 200


# ============================================================================
# SOCKET.IO EVENT HANDLERS
# ============================================================================

@socketio.on('connect')
def handle_connect():
    """Handle new client connection"""
    sid = request.sid
    print(f'[CONNECT] Client connected: {sid}')
    emit('connection_established', {'sid': sid})


@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection - Clean up all traces"""
    sid = request.sid
    
    if sid in active_users:
        user_data = active_users[sid]
        username = user_data['username']
        room_code = user_data.get('room_code', 'GLOBAL')
        
        # Remove from room tracking
        if room_code in active_rooms:
            active_rooms[room_code]['users'].discard(sid)
            
            # Notify room about user leaving
            emit('user_left', {
                'username': username,
                'room_code': room_code,
                'users': get_active_users_list(room_code),
                'user_count': len(active_rooms[room_code]['users'])
            }, room=room_code)
        
        # Remove from active users
        del active_users[sid]
        
        # Remove typing status
        if sid in typing_users:
            del typing_users[sid]
        
        # Cleanup empty rooms
        cleanup_empty_rooms()
        
        # Update all clients with new room lists
        emit('update_rooms', {
            'rooms': get_rooms_list()
        }, broadcast=True)
        
        print(f'[DISCONNECT] {username} left room {room_code}')


@socketio.on('join')
def handle_join(data):
    """Handle user joining the chat"""
    username = data.get('username', '').strip()
    room_code = data.get('room_code', 'GLOBAL').upper().strip()
    
    if not username:
        emit('error', {'message': 'Username is required', 'code': 'INVALID_USERNAME'})
        return
    
    if len(username) < 2 or len(username) > 20:
        emit('error', {'message': 'Username must be 2-20 characters', 'code': 'INVALID_USERNAME'})
        return
    
    # Check for duplicate username in the same room
    for sid, user_data in active_users.items():
        if user_data['username'].lower() == username.lower() and user_data.get('room_code') == room_code:
            emit('error', {'message': 'Username already taken in this room', 'code': 'DUPLICATE_USERNAME'})
            return
    
    # Validate room code
    if room_code != 'GLOBAL' and room_code not in active_rooms:
        emit('error', {'message': 'Room not found. Check the code and try again.', 'code': 'ROOM_NOT_FOUND'})
        return
    
    sid = request.sid
    color = get_next_color()
    
    # Store user data (volatile, in-memory only)
    active_users[sid] = {
        'username': username,
        'room_code': room_code,
        'color': color,
        'joined_at': datetime.now()
    }
    
    # Add user to room
    if room_code in active_rooms:
        active_rooms[room_code]['users'].add(sid)
    
    # Join Socket.IO room
    join_room(room_code)
    
    room_data = active_rooms.get(room_code, {})
    
    # Confirm join to user
    emit('join_confirmed', {
        'username': username,
        'room_code': room_code,
        'room_name': room_data.get('name', room_code),
        'color': color,
        'users': get_active_users_list(room_code),
        'user_count': len(room_data.get('users', set())),
        'is_private': room_data.get('is_private', False),
        'rooms': get_rooms_list()
    })
    
    # Notify room about new user
    emit('user_joined', {
        'username': username,
        'color': color,
        'room_code': room_code,
        'users': get_active_users_list(room_code),
        'user_count': len(room_data.get('users', set()))
    }, room=room_code, include_self=False)
    
    print(f'[JOIN] {username} joined {room_code}')


@socketio.on('create_private_room')
def handle_create_private_room(data):
    """Create a new private room with unique code"""
    sid = request.sid
    
    room_name = data.get('room_name', '').strip()
    if not room_name:
        room_name = "Private Room"
    
    if len(room_name) > 30:
        room_name = room_name[:30]
    
    # Get username if available
    username = "Unknown"
    if sid in active_users:
        username = active_users[sid]['username']
    
    # Generate unique room code
    room_code = generate_room_code(6)
    
    # Create the room
    active_rooms[room_code] = {
        'name': room_name,
        'users': set(),
        'created_by': username,
        'created_at': datetime.now(),
        'is_private': True
    }
    
    emit('private_room_created', {
        'room_code': room_code,
        'room_name': room_name,
        'created_by': username
    })
    
    print(f'[CREATE] Private room {room_code} created by {username}')


@socketio.on('join_private_room')
def handle_join_private_room(data):
    """Join an existing private room via code"""
    sid = request.sid
    room_code = data.get('room_code', '').upper().strip()
    username = data.get('username', '').strip()
    
    if not username:
        emit('error', {'message': 'Username is required', 'code': 'INVALID_USERNAME'})
        return
    
    if len(username) < 2 or len(username) > 20:
        emit('error', {'message': 'Username must be 2-20 characters', 'code': 'INVALID_USERNAME'})
        return
    
    if not validate_room_code(room_code):
        emit('error', {'message': 'Invalid room code format', 'code': 'INVALID_CODE'})
        return
    
    if room_code not in active_rooms:
        emit('error', {'message': 'Room not found. Check the code and try again.', 'code': 'ROOM_NOT_FOUND'})
        return
    
    # Check for duplicate username in the room
    for user_sid, user_data in active_users.items():
        if user_data['username'].lower() == username.lower() and user_data.get('room_code') == room_code:
            emit('error', {'message': 'Username already taken in this room', 'code': 'DUPLICATE_USERNAME'})
            return
    
    color = get_next_color()
    
    # If user was in another room, leave it first
    if sid in active_users:
        old_room = active_users[sid].get('room_code')
        if old_room and old_room in active_rooms:
            active_rooms[old_room]['users'].discard(sid)
            leave_room(old_room)
            emit('user_left', {
                'username': active_users[sid]['username'],
                'room_code': old_room,
                'users': get_active_users_list(old_room),
                'user_count': len(active_rooms[old_room]['users'])
            }, room=old_room)
    
    # Store/update user data
    active_users[sid] = {
        'username': username,
        'room_code': room_code,
        'color': color,
        'joined_at': datetime.now()
    }
    
    # Add to room
    active_rooms[room_code]['users'].add(sid)
    join_room(room_code)
    
    room_data = active_rooms[room_code]
    
    # Confirm join
    emit('join_confirmed', {
        'username': username,
        'room_code': room_code,
        'room_name': room_data['name'],
        'color': color,
        'users': get_active_users_list(room_code),
        'user_count': len(room_data['users']),
        'is_private': room_data['is_private'],
        'rooms': get_rooms_list()
    })
    
    # Notify room
    emit('user_joined', {
        'username': username,
        'color': color,
        'room_code': room_code,
        'users': get_active_users_list(room_code),
        'user_count': len(room_data['users'])
    }, room=room_code, include_self=False)
    
    # Cleanup empty rooms
    cleanup_empty_rooms()
    
    print(f'[JOIN] {username} joined private room {room_code}')


@socketio.on('leave_room')
def handle_leave_room(data=None):
    """Handle user leaving a room"""
    sid = request.sid
    
    if sid not in active_users:
        emit('left_room', {'success': True})
        return
    
    user_data = active_users[sid]
    username = user_data['username']
    room_code = user_data.get('room_code')
    
    if room_code and room_code in active_rooms:
        # Remove from room
        active_rooms[room_code]['users'].discard(sid)
        leave_room(room_code)
        
        # Notify room
        emit('user_left', {
            'username': username,
            'room_code': room_code,
            'users': get_active_users_list(room_code),
            'user_count': len(active_rooms[room_code]['users'])
        }, room=room_code)
        
        # Cleanup empty rooms
        cleanup_empty_rooms()
    
    # Remove user data
    del active_users[sid]
    
    if sid in typing_users:
        del typing_users[sid]
    
    emit('left_room', {'success': True})
    
    # Update room list for all
    emit('update_rooms', {
        'rooms': get_rooms_list()
    }, broadcast=True)
    
    print(f'[LEAVE] {username} left room {room_code}')


@socketio.on('send_message')
def handle_message(data):
    """Handle incoming chat message - NO STORAGE"""
    sid = request.sid
    
    if sid not in active_users:
        return
    
    user_data = active_users[sid]
    message = data.get('message', '').strip()
    
    if not message:
        return
    
    if len(message) > 2000:
        message = message[:2000]
    
    room_code = user_data.get('room_code', 'GLOBAL')
    
    # Broadcast message ONLY to the specific room (NOT stored anywhere)
    emit('new_message', {
        'username': user_data['username'],
        'message': message,
        'color': user_data['color'],
        'timestamp': datetime.now().strftime('%H:%M'),
        'sid': sid,
        'room_code': room_code
    }, room=room_code)
    
    # Clear typing status
    if sid in typing_users:
        del typing_users[sid]
        emit('typing_update', {
            'typing_users': get_typing_users(room_code)
        }, room=room_code)


@socketio.on('typing')
def handle_typing(data):
    """Handle typing indicator - Ephemeral only"""
    sid = request.sid
    
    if sid not in active_users:
        return
    
    user_data = active_users[sid]
    is_typing = data.get('typing', False)
    room_code = user_data.get('room_code', 'GLOBAL')
    
    if is_typing:
        typing_users[sid] = True
    elif sid in typing_users:
        del typing_users[sid]
    
    emit('typing_update', {
        'typing_users': get_typing_users(room_code)
    }, room=room_code, include_self=False)


@socketio.on('check_room')
def handle_check_room(data):
    """Check if a room code is valid"""
    room_code = data.get('room_code', '').upper().strip()
    
    if not validate_room_code(room_code):
        emit('room_check_result', {
            'valid': False,
            'message': 'Invalid code format'
        })
        return
    
    if room_code in active_rooms:
        room_data = active_rooms[room_code]
        emit('room_check_result', {
            'valid': True,
            'room_code': room_code,
            'room_name': room_data['name'],
            'user_count': len(room_data['users']),
            'is_private': room_data['is_private']
        })
    else:
        emit('room_check_result', {
            'valid': False,
            'message': 'Room not found'
        })


@socketio.on('private_message')
def handle_private_message(data):
    """Handle private message - Direct transmission only"""
    sid = request.sid
    
    if sid not in active_users:
        return
    
    sender_data = active_users[sid]
    target_sid = data.get('target_sid')
    message = data.get('message', '').strip()
    
    if not message or not target_sid:
        return
    
    if target_sid not in active_users:
        emit('error', {'message': 'User not found', 'code': 'USER_NOT_FOUND'})
        return
    
    target_data = active_users[target_sid]
    timestamp = datetime.now().strftime('%H:%M')
    
    # Send to recipient
    emit('private_message', {
        'from_username': sender_data['username'],
        'from_sid': sid,
        'message': message,
        'color': sender_data['color'],
        'timestamp': timestamp,
        'is_incoming': True
    }, room=target_sid)
    
    # Confirm to sender
    emit('private_message', {
        'to_username': target_data['username'],
        'to_sid': target_sid,
        'message': message,
        'color': sender_data['color'],
        'timestamp': timestamp,
        'is_incoming': False
    }, room=sid)


@socketio.on('share_file')
def handle_file_share(data):
    """Handle file sharing via base64 - NO STORAGE"""
    sid = request.sid
    
    if sid not in active_users:
        return
    
    user_data = active_users[sid]
    room_code = user_data.get('room_code', 'GLOBAL')
    
    file_data = data.get('file_data')
    file_name = data.get('file_name', 'file')
    file_type = data.get('file_type', 'application/octet-stream')
    file_size = data.get('file_size', 0)
    
    if not file_data:
        return
    
    # Broadcast file ONLY to the specific room (NOT stored - direct transmission)
    emit('file_shared', {
        'username': user_data['username'],
        'color': user_data['color'],
        'file_data': file_data,
        'file_name': file_name,
        'file_type': file_type,
        'file_size': file_size,
        'timestamp': datetime.now().strftime('%H:%M'),
        'sid': sid,
        'room_code': room_code
    }, room=room_code)


@socketio.on('private_file')
def handle_private_file(data):
    """Handle private file sharing"""
    sid = request.sid
    
    if sid not in active_users:
        return
    
    sender_data = active_users[sid]
    target_sid = data.get('target_sid')
    
    if not target_sid or target_sid not in active_users:
        emit('error', {'message': 'User not found', 'code': 'USER_NOT_FOUND'})
        return
    
    target_data = active_users[target_sid]
    timestamp = datetime.now().strftime('%H:%M')
    
    # Send to recipient
    emit('private_file', {
        'from_username': sender_data['username'],
        'from_sid': sid,
        'file_data': data.get('file_data'),
        'file_name': data.get('file_name'),
        'file_type': data.get('file_type'),
        'file_size': data.get('file_size'),
        'color': sender_data['color'],
        'timestamp': timestamp,
        'is_incoming': True
    }, room=target_sid)
    
    # Confirm to sender
    emit('private_file', {
        'to_username': target_data['username'],
        'to_sid': target_sid,
        'file_name': data.get('file_name'),
        'file_size': data.get('file_size'),
        'color': sender_data['color'],
        'timestamp': timestamp,
        'is_incoming': False
    }, room=sid)


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@socketio.on_error_default
def default_error_handler(e):
    """Handle Socket.IO errors"""
    print(f'[ERROR] Socket.IO error: {e}')


@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    return {'error': 'Not found'}, 404


@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors"""
    return {'error': 'Internal server error'}, 500


# ============================================================================
# APPLICATION ENTRY POINT
# ============================================================================

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    
    print(f"""
    ╔══════════════════════════════════════════════════════════════╗
    ║       🔒 EPHEMERAL CHAT - PRIVATE ROOMS EDITION 🔒           ║
    ╠══════════════════════════════════════════════════════════════╣
    ║  ✓ Private Rooms with Invite Codes                           ║
    ║  ✓ Zero Data Retention                                       ║
    ║  ✓ No Database                                               ║
    ║  ✓ Fully Ephemeral                                           ║
    ╠══════════════════════════════════════════════════════════════╣
    ║  🌐 Server running on:                                       ║
    ║     Local:   http://127.0.0.1:{port}                           ║
    ║     Network: http://0.0.0.0:{port}                             ║
    ╚══════════════════════════════════════════════════════════════╝
    """)
    
    # Run with threading mode (most compatible)
    socketio.run(
        app,
        host='0.0.0.0',
        port=port,
        debug=True,
        use_reloader=False,
        allow_unsafe_werkzeug=True
    )