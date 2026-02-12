require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const GroupMessage = require('./models/GroupMessage');
const PrivateMessage = require('./models/PrivateMessage');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'chat.html'));
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatapp';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Socket.io connection handling
const activeUsers = new Map(); // Map of socket.id -> user info
const userRooms = new Map(); // Map of username -> current room
const typingUsers = new Map(); // Map of room -> Set of typing users

io.on('connection', (socket) => {
    console.log('🔌 New user connected:', socket.id);

    // User joins the chat
    socket.on('user-joined', (userData) => {
        activeUsers.set(socket.id, userData);
        console.log(`👤 ${userData.username} joined the chat`);
    });

    // Join a room
    socket.on('join-room', async (data) => {
        const { username, room } = data;
        
        // Leave previous room if any
        const previousRoom = userRooms.get(username);
        if (previousRoom) {
            socket.leave(previousRoom);
            io.to(previousRoom).emit('user-left', {
                username,
                room: previousRoom,
                message: `${username} left the room`
            });
        }

        // Join new room
        socket.join(room);
        userRooms.set(username, room);
        
        console.log(`👤 ${username} joined room: ${room}`);

        // Notify others in the room
        socket.to(room).emit('user-joined-room', {
            username,
            room,
            message: `${username} joined the room`
        });

        // Send room history to the user
        try {
            const messages = await GroupMessage.find({ room })
                .sort({ date_sent: 1 })
                .limit(50);
            
            socket.emit('room-history', { room, messages });
        } catch (error) {
            console.error('Error fetching room history:', error);
        }

        // Send updated user list
        const roomUsers = Array.from(userRooms.entries())
            .filter(([, userRoom]) => userRoom === room)
            .map(([user]) => user);
        
        io.to(room).emit('room-users', { room, users: roomUsers });
    });

    // Leave room
    socket.on('leave-room', (data) => {
        const { username, room } = data;
        
        socket.leave(room);
        userRooms.delete(username);
        
        console.log(`👤 ${username} left room: ${room}`);

        // Notify others in the room
        io.to(room).emit('user-left', {
            username,
            room,
            message: `${username} left the room`
        });

        // Send updated user list
        const roomUsers = Array.from(userRooms.entries())
            .filter(([, userRoom]) => userRoom === room)
            .map(([user]) => user);
        
        io.to(room).emit('room-users', { room, users: roomUsers });
    });

    // Group message
    socket.on('group-message', async (data) => {
        const { from_user, room, message } = data;

        try {
            // Save message to database
            const newMessage = new GroupMessage({
                from_user,
                room,
                message
            });
            await newMessage.save();

            // Broadcast message to room
            io.to(room).emit('group-message', {
                _id: newMessage._id,
                from_user: newMessage.from_user,
                room: newMessage.room,
                message: newMessage.message,
                date_sent: newMessage.date_sent
            });

            console.log(`💬 [${room}] ${from_user}: ${message}`);
        } catch (error) {
            console.error('Error saving group message:', error);
            socket.emit('message-error', { message: 'Failed to send message' });
        }
    });

    // Private message
    socket.on('private-message', async (data) => {
        const { from_user, to_user, message } = data;

        try {
            // Save message to database
            const newMessage = new PrivateMessage({
                from_user,
                to_user,
                message
            });
            await newMessage.save();

            // Find recipient's socket
            const recipientSocket = Array.from(activeUsers.entries())
                .find(([, user]) => user.username === to_user);

            const messageData = {
                _id: newMessage._id,
                from_user: newMessage.from_user,
                to_user: newMessage.to_user,
                message: newMessage.message,
                date_sent: newMessage.date_sent
            };

            // Send to recipient
            if (recipientSocket) {
                io.to(recipientSocket[0]).emit('private-message', messageData);
            }

            // Send confirmation to sender
            socket.emit('private-message', messageData);

            console.log(`📨 [Private] ${from_user} -> ${to_user}: ${message}`);
        } catch (error) {
            console.error('Error saving private message:', error);
            socket.emit('message-error', { message: 'Failed to send message' });
        }
    });

    // Typing indicator
    socket.on('typing', (data) => {
        const { username, room, isTyping } = data;

        if (room) {
            // Group chat typing
            if (!typingUsers.has(room)) {
                typingUsers.set(room, new Set());
            }

            if (isTyping) {
                typingUsers.get(room).add(username);
            } else {
                typingUsers.get(room).delete(username);
            }

            socket.to(room).emit('user-typing', {
                username,
                room,
                isTyping
            });
        } else if (data.to_user) {
            // Private chat typing
            const recipientSocket = Array.from(activeUsers.entries())
                .find(([, user]) => user.username === data.to_user);

            if (recipientSocket) {
                io.to(recipientSocket[0]).emit('user-typing', {
                    username,
                    isTyping
                });
            }
        }
    });

    // Disconnect
    socket.on('disconnect', () => {
        const userData = activeUsers.get(socket.id);
        
        if (userData) {
            const { username } = userData;
            const room = userRooms.get(username);

            if (room) {
                // Notify room about user leaving
                io.to(room).emit('user-left', {
                    username,
                    room,
                    message: `${username} disconnected`
                });

                userRooms.delete(username);

                // Update room user list
                const roomUsers = Array.from(userRooms.entries())
                    .filter(([, userRoom]) => userRoom === room)
                    .map(([user]) => user);
                
                io.to(room).emit('room-users', { room, users: roomUsers });
            }

            activeUsers.delete(socket.id);
            console.log(`🔌 ${username} disconnected`);
        } else {
            console.log('🔌 User disconnected:', socket.id);
        }
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});