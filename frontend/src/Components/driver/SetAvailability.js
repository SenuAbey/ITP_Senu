// SetAvailability.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import DriverSidebar from "./DriverSidebar";
import DriverNavbar from "./DriverNavbar";
import "./SetAvailability.css"; // You can create styling here

const SetAvailability = () => {
  const [availability, setAvailability] = useState("Available");
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCurrentAvailability = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8070/user/driver-dashboard/${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAvailability(res.data.availability);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch current availability:", err);
      }
    };

    fetchCurrentAvailability();
  }, [username, token]);

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8070/staff/set-availability/${username}`,
        { availability },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Availability updated successfully!");
    } catch (err) {
      console.error("Error updating availability:", err);
      alert("Failed to update availability.");
    }
  };

  if (loading) return <p>Loading current status...</p>;

  return (
    <div className="set-availability-page">
      <DriverNavbar />
      <DriverSidebar />
      <div className="availability-content">
        <h2>Set Your Availability</h2>
        <div className="form-group">
          <label htmlFor="availability">Current Status:</label>
          <select
            id="availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="Available">Available</option>
            <option value="On Leave">On Leave</option>
            <option value="Assigned">Assigned</option>
          </select>
        </div>
        <button className="update-btn" onClick={handleUpdate}>
          Update Availability
        </button>
      </div>
    </div>
  );
};

export default SetAvailability;
