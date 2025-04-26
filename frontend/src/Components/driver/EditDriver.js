import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import "./EditDriver.css";

export default function EditDriver() {
    const { staffID } = useParams();  // Get staffID from URL params
    const [driver, setDriver] = useState({
        firstName: "",
        lastName: "",
        email: "",
        contactNumber: "",
        yearsOfExperience: "",
    });
    const [isLoading, setIsLoading] = useState(true);  // Loading state
    const [staffList, setStaffList] = useState([]);  // State for staff list
    const [error, setError] = useState(null);  // State to handle errors
    const navigate = useNavigate();  // Initialize useNavigate

    // Fetch driver data based on staffID
    useEffect(() => {
        // Fetch driver data
        axios.get(`http://localhost:8070/staff`)
        .then((res) => {
            console.log("Fetched Data:", res.data);  // Check API response
            const driverData = res.data.find((d) => d.staffID === staffID); // Find the correct driver
            if (driverData) {
                setDriver(driverData);
            } else {
                setError("Driver not found");
            }
            setIsLoading(false);
        })
        .catch((err) => {
            console.error("Error fetching driver:", err);
            setError(err.message);
            setIsLoading(false);
        });
        // Fetch all staff members (example list fetch)
        axios.get(`http://localhost:8070/staff`)
            .then((res) => {
                setStaffList(res.data);  // Set staff list data
            })
            .catch((err) => {
                setError(err.message);  // Set error message if there's any error
            });
    }, [staffID]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDriver((prevState) => ({
            ...prevState,
            [name]: value.trim(),
        }));
    };

    // Handle form submission to update the driver data
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate contactNumber 
        if (!/^\d{10}$/.test(driver.contactNumber)) {
            return alert("Contact number must be a 10-digit numeric value.");
        }
         // Validate Email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(driver.email)) {
            return alert("Please enter a valid email address.");
        }

        // Validate yearsOfExperience (should be a valid number)
        if (Number(driver.yearsOfExperience) < 0 || isNaN(Number(driver.yearsOfExperience))) {
            alert("Years of Experience should be a valid number.");
            return;
        }

        axios.put(`http://localhost:8070/staff/update/${staffID}`, driver)
            .then((res) => {
                alert("Driver updated successfully!");
                navigate("/manage-drivers");  // Redirect to manage drivers page using useNavigate
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Failed to update driver.");
            });
    };

    return (
        <div className="edit-driver-form">
            <h2 className="title">Edit Driver</h2>

            {isLoading ? (
                <p>Loading...</p>  // Display loading message until data is fetched
            ) : error ? (
                <p className="error-message">Error: {error}</p> // Display error if any
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={driver.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={driver.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={driver.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contact Number</label>
                        <input
                            type="text"
                            name="contactNumber"
                            value={driver.contactNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Years of Experience</label>
                        <input
                            type="number"
                            name="yearsOfExperience"
                            value={driver.yearsOfExperience}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="updates-button">
                        Update Driver
                    </button>
                </form>
            )}
        </div>
    );
}
