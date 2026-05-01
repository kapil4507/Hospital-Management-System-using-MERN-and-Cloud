const mongoose = require('mongoose');

const medicalReportSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patients', // Make sure this matches your Patient model export exactly!
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctors', // Make sure this matches your Doctor model export exactly!
        required: true
    },
    title: {
        type: String,
        required: [true, 'Report title is required (e.g., Blood Test Results)']
    },
    reportType: {
        type: String,
        enum: ['Lab Result', 'Prescription', 'Scan', 'Other'],
        default: 'Other'
    },
    // IMPORTANT FIELD FOR AWS S3
    fileUrl: { 
        type: String,
        required: [true, 'File URL from AWS S3 is required.']
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reports', medicalReportSchema);