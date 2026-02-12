const mongoose = require('mongoose');

const privateMessageSchema = new mongoose.Schema({
    from_user: {
        type: String,
        required: true,
        trim: true
    },
    to_user: {
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

// Indexes for faster queries
privateMessageSchema.index({ from_user: 1, to_user: 1, date_sent: 1 });

module.exports = mongoose.model('PrivateMessage', privateMessageSchema);