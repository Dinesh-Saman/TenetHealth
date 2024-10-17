// controllers/patientController.js
const Patient = require("../models/patientModel");
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation

// Add a new patient
exports.addNewPatient = async (req, res) => {
    try {
        const { patientId, patientName, dob, gender, contact, address, nic, patientStatus } = req.body;

        // Log the received data for debugging
        console.log(req.body);

        // Create an array to hold error messages for missing fields
        const missingFields = [];

        // Check each field and push to missingFields array if not provided
        if (!patientId) missingFields.push("patientId");
        if (!patientName) missingFields.push("patientName");
        if (!dob) missingFields.push("dob");
        if (!gender) missingFields.push("gender");
        if (!contact) missingFields.push("contact");
        if (!address) missingFields.push("address");
        if (!nic) missingFields.push("nic");
        if (!patientStatus) missingFields.push("patientStatus");

        // If there are any missing fields, return a detailed message
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: "The following fields are required", 
                missingFields 
            });
        }

        const newPatient = new Patient({
            patientId,
            patientName,
            dob,
            gender,
            contact,
            address,
            nic,
            patientStatus
        });

        await newPatient.save();
        res.status(201).json({ message: "New patient added successfully!" });
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(500).json({ message: err.message });
    }
};

// Delete a patient
exports.deletePatient = (req, res) => {
    const patientId = req.params.id;

    // Validate the patient ID
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
        return res.status(400).send({ message: "Invalid patient ID" });
    }

    Patient.deleteOne({ _id: patientId })
        .then(() => {
            res.status(200).send({ status: "Patient deleted successfully" });
        })
        .catch((err) => {
            console.error(err.message);
            res.status(500).send({ status: "Error with deleting patient", error: err.message });
        });
};

// Get all patients
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single patient by ID
exports.getPatientById = async (req, res) => {
    const { id } = req.params;

    // Validate the patient ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid patient ID" });
    }

    try {
        const patient = await Patient.findById(id);
        if (!patient) return res.status(404).json({ message: "Patient not found!" });
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a patient's details
exports.updatePatient = async (req, res) => {
    const patientId = req.params.id;
    const { patientName, dob, gender, contact, address, nic, patientStatus } = req.body;

    // Validate inputs
    if (!(patientName && dob && gender && contact && address && nic && patientStatus)) {
        return res.status(400).send({ message: "All inputs are required" });
    }

    // Validate the patient ID
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
        return res.status(400).send({ message: "Invalid patient ID" });
    }

    try {
        // Check if the patient exists in the database
        const isPatient = await Patient.findById(patientId);

        if (!isPatient) {
            return res.status(404).json({ message: "Patient not found!" });
        }

        // Update the patient's details
        const result = await Patient.updateOne(
            { _id: patientId },
            {
                patientName,
                dob,
                gender,
                contact,
                address,
                nic,
                patientStatus
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: "No changes were made" });
        }

        return res.status(200).json({ message: "Patient updated successfully!" });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ message: err.message });
    }
};

// Get patient status counts
exports.getPatientStatusCounts = async (req, res) => {
    try {
        // Aggregate the count of patients by status
        const statusCounts = await Patient.aggregate([
            {
                $group: {
                    _id: "$patientStatus",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    status: "$_id",
                    count: 1
                }
            }
        ]);

        // If no counts found, return an empty object
        if (!statusCounts.length) {
            return res.json({ message: "No patient statuses found" });
        }

        res.json(statusCounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
