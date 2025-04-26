import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Availability.css"; // Add styles if needed

export default function Availability() {
  const [drivers, setDrivers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all drivers
  useEffect(() => {
    axios.get("http://localhost:8070/staff/")
      .then((res) => {
        setDrivers(res.data);
      })
      .catch((err) => {
        alert("Error fetching drivers: " + err.message);
      });
  }, []);

  // Update driver availability
  const updateAvailability = (staffID, newStatus) => {
    axios.put(`http://localhost:8070/staff/update/${staffID}`, { availability: newStatus })
      .then(() => {
        setDrivers(drivers.map(driver => 
          driver.staffID === staffID ? { ...driver, availability: newStatus } : driver
        ));
      })
      .catch((err) => alert("Error updating availability: " + err.response.data.message));
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.staffID.toLowerCase().includes(searchQuery) ||
    driver.firstName.toLowerCase().includes(searchQuery) ||
    driver.lastName.toLowerCase().includes(searchQuery) ||
    driver.email.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="availability-container">
      <h2>Driver Availability Management</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by ID, Name, Email"
        value={searchQuery}
        onChange={handleSearch}
      />

      {/* Drivers Table */}
      <table>
        <thead>
          <tr>
            <th>Staff ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Experience</th>
            <th>Availability</th>
          </tr>
        </thead>
        <tbody>
          {filteredDrivers.map((driver) => (
            <tr key={driver.staffID}>
              <td>{driver.staffID}</td>
              <td>{driver.firstName} {driver.lastName}</td>
              <td>{driver.email}</td>
              <td>{driver.yearsOfExperience} years</td>
              <td>
                <select 
                  value={driver.availability || "Available"}
                  onChange={(e) => updateAvailability(driver.staffID, e.target.value)}
                >
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="On Leave">On Leave</option>
                 
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
