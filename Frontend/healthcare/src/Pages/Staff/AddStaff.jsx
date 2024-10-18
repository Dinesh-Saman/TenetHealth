import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import axios from 'axios';
import swal from 'sweetalert';

const AddStaff = () => {
  const [staffId, setStaffId] = useState('');
  const [staffName, setStaffName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [dateOfJoined, setDateOfJoined] = useState(new Date().toISOString().substring(0, 10)); // Automatically set to today
  const [employeeStatus, setEmployeeStatus] = useState('Active');
  const [errors, setErrors] = useState({});

  // Function to generate a random staff ID
  const generateStaffId = () => {
    const randomId = Math.floor(Math.random() * 10000); // Generates a number between 0 and 9999
    return `STF-${String(randomId).padStart(4, '0')}`; // Prefix with 'STF-' and ensure it's 4 digits
  };

  const handleBlur = (field) => {
    // Trigger validation for the specific field when it loses focus
    setErrors((prevErrors) => {
      const validationErrors = validateForm();
      return { ...prevErrors, [field]: validationErrors[field] };
    });
  };
  

  useEffect(() => {
    // Automatically set staff ID when the component mounts
    setStaffId(generateStaffId());
  }, []);

  const validateForm = () => {
    let newErrors = {};
    
    if (!staffId) newErrors.staffId = "Staff ID is required.";
    if (!staffName) newErrors.staffName = "Staff name is required.";
    
    if (!dob) {
      newErrors.dob = "Date of birth is required.";
    } else {
      const today = new Date();
      const birthDate = new Date(dob);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        newErrors.dob = "Staff must be at least 18 years old.";
      } else if (age > 60) {
        newErrors.dob = "Staff must be under 60 years old.";
      }
    }

    if (!gender) newErrors.gender = "Gender is required.";
    
    // Validate contact number: must be 10 digits
    if (!contact) {
      newErrors.contact = "Contact number is required.";
    } else if (!/^\d{10}$/.test(contact)) {
      newErrors.contact = "Contact number must be exactly 10 digits.";
    }

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email is not valid.";
    }

    if (!address) newErrors.address = "Address is required.";
    
    if (!position) newErrors.position = "Position is required.";
    if (!department) newErrors.department = "Department is required.";
    if (!dateOfJoined) newErrors.dateOfJoined = "Date of joining is required.";

    return newErrors;
  };

  const handleInputChange = (setter, field) => (event) => {
    setter(event.target.value);
    // Reset the specific field's error when the user starts typing
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newStaff = {
      staffId,
      name: staffName,
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
      await axios.post('http://localhost:3002/staff/add-staff', newStaff);
      swal("Success", "New staff member added successfully!", "success");
      // Reset form fields here...
      setStaffId(generateStaffId()); // Generate new staff ID for the next entry
      setStaffName('');
      setDob('');
      setGender('');
      setContact('');
      setEmail('');
      setAddress('');
      setPosition('');
      setDepartment('');
      setDateOfJoined(new Date().toISOString().substring(0, 10)); // Reset to today
      setEmployeeStatus('Active');
      setErrors({});
    } catch (error) {
      console.error(error);
      swal("Error", "Something went wrong. Please try again.", "error");
    }
  };

  const positionsList = [
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
  ];
  
  const departmentsList = [
    'Emergency Department',
    'Surgery Department',
    'Internal Medicine',
    'Pediatrics',
    'Obstetrics and Gynecology',
    'Radiology',
    'Laboratory Services',
    'Pharmacy'
  ];

  const statusesList = ['Active', 'Inactive', 'Terminated'];

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
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            style={{ marginRight: '10px', marginLeft: '30px' }} // Add some space between the form and image
          >
            <Box alignItems="center" justifyContent="center">
              <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop: '40px' }}>
                Add New Staff Member
              </Typography>
            </Box>
            <TextField
              fullWidth
              margin="normal"
              label="Staff ID"
              variant="outlined"
              value={staffId}
              disabled // Disable the staff ID field since it is auto-generated
              helperText={errors.staffId}
              error={!!errors.staffId}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Staff Name"
              variant="outlined"
              value={staffName}
              onChange={handleInputChange(setStaffName, 'staffName')}
              helperText={errors.staffName}
              error={!!errors.staffName}
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
                inputProps={{ max: new Date().toISOString().split('T')[0] }} // Restricts future dates
                />

            <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.gender}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={gender}
                onChange={handleInputChange(setGender, 'gender')}
                label="Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
              <FormHelperText>{errors.gender}</FormHelperText>
            </FormControl>
            <TextField
                fullWidth
                margin="normal"
                label="Contact"
                variant="outlined"
                value={contact}
                type='tel' // Change to 'tel' to prevent arrows
                onChange={handleInputChange(setContact, 'contact')}
                helperText={errors.contact}
                error={!!errors.contact}
                inputProps={{
                    maxLength: 10, // Set maximum length to 10
                    inputMode: 'numeric', // Use numeric keyboard on mobile devices
                    pattern: "[0-9]*", // Allow only numbers
                }}
                onBlur={() => {
                    // Validate contact number on blur (when focus is lost)
                    if (!/^\d{10}$/.test(contact)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        contact: 'Contact number must be exactly 10 digits.',
                    }));
                    } else {
                    setErrors((prevErrors) => ({ ...prevErrors, contact: '' }));
                    }
                }}
                style={{ appearance: 'textfield' }} // Hide default arrows
                InputProps={{
                    style: { MozAppearance: 'textfield', WebkitAppearance: 'none' }, // Hide arrows in Firefox and Webkit-based browsers
                }}
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
            <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.position}>
              <InputLabel>Position</InputLabel>
              <Select
                value={position}
                onChange={handleInputChange(setPosition, 'position')}
                label="Position"
              >
                {positionsList.map((pos, index) => (
                  <MenuItem key={index} value={pos}>{pos}</MenuItem>
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
                {departmentsList.map((dept, index) => (
                  <MenuItem key={index} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.department}</FormHelperText>
            </FormControl>
            <TextField
                fullWidth
                margin="normal"
                label="Date of Joined"
                type="date"
                variant="outlined"
                value={dateOfJoined}
                onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    const currentDate = new Date();

                    // Update error state if selected date is in the future
                    if (selectedDate > currentDate) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        dateOfJoined: "Date of Joined cannot be in the future.",
                    }));
                    } else {
                    setErrors((prevErrors) => ({ ...prevErrors, dateOfJoined: "" }));
                    handleInputChange(setDateOfJoined, 'dateOfJoined')(e);
                    }
                }}
                helperText={errors.dateOfJoined}
                error={!!errors.dateOfJoined}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: new Date().toISOString().split("T")[0] }} // Freeze future dates
                />


            <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.employeeStatus}>
              <InputLabel>Employee Status</InputLabel>
              <Select
                value={employeeStatus}
                onChange={handleInputChange(setEmployeeStatus, 'employeeStatus')}
                label="Employee Status"
              >
                {statusesList.map((status, index) => (
                  <MenuItem key={index} value={status}>{status}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.employeeStatus}</FormHelperText>
            </FormControl>
            <Button fullWidth type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
              Add Staff
            </Button>
          </Box>
          {/* Optional Image Section */}
          <Box
            flex={1}
            marginTop='110px'
            alignItems="center"
            justifyContent="center"
            style={{ marginLeft: '20px' }} 
          >
            <img
              src="https://img.freepik.com/premium-photo/nurses-portrait-confident-hospital-service-support-collaboration-medicine_1313853-170036.jpg?ga=GA1.1.544247.1723654277&semt=ais_hybrid"
              alt="Add Staff"
              style={{ width: '100%', height: 'auto', borderRadius:'15px' }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddStaff;
