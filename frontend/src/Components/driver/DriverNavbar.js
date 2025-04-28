import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./DriverNavbar.css";

const Navbar = () => {
  const username = localStorage.getItem("username");
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); // for dropdown visibility

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:8070/staff/notifications/${username}`);
        setUnreadCount(res.data.unreadCount);
        setNotifications(res.data.notifications);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    if (username) {
      fetchNotifications();
    }
  }, [username]);

  const handleNotificationClick = async () => {
    try {
      setShowDropdown(!showDropdown);

      if (!showDropdown) {
        // Only mark as read if opening the dropdown
        await axios.put(`http://localhost:8070/staff/notifications/mark-read/${username}`);
        // After marking as read, update state
        const res = await axios.get(`http://localhost:8070/staff/notifications/${username}`);
        setUnreadCount(res.data.unreadCount);
        setNotifications(res.data.notifications);
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return (
    <div className="top-bar">
      {/* Logo Section */}
      <div className="logo">
        <NavLink to="/" className="logo-link">Vehicle Rental Services</NavLink>
      </div>

      {/* Navigation / User Profile Section */}
      <div className="top-bar-actions">
        {/* Notifications Link */}
        <div className="top-bar-link" onClick={handleNotificationClick}>
          Notifications
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </div>

        {/* Notifications Dropdown */}
        {showDropdown && (
          <div className="notifications-dropdown">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={index} className="notification-item">
                  <p>{notification.message}</p>
                  <small>{new Date(notification.createdAt).toLocaleString()}</small>
                </div>
              ))
            ) : (
              <p>No notifications</p>
            )}
          </div>
        )}

        {/* User Profile Section */}
        <div className="user-profile">
          <NavLink to={`/driver-profile/${username}`}>
            <img 
              src="https://i.imgur.com/bpocvFd.jpg" 
              className="profile-avatar" 
              alt="Driver Avatar"
            />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
