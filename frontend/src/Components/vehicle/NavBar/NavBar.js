import React from 'react';
import './NavBar.css';
import {Link} from 'react-router-dom';

function NavBar() {
  return (
<div className="navbar"> 
  <h1>Vehicle Booking and Rental System</h1>
      <ul> 
        <li>
          <Link to = "/mainHome" className="vehicleHome">
          <h1>HOME</h1></Link>
        </li>

        {/* 

        <li>
          <Link to = "/addVehicle" className="vehicleHome">
          <h1>Add Vehicles</h1></Link>
        </li>
        <li>
          <Link to = "/vehicleDetails" className="VehicleDetails">
          <h1>vehicle details</h1></Link>
        </li>
        */}
        
      </ul>
    </div>
  )
}

export default NavBar

