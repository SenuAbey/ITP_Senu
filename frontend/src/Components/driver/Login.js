import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8070/user/login", {
        username,
        password,
      });

      console.log(response.data);

      if (response.data.token && response.data.role) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("username", response.data.username);

        console.log("User logged in:", response.data.username, "Role:", response.data.role);
        onLoginSuccess(response.data.role);

        if (response.data.role === "ADMIN") {
          navigate("/admin-dashboard");
        } else if (response.data.role === "DRIVER") {
          navigate(`/driver-dashboard/${response.data.username}`);
        } else if (response.data.role === "CUSTOMER") {
          navigate(`/customerVehicleDetails/${response.data.username}`);
        }
      } else {
        console.error("Role is missing in API response");
      }
    } catch (err) {
      setMessage("Invalid username or password");
    }
  };

  // Navigate to the register page directly
  const navigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="header-section">
        <h1>Driver Management</h1>
      </div>
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {message && <p className="error-message">{message}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>

        {/* Single Register Button */}
        <div className="register-option">
          <p>Don't have an account?</p>
          <button
            onClick={navigateToRegister}
            className="register-button"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
