import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, FormControl, Select, InputLabel, TablePagination, IconButton } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import { makeStyles } from '@material-ui/core/styles';
import { Edit, Delete } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';

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
    overflowX: 'auto', // Add overflowX to the container
  },
  tableWrapper: {
    overflowX: 'auto', // Add overflowX here to allow horizontal scrolling
  },
}));

const ViewStaff = () => {
  const classes = useStyles();
  const [staffData, setStaffData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/staff/get-staff'); // Adjust your endpoint here
        setStaffData(response.data);
      } catch (error) {
        console.error("There was an error fetching the staff data!", error);
      }
    };

    fetchStaffData();
  }, []);

  const handleUpdate = (staffId) => {
    navigate(`/update-staff/${staffId}`); // Navigate to the update page with the staff ID
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/staff/delete-staff/${id}`);
      setStaffData(staffData.filter(staff => staff._id !== id));
    } catch (error) {
      console.error("There was an error deleting the staff member!", error);
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

  const filteredStaff = staffData.filter(staff => {
    if (!searchQuery) return true;
    const field = staff[searchCriteria]?.toString().toLowerCase();
    return field?.startsWith(searchQuery.toLowerCase());
  });

  const paginatedStaff = filteredStaff.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Box display="flex">
        <Sidebar />
        <Box className={classes.contentContainer}  style={{overflowX:'auto'}}>
          <Box
            alignItems="center"
            justifyContent="space-between"
            marginTop={"60px"}
            width="100%"
            display="flex"
            flexDirection="row"
          >
            <Typography variant="h4" gutterBottom style={{ marginBottom: '20px', fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center' }}>
              Staff
            </Typography>
            <Box display="flex" alignItems="center">
              <FormControl className={classes.criteriaSelect}>
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchCriteria}
                  onChange={handleCriteriaChange}
                  label="Search By"
                >
                  <MenuItem value="staffId">ID</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="dob">Date of Birth</MenuItem>
                  <MenuItem value="gender">Gender</MenuItem>
                  <MenuItem value="contact">Contact</MenuItem>
                  <MenuItem value="address">Address</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="position">Position</MenuItem>
                  <MenuItem value="department">Department</MenuItem>
                  <MenuItem value="dateOfJoined">Date of Joining</MenuItem>
                  <MenuItem value="employeeStatus">Status</MenuItem>
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
            <Box className={classes.tableWrapper} > {/* Add a wrapper here for overflow */}
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: '#d4ac0d', color: 'white' }}>
                    <TableCell style={{ color: 'white' }}>ID</TableCell>
                    <TableCell style={{ color: 'white' }}>Name</TableCell>
                    <TableCell style={{ color: 'white' }}>DOB</TableCell>
                    <TableCell style={{ color: 'white' }}>Gender</TableCell>
                    <TableCell style={{ color: 'white' }}>Contact</TableCell>
                    <TableCell style={{ color: 'white' }}>Address</TableCell>
                    <TableCell style={{ color: 'white' }}>Email</TableCell>
                    <TableCell style={{ color: 'white' }}>Position</TableCell>
                    <TableCell style={{ color: 'white' }}>Department</TableCell>
                    <TableCell style={{ color: 'white' }}>Date of Joining</TableCell>
                    <TableCell style={{ color: 'white' }}>Status</TableCell>
                    <TableCell style={{ color: 'white' }}>Update</TableCell>
                    <TableCell style={{ color: 'white' }}>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedStaff.map((staff) => (
                    <TableRow key={staff._id}>
                      <TableCell>{staff.staffId}</TableCell>
                      <TableCell>{staff.name}</TableCell>
                      <TableCell>{staff.dob.substring(0, 10)}</TableCell>
                      <TableCell>{staff.gender}</TableCell>
                      <TableCell>{staff.contact}</TableCell>
                      <TableCell>{staff.address}</TableCell>
                      <TableCell>{staff.email}</TableCell>
                      <TableCell>{staff.position}</TableCell>
                      <TableCell>{staff.department}</TableCell>
                      <TableCell>{staff.dateOfJoined.substring(0, 10)}</TableCell>
                      <TableCell>{staff.employeeStatus}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleUpdate(staff._id)}>
                          <Edit />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton color="secondary" onClick={() => handleDelete(staff._id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </TableContainer>
          <CustomPagination
            count={filteredStaff.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ViewStaff;
