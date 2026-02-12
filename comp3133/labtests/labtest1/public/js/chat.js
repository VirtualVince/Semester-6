// Chat page JavaScript

let socket;
let currentUser;
let currentRoom = null;
let typingTimeout;

$(document).ready(function() {
    // Check authentication
    const userData = localStorage.getItem('chatUser');
    if (!userData) {
        window.location.href = '/login';
        return;
    }

    currentUser = JSON.parse(userData);
    
    // Display user info
    $('#user-display').text(currentUser.username);

    // Initialize Socket.io
    initializeSocket();

    // Event listeners
    $('#logout-btn').on('click', handleLogout);
    $('#change-room-btn').on('click', showRoomModal);
    $('#join-room-btn').on('click', handleJoinRoom);
    $('#leave-room-btn').on('click', handleLeaveRoom);
    $('#message-form').on('submit', handleSendMessage);
    $('#message-input').on('input', handleTyping);

    // Show room selection modal on load
    showRoomModal();
});

// Initialize Socket.io connection
function initializeSocket() {
    socket = io();

    socket.on('connect', () => {
        console.log('Connected to server');
        socket.emit('user-joined', currentUser);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });

    socket.on('room-history', (data) => {
        displayRoomHistory(data.messages);
    });

    socket.on('group-message', (data) => {
        displayMessage(data);
    });

    socket.on('user-joined-room', (data) => {
        displaySystemMessage(`${data.username} joined the room`);
    });

    socket.on('user-left', (data) => {
        displaySystemMessage(data.message);
    });

    socket.on('room-users', (data) => {
        updateUsersList(data.users);
    });

    socket.on('user-typing', (data) => {
        displayTypingIndicator(data);
    });

    socket.on('message-error', (data) => {
        alert('Error: ' + data.message);
    });
}

// Show room selection modal
function showRoomModal() {
    const modal = new bootstrap.Modal(document.getElementById('roomModal'));
    modal.show();
}

// Handle joining a room
function handleJoinRoom() {
    const selectedRoom = $('#room-select').val();
    
    if (selectedRoom) {
        currentRoom = selectedRoom;
        
        // Update UI
        $('#room-display').text(selectedRoom);
        $('#chat-room-title').text(`Room: ${selectedRoom}`);
        $('#message-input').prop('disabled', false);
        $('#send-btn').prop('disabled', false);
        $('#leave-room-btn').prop('disabled', false);
        
        // Clear messages
        $('#messages').empty();
        
        // Emit join room event
        socket.emit('join-room', {
            username: currentUser.username,
            room: selectedRoom
        });
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('roomModal'));
        modal.hide();
    }
}

// Handle leaving a room
function handleLeaveRoom() {
    if (currentRoom) {
        socket.emit('leave-room', {
            username: currentUser.username,
            room: currentRoom
        });
        
        currentRoom = null;
        
        // Update UI
        $('#room-display').text('No room joined');
        $('#chat-room-title').text('Welcome to Chat App');
        $('#message-input').prop('disabled', true).val('');
        $('#send-btn').prop('disabled', true);
        $('#leave-room-btn').prop('disabled', true);
        
        // Clear messages and users
        $('#messages').html(`
            <div class="text-center text-muted p-5">
                <i class="fas fa-comments fa-3x mb-3"></i>
                <p>Select a room to start chatting</p>
            </div>
        `);
        $('#users-list').html(`
            <div class="text-center text-muted p-3">
                <small>Join a room to see users</small>
            </div>
        `);
    }
}

// Handle sending messages
function handleSendMessage(e) {
    e.preventDefault();
    
    const message = $('#message-input').val().trim();
    
    if (message && currentRoom) {
        socket.emit('group-message', {
            from_user: currentUser.username,
            room: currentRoom,
            message: message
        });
        
        $('#message-input').val('');
        
        // Stop typing indicator
        socket.emit('typing', {
            username: currentUser.username,
            room: currentRoom,
            isTyping: false
        });
    }
}

// Handle typing indicator
function handleTyping() {
    if (!currentRoom) return;
    
    const message = $('#message-input').val();
    
    if (message.length > 0) {
        socket.emit('typing', {
            username: currentUser.username,
            room: currentRoom,
            isTyping: true
        });
        
        // Clear previous timeout
        clearTimeout(typingTimeout);
        
        // Set timeout to stop typing indicator
        typingTimeout = setTimeout(() => {
            socket.emit('typing', {
                username: currentUser.username,
                room: currentRoom,
                isTyping: false
            });
        }, 1000);
    } else {
        socket.emit('typing', {
            username: currentUser.username,
            room: currentRoom,
            isTyping: false
        });
    }
}

// Display room history
function displayRoomHistory(messages) {
    $('#messages').empty();
    messages.forEach(message => {
        displayMessage(message);
    });
    scrollToBottom();
}

// Display a message
function displayMessage(data) {
    const isOwnMessage = data.from_user === currentUser.username;
    const messageClass = isOwnMessage ? 'message own-message' : 'message';
    
    const messageHtml = `
        <div class="${messageClass}">
            <div class="message-header">
                <span class="message-sender">${data.from_user}</span>
                <span class="message-time">${data.date_sent}</span>
            </div>
            <div class="message-content">
                ${escapeHtml(data.message)}
            </div>
        </div>
    `;
    
    $('#messages').append(messageHtml);
    scrollToBottom();
}

// Display system message
function displaySystemMessage(message) {
    const messageHtml = `
        <div class="system-message">
            <div class="message-content">
                <i class="fas fa-info-circle me-2"></i>${escapeHtml(message)}
            </div>
        </div>
    `;
    
    $('#messages').append(messageHtml);
    scrollToBottom();
}

// Display typing indicator
function displayTypingIndicator(data) {
    if (data.isTyping && data.username !== currentUser.username) {
        $('#typing-indicator').html(`
            <i class="fas fa-circle-notch fa-spin me-2"></i>
            ${escapeHtml(data.username)} is typing...
        `);
    } else {
        $('#typing-indicator').empty();
    }
}

// Update users list
function updateUsersList(users) {
    const userListHtml = users.map(user => {
        const isCurrentUser = user === currentUser.username;
        const displayName = isCurrentUser ? `${user} (You)` : user;
        
        return `
            <div class="list-group-item">
                <i class="fas fa-user"></i>${escapeHtml(displayName)}
            </div>
        `;
    }).join('');
    
    if (userListHtml) {
        $('#users-list').html(userListHtml);
    } else {
        $('#users-list').html(`
            <div class="text-center text-muted p-3">
                <small>No users in this room</small>
            </div>
        `);
    }
}

// Scroll to bottom of messages
function scrollToBottom() {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Leave current room if any
        if (currentRoom) {
            socket.emit('leave-room', {
                username: currentUser.username,
                room: currentRoom
            });
        }
        
        // Disconnect socket
        socket.disconnect();
        
        // Clear localStorage
        localStorage.removeItem('chatUser');
        
        // Redirect to login
        window.location.href = '/login';
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle window unload
$(window).on('beforeunload', function() {
    if (currentRoom) {
        socket.emit('leave-room', {
            username: currentUser.username,
            room: currentRoom
        });
    }
});