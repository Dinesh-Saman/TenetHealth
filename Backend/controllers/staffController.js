// controllers/staffController.js
const Staff = require("../models/staffModel");
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config(); 

// Add a new staff member
exports.addNewStaff = async (req, res) => {
    try {
        const { staffId, name, dob, gender, contact, address, email, position, department, dateOfJoined, employeeStatus } = req.body;

        // Log the received data for debugging
        console.log(req.body);

        // Create an array to hold error messages for missing fields
        const missingFields = [];

        // Check each field and push to missingFields array if not provided
        if (!staffId) missingFields.push("staffId");
        if (!name) missingFields.push("name");
        if (!dob) missingFields.push("dob");
        if (!gender) missingFields.push("gender");
        if (!contact) missingFields.push("contact");
        if (!address) missingFields.push("address");
        if (!email) missingFields.push("email");
        if (!position) missingFields.push("position");
        if (!department) missingFields.push("department");
        if (!dateOfJoined) missingFields.push("dateOfJoined");
        if (!employeeStatus) missingFields.push("employeeStatus");

        // If there are any missing fields, return a detailed message
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: "The following fields are required", 
                missingFields 
            });
        }

        const newStaff = new Staff({
            staffId,
            name,
            dob,
            gender,
            contact,
            address,
            email,
            position,
            department,
            dateOfJoined,
            employeeStatus
        });

        await newStaff.save();

        // Send email to the new staff member
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Our Team',
            text: `Hello ${name},\n\nWelcome to the team! We're excited to have you on board as a ${position}.\n\nBest regards,\nTenet Health`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "New staff member added successfully and email sent!" });
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(500).json({ message: err.message });
    }
};

// Delete a staff member
exports.deleteStaff = (req, res) => {
    const staffId = req.params.id;

    // Validate the staff ID
    if (!mongoose.Types.ObjectId.isValid(staffId)) {
        return res.status(400).send({ message: "Invalid staff ID" });
    }

    Staff.deleteOne({ _id: staffId })
        .then(() => {
            res.status(200).send({ status: "Staff member deleted successfully" });
        })
        .catch((err) => {
            console.error(err.message);
            res.status(500).send({ status: "Error with deleting staff member", error: err.message });
        });
};

// Get all staff members
exports.getAllStaff = async (req, res) => {
    try {
        const staff = await Staff.find();
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single staff member by ID
exports.getStaffById = async (req, res) => {
    const { id } = req.params;

    // Validate the staff ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid staff ID" });
    }

    try {
        const staff = await Staff.findById(id);
        if (!staff) return res.status(404).json({ message: "Staff member not found!" });
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a staff member's details
exports.updateStaff = async (req, res) => {
    const staffId = req.params.id;
    const { name, dob, gender, contact, address, email, position, department, dateOfJoined, employeeStatus } = req.body;

    // Validate inputs
    if (!(name && dob && gender && contact && address && email && position && department && dateOfJoined && employeeStatus)) {
        return res.status(400).send({ message: "All inputs are required" });
    }

    // Validate the staff ID
    if (!mongoose.Types.ObjectId.isValid(staffId)) {
        return res.status(400).send({ message: "Invalid staff ID" });
    }

    try {
        // Check if the staff member exists in the database
        const isStaff = await Staff.findById(staffId);

        if (!isStaff) {
            return res.status(404).json({ message: "Staff member not found!" });
        }

        // Update the staff member's details
        const result = await Staff.updateOne(
            { _id: staffId },
            {
                name,
                dob,
                gender,
                contact,
                address,
                email,
                position,
                department,
                dateOfJoined,
                employeeStatus
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: "No changes were made" });
        }

        return res.status(200).json({ message: "Staff member updated successfully!" });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ message: err.message });
    }
};

// Get staff status counts
exports.getStaffStatusCounts = async (req, res) => {
    try {
        // Aggregate the count of staff members by status
        const statusCounts = await Staff.aggregate([
            {
                $group: {
                    _id: "$employeeStatus",
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
            return res.json({ message: "No staff statuses found" });
        }

        res.json(statusCounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
