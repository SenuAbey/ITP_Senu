import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageTrips.css"; // reuse the same styles

const CompletedTrips = () => {
  const [completedBookings, setCompletedBookings] = useState([]);
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCompletedBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8070/bokings/completed/${username}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Completed trips fetched:", response.data);
        setCompletedBookings(response.data);
      } catch (err) {
        console.error("Error fetching completed trips:", err);
      }
    };

    fetchCompletedBookings();
  }, [username, token]);

  return (
    <div className="manage-trips-container">
      <h1>Completed Trips</h1>
      {completedBookings.length > 0 ? (
        <ul className="booking-list">
        {completedBookings.map((bk) => (
          <li key={bk._id} className="booking-card completed">
            <p><strong>Customer:</strong> {bk.customerName}</p>
            <p><strong>Contact:</strong> {bk.contactNumber}</p>
            <p><strong>Email:</strong> {bk.email}</p>
            <p>
              <strong>Rental Duration:</strong> {bk.rentalDuration?.value} {bk.rentalDuration?.type}
            </p>
            <p><strong>Total Amount:</strong> Rs. {bk.totalAmount}</p>
            <p><strong>Trip Date:</strong> {new Date(bk.tripDate).toLocaleDateString()}</p>
            <p><strong>Trip Status:</strong> <span className="status completed">{bk.tripStatus}</span></p>
          </li>
        ))}
      </ul>
      ) : (
        <p>No completed trips found.</p>
      )}
    </div>
  );
};

export default CompletedTrips;
