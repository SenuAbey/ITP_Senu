import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageTrips.css";

const ManageTrips = () => {
  const [assignedBookings, setAssignedBookings] = useState([]);
  const [message, setMessage] = useState("");

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [completedBookings, setCompletedBookings] = useState([]);


  // Fetch all bookings assigned to this driver
  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8070/bokings/driver-bookings/${username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAssignedBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setMessage("Error: could not load bookings.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  useEffect(() => {
    if (username && token) fetchBookings();
    fetchCompletedBookings();
  }, [username, token]);

  // Update trip status and refresh list
  const updateTripStatus = async (bookingId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:8070/bokings/update-trip-status/${bookingId}`,
        { tripStatus: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      alert(response.data.message || "Trip status updated");
  
      if (newStatus === "Completed") {
        // Remove from UI immediately
        setAssignedBookings((prev) =>
          prev.filter((bk) => bk._id !== bookingId)
        );
      } else {
        // Just refresh assigned trips for other status
        fetchBookings();
      }
  
    } catch (err) {
      console.error("Failed to update trip status:", err);
      alert("Failed to update trip status.");
    }
  };
  
  
  

  // Wrapper for status update
  const handleStatusUpdate = (bookingId, newStatus) => {
    console.log("Clicked button for:", bookingId, "->", newStatus);
    updateTripStatus(bookingId, newStatus);
  };

  const fetchCompletedBookings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8070/bokings/completed/${username}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Completed bookings from backend:", response.data); // <--- add this
      setCompletedBookings(response.data);
    } catch (err) {
      console.error("Error fetching completed bookings:", err);
    }
  };
  

  return (
    <div className="manage-trips-container">
      <h1>Assigned Bookings</h1>
      {message && <div className="success-message">{message}</div>}
  
      <div className="assigned-bookings">
        {assignedBookings.length > 0 ? (
          <ul className="booking-list">
          {assignedBookings.map((bk) => (
            <li key={bk._id} className="booking-card">
              <p><strong>Customer:</strong> {bk.customerName}</p>
              <p><strong>Contact:</strong> {bk.contactNumber}</p>
              <p><strong>Email:</strong> {bk.email}</p>
              <p>
                <strong>Rental Duration:</strong> {bk.rentalDuration?.value}{" "}
                {bk.rentalDuration?.type}
              </p>
              <p><strong>Total Amount:</strong> Rs. {bk.totalAmount}</p>
              <p><strong>Trip Date:</strong> {new Date(bk.tripDate).toLocaleDateString()}</p>
              <p><strong>Trip Status:</strong> {bk.tripStatus}</p>
        
              <button onClick={() => updateTripStatus(bk._id, "Started")}>
              Start
            </button>
            <button onClick={() => handleStatusUpdate(bk._id, "Completed")}>
              Complete
            </button>

            </li>
          ))}
        </ul>
        ) : (
          <p>No assigned bookings yet.</p>
        )}
      </div>
  
      {/* Completed Bookings Section at the bottom 
      <div className="completed-bookings">
        <h1>Completed Trips</h1>
        {completedBookings.length > 0 ? (
          <ul className="booking-list">
            {completedBookings.map((bk) => (
              <li key={bk._id} className="booking-card completed">
                <p><strong>Customer:</strong> {bk.customerName}</p>
                <p><strong>Pickup:</strong> {bk.pickupLocation}</p>
                <p><strong>Dropoff:</strong> {bk.dropoffLocation}</p>
                <p><strong>Date:</strong> {new Date(bk.tripDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {bk.tripStatus}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No completed trips found.</p>
        )}
      </div>*/}
    </div>
  );
  
};

export default ManageTrips;
