const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    staffId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/ // Simple email validation
    },
    position: {
        type: String,
        enum: [
            'Nurse',
            'Physician Assistant',
            'Medical Assistant',
            'Pharmacist',
            'Radiologic Technologist',
            'Lab Technician',
            'Physical Therapist',
            'Occupational Therapist',
            'Speech-Language Pathologist',
            'Healthcare Administrator',
            'Health Information Technician',
            'Surgical Technologist',
            'Respiratory Therapist',
            'Clinical Research Coordinator',
            'Patient Care Coordinator'
        ],
        required: true
    },
    department: {
        type: String,
        enum: [
            'Emergency Department',
            'Surgery Department',
            'Internal Medicine',
            'Pediatrics',
            'Obstetrics and Gynecology',
            'Radiology',
            'Laboratory Services',
            'Pharmacy'
        ],
        required: true
    },
    dateOfJoined: {
        type: Date,
        required: true
    },
    employeeStatus: {
        type: String,
        enum: ['Active', 'Inactive', 'Terminated'],
        required: true
    }
}, { timestamps: true });

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
