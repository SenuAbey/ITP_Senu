import React from 'react';
import { Link } from "react-router-dom";
//import { useNavigate } from 'react-router-dom';
import './Vehicles.css';

function CustomerVehicles({vehicle = {}}) {
    //const history = useNavigate();
    if (!vehicle) return <p>No vehicle data available</p>;

  const {vehicleID,vehicleModel,vehicleType,vehiclePriceHour,vehiclePriceDay,vehicleStatus,vehicleMileage,vehicleImage,VehicleAddedDate} = vehicle;

  //const isNew = VehicleAddedDate && (new Date() - new Date(VehicleAddedDate)) <= 1 * 60 * 1000;
  //const isNew = VehicleAddedDate && (new Date() - new Date(VehicleAddedDate)) <= 24 * 60 * 60 * 1000; // 24 hours
  const isNew = VehicleAddedDate && (new Date() - new Date(VehicleAddedDate)) > 0 && (new Date() - new Date(VehicleAddedDate)) <= 1 *60* 60 * 1000;

  return (
    <div className="vehicle-card">
      
      {isNew && (
        <div className="new-tag">New</div>
      )}

      {vehicleImage && (
        <div>
          <img
            src={`http://localhost:5000/${vehicleImage}`}
            alt={vehicleModel}
          />
        </div>
      )}
      
      
      <h1>Vehicle ID : {vehicleID}</h1>
      <h1>Vehicle Model : {vehicleModel}</h1>
      <h1>Vehicle Type : {vehicleType}</h1>
      <h1>Vehicle Price per Hour : {vehiclePriceHour}</h1>
      <h1>Vehicle Price per Day : {vehiclePriceDay}</h1>
      <h1>Vehicle Status : {vehicleStatus}</h1>
      <h1>Vehicle Mileage : {vehicleMileage}</h1>

      <Link to ="" className="vehicle-book-link">
      Book Now</Link>
      

      <br/> 
    </div>
  )
}

export default CustomerVehicles




