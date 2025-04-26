import React from "react";
import { NavLink } from "react-router-dom";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  return (
    <div className="top-bar">
      {/* Logo Section */}
      <div className="logo">
        <NavLink to="/" className="logo-link">Admin Dashboard</NavLink>
      </div>

      {/* Navigation / User Profile Section */}
      <div className="top-bar-actions">
        {/* Navigation Links */}
        
        <NavLink to="/notifications" className="top-bar-link">
          Notifications
        </NavLink>

        {/* User Profile Icon or Avatar */}
        <div className="user-profile">
          <img 
            src="https://via.placeholder.com/40" 
            alt="User Avatar" 
            className="profile-avatar" 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
