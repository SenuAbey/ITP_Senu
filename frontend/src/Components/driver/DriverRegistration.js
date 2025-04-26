import React, { useState } from "react";
import "./DriverRegistration.css";

const DriverRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    license: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registered Driver:", formData);
  };

  return (
    <div className="registration-container">
      <h2>Driver Registration</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />
        <input type="file" name="license" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default DriverRegistration;
