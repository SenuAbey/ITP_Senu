import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Correctly spelled axios
import "./AllStaffs.css"

export default function AllStaffs() {
    const [staffs, setStaffs] = useState([]); // State to store all staff data
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [filteredStaffs, setFilteredStaffs] = useState([]); // State for filtered data

    // Fetch all staff data on component load
    useEffect(() => {
        function getStaffs() {
            axios.get("http://localhost:8070/staff/")
                .then((res) => {
                    setStaffs(res.data); // Store all staff data
                    setFilteredStaffs(res.data); // Initialize filtered data with all staff
                })
                .catch((err) => {
                    alert(err.message); // Show error if any
                });
        }
        getStaffs();
    }, []);

     // Handle search input dynamically
     const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        
        const result = staffs.filter((staff) =>
            staff.staffID.toLowerCase().includes(query) ||
            staff.firstName.toLowerCase().includes(query) ||
            staff.lastName.toLowerCase().includes(query) ||
            staff.email.toLowerCase().includes(query)
        );
        setFilteredStaffs(result);
    };

       // Approve driver registration
       const approveDriver = (staffID) => {
        axios.put(`http://localhost:8070/staff/update/${staffID}`, { status: 'approved' })
            .then((res) => {
                alert(res.data.message);  // Show success message
                setFilteredStaffs(filteredStaffs.map(staff =>
                    staff.staffID === staffID ? { ...staff, status: 'approved' } : staff
                ));
            })
            .catch((err) => alert("Error approving driver: " + err.response.data.message));
    };

    // Reject driver registration
    const rejectDriver = (staffID) => {
        axios.put(`http://localhost:8070/staff/update/${staffID}`, { status: 'rejected' })
            .then((res) => {
                alert(res.data.message);  
                setFilteredStaffs(filteredStaffs.map(staff =>
                    staff.staffID === staffID ? { ...staff, status: 'rejected' } : staff
                ));
            })
            .catch((err) => alert("Error rejecting driver: " + err.response.data.message));
    };
    return (
        <div className="driver-container">
            <h2 className="title">Registered Drivers</h2>

            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search by Staff ID, Name, or Email"
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <button onClick={handleSearch} className="search-button">
                    Search
                </button>
            </div>


            {/* Staff Table */}
            <table className="driver-table">
                <thead>
                    <tr>
                    <th>Staff ID</th>
                    <th>Staff ID</th>
                            <th>Name</th>
                            <th>NIC</th>
                            <th>DOB</th>
                            <th>Gender</th>
                            <th>Contact</th>
                            <th>Email</th>
                            <th>Experience</th>
                            <th>License</th>
                            <th>Approve/Reject</th> {/* New column for approve/reject buttons */}
                    </tr>
                </thead>
                <tbody>
                    {filteredStaffs.map((staff) => (
                        <tr key={staff.staffID}>
                            <td>{staff.staffID}</td>
                            <td>{staff.firstName}</td>
                            <td>{staff.lastName}</td>
                            <td>{staff.NIC}</td>
                            <td>{new Date(staff.dob).toLocaleDateString()}</td>
                                <td>{staff.gender}</td>
                                <td>{staff.contactNumber}</td>
                                <td>{staff.email}</td>
                                <td>{staff.yearsOfExperience} years</td>
                                <td>
                                    {staff.driversLicense ? (
                                        <a href={`/${staff.driversLicense}`} target="_blank" rel="noopener noreferrer">
                                            View License
                                        </a>
                                    ) : "Not uploaded"}
                                </td>
                                     {/* Approve/Reject buttons */}
                            <td>
                                {staff.status !== 'approved' && staff.status !== 'rejected' && (
                                    <>
                                        <button onClick={() => approveDriver(staff.staffID)} className="approve-button">
                                            Approve
                                        </button>
                                        <button onClick={() => rejectDriver(staff.staffID)} className="reject-button">
                                            Reject
                                        </button>
                                    </>
                                )}
                                {staff.status === 'approved' && <span>Approved</span>}
                                {staff.status === 'rejected' && <span>Rejected</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
