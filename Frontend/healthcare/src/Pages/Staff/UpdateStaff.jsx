import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, FormControl, Select, InputLabel, Box, Typography, FormHelperText } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const UpdateStaff = () => {
  const { id } = useParams(); // Extract staff ID from URL params
  const navigate = useNavigate();

  // State variables for staff details
  const [staffId, setStaffId] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [dateOfJoined, setDateOfJoined] = useState('');
  const [employeeStatus, setEmployeeStatus] = useState('Active'); // Employee status state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/staff/get-staff/${id}`);
        const { staffId, name, dob, gender, contact, address, email, position, department, dateOfJoined, employeeStatus } = response.data;

        setStaffId(staffId);
        setName(name);
        setDob(new Date(dob).toISOString().split('T')[0]); // Format DOB to YYYY-MM-DD
        setGender(gender);
        setContact(contact);
        setAddress(address);
        setEmail(email);
        setPosition(position);
        setDepartment(department);
        setDateOfJoined(new Date(dateOfJoined).toISOString().split('T')[0]); // Format joined date to YYYY-MM-DD
        setEmployeeStatus(employeeStatus || 'Active'); // Set the employeeStatus from the API or default to 'Active'
      } catch (error) {
        console.error(error);
        swal("Error", "Failed to fetch staff data.", "error");
      }
    };

    fetchStaff();
  }, [id]);

  const validateForm = () => {
    let newErrors = {};

    // Required field validations
    if (!name) newErrors.name = "Name is required.";
    
    // Date of Birth Validation: Age must be between 18 and 60 years
    if (!dob) {
      newErrors.dob = "Date of birth is required.";
    } else {
      const currentDate = new Date();
      const enteredDOB = new Date(dob);
      const age = currentDate.getFullYear() - enteredDOB.getFullYear();
      const ageDiff = currentDate - enteredDOB;

      // Check if age is less than 18 or more than 60
      if (age < 18 || age > 60) {
        newErrors.dob = "Age must be between 18 and 60 years.";
      } else if (age === 18 && ageDiff < 0) {
        newErrors.dob = "You must be at least 18 years old.";
      }
    }

    // Gender validation
    if (!gender) newErrors.gender = "Gender is required.";

    // Contact validation: Must be exactly 10 digits
    if (!contact) {
      newErrors.contact = "Contact number is required.";
    } else if (!/^\d{10}$/.test(contact)) {
      newErrors.contact = "Contact number must be exactly 10 digits.";
    }

    // Address validation
    if (!address) newErrors.address = "Address is required.";

    // Email validation
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/.+@.+\..+/.test(email)) {
      newErrors.email = "Email format is invalid.";
    }

    // Position validation
    if (!position) newErrors.position = "Position is required.";

    // Department validation
    if (!department) newErrors.department = "Department is required.";

    // Joined Date Validation
    if (!dateOfJoined) newErrors.dateOfJoined = "Joining date is required.";

    return newErrors;
  };

  const handleInputChange = (setter, field) => (event) => {
    setter(event.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const staffData = {
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
      employeeStatus,
    };

    try {
      await axios.put(`http://localhost:3002/staff/update-staff/${id}`, staffData);
      swal("Success", "Staff updated successfully!", "success");
      navigate("/view-staff");
    } catch (error) {
      console.error(error);
      swal("Error", "Failed to update staff data.", "error");
    }
  };

  const gendersList = ['Male', 'Female', 'Other'];
  const positionsList = [
    'Nurse', 'Physician Assistant', 'Medical Assistant', 'Pharmacist',
    'Radiologic Technologist', 'Lab Technician', 'Physical Therapist',
    'Occupational Therapist', 'Speech-Language Pathologist', 'Healthcare Administrator',
    'Health Information Technician', 'Surgical Technologist', 'Respiratory Therapist',
    'Clinical Research Coordinator', 'Patient Care Coordinator'
  ];
  const departmentsList = [
    'Emergency Department', 'Surgery Department', 'Internal Medicine', 'Pediatrics',
    'Obstetrics and Gynecology', 'Radiology', 'Laboratory Services', 'Pharmacy'
  ];
  const statusesList = ['Active', 'Inactive', 'Terminated'];

  const handleBlur = (field) => {
    setErrors((prevErrors) => {
      const validationErrors = validateForm();
      return { ...prevErrors, [field]: validationErrors[field] };
    });
  };

  return (
    <Box>
      <Box display="flex">
        <Sidebar />
        <Box
          display="flex"
          p={2}
          style={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', flex: 1, margin: '15px' }}
        >
          <Box
            flex={1}
            display="flex"
            justifyContent="space-between" // Aligns items in the flex container
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 3 }}
            style={{marginLeft:'20px'}}
          >
            <Box flex={1}>
              <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop: '40px' }}>
                Update Staff
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                variant="outlined"
                value={name}
                onChange={handleInputChange(setName, 'name')}
                helperText={errors.name}
                error={!!errors.name}
              />
                <TextField
                fullWidth
                margin="normal"
                label="Date of Birth"
                type="date"
                variant="outlined"
                value={dob}
                onChange={handleInputChange(setDob, 'dob')}
                onBlur={() => handleBlur('dob')}
                helperText={errors.dob}
                error={!!errors.dob}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: new Date().toISOString().split('T')[0] }} // Prevents future dates
                />

              <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.gender}>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={gender}
                  onChange={handleInputChange(setGender, 'gender')}
                  label="Gender"
                >
                  {gendersList.map((gen) => (
                    <MenuItem key={gen} value={gen}>{gen}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.gender}</FormHelperText>
              </FormControl>
              <TextField
                fullWidth
                margin="normal"
                label="Contact Number"
                variant="outlined"
                value={contact}
                onChange={handleInputChange(setContact, 'contact')}
                onBlur={() => handleBlur('contact')}
                helperText={errors.contact}
                error={!!errors.contact}
                type="tel"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Address"
                variant="outlined"
                value={address}
                onChange={handleInputChange(setAddress, 'address')}
                helperText={errors.address}
                error={!!errors.address}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                variant="outlined"
                value={email}
                onChange={handleInputChange(setEmail, 'email')}
                onBlur={() => handleBlur('email')}                
                helperText={errors.email}
                error={!!errors.email}
                type="email"
              />
              <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.position}>
                <InputLabel>Position</InputLabel>
                <Select
                  value={position}
                  onChange={handleInputChange(setPosition, 'position')}
                  label="Position"
                >
                  {positionsList.map((pos) => (
                    <MenuItem key={pos} value={pos}>{pos}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.position}</FormHelperText>
              </FormControl>
              <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.department}>
                <InputLabel>Department</InputLabel>
                <Select
                  value={department}
                  onChange={handleInputChange(setDepartment, 'department')}
                  label="Department"
                >
                  {departmentsList.map((dept) => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.department}</FormHelperText>
              </FormControl>
              <TextField
                fullWidth
                margin="normal"
                label="Date of Joining"
                type="date"
                variant="outlined"
                value={dateOfJoined}
                onChange={handleInputChange(setDateOfJoined, 'dateOfJoined')}
                helperText={errors.dateOfJoined}
                error={!!errors.dateOfJoined}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: new Date().toISOString().split('T')[0] }} // Prevents future dates
                />

              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={employeeStatus}
                  onChange={handleInputChange(setEmployeeStatus, 'employeeStatus')}
                  label="Status"
                >
                  {statusesList.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
              >
                Update Staff
              </Button>
            </Box>
          </Box>
          <Box
            component="img"
            src="https://img.freepik.com/premium-photo/picture-woman-wearing-blue-scrub-suit-with-smile-her-face_1162810-4844.jpg?ga=GA1.1.544247.1723654277&semt=ais_hybrid"// Set the image source
            alt="Staff Update"
            style={{
              width: '480px', 
              height: 'auto',
              marginLeft: '20px', 
              alignSelf: 'center',
              marginBottom:'440px',
              borderRadius:'15px'
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateStaff;
