/**
 * Ephemeral Chat - Premium Experiential Edition
 * Zero Data Retention - Fully Ephemeral
 * With Mood Themes, Sounds, Companion & More
 */

'use strict';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
    TYPING_TIMEOUT: 2000,
    RECONNECT_ATTEMPTS: 5,
    RECONNECT_DELAY: 3000,
    MAX_FILE_SIZE: 25 * 1024 * 1024,
    TOAST_DURATION: 4000,
    SCROLL_THRESHOLD: 100,
    CODE_CHECK_DEBOUNCE: 500,
    SURPRISE_CHANCE: 0.08, // 8% chance for surprise animations
    ENERGY_DECAY_RATE: 0.02,
    ENERGY_BOOST_MESSAGE: 0.1,
    MUSIC_LINK_PATTERNS: [
        /spotify\.com/i,
        /soundcloud\.com/i,
        /youtube\.com.*(?:watch|music)/i,
        /youtu\.be/i,
        /apple\.com.*music/i,
        /deezer\.com/i
    ]
};

// ============================================================================
// EMOJI DATA
// ============================================================================

const EMOJI_DATA = {
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐'],
    gestures: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🪱', '🐛', '🦋', '🐌', '🐞', '🐜', '🪰', '🪲', '🪳', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍'],
    food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺', '🤾', '🏌️', '🏇', '🧘', '🏄'],
    objects: ['💡', '🔦', '🕯️', '🧯', '💰', '💵', '💴', '💶', '💷', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪓', '🪚', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '☢️', '☣️', '✴️', '💮']
};

// Typing personalities
const TYPING_PERSONALITIES = [
    'typing...',
    'thinking...',
    'typing fast...',
    'composing thoughts...',
    'writing something...',
    'crafting a message...',
    'pondering...',
    'typing with intent...'
];

// ============================================================================
// APPLICATION STATE
// ============================================================================

const state = {
    socket: null,
    username: null,
    userColor: null,
    roomCode: null,
    roomName: null,
    sid: null,
    isConnected: false,
    typingTimeout: null,
    isTyping: false,
    pmTarget: null,
    pmMessages: {},
    pendingFile: null,
    pendingRoomCode: null,
    codeCheckTimeout: null,
    notificationPermission: false,
    
    // Experiential Features
    currentMood: 'default',
    soundEnabled: false,
    physicsEnabled: true,
    energyEnabled: false,
    surpriseEnabled: true,
    energyLevel: 0.2,
    lastMessageTime: Date.now(),
    messageCount: 0
};

// Audio Context for sounds
let audioContext = null;

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const DOM = {};

