import React from "react";
import "./nav.css";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <div className="nav">
      <div className="left">
        <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
          <h2 className="system">Vehicle Rental Services</h2>
        </Link>
      </div>
      <div className="right">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/bookings" className="nav-link">My Bookings</Link>
        <Link to="/customer-support" className="nav-link">Customer Support</Link>
        <Link to="/about-us" className="nav-link">About Us</Link>
      </div>
    </div>
  );
};

export default Nav;