import React, { useState, useEffect } from "react";  // Import useState and useEffect
import axios from "axios";  // Import axios
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import "./AdminDashboard.css";
import BookVehicle from "./BookVehicle";

const AdminDashboard = () => {
  const [totalStaffs, setTotalStaffs] = useState(0);
  const [availableDrivers, setAvailableDrivers] = useState(0);
  const [assignedDrivers, setAssignedDrivers] = useState(0);
  const [onLeaveDrivers, setonLeaveDrivers] = useState(0);
  const [activeTrips, setActiveTrips] = useState(0);
  const [completedTrips,setCompletedTrips] = useState(0);
  const [totalTrips,settotalTrips] = useState(0);

  useEffect(() => {
    // Fetch total staff count when the component mounts
    axios.get("http://localhost:8070/staff/total-staffs")
      .then((response) => {
        setTotalStaffs(response.data.totalStaffs);
      })
      .catch((error) => {
        console.error("Error fetching total staff count: ", error);
      });

    // Fetch available drivers count
    axios.get("http://localhost:8070/staff/available-staffs")
      .then((response) => {
        setAvailableDrivers(response.data.availableDrivers);
      })
      .catch((error) => {
        console.error("Error fetching available drivers: ", error);
      });

    // Fetch assigned drivers count
    axios.get("http://localhost:8070/staff/assigned-staffs")
      .then((response) => {
        setAssignedDrivers(response.data.assignedDrivers);
      })
      .catch((error) => {
        console.error("Error fetching assigned drivers: ", error);
      });

       // Fetch available drivers count
    axios.get("http://localhost:8070/staff/onleave-staffs")
    .then((response) => {
      setonLeaveDrivers(response.data.onLeaveDrivers);
    })
    .catch((error) => {
      console.error("Error fetching available drivers: ", error);
    });


    // Fetch active trips count
  axios.get("http://localhost:8070/bokings/active-trips")
  .then((response) => {
    setActiveTrips(response.data.activeTripsCount);
  })
  .catch((error) => {
    console.error("Error fetching active trips: ", error);
  });

  // Fetch active trips count
  axios.get("http://localhost:8070/bokings/completed-trips")
  .then((response) => {
    setCompletedTrips(response.data.completedTripsCount);
  })
  .catch((error) => {
    console.error("Error fetching active trips: ", error);
  });

  // Fetch active trips count
  axios.get("http://localhost:8070/bokings/total-trips")
  .then((response) => {
    settotalTrips(response.data.totalTripsCount);
  })
  .catch((error) => {
    console.error("Error fetching active trips: ", error);
  });
  }, []);

  return (
   
    <div className="admin-dashboard">
        <AdminNavbar />
      <AdminSidebar />
      <div className="dashboard-content">
        <h1>Welcome, Admin </h1>
        
        {/* Drivers Section */}
        <div className="dashboard-section">
          <h2>Drivers</h2>
          <div className="dashboard-box-container">
            <div className="dashboard-box">
              <h3>Total Drivers</h3>
              <p>{totalStaffs}</p> 
            </div>
            <div className="dashboard-box">
              <h3>Assigned Drivers</h3>
              <p>{assignedDrivers}</p> 
            </div>
            <div className="dashboard-box">
              <h3>Available Drivers</h3>
              <p>{availableDrivers}</p> 
            </div>
            <div className="dashboard-box">
              <h3>On Leave Drivers</h3>
              <p>{onLeaveDrivers}</p> 
            </div>
          </div>
        </div>

        {/* Trips Section */}
        <div className="dashboard-section">
          <h2>Trips</h2>
          <div className="dashboard-box-container">
          <div className="dashboard-box">
              <h3>Total Trips</h3>
              <p>{totalTrips}</p> 
            </div>
            <div className="dashboard-box">
              <h3>Total Active Trips</h3>
              <p>{activeTrips}</p> 
            </div>
            <div className="dashboard-box">
              <h3>Completed Trips</h3>
              <p>{completedTrips}</p> 
            </div>
          </div>
        </div>
      </div>
    </div>

        
       
      
  );
};

export default AdminDashboard;
