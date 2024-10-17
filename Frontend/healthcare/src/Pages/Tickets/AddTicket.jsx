import React, { useState } from 'react';
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@material-ui/core';
import axios from 'axios';
import swal from 'sweetalert';

const AddTicket = () => {
  const [email, setEmail] = useState('');
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [errors, setErrors] = useState({});

  // Only update email without validation
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  // Validate email on blur (when input loses focus)
  const handleEmailBlur = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setErrors(prevErrors => ({ ...prevErrors, email: 'Please enter a valid email address.' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, email: '' }));
    }
  };

  const handleIssueTitleChange = (event) => {
    const titleValue = event.target.value;
    const titleRegex = /^[A-Za-z\s]+$/; // Only allows alphabetic characters and spaces

    if (!titleRegex.test(titleValue)) {
      setErrors(prevErrors => ({ ...prevErrors, issueTitle: 'Title cannot contain numbers or special characters.' }));
    } else {
      setIssueTitle(titleValue);
      setErrors(prevErrors => ({ ...prevErrors, issueTitle: '' }));
    }
  };

  const handleIssueDescriptionChange = (event) => {
    setIssueDescription(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, issueDescription: '' }));
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, priority: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!issueTitle) newErrors.issueTitle = "Issue title is required.";
    if (!issueDescription) newErrors.issueDescription = "Issue description is required.";
    if (!priority) newErrors.priority = "Priority is required.";

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newTicket = {
      email,
      issueTitle,
      issueDescription,
      priority,
    };

    try {
      await axios.post('http://localhost:3002/tickets', newTicket);
      swal("Success", "Ticket created successfully!", "success");
      setEmail('');
      setIssueTitle('');
      setIssueDescription('');
      setPriority('');
      setErrors({});
    } catch (error) {
      console.error(error);
      swal("Error", "Something went wrong. Please try again.", "error");
    }
  };

  const priorityOptions = ['Low', 'Medium', 'High'];

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      style={{
        minHeight: '100vh',
        backgroundImage: 'url(https://arrivein.com/wp-content/uploads/2020/06/Blog-Banner-Family-health.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px',
      }}
    >
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        style={{
          width: '400px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: 8,
          boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
        }}
      >
      <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign:'center' }}>
        Add New Ticket
      </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          variant="outlined"
          value={email}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur} // Validate email on blur
          helperText={errors.email || ' '}  // Pre-reserve space for the error message
          error={!!errors.email}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Issue Title"
          variant="outlined"
          value={issueTitle}
          rows={3}
          multiline
          onChange={handleIssueTitleChange}
          helperText={errors.issueTitle || ' '}
          error={!!errors.issueTitle}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Issue Description"
          variant="outlined"
          multiline
          rows={4}
          value={issueDescription}
          onChange={handleIssueDescriptionChange}
          helperText={errors.issueDescription || ' '}
          error={!!errors.issueDescription}
        />
        <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.priority}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            onChange={handlePriorityChange}
            label="Priority"
          >
            {priorityOptions.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.priority || ' '}</FormHelperText>
        </FormControl>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          style={{ marginTop: 16 }}
        >
          Add Ticket
        </Button>
      </Box>
    </Box>
  );
};

export default AddTicket;
