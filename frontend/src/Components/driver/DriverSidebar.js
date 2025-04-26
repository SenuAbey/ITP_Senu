import React from "react";
import { NavLink, Link } from "react-router-dom";
import "./DriverSidebar.css";

const Sidebar = () => {
  return (
    <div className="driver-sidebar">
      <ul>
        <li className="sidebar-section">Driver Overview</li>
        <ul className="submenu">
          <li>
            <NavLink to="/driver-dashboard" activeClassName="active-link">
              Dashboard
            </NavLink>
          </li>
        </ul>

        <li className="sidebar-section">Trips</li>
        <ul className="submenu">
          <li>
          <NavLink to="/manage-trips" activeClassName="active-link">
          Manage Trips
         </NavLink>

          </li>
          <li>
            <NavLink to="/manage-trips/completed" activeClassName="active-link">
              Completed Trips
            </NavLink>
          </li>
        </ul>

        <li className="sidebar-section">Availability</li>
        <ul className="submenu">
          <li>
            <NavLink to="/driver/set-availability" activeClassName="active-link">
              Set Availability
            </NavLink>
          </li>
        </ul>
      </ul>
    </div>
  );
};

export default Sidebar;
