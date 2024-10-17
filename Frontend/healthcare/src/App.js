import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Correct import for Router


// Common Pages
import HomePage from './Pages/Guest/homepage';
import LoginForm from './Pages/User/login';
import RegisterForm from './Pages/User/register';
import Footer from './Components/customer_footer'
import Header from './Components/customer_header'

// Appointment Pages
import AddAppointment from './Pages/Appointment/MakeAppointment';
import ViewAppointments from './Pages/Appointment/ViewAppointments';
import AppointmentReport from './Pages/Appointment/AppointmentReport';

// Doctor Pages
import AddDoctor from './Pages/Doctor/AddDoctor';
import ViewDoctors from './Pages/Doctor/ViewDoctor';
import UpdateDoctor from './Pages/Doctor/UpdateDoctor';

// Appointment Pages
import UpdateAppointment from './Pages/Appointment/UpdateAppointment';

// Article Pages
import AddArticle from './Pages/Resource/AddResource';
import ViewResources from './Pages/Resource/ViewResource';
import UpdateResource from './Pages/Resource/UpdateResource';
import ResourceReportPage from './Pages/Resource/ResourceReport';
import ViewArticles from './Pages/Resource/ViewArticles';
import SingleArticlePage from './Pages/Resource/ViewSingleArticle';

// Ticket Pages
import AddTicket from './Pages/Tickets/AddTicket';
import ViewTickets from './Pages/Tickets/ViewTickets';
import UpdateTicket from './Pages/Tickets/UpdateTicket';

// Inventory Pages
import AddInventory from './Pages/Inventory/AddInventory';
import ViewInventory from './Pages/Inventory/ViewInventory';
import UpdateInventory from './Pages/Inventory/UpdateInventory';
import ManageProfileForm from './Pages/User/ManageProfile';
import AddPatient from './Pages/Patient/AddPatient';
import ViewPatients from './Pages/Patient/ViewPatients';
import UpdatePatient from './Pages/Patient/UpdatePatients';
import PatientReportPage from './Pages/Patient/PatientReport';
import AddStaff from './Pages/Staff/AddStaff';
import ViewStaff from './Pages/Staff/ViewStaff';
import UpdateStaff from './Pages/Staff/UpdateStaff';
import StaffReportPage from './Pages/Staff/StaffReport';

// Patient Pages

     
function App() {
  return (

      <div>
        <Header></Header>
        <Routes>
          {/* Dashboard and Home Routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Appointment Routes */}
          <Route path="/make-appointment" element={<AddAppointment />} /> 
          <Route path="/view-appointments" element={<ViewAppointments />} />
          <Route path="/appointment-report" element={<AppointmentReport />} />
          <Route path="/update-appointment/:id" element={<UpdateAppointment />} />

          {/* Doctor Routes */}
          <Route path="/add-doctor" element={<AddDoctor />} /> 
          <Route path="/view-doctors" element={<ViewDoctors />} /> 
          <Route path="/update-doctor/:id" element={<UpdateDoctor />} /> 

          {/* Resource Routes */}
          <Route path="/add-resource" element={<AddArticle />} /> 
          <Route path="/view-resources" element={<ViewResources />} /> 
          <Route path="/update-resource/:id" element={<UpdateResource />} /> 
          <Route path="/resource-report" element={<ResourceReportPage />} /> 
          <Route path="/view-articles" element={<ViewArticles/>} /> 
          <Route path="/view-articles/:id" element={<SingleArticlePage/>} /> 

          {/* User Routes */}
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/manage-profile/:id" element={<ManageProfileForm/>} /> 

          <Route path="/add-ticket" element={<AddTicket />} />
          <Route path="/view-ticket" element={<ViewTickets />} />
          <Route path="/update-ticket/:id" element={<UpdateTicket />} />

          <Route path="/add-inventory" element={<AddInventory />} />
          <Route path="/view-inventory" element={<ViewInventory />} />
          <Route path="/update-inventory/:id" element={<UpdateInventory />} />

          <Route path="/add-patient" element={<AddPatient />} />
          <Route path="/view-patients" element={<ViewPatients />} />
          <Route path="/update-patient/:id" element={<UpdatePatient />} />
          <Route path="/patient-report" element={<PatientReportPage />} />

          <Route path="/add-staff" element={<AddStaff />} />
          <Route path="/view-staff" element={<ViewStaff />} />
          <Route path="/update-staff/:id" element={<UpdateStaff />} />
          <Route path="/staff-report" element={<StaffReportPage />} />
          
        </Routes>
        <Footer></Footer>
      </div>

  );
}

export default App;