function initDOMReferences() {
    // Screens
    DOM.loadingScreen = document.getElementById('loading-screen');
    DOM.landingScreen = document.getElementById('landing-screen');
    DOM.chatScreen = document.getElementById('chat-screen');
    
    // Landing Cards
    DOM.createRoomCard = document.getElementById('create-room-card');
    DOM.joinRoomCard = document.getElementById('join-room-card');
    DOM.globalRoomCard = document.getElementById('global-room-card');
    
    // Create Modal
    DOM.createModal = document.getElementById('create-modal');
    DOM.createModalClose = document.getElementById('create-modal-close');
    DOM.createUsername = document.getElementById('create-username');
    DOM.createRoomName = document.getElementById('create-room-name');
    DOM.createRoomBtn = document.getElementById('create-room-btn');
    
    // Code Modal
    DOM.codeModal = document.getElementById('code-modal');
    DOM.generatedCode = document.getElementById('generated-code');
    DOM.copyCodeBtn = document.getElementById('copy-code-btn');
    DOM.enterRoomBtn = document.getElementById('enter-room-btn');
    
    // Join Modal
    DOM.joinModal = document.getElementById('join-modal');
    DOM.joinModalClose = document.getElementById('join-modal-close');
    DOM.joinUsername = document.getElementById('join-username');
    DOM.joinCodeInput = document.getElementById('join-code-input');
    DOM.codeValidation = document.getElementById('code-validation');
    DOM.joinRoomBtn = document.getElementById('join-room-btn');
    
    // Global Modal
    DOM.globalModal = document.getElementById('global-modal');
    DOM.globalModalClose = document.getElementById('global-modal-close');
    DOM.globalUsername = document.getElementById('global-username');
    DOM.globalJoinBtn = document.getElementById('global-join-btn');
    
    // Settings Modal
    DOM.settingsModal = document.getElementById('settings-modal');
    DOM.settingsModalClose = document.getElementById('settings-modal-close');
    DOM.settingsBtn = document.getElementById('settings-btn');
    DOM.soundToggle = document.getElementById('sound-toggle');
    
    // Chat Header
    DOM.leaveRoomBtn = document.getElementById('leave-room-btn');
    DOM.chatRoomName = document.getElementById('chat-room-name');
    DOM.chatRoomCode = document.getElementById('chat-room-code');
    DOM.headerCopyBtn = document.getElementById('header-copy-btn');
    DOM.onlineCount = document.getElementById('online-count');
    DOM.toggleUsersBtn = document.getElementById('toggle-users-btn');
    
    // Chat Area
    DOM.messagesArea = document.getElementById('messages-area');
    DOM.messagesScroll = document.getElementById('messages-scroll');
    DOM.welcomeMessage = document.getElementById('welcome-message');
    DOM.typingIndicator = document.getElementById('typing-indicator');
    DOM.typingText = document.getElementById('typing-text');
    
    // Users Sidebar
    DOM.usersSidebar = document.getElementById('users-sidebar');
    DOM.closeSidebarBtn = document.getElementById('close-sidebar-btn');
    DOM.usersList = document.getElementById('users-list');
    
    // Chat Input
    DOM.messageInput = document.getElementById('message-input');
    DOM.sendBtn = document.getElementById('send-btn');
    DOM.attachBtn = document.getElementById('attach-btn');
    DOM.fileInput = document.getElementById('file-input');
    DOM.emojiBtn = document.getElementById('emoji-btn');
    DOM.emojiPicker = document.getElementById('emoji-picker');
    DOM.emojiGrid = document.getElementById('emoji-grid');
    DOM.emojiCloseBtn = document.getElementById('emoji-close-btn');
    
    // PM Modal
    DOM.pmModal = document.getElementById('pm-modal');
    DOM.pmAvatar = document.getElementById('pm-avatar');
    DOM.pmUsername = document.getElementById('pm-username');
    DOM.pmMessages = document.getElementById('pm-messages');
    DOM.pmMessageInput = document.getElementById('pm-message-input');
    DOM.pmSendBtn = document.getElementById('pm-send-btn');
    DOM.pmCloseBtn = document.getElementById('pm-close-btn');
    DOM.pmAttachBtn = document.getElementById('pm-attach-btn');
    DOM.pmFileInput = document.getElementById('pm-file-input');
    
    // File Preview
    DOM.filePreviewModal = document.getElementById('file-preview-modal');
    DOM.filePreviewName = document.getElementById('file-preview-name');
    DOM.filePreviewBody = document.getElementById('file-preview-body');
    DOM.filePreviewClose = document.getElementById('file-preview-close');
    DOM.fileCancelBtn = document.getElementById('file-cancel-btn');
    DOM.fileSendBtn = document.getElementById('file-send-btn');
    
    // Image Viewer
    DOM.imageViewer = document.getElementById('image-viewer');
    DOM.imageViewerImg = document.getElementById('image-viewer-img');
    DOM.imageViewerClose = document.getElementById('image-viewer-close');
    
    // Leave Modal
    DOM.leaveModal = document.getElementById('leave-modal');
    DOM.leaveCancelBtn = document.getElementById('leave-cancel-btn');
    DOM.leaveConfirmBtn = document.getElementById('leave-confirm-btn');
    
    // Toast
    DOM.toastContainer = document.getElementById('toast-container');
    
    // Experiential Features
    DOM.energyMeter = document.getElementById('energy-meter');
    DOM.energyFill = document.getElementById('energy-fill');
    DOM.musicMoodOverlay = document.getElementById('music-mood-overlay');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileIcon(type) {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎬';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('document') || type.includes('word')) return '📝';
    if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📎';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function linkifyText(text) {
    const urlPattern = /(https?:\/\/[^\s<]+)/g;
    return escapeHtml(text).replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}

function getInitials(username) {
    return username.charAt(0).toUpperCase();
}

function showToast(title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>`,
        error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>`,
        info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>`,
        warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>`
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <div class="toast-content">
            <div class="toast-title">${escapeHtml(title)}</div>
            ${message ? `<div class="toast-message">${escapeHtml(message)}</div>` : ''}
        </div>
    `;
    
    DOM.toastContainer.appendChild(toast);
    
    // Play sound if enabled
    if (state.soundEnabled) {
        playSound('notification');
    }
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, CONFIG.TOAST_DURATION);
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (e) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        state.notificationPermission = permission === 'granted';
    } else if (Notification.permission === 'granted') {
        state.notificationPermission = true;
    }
}

function showBrowserNotification(title, body) {
    if (state.notificationPermission && document.hidden) {
        new Notification(title, {
            body,
            icon: '⚡',
            badge: '⚡',
            tag: 'ephemeral-chat'
        });
    }
}

function scrollToBottom(smooth = true) {
    DOM.messagesScroll.scrollTo({
        top: DOM.messagesScroll.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
    });
}

function shouldAutoScroll() {
    const threshold = CONFIG.SCROLL_THRESHOLD;
    const position = DOM.messagesScroll.scrollTop + DOM.messagesScroll.clientHeight;
    return DOM.messagesScroll.scrollHeight - position < threshold;
}

function validateUsername(username) {
    if (!username || username.trim().length < 2) {
        return { valid: false, message: 'Username must be at least 2 characters' };
    }
    if (username.length > 20) {
        return { valid: false, message: 'Username must be 20 characters or less' };
    }
    if (!/^[a-zA-Z0-9_\-\s]+$/.test(username)) {
        return { valid: false, message: 'Username can only contain letters, numbers, spaces, - and _' };
    }
    return { valid: true };
}

// ============================================================================
// SOUND SYSTEM
// ============================================================================

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

function playSound(type) {
    if (!state.soundEnabled) return;
    
    try {
        const ctx = initAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        const sounds = {
            send: { freq: 800, type: 'sine', duration: 0.1, gain: 0.08 },
            receive: { freq: 600, type: 'sine', duration: 0.15, gain: 0.06 },
            notification: { freq: 700, type: 'sine', duration: 0.2, gain: 0.05 },
            typing: { freq: 400, type: 'sine', duration: 0.05, gain: 0.02 }
        };
        
        const sound = sounds[type] || sounds.notification;
        
        oscillator.frequency.value = sound.freq;
        oscillator.type = sound.type;
        
        gainNode.gain.setValueAtTime(sound.gain, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + sound.duration);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + sound.duration);
    } catch (e) {
        // Audio not supported
    }
}

// ============================================================================
// MOOD SYSTEM
// ============================================================================

function setMood(mood) {
    state.currentMood = mood;
    document.documentElement.setAttribute('data-mood', mood);
    
    // Update active button
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mood === mood);
    });

}

// ============================================================================
// SURPRISE ANIMATIONS
// ============================================================================

function shouldApplySurprise() {
    return state.surpriseEnabled && Math.random() < CONFIG.SURPRISE_CHANCE;
}

function getRandomSurprise() {
    const surprises = ['surprise-glow', 'surprise-bounce', 'surprise-sparkle'];
    return surprises[Math.floor(Math.random() * surprises.length)];
}

// ============================================================================
// MUSIC DETECTION
// ============================================================================

function detectMusicLink(message) {
    return CONFIG.MUSIC_LINK_PATTERNS.some(pattern => pattern.test(message));
}

function showMusicMood() {
    if (!DOM.musicMoodOverlay) return;
    
    DOM.musicMoodOverlay.classList.remove('hidden');
    
    setTimeout(() => {
        DOM.musicMoodOverlay.classList.add('hidden');
    }, 5000);
}

// ============================================================================
// ENERGY METER
// ============================================================================

function initEnergyMeter() {
    if (!state.energyEnabled || !DOM.energyMeter) return;
    
    DOM.energyMeter.classList.remove('hidden');
    updateEnergyDisplay();
    
    // Start decay
    setInterval(() => {
        if (state.energyEnabled) {
            state.energyLevel = Math.max(0, state.energyLevel - CONFIG.ENERGY_DECAY_RATE);
            updateEnergyDisplay();
        }
    }, 5000);
}

function hideEnergyMeter() {
    if (DOM.energyMeter) {
        DOM.energyMeter.classList.add('hidden');
    }
}

function boostEnergy(amount = CONFIG.ENERGY_BOOST_MESSAGE) {
    state.energyLevel = Math.min(1, state.energyLevel + amount);
    updateEnergyDisplay();
}

function updateEnergyDisplay() {
    if (!DOM.energyFill || !DOM.energyMeter) return;
    
    const percentage = state.energyLevel * 100;
    DOM.energyFill.style.height = `${percentage}%`;
    
    // Update energy level class
    DOM.energyMeter.classList.remove('low', 'medium', 'high', 'max');
    
    if (state.energyLevel < 0.25) {
        DOM.energyMeter.classList.add('low');
    } else if (state.energyLevel < 0.5) {
        DOM.energyMeter.classList.add('medium');
    } else if (state.energyLevel < 0.8) {
        DOM.energyMeter.classList.add('high');
    } else {
        DOM.energyMeter.classList.add('max');
    }
}

// ============================================================================
// TYPING PERSONALITY
// ============================================================================

function getTypingPersonality() {
    return TYPING_PERSONALITIES[Math.floor(Math.random() * TYPING_PERSONALITIES.length)];
}

// ============================================================================
// SCREEN NAVIGATION
// ============================================================================

function showScreen(screenId) {
    DOM.landingScreen.classList.add('hidden');
    DOM.chatScreen.classList.add('hidden');
    
    if (screenId === 'landing') {
        DOM.landingScreen.classList.remove('hidden');
    } else if (screenId === 'chat') {
        DOM.chatScreen.classList.remove('hidden');
        DOM.messageInput.focus();
        
        // Initialize features
        if (state.energyEnabled) initEnergyMeter();
        if (state.physicsEnabled) {
            DOM.messagesScroll.classList.add('physics-enabled');
        }
    }
}

function showModal(modal) {
    modal.classList.remove('hidden');
    const firstInput = modal.querySelector('input');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

function hideModal(modal) {
    modal.classList.add('hidden');
}

function hideAllModals() {
    DOM.createModal.classList.add('hidden');
    DOM.codeModal.classList.add('hidden');
    DOM.joinModal.classList.add('hidden');
    DOM.globalModal.classList.add('hidden');
    DOM.settingsModal?.classList.add('hidden');
    DOM.pmModal.classList.add('hidden');
    DOM.filePreviewModal.classList.add('hidden');
    DOM.leaveModal.classList.add('hidden');
    DOM.imageViewer.classList.add('hidden');
}

// ============================================================================
// SOCKET CONNECTION
// ============================================================================

function initializeSocket() {
    state.socket = io({
        transports: ['polling', 'websocket'],
        reconnection: true,
        reconnectionAttempts: CONFIG.RECONNECT_ATTEMPTS,
        reconnectionDelay: CONFIG.RECONNECT_DELAY
    });
    
    state.socket.on('connect', onConnect);
    state.socket.on('disconnect', onDisconnect);
    state.socket.on('connect_error', onConnectError);
    state.socket.on('connection_established', onConnectionEstablished);
    
    state.socket.on('private_room_created', onPrivateRoomCreated);
    state.socket.on('room_check_result', onRoomCheckResult);
    state.socket.on('join_confirmed', onJoinConfirmed);
    state.socket.on('left_room', onLeftRoom);
    
    state.socket.on('user_joined', onUserJoined);
    state.socket.on('user_left', onUserLeft);
    state.socket.on('update_rooms', onUpdateRooms);
    
    state.socket.on('new_message', onNewMessage);
    state.socket.on('typing_update', onTypingUpdate);
    state.socket.on('file_shared', onFileShared);
    
    state.socket.on('private_message', onPrivateMessage);
    state.socket.on('private_file', onPrivateFile);
    
    state.socket.on('error', onError);
}

function onConnect() {
    console.log('🔌 Connected to server');
    state.isConnected = true;
}

function onDisconnect(reason) {
    console.log('🔌 Disconnected:', reason);
    state.isConnected = false;
    showToast('Disconnected', 'Attempting to reconnect...', 'warning');
}

function onConnectError(error) {
    console.error('Connection error:', error);
    showToast('Connection Error', 'Unable to connect to server', 'error');
}

function onConnectionEstablished(data) {
    state.sid = data.sid;
    hideLoadingScreen();
    showScreen('landing');
}

function onError(data) {
    showToast('Error', data.message, 'error');
    
    if (data.code === 'ROOM_NOT_FOUND') {
        updateCodeValidation(false, 'Room not found');
        DOM.joinRoomBtn.disabled = true;
    } else if (data.code === 'DUPLICATE_USERNAME') {
        showToast('Username Taken', 'Please choose a different name', 'error');
    }
}

// ============================================================================
// ROOM EVENT HANDLERS
// ============================================================================

function onPrivateRoomCreated(data) {
    state.pendingRoomCode = data.room_code;
    DOM.generatedCode.textContent = data.room_code;
    hideModal(DOM.createModal);
    showModal(DOM.codeModal);
}

function onRoomCheckResult(data) {
    if (data.valid) {
        updateCodeValidation(true, `${data.room_name} • ${data.user_count} online`);
        DOM.joinRoomBtn.disabled = false;
    } else {
        updateCodeValidation(false, data.message || 'Room not found');
        DOM.joinRoomBtn.disabled = true;
    }
}

function onJoinConfirmed(data) {
    state.username = data.username;
    state.userColor = data.color;
    state.roomCode = data.room_code;
    state.roomName = data.room_name;
    
    DOM.chatRoomName.textContent = data.room_name;
    DOM.chatRoomCode.querySelector('.code-text').textContent = data.room_code;
    
    if (data.room_code === 'GLOBAL') {
        DOM.chatRoomCode.style.display = 'none';
    } else {
        DOM.chatRoomCode.style.display = 'inline-flex';
    }
    
    updateUsersList(data.users);
    DOM.onlineCount.textContent = data.user_count;
    
    clearMessages();
    hideAllModals();
    showScreen('chat');
    
    requestNotificationPermission();
    showToast('Joined!', `Welcome to ${data.room_name}`, 'success');
}

function onLeftRoom(data) {
    if (data.success) {
        state.username = null;
        state.roomCode = null;
        state.roomName = null;
        state.pmMessages = {};
        
        hideEnergyMeter();
        
        showScreen('landing');
        showToast('Left Room', 'You have left the room', 'info');
    }
}

function onUserJoined(data) {
    updateUsersList(data.users);
    DOM.onlineCount.textContent = data.user_count;
    addSystemMessage(`${data.username} joined the room`);
    boostEnergy(0.05);
}

function onUserLeft(data) {
    updateUsersList(data.users);
    DOM.onlineCount.textContent = data.user_count;
    addSystemMessage(`${data.username} left the room`);
}

function onUpdateRooms(data) {
    // Room list updated
}

// ============================================================================
// MESSAGE EVENT HANDLERS
// ============================================================================

function onNewMessage(data) {
    const isSent = data.sid === state.sid;
    addChatMessage(data, isSent);
    
    if (!isSent) {
        showBrowserNotification(data.username, data.message);
        playSound('receive');
    }
    
    boostEnergy();
    state.lastMessageTime = Date.now();
    state.messageCount++;
}

function onTypingUpdate(data) {
    const typingUsers = data.typing_users.filter(u => u !== state.username);
    
    if (typingUsers.length > 0) {
        DOM.typingIndicator.classList.remove('hidden');
        
        // Use typing personality
        if (typingUsers.length === 1) {
            const personality = getTypingPersonality();
            DOM.typingText.textContent = `${typingUsers[0]} is ${personality}`;
        } else if (typingUsers.length === 2) {
            DOM.typingText.textContent = `${typingUsers.join(' and ')} are typing...`;
        } else {
            DOM.typingText.textContent = `${typingUsers.length} people are typing...`;
        }
    } else {
        DOM.typingIndicator.classList.add('hidden');
    }
}

function onFileShared(data) {
    const isSent = data.sid === state.sid;
    addFileMessage(data, isSent);
    
    if (!isSent) {
        showBrowserNotification(data.username, `Shared a file: ${data.file_name}`);
        playSound('receive');
    }
    
    boostEnergy(0.15);
}

// ============================================================================
// PRIVATE MESSAGE HANDLERS
// ============================================================================

function onPrivateMessage(data) {
    if (data.is_incoming) {
        const fromSid = data.from_sid;
        
        if (!state.pmMessages[fromSid]) {
            state.pmMessages[fromSid] = [];
        }
        
        state.pmMessages[fromSid].push({
            ...data,
            isSent: false
        });
        
        if (state.pmTarget && state.pmTarget.sid === fromSid) {
            addPmMessage(data, false);
        } else {
            showToast('Private Message', `${data.from_username}: ${data.message}`, 'info');
            showBrowserNotification(`PM from ${data.from_username}`, data.message);
            playSound('receive');
        }
    } else {
        const toSid = data.to_sid;
        
        if (!state.pmMessages[toSid]) {
            state.pmMessages[toSid] = [];
        }
        
        state.pmMessages[toSid].push({
            ...data,
            isSent: true
        });
        
        if (state.pmTarget && state.pmTarget.sid === toSid) {
            addPmMessage(data, true);
        }
    }
}

function onPrivateFile(data) {
    if (data.is_incoming) {
        if (state.pmTarget && state.pmTarget.sid === data.from_sid) {
            addPmFileMessage(data, false);
        } else {
            showToast('Private File', `${data.from_username} sent a file`, 'info');
        }
    } else {
        if (state.pmTarget && state.pmTarget.sid === data.to_sid) {
            addPmFileMessage(data, true);
        }
    }
}

// ============================================================================
// UI UPDATE FUNCTIONS
// ============================================================================

function hideLoadingScreen() {
    setTimeout(() => {
        DOM.loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            DOM.loadingScreen.style.display = 'none';
        }, 600);
    }, 2000);
}

function updateCodeValidation(isValid, message) {
    DOM.codeValidation.className = 'code-validation';
    
    if (isValid === null) {
        DOM.codeValidation.classList.add('checking');
        DOM.codeValidation.innerHTML = `
            <span class="validation-icon">⏳</span>
            <span class="validation-text">Checking...</span>
        `;
    } else if (isValid) {
        DOM.codeValidation.classList.add('valid');
        DOM.codeValidation.innerHTML = `
            <span class="validation-icon">✓</span>
            <span class="validation-text">${escapeHtml(message)}</span>
        `;
    } else {
        DOM.codeValidation.classList.add('invalid');
        DOM.codeValidation.innerHTML = `
            <span class="validation-icon">✗</span>
            <span class="validation-text">${escapeHtml(message)}</span>
        `;
    }
}

function updateUsersList(users) {
    DOM.usersList.innerHTML = users.map(user => {
        const isMe = user.sid === state.sid;
        return `
            <div class="user-item ${isMe ? 'me' : ''}" data-sid="${user.sid}">
                <div class="user-avatar" style="background: ${user.color}">
                    ${getInitials(user.username)}
                </div>
                <div class="user-info">
                    <span class="user-name">${escapeHtml(user.username)}</span>
                    <span class="user-status">${isMe ? 'You' : 'Online'}</span>
                </div>
                ${!isMe ? `<button class="pm-btn" title="Private Message">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                </button>` : ''}
            </div>
        `;
    }).join('');
    
    document.querySelectorAll('.user-item:not(.me) .pm-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const userItem = btn.closest('.user-item');
            const sid = userItem.dataset.sid;
            const username = userItem.querySelector('.user-name').textContent;
            const color = userItem.querySelector('.user-avatar').style.background;
            openPmModal({ sid, username, color });
        });
    });
}

function clearMessages() {
    const messages = DOM.messagesScroll.querySelectorAll('.message, .system-message');
    messages.forEach(msg => msg.remove());
    
    if (DOM.welcomeMessage) {
        DOM.welcomeMessage.style.display = 'block';
    }
}

function addSystemMessage(text) {
    if (DOM.welcomeMessage) {
        DOM.welcomeMessage.style.display = 'none';
    }
    
    const messageEl = document.createElement('div');
    messageEl.className = 'system-message';
    messageEl.innerHTML = `<span class="system-text">${escapeHtml(text)}</span>`;
    DOM.messagesScroll.appendChild(messageEl);
    scrollToBottom();
}

function addChatMessage(data, isSent) {
    if (DOM.welcomeMessage) {
        DOM.welcomeMessage.style.display = 'none';
    }
    
    const autoScroll = shouldAutoScroll();
    
    const messageEl = document.createElement('div');
    let classes = `message ${isSent ? 'sent' : 'received'}`;
    
    
    // Add surprise animation
    if (shouldApplySurprise()) {
        classes += ` ${getRandomSurprise()}`;
    }
    
    // Check for music link
    if (detectMusicLink(data.message)) {
        classes += ' has-music';
        showMusicMood();
    }
    
    messageEl.className = classes;
    
    messageEl.innerHTML = `
        <div class="message-avatar" style="background: ${data.color}">
            ${getInitials(data.username)}
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-username" style="color: ${data.color}">${escapeHtml(data.username)}</span>
                <span class="message-time">${data.timestamp}</span>
            </div>
            <div class="message-bubble">
                ${linkifyText(data.message)}
            </div>
        </div>
    `;
    
    DOM.messagesScroll.appendChild(messageEl);
    
    if (autoScroll) {
        scrollToBottom();
    }
}

function addFileMessage(data, isSent) {
    if (DOM.welcomeMessage) {
        DOM.welcomeMessage.style.display = 'none';
    }
    
    const autoScroll = shouldAutoScroll();
    const isImage = data.file_type.startsWith('image/');
    const isVideo = data.file_type.startsWith('video/');
    
    const messageEl = document.createElement('div');
    messageEl.className = `message ${isSent ? 'sent' : 'received'}`;
    
    let fileContent = '';
    
    if (isImage) {
        fileContent = `
            <div class="image-message" onclick="openImageViewer('${data.file_data}')">
                <img src="${data.file_data}" alt="${escapeHtml(data.file_name)}">
            </div>
        `;
    } else if (isVideo) {
        fileContent = `
            <video controls style="max-width: 280px; border-radius: 8px;">
                <source src="${data.file_data}" type="${data.file_type}">
            </video>
        `;
    } else {
        fileContent = `
            <div class="file-message">
                <span class="file-icon">${getFileIcon(data.file_type)}</span>
                <div class="file-info">
                    <span class="file-name">${escapeHtml(data.file_name)}</span>
                    <span class="file-size">${formatFileSize(data.file_size)}</span>
                </div>
                <button class="file-download" onclick="downloadFile('${data.file_data}', '${escapeHtml(data.file_name)}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                </button>
            </div>
        `;
    }
    
    messageEl.innerHTML = `
        <div class="message-avatar" style="background: ${data.color}">
            ${getInitials(data.username)}
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-username" style="color: ${data.color}">${escapeHtml(data.username)}</span>
                <span class="message-time">${data.timestamp}</span>
            </div>
            <div class="message-bubble">
                ${fileContent}
            </div>
        </div>
    `;
    
    DOM.messagesScroll.appendChild(messageEl);
    
    if (autoScroll) {
        scrollToBottom();
    }
}

// ============================================================================
// PM MODAL FUNCTIONS
// ============================================================================

function openPmModal(user) {
    state.pmTarget = user;
    
    DOM.pmAvatar.textContent = getInitials(user.username);
    DOM.pmAvatar.style.background = user.color;
    DOM.pmUsername.textContent = user.username;
    
    DOM.pmMessages.innerHTML = `
        <div class="pm-empty">
            <div class="pm-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                    <circle cx="12" cy="16" r="1"/>
                </svg>
            </div>
            <p>Private messages vanish on close</p>
        </div>
    `;
    
    if (state.pmMessages[user.sid] && state.pmMessages[user.sid].length > 0) {
        DOM.pmMessages.innerHTML = '';
        state.pmMessages[user.sid].forEach(msg => {
            addPmMessage(msg, msg.isSent);
        });
    }
    
    showModal(DOM.pmModal);
    DOM.pmMessageInput.focus();
    
    DOM.usersSidebar.classList.remove('open');
}

function closePmModal() {
    state.pmTarget = null;
    hideModal(DOM.pmModal);
}

function addPmMessage(data, isSent) {
    const empty = DOM.pmMessages.querySelector('.pm-empty');
    if (empty) empty.remove();
    
    const messageEl = document.createElement('div');
    messageEl.className = `message ${isSent ? 'sent' : 'received'}`;
    
    messageEl.innerHTML = `
        <div class="message-content">
            <div class="message-header">
                <span class="message-time">${data.timestamp}</span>
            </div>
            <div class="message-bubble">
                ${linkifyText(data.message)}
            </div>
        </div>
    `;
    
    DOM.pmMessages.appendChild(messageEl);
    DOM.pmMessages.scrollTop = DOM.pmMessages.scrollHeight;
}

function addPmFileMessage(data, isSent) {
    const empty = DOM.pmMessages.querySelector('.pm-empty');
    if (empty) empty.remove();
    
    const isImage = data.file_type && data.file_type.startsWith('image/');
    
    let fileContent = '';
    if (isImage && data.file_data) {
        fileContent = `
            <div class="image-message" onclick="openImageViewer('${data.file_data}')">
                <img src="${data.file_data}" alt="${escapeHtml(data.file_name)}">
            </div>
        `;
    } else {
                fileContent = `
            <div class="file-message">
                <span class="file-icon">${getFileIcon(data.file_type || 'application/octet-stream')}</span>
                <div class="file-info">
                    <span class="file-name">${escapeHtml(data.file_name)}</span>
                    <span class="file-size">${formatFileSize(data.file_size)}</span>
                </div>
                ${data.file_data ? `<button class="file-download" onclick="downloadFile('${data.file_data}', '${escapeHtml(data.file_name)}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                </button>` : ''}
            </div>
        `;
    }
    
    const messageEl = document.createElement('div');
    messageEl.className = `message ${isSent ? 'sent' : 'received'}`;
    
    messageEl.innerHTML = `
        <div class="message-content">
            <div class="message-header">
                <span class="message-time">${data.timestamp}</span>
            </div>
            <div class="message-bubble">
                ${fileContent}
            </div>
        </div>
    `;
    
    DOM.pmMessages.appendChild(messageEl);
    DOM.pmMessages.scrollTop = DOM.pmMessages.scrollHeight;
}

function sendPmMessage() {
    const message = DOM.pmMessageInput.value.trim();
    
    if (!message || !state.pmTarget) return;
    
    state.socket.emit('private_message', {
        target_sid: state.pmTarget.sid,
        message: message
    });
    
    DOM.pmMessageInput.value = '';
    playSound('send');
}

// ============================================================================
// MESSAGE SENDING
// ============================================================================

function sendMessage() {
    const message = DOM.messageInput.value.trim();
    
    if (!message) return;
    
    if (message.length > 2000) {
        showToast('Error', 'Message too long (max 2000 characters)', 'error');
        return;
    }

    state.socket.emit('send_message', { message });
    
    DOM.messageInput.value = '';
    
    // Play send sound
    playSound('send');
    
    // Stop typing indicator
    if (state.isTyping) {
        state.isTyping = false;
        state.socket.emit('typing', { typing: false });
    }
    
    if (state.typingTimeout) {
        clearTimeout(state.typingTimeout);
        state.typingTimeout = null;
    }
    
    // Boost energy
    boostEnergy();
}

function handleTyping() {
    if (!state.isTyping) {
        state.isTyping = true;
        state.socket.emit('typing', { typing: true });
    }
    
    if (state.typingTimeout) {
        clearTimeout(state.typingTimeout);
    }
    
    state.typingTimeout = setTimeout(() => {
        state.isTyping = false;
        state.socket.emit('typing', { typing: false });
    }, CONFIG.TYPING_TIMEOUT);
    
}

// ============================================================================
// FILE HANDLING
// ============================================================================

function handleFileSelect(event, isPrivate = false) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > CONFIG.MAX_FILE_SIZE) {
        showToast('File Too Large', `Maximum size is ${formatFileSize(CONFIG.MAX_FILE_SIZE)}`, 'error');
        return;
    }
    
    state.pendingFile = { file, isPrivate };
    showFilePreview(file);
}

function showFilePreview(file) {
    DOM.filePreviewName.textContent = file.name;
    
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (isImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
            DOM.filePreviewBody.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    } else if (isVideo) {
        const url = URL.createObjectURL(file);
        DOM.filePreviewBody.innerHTML = `<video controls src="${url}"></video>`;
    } else {
        DOM.filePreviewBody.innerHTML = `
            <div class="file-preview-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                </svg>
                <p>${formatFileSize(file.size)}</p>
            </div>
        `;
    }
    
    showModal(DOM.filePreviewModal);
}

function sendFile() {
    if (!state.pendingFile) return;
    
    const { file, isPrivate } = state.pendingFile;
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const fileData = {
            file_data: e.target.result,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size
        };
        
        if (isPrivate && state.pmTarget) {
            fileData.target_sid = state.pmTarget.sid;
            state.socket.emit('private_file', fileData);
        } else {
            state.socket.emit('share_file', fileData);
        }
        
        closeFilePreview();
        playSound('send');
    };
    
    reader.readAsDataURL(file);
}

function closeFilePreview() {
    state.pendingFile = null;
    hideModal(DOM.filePreviewModal);
    DOM.fileInput.value = '';
    if (DOM.pmFileInput) DOM.pmFileInput.value = '';
}

// Global functions for onclick handlers
window.openImageViewer = function(src) {
    DOM.imageViewerImg.src = src;
    DOM.imageViewer.classList.remove('hidden');
};

window.downloadFile = function(dataUrl, filename) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
};

function closeImageViewer() {
    DOM.imageViewer.classList.add('hidden');
    DOM.imageViewerImg.src = '';
}

// ============================================================================
// EMOJI PICKER
// ============================================================================

function initEmojiPicker() {
    populateEmojiGrid('smileys');
    
    document.querySelectorAll('.emoji-cat').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.emoji-cat').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            populateEmojiGrid(btn.dataset.category);
        });
    });
}

function populateEmojiGrid(category) {
    const emojis = EMOJI_DATA[category] || [];
    DOM.emojiGrid.innerHTML = emojis.map(emoji => 
        `<button class="emoji-item" data-emoji="${emoji}">${emoji}</button>`
    ).join('');
    
    DOM.emojiGrid.querySelectorAll('.emoji-item').forEach(btn => {
        btn.addEventListener('click', () => {
            insertEmoji(btn.dataset.emoji);
        });
    });
}

function insertEmoji(emoji) {
    const input = DOM.messageInput;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    
    input.value = text.slice(0, start) + emoji + text.slice(end);
    input.selectionStart = input.selectionEnd = start + emoji.length;
    input.focus();
    
    DOM.emojiPicker.classList.add('hidden');
}

function toggleEmojiPicker() {
    DOM.emojiPicker.classList.toggle('hidden');
    // Close style selector if open
    DOM.styleSelector.classList.add('hidden');
}

// ============================================================================
// ROOM ACTIONS
// ============================================================================

function createPrivateRoom() {
    const username = DOM.createUsername.value.trim();
    const roomName = DOM.createRoomName.value.trim() || 'Private Room';
    
    const validation = validateUsername(username);
    if (!validation.valid) {
        showToast('Invalid Username', validation.message, 'error');
        return;
    }
    
    state.username = username;
    
    state.socket.emit('create_private_room', {
        room_name: roomName
    });
}

function enterCreatedRoom() {
    if (!state.pendingRoomCode || !state.username) return;
    
    state.socket.emit('join_private_room', {
        room_code: state.pendingRoomCode,
        username: state.username
    });
    
    state.pendingRoomCode = null;
}

function checkRoomCode(code) {
    if (state.codeCheckTimeout) {
        clearTimeout(state.codeCheckTimeout);
    }
    
    const cleanCode = code.toUpperCase().trim();
    
    if (cleanCode.length < 4) {
        DOM.codeValidation.innerHTML = '';
        DOM.joinRoomBtn.disabled = true;
        return;
    }
    
    updateCodeValidation(null, 'Checking...');
    
    state.codeCheckTimeout = setTimeout(() => {
        state.socket.emit('check_room', { room_code: cleanCode });
    }, CONFIG.CODE_CHECK_DEBOUNCE);
}

function joinPrivateRoom() {
    const username = DOM.joinUsername.value.trim();
    const roomCode = DOM.joinCodeInput.value.toUpperCase().trim();
    
    const validation = validateUsername(username);
    if (!validation.valid) {
        showToast('Invalid Username', validation.message, 'error');
        return;
    }
    
    if (!roomCode || roomCode.length < 4) {
        showToast('Invalid Code', 'Please enter a valid room code', 'error');
        return;
    }
    
    state.socket.emit('join_private_room', {
        room_code: roomCode,
        username: username
    });
}

function joinGlobalRoom() {
    const username = DOM.globalUsername.value.trim();
    
    const validation = validateUsername(username);
    if (!validation.valid) {
        showToast('Invalid Username', validation.message, 'error');
        return;
    }
    
    state.socket.emit('join', {
        username: username,
        room_code: 'GLOBAL'
    });
}

function showLeaveConfirmation() {
    showModal(DOM.leaveModal);
}

function leaveRoom() {
    state.socket.emit('leave_room');
    hideModal(DOM.leaveModal);
}

// ============================================================================
// SIDEBAR FUNCTIONS
// ============================================================================

function toggleUsersSidebar() {
    DOM.usersSidebar.classList.toggle('open');
    DOM.usersSidebar.classList.toggle('hidden');
}

function closeUsersSidebar() {
    DOM.usersSidebar.classList.remove('open');
    DOM.usersSidebar.classList.add('hidden');
}

// ============================================================================
// COPY FUNCTIONALITY
// ============================================================================

async function copyRoomCode(button) {
    const code = state.pendingRoomCode || state.roomCode;
    
    if (!code) return;
    
    const success = await copyToClipboard(code);
    
    if (success) {
        button.classList.add('copied');
        
        if (button.querySelector('span')) {
            button.querySelector('span').textContent = 'Copied!';
        }
        
        showToast('Copied!', 'Room code copied to clipboard', 'success');
        
        setTimeout(() => {
            button.classList.remove('copied');
            if (button.querySelector('span')) {
                button.querySelector('span').textContent = 'Copy Code';
            }
        }, 2000);
    }
}

// ============================================================================
// SETTINGS HANDLERS
// ============================================================================

function openSettings() {
    showModal(DOM.settingsModal);
}

function closeSettings() {
    hideModal(DOM.settingsModal);
}

function initSettingsListeners() {
    
    // Sound Toggle
    if (DOM.soundToggle) {
        DOM.soundToggle.addEventListener('change', (e) => {
            state.soundEnabled = e.target.checked;
            if (state.soundEnabled) {
                playSound('notification');
            }
        });
    }    
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

function handleKeyboardShortcuts(e) {
    if (e.key === 'Escape') {
        if (!DOM.imageViewer.classList.contains('hidden')) {
            closeImageViewer();
        } else if (!DOM.pmModal.classList.contains('hidden')) {
            closePmModal();
        } else if (!DOM.leaveModal.classList.contains('hidden')) {
            hideModal(DOM.leaveModal);
        } else if (!DOM.settingsModal.classList.contains('hidden')) {
            closeSettings();
        } else if (!DOM.filePreviewModal.classList.contains('hidden')) {
            closeFilePreview();
        } else if (!DOM.emojiPicker.classList.contains('hidden')) {
            DOM.emojiPicker.classList.add('hidden');
        } else if (!DOM.createModal.classList.contains('hidden')) {
            hideModal(DOM.createModal);
        } else if (!DOM.joinModal.classList.contains('hidden')) {
            hideModal(DOM.joinModal);
        } else if (!DOM.globalModal.classList.contains('hidden')) {
            hideModal(DOM.globalModal);
        } else if (!DOM.usersSidebar.classList.contains('hidden')) {
            closeUsersSidebar();
        }
    }
    
    if (e.key === 'Enter' && !e.shiftKey) {
        if (document.activeElement === DOM.messageInput) {
            e.preventDefault();
            sendMessage();
        } else if (document.activeElement === DOM.pmMessageInput) {
            e.preventDefault();
            sendPmMessage();
        }
    }
}

// ============================================================================
// EVENT LISTENERS SETUP
// ============================================================================

function setupEventListeners() {
    // Landing Screen - Action Cards
    DOM.createRoomCard.addEventListener('click', () => showModal(DOM.createModal));
    DOM.joinRoomCard.addEventListener('click', () => showModal(DOM.joinModal));
    DOM.globalRoomCard.addEventListener('click', () => showModal(DOM.globalModal));
    
    // Create Modal
    DOM.createModalClose.addEventListener('click', () => hideModal(DOM.createModal));
    DOM.createModal.addEventListener('click', (e) => {
        if (e.target === DOM.createModal) hideModal(DOM.createModal);
    });
    DOM.createRoomBtn.addEventListener('click', createPrivateRoom);
    DOM.createUsername.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (DOM.createRoomName.value.trim() || DOM.createUsername.value.trim()) {
                createPrivateRoom();
            } else {
                DOM.createRoomName.focus();
            }
        }
    });
    DOM.createRoomName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            createPrivateRoom();
        }
    });
    
    // Code Modal
    DOM.copyCodeBtn.addEventListener('click', () => copyRoomCode(DOM.copyCodeBtn));
    DOM.enterRoomBtn.addEventListener('click', enterCreatedRoom);
    
    // Join Modal
    DOM.joinModalClose.addEventListener('click', () => hideModal(DOM.joinModal));
    DOM.joinModal.addEventListener('click', (e) => {
        if (e.target === DOM.joinModal) hideModal(DOM.joinModal);
    });
    DOM.joinCodeInput.addEventListener('input', (e) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        e.target.value = value;
        checkRoomCode(value);
    });
    DOM.joinRoomBtn.addEventListener('click', joinPrivateRoom);
    DOM.joinUsername.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            DOM.joinCodeInput.focus();
        }
    });
    DOM.joinCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !DOM.joinRoomBtn.disabled) {
            e.preventDefault();
            joinPrivateRoom();
        }
    });
    
    // Global Modal
    DOM.globalModalClose.addEventListener('click', () => hideModal(DOM.globalModal));
    DOM.globalModal.addEventListener('click', (e) => {
        if (e.target === DOM.globalModal) hideModal(DOM.globalModal);
    });
    DOM.globalJoinBtn.addEventListener('click', joinGlobalRoom);
    DOM.globalUsername.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            joinGlobalRoom();
        }
    });
    
    // Settings Modal
    if (DOM.settingsBtn) {
        DOM.settingsBtn.addEventListener('click', openSettings);
    }
    if (DOM.settingsModalClose) {
        DOM.settingsModalClose.addEventListener('click', closeSettings);
    }
    if (DOM.settingsModal) {
        DOM.settingsModal.addEventListener('click', (e) => {
            if (e.target === DOM.settingsModal) closeSettings();
        });
    }
    
    // Chat Header
    DOM.leaveRoomBtn.addEventListener('click', showLeaveConfirmation);
    DOM.headerCopyBtn.addEventListener('click', () => copyRoomCode(DOM.headerCopyBtn));
    DOM.toggleUsersBtn.addEventListener('click', toggleUsersSidebar);
    
    // Users Sidebar
    DOM.closeSidebarBtn.addEventListener('click', closeUsersSidebar);
    
    // Message Input
    DOM.messageInput.addEventListener('input', handleTyping);
    DOM.sendBtn.addEventListener('click', sendMessage);
    
    // File Upload
    DOM.attachBtn.addEventListener('click', () => DOM.fileInput.click());
    DOM.fileInput.addEventListener('change', (e) => handleFileSelect(e, false));
    
    // File Preview
    DOM.filePreviewClose.addEventListener('click', closeFilePreview);
    DOM.fileCancelBtn.addEventListener('click', closeFilePreview);
    DOM.fileSendBtn.addEventListener('click', sendFile);
    DOM.filePreviewModal.addEventListener('click', (e) => {
        if (e.target === DOM.filePreviewModal) closeFilePreview();
    });
    
    // Emoji Picker
    DOM.emojiBtn.addEventListener('click', toggleEmojiPicker);
    DOM.emojiCloseBtn.addEventListener('click', () => DOM.emojiPicker.classList.add('hidden'));
    
    document.addEventListener('click', (e) => {
        if (!DOM.emojiPicker.contains(e.target) && 
            !DOM.emojiBtn.contains(e.target) && 
            !DOM.emojiPicker.classList.contains('hidden')) {
            DOM.emojiPicker.classList.add('hidden');
        }
        
    });
    
    // PM Modal
    DOM.pmCloseBtn.addEventListener('click', closePmModal);
    DOM.pmModal.addEventListener('click', (e) => {
        if (e.target === DOM.pmModal) closePmModal();
    });
    DOM.pmSendBtn.addEventListener('click', sendPmMessage);
    DOM.pmMessageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendPmMessage();
        }
    });
    
    // PM File Upload
    DOM.pmAttachBtn.addEventListener('click', () => DOM.pmFileInput.click());
    DOM.pmFileInput.addEventListener('change', (e) => handleFileSelect(e, true));
    
    // Image Viewer
    DOM.imageViewerClose.addEventListener('click', closeImageViewer);
    DOM.imageViewer.addEventListener('click', (e) => {
        if (e.target === DOM.imageViewer) closeImageViewer();
    });
    
    // Leave Modal
    DOM.leaveCancelBtn.addEventListener('click', () => hideModal(DOM.leaveModal));
    DOM.leaveConfirmBtn.addEventListener('click', leaveRoom);
    DOM.leaveModal.addEventListener('click', (e) => {
        if (e.target === DOM.leaveModal) hideModal(DOM.leaveModal);
    });
    
    // Global keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Handle paste for images
    document.addEventListener('paste', handlePaste);
    
    // Window events
    window.addEventListener('beforeunload', () => {
        if (state.socket) {
            state.socket.disconnect();
        }
    });
    
    // Mobile viewport fix
    window.addEventListener('resize', handleMobileResize);
    handleMobileResize();
}

// ============================================================================
// PASTE HANDLING
// ============================================================================

function handlePaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;
    
    for (const item of items) {
        if (item.type.startsWith('image/')) {
            e.preventDefault();
            const file = item.getAsFile();
            if (file) {
                const mockEvent = {
                    target: { files: [file] }
                };
                const isPrivate = !DOM.pmModal.classList.contains('hidden');
                handleFileSelect(mockEvent, isPrivate);
            }
            break;
        }
    }
}

// ============================================================================
// MOBILE HANDLING
// ============================================================================

function handleMobileResize() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// ============================================================================
// DRAG AND DROP
// ============================================================================

function setupDragAndDrop() {
    const dropZone = DOM.messagesArea;
    if (!dropZone) return;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.style.background = 'rgba(0, 217, 255, 0.1)';
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.style.background = '';
        }, false);
    });
    
    dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const mockEvent = { target: { files: [files[0]] } };
            handleFileSelect(mockEvent, false);
        }
    }, false);
}

// ============================================================================
// PERFORMANCE OPTIMIZATION
// ============================================================================

function optimizePerformance() {
    const MAX_MESSAGES = 150;
    
    const observer = new MutationObserver(() => {
        const messages = DOM.messagesScroll.querySelectorAll('.message, .system-message:not(.welcome-message)');
        if (messages.length > MAX_MESSAGES) {
            const toRemove = messages.length - MAX_MESSAGES;
            for (let i = 0; i < toRemove; i++) {
                if (messages[i] && !messages[i].classList.contains('welcome-message')) {
                    messages[i].remove();
                }
            }
        }
    });
    
    if (DOM.messagesScroll) {
        observer.observe(DOM.messagesScroll, { childList: true });
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function initialize() {
    console.log('%c⚡ Ephemeral Chat - Premium Experiential Edition', 'color: #00D9FF; font-size: 20px; font-weight: bold;');
    console.log('%c🔒 Zero Data Retention • Fully Ephemeral', 'color: #00FF88;');
    console.log('%c✨ Mood Themes • Sounds • Companion • Energy Meter', 'color: #A855F7;');
    
    // Initialize DOM references
    initDOMReferences();
    
    // Initialize socket connection
    initializeSocket();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize emoji picker
    initEmojiPicker();
    
    // Setup drag and drop
    setupDragAndDrop();
    
    // Optimize performance
    optimizePerformance();
    
    // Initialize settings listeners
    initSettingsListeners();
    
    // Set initial mood
    setMood('default');
    
    // Initial mobile resize
    handleMobileResize();
}

// Start application
document.addEventListener('DOMContentLoaded', initialize);

// Global error handling
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error:', { msg, url, lineNo, columnNo, error });
    return false;
};

window.onunhandledrejection = function(event) {
    console.error('Unhandled rejection:', event.reason);
};