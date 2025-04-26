import React from 'react';
import { Link } from "react-router-dom";
import './HomeVehicles.css';

function HomeVehicles() {
  return (
    <div>
      
      <h1>This is home</h1><br/>
      <p>View Vehicle Details as an Administrator</p>
      <Link to="/customerVehicleDetails" id="customer-vehicle-link">
                Customer
      </Link> 
      <br/><br/>
      <p>View Vehicle Details as a Customer</p>
      <Link to="/vehicleDetails" id="admin-vehicle-link">
                Administrator
      </Link> 
    </div>
  )
}

export default HomeVehicles
