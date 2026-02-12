const mongoose = require('mongoose');

const groupMessageSchema = new mongoose.Schema({
    from_user: {
        type: String,
        required: true,
        trim: true
    },
    room: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    date_sent: {
        type: String,
        default: () => new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }
});

// Index for faster room based queries
groupMessageSchema.index({ room: 1, date_sent: 1 });

module.exports = mongoose.model('GroupMessage', groupMessageSchema);