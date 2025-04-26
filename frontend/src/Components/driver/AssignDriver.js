/*import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AssignDriver.css";

const AssignDriver = () => {
  const [bookings, setBookings] = useState([]);
  const [staff, setStaff] = useState([]); // To store the list of available staff (drivers)
  const [selectedStaff, setSelectedStaff] = useState({}); // Object to store the selected driver for each booking

  // Fetch bookings with drivers needed and available staff
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:8070/bookings/driver-needed");
        
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching driver-needed bookings:", error);
      }
    };

    const fetchStaff = async () => {
    try {
        const response = await fetch('http://localhost:8070/staff/available-drivers');
        
        if (!response.ok) {
            console.error('Error fetching available staff:', response.statusText);
            return;
        }
        
        const data = await response.json();  // Parse the JSON directly
        
        if (data.length === 0) {
            console.error('No available staff found.');
            return;
        }
        
        console.log('Available staff:', data);
        setStaff(data);  // Update state with available staff
    } catch (error) {
        console.error('Error fetching available staff:', error);
    }
};

      
    fetchBookings();
    fetchStaff();
  }, []);

  const handleAssignDriver = async (bookingId) => {
    const staffId = selectedStaff[bookingId];
    
    if (!staffId) {
      alert("Please select a driver");
      return;
    }

    // Logic to assign the staff (driver) to the booking
    try {
      const response = await axios.put(`http://localhost:8070/bookings/assign-driver/${bookingId}`, { staffId });
      alert(response.data.message);
    } catch (error) {
      console.error("Error assigning driver:", error);
    }
  };

  const handleDriverChange = (bookingId, staffId) => {
    setSelectedStaff((prevSelectedStaff) => ({
      ...prevSelectedStaff,
      [bookingId]: staffId,
    }));
  };

  return (
    <div className="container">
      <h2>Assign Driver</h2>
      {bookings.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Vehicle Type</th>
              <th>Pickup Location</th>
              <th>Dropoff Location</th>
              <th>Trip Date</th>
              <th>Assign Driver</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.customerName}</td>
                <td>{booking.vehicleType}</td>
                <td>{booking.pickupLocation}</td>
                <td>{booking.dropoffLocation}</td>
                <td>{booking.tripDate}</td>
                <td>
                  <select 
                    onChange={(e) => handleDriverChange(booking._id, e.target.value)} 
                    value={selectedStaff[booking._id] || ""}
                  >
                    <option value="">Select Driver</option>
                    {staff.length > 0 ? (
                      staff.map((staffMember) => (
                        <option key={staffMember._id} value={staffMember._id}>
                          {staffMember.firstName} {staffMember.lastName} ({staffMember.availability})
                        </option>
                      ))
                    ) : (
                      <option value="">No available drivers</option>
                    )}
                  </select>
                  <button onClick={() => handleAssignDriver(booking._id)}>
                    Assign Driver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No bookings require a driver.</p>
      )}
    </div>
  );
};

export default AssignDriver;*/

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AssignDriver.css";

const AssignDriver = () => {
  const [bookings, setBookings] = useState([]);
  const [staff, setStaff] = useState([]); // Available drivers
  const [selectedStaff, setSelectedStaff] = useState({}); // Driver selected per booking

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:8070/bokings/driver-needed"); // You may need to update this endpoint logic too
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings needing drivers:", error);
      }
    };

    const fetchStaff = async () => {
      try {
        const response = await fetch('http://localhost:8070/staff/available-drivers');
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setStaff(data);
      } catch (error) {
        console.error('Error fetching available staff:', error);
      }
    };

    fetchBookings();
    fetchStaff();
  }, []);

  const handleAssignDriver = async (bookingId) => {
    const staffId = selectedStaff[bookingId];
    if (!staffId) return alert("Please select a driver");

    try {
      const response = await axios.put(`http://localhost:8070/bokings/assign-driver/${bookingId}`, { staffId });
      alert(response.data.message);
    } catch (error) {
      console.error("Error assigning driver:", error);
    }
  };

  const handleDriverChange = (bookingId, staffId) => {
    setSelectedStaff((prev) => ({
      ...prev,
      [bookingId]: staffId,
    }));
  };

  return (
    <div className="container">
      <h2>Assign Driver</h2>
      {bookings.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>License No.</th>
              <th>Trip Date</th>
              <th>Rental Duration</th>
              <th>Total Amount</th>
              <th>Assign Driver</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.customerName}</td>
                <td>{booking.contactNumber}</td>
                <td>{booking.email}</td>
                <td>{booking.driverLicenseNumber}</td>
                <td>{new Date(booking.tripDate).toLocaleDateString()}</td>
                <td>{booking.rentalDuration?.value} {booking.rentalDuration?.type}</td>
                <td>${booking.totalAmount}</td>
                <td>
                  <select 
                    onChange={(e) => handleDriverChange(booking._id, e.target.value)} 
                    value={selectedStaff[booking._id] || ""}
                  >
                    <option value="">Select Driver</option>
                    {staff.length > 0 ? (
                      staff.map((driver) => (
                        <option key={driver._id} value={driver._id}>
                          {driver.firstName} {driver.lastName}
                        </option>
                      ))
                    ) : (
                      <option value="">No available drivers</option>
                    )}
                  </select>
                  <button onClick={() => handleAssignDriver(booking._id)}>
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No bookings need a driver.</p>
      )}
    </div>
  );
};

export default AssignDriver;



