import React, { useEffect, useState } from 'react';
import Sidebar from '../../Components/sidebar';
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
} from '@material-ui/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PatientReportPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:3002/patients/get-patients'); // Update endpoint for patients
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError('Failed to load patients.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

    const handleDownload = async () => {
        try {
            const doc = new jsPDF('p', 'mm', 'a3');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 15;
            const startY = 15;

            const logoImgUrl = "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tenet_Health_logo.png";
            const img = await loadImage(logoImgUrl);

            // Add image to the PDF
            doc.addImage(img, 'PNG', margin, startY, 40, 40);

            const tableWidth = pageWidth - margin * 2;

            // Header Section
            doc.setFillColor(128, 0, 128);
            doc.rect(margin, startY, tableWidth, 50, 'F');

            doc.setFontSize(22);
            doc.setFont('courier', 'bold');
            doc.setTextColor(255, 255, 0);
            doc.text("Tenet Health", pageWidth / 2, startY + 15, { align: 'center' });

            doc.setFontSize(17);
            doc.setTextColor(255, 255, 0);
            doc.text('Patient Report', pageWidth / 2, startY + 25, { align: 'center' });

            doc.setFontSize(12);
            doc.setTextColor(255, 255, 255);
            doc.text('139 Srimath Anagarika Dharmapala Mawatha, Colombo 07', pageWidth / 2, startY + 35, { align: 'center' });

            doc.setFontSize(12);
            doc.setTextColor(255, 255, 0);
            doc.text('Contact - 0114 700 700', pageWidth / 2, startY + 45, { align: 'center' });

            doc.setLineWidth(0.5);
            doc.setDrawColor(255, 255, 255);
            doc.line(margin, startY + 55, pageWidth - margin, startY + 55);

            // Table Setup
            const tableColumn = ['Patient ID', 'Name', 'Date of Birth', 'Gender', 'Contact', 'NIC', 'Status', 'Address', 'Date of Registration'];
            const tableRows = patients.map((patient) => [
                patient.patientId || 'Unknown',
                patient.patientName || 'No Name',
                patient.dob ? patient.dob.substring(0, 10) : 'N/A',
                patient.gender || 'Unknown',
                patient.contact || 'N/A',
                patient.nic || 'N/A',
                patient.patientStatus || 'N/A',
                patient.address || 'N/A',
                patient.dateOfRegistration ? patient.dateOfRegistration.substring(0, 10) : 'N/A',
            ]);

            // Add Table to PDF
            doc.autoTable({
                startY: startY + 56,
                head: [tableColumn],
                body: tableRows,
                styles: {
                    fontSize: 10,
                    overflow: 'linebreak',
                    cellPadding: 4,
                    halign: 'center',
                    valign: 'middle',
                },
                headStyles: {
                    fillColor: [255, 68, 51],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                },
                bodyStyles: {
                    fillColor: [255, 255, 255],
                    textColor: [0, 0, 0],
                    lineWidth: 0.1,
                    lineColor: [200, 200, 200],
                },
                margin: { top: 0, bottom: 20, left: margin, right: margin },
                width: tableWidth,
            });

            // Page Numbers and Footer
            const pageCount = doc.internal.getNumberOfPages();
            const today = new Date().toLocaleDateString(); // Get today's date

            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.setTextColor(128, 128, 128);

                // Add page number
                doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });

                // Add "Report generated on" with the current date
                doc.text(`Report generated on: ${today}`, margin, pageHeight - 10, { align: 'left' });
            }

            doc.save('patient_report.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box display="flex">
        <Sidebar />
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          style={{
            flex: 1,
            minHeight: '100vh',
            backgroundColor: 'white',
            borderRadius: 8,
            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
            margin: '15px',
            position: 'relative',
            marginTop: '15px',
            marginBottom: '15px',
          }}
          id="printable-section"
        >
          <Box
            style={{
              textAlign: 'center',
              marginBottom: '20px',
              padding: '10px',
              borderBottom: '2px solid purple',
              backgroundColor: '#32174D',
              width: '100%',
              boxSizing: 'border-box',
            }}>

            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Tenet_Health_logo.png"
              alt="Tenet Health Logo"
              style={{ width: '200px' }}
            />
            <Typography variant="body1" style={{ fontFamily: 'sans-serif', color: 'white', marginTop: 10 }}>
              139 Srimath Anagarika Dharmapala Mawatha, Colombo 07
              <br />
              Contact: 0114 700 700
            </Typography>
            <Typography variant="h6" style={{ fontFamily: 'serif', fontStyle: 'bold', color: 'yellow', marginTop: '20px', fontSize: '30px' }}>
              Patient Report
            </Typography>
          </Box>
          <Box mt={2} mb={2}>
            <Button variant="contained" color="primary" onClick={handleDownload}>
              Download PDF
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Patient ID</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Date of Birth</strong></TableCell>
                  <TableCell><strong>Gender</strong></TableCell>
                  <TableCell><strong>Contact</strong></TableCell>
                  <TableCell><strong>NIC</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Address</strong></TableCell>
                  <TableCell><strong>Date of Registration</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((patient) => (
                  <TableRow key={patient._id}>
                    <TableCell>{patient.patientId}</TableCell>
                    <TableCell>{patient.patientName}</TableCell>
                    <TableCell>{patient.dob ? patient.dob.substring(0, 10) : 'N/A'}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.contact}</TableCell>
                    <TableCell>{patient.nic}</TableCell>
                    <TableCell>{patient.patientStatus}</TableCell>
                    <TableCell>{patient.address || 'N/A'}</TableCell>
                    <TableCell>{patient.dateOfRegistration ? patient.dateOfRegistration.substring(0, 10) : 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={patients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PatientReportPage;
