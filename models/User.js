const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    blood_group: {
        type: String,
        required: true
    },
    socket_id: {
        type: String,
        default: ""
    },
    resonance_id: {
        type: String,
        default: ""
    },
    emergency_contact: {
        name: {
            type: String,
            required: true
        },
        relation: {
            type: String,
            required: true
        },
        phone_number: {
            type: String,
            required: true
        }
    },
    alert_time: {
        type: Number,
        required: true
    },
    past_records: {
        type: Array,
        required: false,
        default: []
    },
    karma: {
        type: Number,
        required: false,
        default: 0
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;