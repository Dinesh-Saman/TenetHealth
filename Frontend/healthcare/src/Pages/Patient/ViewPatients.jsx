import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, FormControl, Select, InputLabel, TablePagination, IconButton } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import { makeStyles } from '@material-ui/core/styles';
import { Edit, Delete } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert2';

// Custom Pagination Component
const CustomPagination = ({ count, page, rowsPerPage, onPageChange }) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      rowsPerPageOptions={[]} 
      labelRowsPerPage="" 
    />
  );
};

const useStyles = makeStyles((theme) => ({
  searchField: {
    marginBottom: '20px',
    width: '300px',
    borderRadius: '25px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '25px',
      padding: '5px 10px',
    },
    '& .MuiOutlinedInput-input': {
      padding: '8px 14px',
      fontSize: '14px',
    },
  },
  criteriaSelect: {
    marginRight: '45px',
    minWidth: '150px',
    marginBottom: '30px',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    flex: 1,
    margin: '15px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '80vh',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
  },
}));

const ViewPatients = () => {
  const classes = useStyles();
  const [patientData, setPatientData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("patientName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/patients/get-patients');
        setPatientData(response.data);
      } catch (error) {
        console.error("There was an error fetching the patient data!", error);
      }
    };

    fetchPatientData();
  }, []);

  const handleUpdate = (patientId) => {
    navigate(`/update-patient/${patientId}`); // Navigate to the update page with the patient ID
  };

  const handleDelete = async (id) => {
    const result = await swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this patient record!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3002/patients/delete-patient/${id}`);
        setPatientData(patientData.filter(patient => patient._id !== id));
        swal.fire(
          'Deleted!',
          'The record has been deleted.',
          'success'
        );
      } catch (error) {
        console.error("There was an error deleting the patient!", error);
        swal.fire(
          'Error!',
          'There was an error deleting the record.',
          'error'
        );
      }
    }
  };
  
  

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCriteriaChange = (event) => {
    setSearchCriteria(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredPatients = patientData.filter(patient => {
    if (!searchQuery) return true;
    const field = patient[searchCriteria]?.toString().toLowerCase();
    return field?.startsWith(searchQuery.toLowerCase());
  });

  const paginatedPatients = filteredPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Box display="flex">
        <Sidebar />
        <Box className={classes.contentContainer}>
          <Box
            alignItems="center"
            justifyContent="space-between"
            marginTop={"60px"}
            width="100%"
            display="flex"
            flexDirection="row"
          >
            <Typography variant="h4" gutterBottom style={{ marginBottom: '20px', fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center' }}>
              Patients
            </Typography>
            <Box display="flex" alignItems="center">
              <FormControl className={classes.criteriaSelect}>
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchCriteria}
                  onChange={handleCriteriaChange}
                  label="Search By"
                >
                  <MenuItem value="patientId">ID</MenuItem>
                  <MenuItem value="patientName">Name</MenuItem>
                  <MenuItem value="dob">Date of Birth</MenuItem>
                  <MenuItem value="gender">Gender</MenuItem>
                  <MenuItem value="contact">Contact</MenuItem>
                  <MenuItem value="address">Address</MenuItem>
                  <MenuItem value="nic">NIC</MenuItem>
                  <MenuItem value="registrationDate">Registration Date</MenuItem>
                  <MenuItem value="status">Status</MenuItem>
                </Select>
              </FormControl>
              <TextField
                variant="outlined"
                placeholder={`Search by ${searchCriteria}`}
                value={searchQuery}
                onChange={handleSearchQueryChange}
                className={classes.searchField}
              />
            </Box>
          </Box>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#d4ac0d', color: 'white' }}>
                  <TableCell style={{ color: 'white' }}>ID</TableCell>
                  <TableCell style={{ color: 'white' }}>Name</TableCell>
                  <TableCell style={{ color: 'white' }}>DOB</TableCell>
                  <TableCell style={{ color: 'white' }}>Gender</TableCell>
                  <TableCell style={{ color: 'white' }}>Contact</TableCell>
                  <TableCell style={{ color: 'white' }}>Address</TableCell>
                  <TableCell style={{ color: 'white' }}>NIC</TableCell>
                  <TableCell style={{ color: 'white' }}>Registration</TableCell>
                  <TableCell style={{ color: 'white' }}>Status</TableCell>
                  <TableCell style={{ color: 'white' }}>Update</TableCell>
                  <TableCell style={{ color: 'white' }}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPatients.map((patient) => (
                  <TableRow key={patient._id}>
                    <TableCell>{patient.patientId}</TableCell>
                    <TableCell>{patient.patientName}</TableCell>
                    <TableCell>{patient.dob.substring(0,10)}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.contact}</TableCell>
                    <TableCell>{patient.address}</TableCell>
                    <TableCell>{patient.nic}</TableCell>
                    <TableCell>{patient.dateOfRegistration.substring(0, 10)}</TableCell>
                    <TableCell>{patient.patientStatus}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleUpdate(patient._id)}>
                        <Edit />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton color="secondary" onClick={() => handleDelete(patient._id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            count={filteredPatients.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ViewPatients;
