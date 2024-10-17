// models/patientModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
  patientId: {
    type: String,
    required: true,
    unique: true, 
  },
  patientName: {
    type: String,
    required: true,
  },
  dob: {
    type: Date, 
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'], 
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  nic: {
    type: String,
    required: true,
    unique: true, 
  },
  dateOfRegistration: {
    type: Date,
    default: Date.now, 
    required: true,
  },
  patientStatus: {
    type: String,
    enum: ['Active', 'Inactive'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
