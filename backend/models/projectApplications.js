const mongoose = require('mongoose');

const projectApplicationSchema = new mongoose.Schema({
    employeeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project',
        required: true
    },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'declined'],
        default: 'pending',
        required: true 
    },
    requestDate: { 
        type: Date, 
        default: Date.now,
        required: true
    },
    role: {
        type: String,
        enum: ['employee', 'manager'],
        required: true
    },
    requestDetails:{
        type: String,
        required: true
    },
    responseDate: {
        type: Date
    }
});

module.exports = mongoose.model('ProjectRequest', projectApplicationSchema);