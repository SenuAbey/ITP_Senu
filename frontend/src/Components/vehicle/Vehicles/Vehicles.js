import React from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Vehicles.css';


function VehicleCard({vehicle = {}}) {
  const history = useNavigate();
  if (!vehicle) return <p>No vehicle data available</p>;

  const {_id,vehicleID,vehicleModel,vehicleType,vehiclePriceHour,vehiclePriceDay,vehicleStatus,vehicleMileage,vehicleImage} = vehicle;

  const deleteHandler = async()=>{
    const confirmDelete = window.confirm("Are you sure you want to delete this vehicle?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/Vehicles/${_id}`);
      alert (`Vehicle with ID: ${_id} has been deleted successfully.`);
      history("/");
      history("/VehicleDetails");
    }catch(err){
      alert("Failed to delete vehicle. Please try again.");
    }
  }

  return (
    <div className="vehicle-card">
      
      {vehicleImage && (
        <div>
          <img
            src={`http://localhost:5000/${vehicleImage}`}  // Assuming the image is served from the backend
            alt={vehicleModel}
            //style={{ width: '200px', height: 'auto' }}  
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

      

      <Link to ={`/vehicleDetails/${_id}`} className="update-link">
      Update</Link>
      <button onClick={deleteHandler} className="delete-button">Delete</button>

      <br/> 
    </div>
  )
}

export default VehicleCard
