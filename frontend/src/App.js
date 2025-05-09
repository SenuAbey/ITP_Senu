import React from "react";
import {Route, Routes ,Navigate} from 'react-router-dom';
import './App.css';
import HomeVehicle from "./Components/vehicle/HomeVehicles/HomeVehicles";
import NavBar from "./Components/vehicle/NavBar/Nav";
import AdminNavBar from "./Components/vehicle/NavBar/AdminNav.js";
import DriverNavBar from "./Components/driver/DriverNavbar.js";
import AddVehicles from "./Components/vehicle/AddVehicles/AddVehicles";
import VehicleDetails from "./Components/vehicle/VehicleDetails/VehicleDetails";
import UpdateVehicle from "./Components/vehicle/UpdateVehicle/UpdateVehicle";
import CustomerVehicleDetails from "./Components/vehicle/VehicleDetails/CustomerVehicleDetails";
import TicketAdmin from './Components/tickets/ticketAdmin';
import TicketCustomer from './Components/tickets/ticketCustomer.js';
import BookingTable from "./Components/customerbooking/BookingTable";
import Bookingform from "./Components/customerbooking/Bookingform";
import EditBookingForm from "./Components/customerbooking/EditBookingForm";

import AddStaff from './Components/driver/AddStaff';
import AllStaffs from './Components/driver/AllStaffs';
import Login from './Components/driver/Login';
import Availability from "./Components/driver/Availability";
import AdminDashboard from "./Components/driver/AdminDashboard";
import DriverDashboard from "./Components/driver/DriverDashboard";
import BookVehicle from "./Components/driver/BookVehicle";
import AssignDriver from './Components/driver/AssignDriver';
import ManageDriver from './Components/driver/ManageDriver';
import EditDriver from './Components/driver/EditDriver';
import ManageTrips from './Components/driver/ManageTrips';
import CompletedTrips from './Components/driver/CompletedTrips';
import SetAvailability from "./Components/driver/SetAvailability";
import UpdateDriver from "./Components/driver/UpdateDriver";
import Register from './Components/driver/Register';
import CustomerDashboard from "./Components/driver/CustomerDashboard";

import { useState, useEffect } from 'react';
//import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";


function App() {
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  useEffect(() => {
    // You can retrieve the role from localStorage if it's already stored from login
    if (role) {
      localStorage.setItem("role", role);
    }
  }, [role]);

  // Conditionally render NavBar or AdminNavBar based on the role
  const renderNavBar = () => {
    if (role === "ADMIN") {
      return <AdminNavBar />;
    }else if (role === "DRIVER") {
      return <DriverNavBar />;
    }
    return <NavBar />;
  };
  return (
    <div className="App">
      
      
     {/* Render NavBar or AdminNavBar based on role */}
     {renderNavBar()}


      <React.Fragment>
        <Routes>
          
          <Route path = "/mainHome" element ={<HomeVehicle/>}/>
          <Route path = "/addVehicle" element ={<AddVehicles/>}/>
          <Route path = "/vehicleDetails" element ={<VehicleDetails/>}/>
          <Route path = "/vehicleDetails/:id" element ={<UpdateVehicle/>}/>
          <Route path = "/customerVehicleDetails" element={<CustomerVehicleDetails/>}/>
          <Route path = "/ticketCustomer" element ={<TicketCustomer/>}/>
          <Route path = "/ticketAdmin" element ={<TicketAdmin/>}/>
          <Route path="/bookings" element={<BookingTable />} />
          <Route path="/edit-booking/:id" element={<EditBookingForm />} />
          <Route path="/Bookingform" element={<Bookingform />} />
          
          <Route path="/login" element={<Login onLoginSuccess={setRole} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/approve-drivers" element={<AllStaffs />} />
          <Route path="/register-driver" element={<AddStaff />} />
          <Route path="/manage-drivers" element={<ManageDriver />} />
          <Route path="/edit-driver/:staffID" element={<EditDriver />} />
          <Route path="/set-availability" element={<Availability />} />
          <Route path="/book-vehicle" element={<BookVehicle />} />
          <Route path="/assign-drivers" element={<AssignDriver />} />
          <Route path="/driver-dashboard/:username" element={<DriverDashboard />} />
          <Route path="/manage-trips" element={<ManageTrips />} />
          <Route path="/manage-trips/completed" element={<CompletedTrips />} />
          <Route path="/driver/set-availability" element={<SetAvailability />} />
          <Route path="/update-driver" element={<UpdateDriver />} />
          <Route path="/customer-dashboard/:username" element={<CustomerDashboard />} />
          <Route path="*" element={<Navigate to="/login" />} />
          


        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;