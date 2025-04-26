import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import the plugin
import { NavLink } from 'react-router-dom';
import "./ManageDriver.css";

export default function ManageDriver() {
    const [drivers, setDrivers] = useState([]); // State to store all driver data
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [filteredDrivers, setFilteredDrivers] = useState([]); // State for filtered data

    // Fetch all driver data on component load
    useEffect(() => {
        function getDrivers() {
            axios.get("http://localhost:8070/staff/")
                .then((res) => {
                    setDrivers(res.data); // Store all driver data
                    setFilteredDrivers(res.data); // Initialize filtered data with all drivers
                })
                .catch((err) => {
                    alert(err.message); // Show error if any
                });
        }
        getDrivers();
    }, []);

    // Handle search input dynamically
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const result = drivers.filter((driver) =>
            driver.staffID?.toString().toLowerCase().includes(query) ||
            driver.firstName.toLowerCase().includes(query) ||
            driver.lastName.toLowerCase().includes(query) ||
            driver.email.toLowerCase().includes(query) ||
            driver.contactNumber?.toLowerCase().includes(query) || // Include contactNumber
            driver.yearsOfExperience?.toString().includes(query)
        );
        setFilteredDrivers(result);
    };

    // Delete driver
    const deleteDriver = (staffID) => {
        if (window.confirm("Are you sure you want to delete this driver?")) {
            axios.delete(`http://localhost:8070/staff/delete/${staffID}`)
                .then((res) => {
                    alert("Driver deleted successfully!");
                    setFilteredDrivers(filteredDrivers.filter(driver => driver.staffID !== staffID));
                })
                .catch((err) => alert("Error deleting driver: " + err.message));
        }
    };

      // Generate PDF report
      const generatePDF = () => {
        const doc = new jsPDF();
    
        // Title
        doc.setFontSize(18);
        doc.text("Staff Details Report", 14, 15);
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);
    
        // Define Table Columns
        const columns = ["Staff ID", "Name", "Email", "Contact", "Experience"];
        const rows = filteredDrivers.map(driver => [
            driver.staffID,
            `${driver.firstName} ${driver.lastName}`,
            driver.email,
            driver.contactNumber || "N/A",
            driver.yearsOfExperience || "N/A"
        ]);
    
        // Add table using autoTable
        autoTable(doc, { // Ensure autoTable is correctly used
            startY: 30,
            head: [columns],
            body: rows
        });
    
        // Save the PDF
        doc.save("Staff_Details_Report.pdf");
    };
    

    return (
        <div className="driver-container">
            <h2 className="title">Manage Drivers</h2>

            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search by Staff ID, Name, or Email"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            {/* Driver Table */}
            <table className="driver-table">
                <thead>
                    <tr>
                        <th>Staff ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact Number</th>
                        <th>Years of Experience</th>
                        <th>Actions</th> 
                    </tr>
                </thead>
                <tbody>
                    {filteredDrivers.map((driver) => (
                        <tr key={driver.staffID}>
                            <td>{driver.staffID}</td>
                            <td>{driver.firstName} {driver.lastName}</td>
                            <td>{driver.email}</td>
                            <td>{driver.contactNumber || "N/A"}</td>
                            <td>{driver.yearsOfExperience || "N/A"}</td>
                            <td>
                                <NavLink
                                    to={`/edit-driver/${driver.staffID}`}
                                    className={({ isActive }) => (isActive ? "active-link" : "")} // Correctly apply active class
                                >
                                    <button className="updaten-button">Update</button>
                                </NavLink>

                                <button onClick={() => deleteDriver(driver.staffID)} className="delete-button">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
                
            {/* Generate Report Button */}
            <button onClick={generatePDF} className="generate-report-button">
                Generate PDF Report
            </button>

        </div>
    );
}
