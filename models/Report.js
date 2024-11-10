const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    victim: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: Array,
        required: true
    }
})

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;