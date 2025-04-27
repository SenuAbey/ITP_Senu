import React from "react";
import "./nav.css";
import { Link } from "react-router-dom";

const Nav = () => {
  console.log("NavBar is being rendered");
  return (
    <div className="nav">
      <div className="left">
        <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
          <h2 className="system">Vehicle Rental Services</h2>
        </Link>
      </div>
      <div className="right">
      
        <Link to="/VehicleDetails" className="nav-link">Dashboard</Link>
        <Link to="/bookings" className="nav-link">Booking Details</Link>
        <Link to="/ticketAdmin" className="nav-link">Customer Tickets</Link>
        <Link to="" className="nav-link">Driver Management</Link>
      </div>
    </div>
  );
};

export default Nav;