import React from "react";
import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  
  return (
    <div className="admin-sidebar">
      <ul>

        <li className="sidebar-section">Driver Overview</li>
        <ul className="submenu">
          <li>
            <NavLink to="/register-driver" activeClassName="active-link">
              Register Driver
            </NavLink>
          </li>
          <li>
            <NavLink to="/approve-drivers" activeClassName="active-link">
              Approve/Reject Driver
            </NavLink>
          </li>
          <li>
            <NavLink to="/manage-drivers" activeClassName="active-link">
              Manage Driver Details
            </NavLink>
          </li>
        </ul>

        <li className="sidebar-section">Trip Management</li>
        <ul className="submenu">
          <li>
            <NavLink to="/assign-drivers" activeClassName="active-link">
              Assign Drivers
            </NavLink>
          </li>
          
        </ul>

        <li className="sidebar-section">Availability</li>
        <ul className="submenu">
          <li>
            <NavLink to="/set-availability" activeClassName="active-link">
              Set Availability
            </NavLink>
          </li>
          
        </ul>
      
      </ul>
    </div>
  );
};

export default AdminSidebar;
