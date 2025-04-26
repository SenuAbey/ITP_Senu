import React from "react";
import {Route, Routes } from 'react-router-dom';
import './App.css';
import HomeVehicle from "./Components/vehicle/HomeVehicles/HomeVehicles";
import NavBar from "./Components/vehicle/NavBar/Nav";
import AddVehicles from "./Components/vehicle/AddVehicles/AddVehicles";
import VehicleDetails from "./Components/vehicle/VehicleDetails/VehicleDetails";
import UpdateVehicle from "./Components/vehicle/UpdateVehicle/UpdateVehicle";
import CustomerVehicleDetails from "./Components/vehicle/VehicleDetails/CustomerVehicleDetails";
import TicketAdmin from './Components/tickets/ticketAdmin';
import TicketCustomer from './Components/tickets/ticketCustomer.js';
import BookingTable from "./Components/customerbooking/BookingTable";
import Bookingform from "./Components/customerbooking/Bookingform";
import EditBookingForm from "./Components/customerbooking/EditBookingForm";

function App() {
  return (
    <div className="App">
      
      <NavBar/>
     
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
          

        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
