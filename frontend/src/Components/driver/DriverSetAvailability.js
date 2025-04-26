import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SetAvailability = () => {
  const [availability, setAvailability] = useState("Available");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const staffID = localStorage.getItem("staffID"); // Assuming staffID is stored in localStorage, adjust if needed

  // Handle form submission to update availability
  const handleAvailabilityChange = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading state

    try {
      // Make an API call to update the driver's availability
      const response = await axios.patch(`/staff/update-availability/${staffID}`, { availability });

      if (response.status === 200) {
        alert("Availability updated successfully!");
        navigate("/driver-dashboard"); // Redirect to the driver dashboard after success
      } else {
        alert("There was an error updating your availability. Please try again.");
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("There was an error updating your availability. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };

  return (
    <div className="set-availability">
      <h2>Set Your Availability</h2>
      <form onSubmit={handleAvailabilityChange}>
        <label htmlFor="availability">Choose Availability:</label>
        <select
          id="availability"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        >
          <option value="Available">Available</option>
          <option value="On Leave">On Leave</option>
          <option value="Assigned">Assigned</option>
        </select>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Availability"}
        </button>
      </form>
    </div>
  );
};

export default SetAvailability;
