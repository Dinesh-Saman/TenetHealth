import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import axios from 'axios';
import swal from 'sweetalert';

const AddPatient = () => {
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [nic, setNic] = useState('');
  const [registrationDate, setRegistrationDate] = useState(new Date().toISOString().substring(0, 10)); // Automatically set to today
  const [status, setStatus] = useState('Active');
  const [errors, setErrors] = useState({});

  // Function to generate a random patient ID
  const generatePatientId = () => {
    const randomId = Math.floor(Math.random() * 10000); // Generates a number between 0 and 9999
    return `P-${String(randomId).padStart(4, '0')}`; // Prefix with 'P-' and ensure it's 4 digits
  };

  useEffect(() => {
    // Automatically set patient ID when the component mounts
    setPatientId(generatePatientId());
  }, []);

  const handleBlur = (field) => {
    // Trigger validation for the specific field when it loses focus
    setErrors((prevErrors) => {
      const validationErrors = validateForm();
      return { ...prevErrors, [field]: validationErrors[field] };
    });
  };

  const validateForm = () => {
    let newErrors = {}; // Changed from const to let
    if (!patientId) newErrors.patientId = "Patient ID is required.";
    if (!patientName) newErrors.patientName = "Patient name is required.";
    
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
  
      if (age < 0) {
        newErrors.dob = "Date of birth cannot be in the future.";
      } else if (age > 120) {
        newErrors.dob = "Patient must be under 120 years old.";
      }
    }
  
    if (!gender) newErrors.gender = "Gender is required.";

    // Validate contact number: must be 10 digits
    if (!contact) {
      newErrors.contact = "Contact number is required.";
    } else if (!/^\d{10}$/.test(contact)) {
      newErrors.contact = "Contact number must be exactly 10 digits.";
    }
    
    if (!address) newErrors.address = "Address is required.";
    
    // Validate NIC: must be either 12 digits or 10 digits followed by 'V'/'v'
    if (!nic) {
      newErrors.nic = "NIC is required.";
    } else if (!/^\d{12}$/.test(nic) && !/^\d{9}[Vv]$/.test(nic)) {
      newErrors.nic = "NIC must be either 12 digits or 10 digits followed by 'V'/'v'.";
    }
    
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

    const newPatient = {
      patientId,
      patientName,
      dob,
      gender,
      contact,
      address,
      nic,
      registrationDate,
      patientStatus: status,
    };

    try {
      await axios.post('http://localhost:3002/patients/add-patient', newPatient);
      swal("Success", "New patient added successfully!", "success");
      // Reset form fields here...
      setPatientId(generatePatientId()); // Generate new patient ID for the next entry
      setPatientName('');
      setDob('');
      setGender('');
      setContact('');
      setAddress('');
      setNic('');
      setRegistrationDate(new Date().toISOString().substring(0, 10));
      setStatus('Active');
      setErrors({});
    } catch (error) {
      console.error(error);
      swal("Error", "Something went wrong. Please try again.", "error");
    }
  };

  const gendersList = ['Male', 'Female', 'Other'];
  const statusesList = ['Active', 'Inactive'];

  return (
    <Box>
      <Box display="flex">
        <Sidebar />
        <Box
          display="flex"
          p={2}
          style={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', flex: 1, margin: '15px' }}
        >
          {/* Form Section */}
          <Box
            flex={1}
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            style={{ marginRight: '10px', marginLeft:'30px' }} // Add some space between the form and image
          >
            <Box alignItems="center" justifyContent="center">
              <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop: '40px' }}>
                Add New Patient
              </Typography>
            </Box>
            <TextField
              fullWidth
              margin="normal"
              label="Patient ID"
              variant="outlined"
              value={patientId}
              disabled
              helperText={errors.patientId}
              error={!!errors.patientId}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Patient Name"
              variant="outlined"
              value={patientName}
              onChange={handleInputChange(setPatientName, 'patientName')}
              helperText={errors.patientName}
              error={!!errors.patientName}
            />
            <TextField
                fullWidth
                margin="normal"
                label="Date of Birth"
                type="date"
                variant="outlined"
                value={dob}
                onChange={handleInputChange(setDob, 'dob')}
                helperText={errors.dob}
                error={!!errors.dob}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: new Date().toISOString().split('T')[0] }}
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
              label="Contact"
              variant="outlined"
              type='tel'
              value={contact}
              onChange={handleInputChange(setContact, 'contact')}
              helperText={errors.contact}
              error={!!errors.contact}
              inputProps={{
                maxLength: 10, 
                inputMode: 'numeric',
                pattern: "[0-9]*", 
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
              label="NIC"
              variant="outlined"
              value={nic}
              onChange={handleInputChange(setNic, 'nic')}
              onBlur={() => handleBlur('nic')}
              helperText={errors.nic}
              error={!!errors.nic}
            />
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status"
              >
                {statusesList.map((stat) => (
                  <MenuItem key={stat} value={stat}>{stat}</MenuItem>
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
              Add Patient
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
              src="https://www.shutterstock.com/image-photo/beautiful-modern-female-doctor-talking-600nw-2332044449.jpg"
              alt="Add Patient"
              style={{ width: '96%', height: 'auto', borderRadius:'15px' }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddPatient;
