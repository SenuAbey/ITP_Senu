import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DriverSidebar from "./DriverSidebar";
import DriverNavbar from "./DriverNavbar";
import "./DriverDashboard.css";

const DriverDashboard = () => {
  const [driverData, setDriverData] = useState(null);
  const [assignedBookings, setAssignedBookings] = useState([]);
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [totalTrips, setTotalTrips] = useState(0);
  const [completedTrips, setCompletedTrips] = useState(0);
  const [pendingTrips, setPendingTrips] = useState(0);

  useEffect(() => {
    if (!username || !token) {
      console.error("Username or token is missing from localStorage.");
      return; // Prevent further action if username or token is missing
    }

    // Fetch driver data
    const fetchDriverData = async () => {
      try {
        console.log("Calling driver dashboard endpoint with Driver: %s, Token: %s", username, token);
        const response = await axios.get(`http://localhost:8070/user/driver-dashboard/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Driver data fetched successfully:", response.data);
        setDriverData(response.data);
      } catch (error) {
        console.error("Error fetching driver details:", error);
      }
    };

    // Fetch assigned bookings
    const fetchAssignedBookings = async () => {
      try {
        console.log("Fetching assigned bookings for Driver: %s", username);
        const response = await axios.get(`http://localhost:8070/bokings/driver-bookings/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Assigned bookings fetched:", response.data);
        setAssignedBookings(response.data);
      } catch (error) {
        console.error("Error fetching assigned bookings:", error);
      }
    };

    const fetchTripCounts = async () => {
      try {
        const [totalRes, completedRes, pendingRes] = await Promise.all([
          axios.get(`http://localhost:8070/bokings/total-trips/${username}`),
          axios.get(`http://localhost:8070/bokings/completed-trips/${username}`),
          axios.get(`http://localhost:8070/bokings/pending-trips/${username}`)
        ]);
    
        setTotalTrips(totalRes.data.totalTrips);
        setCompletedTrips(completedRes.data.completedTrips);
        setPendingTrips(pendingRes.data.pendingTrips);
      } catch (error) {
        console.error("Error fetching trip counts:", error);
      }
    };
    

    // Fetch both driver data and assigned bookings
    if (username && token) {
      fetchDriverData();
      fetchAssignedBookings();
      fetchTripCounts();
    }
  }, [username, token]);

  if (!driverData) return <p>Loading driver details...</p>;

  return (
    <div className="driver-dashboard">
      <DriverNavbar />
      <DriverSidebar />
      <div className="dashboard-content">
          <div className="welcome-heading">
        <h1>Welcome, {driverData.firstName}!</h1>
      </div>
        <div className="dashboard-main">
          <div className="dashboard-overview">
            {/* Trip Summary Boxes */}
            <div className="dashboard-box-container">
              <div className="dashboard-box">
                <h3>Total Trips</h3>
                <p>{totalTrips}</p>
              </div>
              <div className="dashboard-box">
                <h3>Completed Trips</h3>
                <p>{completedTrips}</p>
              </div>
              <div className="dashboard-box">
                <h3>Pending Trips</h3>
                <p>{pendingTrips}</p>
              </div>
            </div>

            {/* Status Section */}
            <div className="dashboard-section">
              <h2 className="section-heading">Status</h2>
              <div className="status-box">
                <h3>Current Status</h3>
                <p>{driverData.availability}</p>
              </div>
            </div>
          </div>

          {/* Driver Details */}
          <div className="driver-details-box">
            <h2>Driver Details</h2>
            <p><strong>Staff ID:</strong> {driverData.staffID}</p>
            <p><strong>First Name:</strong> {driverData.firstName}</p>
            <p><strong>Last Name:</strong> {driverData.lastName}</p>
            <p><strong>NIC:</strong> {driverData.NIC}</p>
            <p><strong>Date Of Birth:</strong> {driverData.dob}</p>
            <p><strong>Gender:</strong> {driverData.gender}</p>
            <p><strong>Contact Number:</strong> {driverData.contactNumber}</p>
            <p><strong>Email:</strong> {driverData.email}</p>
            <p><strong>Years Of Experience:</strong> {driverData.yearsOfExperience}</p>
            <button onClick={() => navigate("/update-driver")}>Update Details</button>
          </div>
          
        </div>


      </div>
    </div>
  );
};

export default DriverDashboard;
