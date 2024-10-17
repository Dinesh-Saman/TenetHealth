// routes/patient.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Add a new patient
router.post('/add-patient/', patientController.addNewPatient);

// Delete a patient
router.delete('/delete-patient/:id', patientController.deletePatient);

// Get all patients
router.get('/get-patients/', patientController.getAllPatients);

// Get a single patient by ID
router.get('/get-patient/:id', patientController.getPatientById);

// Update a patient
router.put('/update-patient/:id', patientController.updatePatient);

// Get patient status counts
router.get('/patient-status-counts/', patientController.getPatientStatusCounts);

module.exports = router;
