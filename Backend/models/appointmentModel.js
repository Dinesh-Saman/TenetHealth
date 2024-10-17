// models/appointmentModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  doctor: {
    type: Schema.Types.ObjectId,   
    ref: 'Doctor',                
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,  
    required: true,
  },
  email: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
