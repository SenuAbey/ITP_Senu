import React, { useState } from "react";
import axios from "axios";

const RegisterCus = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8070/user/register", {
        username,
        password,
        role: "CUSTOMER",
      });

      console.log("Customer registered:", response.data);
      // Redirect to login or dashboard after successful registration
    } catch (err) {
      setMessage("Registration failed, please try again.");
    }
  };

  return (
    <div>
      <h2>Customer Registration</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {message && <p>{message}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterCus;
