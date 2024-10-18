import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, FormControl, Select, InputLabel, Box, Typography, FormHelperText } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const UpdatePatient = () => {
  const { id } = useParams(); // Extract patient ID from URL params
  const navigate = useNavigate();

  // State variables for patient details
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [nic, setNic] = useState('');
  const [dateOfRegistration, setDateOfRegistration] = useState(''); // Registration date state
  const [patientStatus, setPatientStatus] = useState('Active'); // Patient status state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/patients/get-patient/${id}`);
        const { patientId, patientName, dob, gender, contact, address, nic, dateOfRegistration, patientStatus } = response.data;

        setPatientId(patientId);
        setPatientName(patientName);
        setDob(new Date(dob).toISOString().split('T')[0]); // Format DOB to YYYY-MM-DD
        setGender(gender);
        setContact(contact);
        setAddress(address);
        setNic(nic);
        
        // Ensure dateOfRegistration is formatted correctly
        setDateOfRegistration(new Date(dateOfRegistration).toISOString().split('T')[0]); // Format registration date to YYYY-MM-DD
        setPatientStatus(patientStatus || 'Active'); // Set the patientStatus from the API or default to 'Active'
      } catch (error) {
        console.error(error);
        swal("Error", "Failed to fetch patient data.", "error");
      }
    };

    fetchPatient();
  }, [id]);

  const validateForm = () => {
    let newErrors = {};

    // Required field validations
    if (!patientName) newErrors.patientName = "Patient name is required.";

    // Date of Birth Validation: Must not exceed 120 years
    if (!dob) {
      newErrors.dob = "Date of birth is required.";
    } else {
      const currentDate = new Date();
      const enteredDOB = new Date(dob);
      const age = currentDate.getFullYear() - enteredDOB.getFullYear();
      if (age > 120) {
        newErrors.dob = "Date of birth cannot indicate an age greater than 120 years.";
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

    // NIC validation: Must be either 12 digits or 10 digits followed by 'V'/'v'
    if (!nic) {
      newErrors.nic = "NIC is required.";
    } else if (!/^\d{12}$/.test(nic) && !/^\d{9}[Vv]$/.test(nic)) {
      newErrors.nic = "NIC must be either 12 digits or 10 digits followed by 'V'/'v'.";
    }

    // Registration Date Validation
    if (!dateOfRegistration) newErrors.dateOfRegistration = "Registration date is required.";

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

    const patientData = {
      patientId,
      patientName,
      dob,
      gender,
      contact,
      address,
      nic,
      dateOfRegistration,
      patientStatus: patientStatus,
    };

    try {
      await axios.put(`http://localhost:3002/patients/update-patient/${id}`, patientData);
      swal("Success", "Patient updated successfully!", "success");
      navigate("/view-patients");
    } catch (error) {
      console.error(error);
      swal("Error", "Failed to update patient data.", "error");
    }
  };

  const gendersList = ['Male', 'Female', 'Other'];
  const statusesList = ['Active', 'Inactive'];

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
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            style={{ marginRight: '20px', marginLeft: '30px' }} 
          >
            <Box alignItems="center" justifyContent="center">
              <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop: '40px' }}>
                Update Patient Details
              </Typography>
            </Box>
            <TextField
              fullWidth
              margin="normal"
              label="Patient ID"
              variant="outlined"
              value={patientId}
              InputProps={{ readOnly: true }} 
              disabled
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
              type="date" // Change type to date
              variant="outlined"
              value={dob}
              onChange={handleInputChange(setDob, 'dob')}
              onBlur={() => handleBlur('dob')}
              helperText={errors.dob}
              error={!!errors.dob}
              InputLabelProps={{
                shrink: true, // This makes the label stay above the input
              }}
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
              value={contact}
              onChange={handleInputChange(setContact, 'contact')}
              onBlur={() => handleBlur('contact')}              
              helperText={errors.contact}
              error={!!errors.contact}
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
            <TextField
              fullWidth
              margin="normal"
              label="Registration Date"
              type="date" 
              variant="outlined"
              value={dateOfRegistration}
              onChange={handleInputChange(setDateOfRegistration, 'dateOfRegistration')}
              helperText={errors.dateOfRegistration}
              error={!!errors.dateOfRegistration}
              InputLabelProps={{
                shrink: true, // This makes the label stay above the input
              }}
            />
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Patient Status</InputLabel>
              <Select
                value={patientStatus} // Set from the fetched data
                onChange={(e) => setPatientStatus(e.target.value)} // Updates patientStatus state
                label="patientStatus"
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
              Update Patient
            </Button>
          </Box>
          <Box
            flex={1}
            marginTop='110px'
            alignItems="center"
            justifyContent="center"
            style={{ marginLeft: '20px' }} 
          >
            <img
              src="https://img.freepik.com/premium-photo/portrait-positive-middle-aged-male-doctor-senior-female-patient-smiling-camera-after-medi_1346034-86463.jpg?ga=GA1.2.544247.1723654277&semt=ais_hybrid"
              alt="profile"
              style={{ width: '430px', borderRadius: '10px' }} 
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdatePatient;
