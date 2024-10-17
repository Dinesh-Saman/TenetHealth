const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

// Add a new staff member
router.post('/add-staff/', staffController.addNewStaff);

// Delete a staff member
router.delete('/delete-staff/:id', staffController.deleteStaff);

// Get all staff members
router.get('/get-staff/', staffController.getAllStaff);

// Get a single staff member by ID
router.get('/get-staff/:id', staffController.getStaffById);

// Update a staff member's details
router.put('/update-staff/:id', staffController.updateStaff);

// Get staff status counts
router.get('/staff-status-counts/', staffController.getStaffStatusCounts);

module.exports = router;
