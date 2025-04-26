import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CustomerDashboard() {
  const { username } = useParams();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('username'); // optional: if you store it
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h2>Welcome, {username}!</h2>

      <div style={styles.section}>
        <h3>Your Options</h3>
        <ul>
          <li><button onClick={() => alert("Feature coming soon!")}>Book a Vehicle</button></li>
          <li><button onClick={() => alert("Feature coming soon!")}>View Your Bookings</button></li>
          <li><button onClick={() => alert("Feature coming soon!")}>Profile Settings</button></li>
        </ul>
      </div>

      <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    textAlign: "center",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh"
  },
  section: {
    marginTop: "2rem"
  },
  logoutBtn: {
    marginTop: "2rem",
    padding: "10px 20px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default CustomerDashboard;
