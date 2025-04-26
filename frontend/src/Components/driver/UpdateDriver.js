import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UpdateDriver.css";

const UpdateDriver = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    NIC: "",
    dob: "",
    gender: "",
    contactNumber: "",
    email: "",
    yearsOfExperience: ""
  });
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await axios.get(`http://localhost:8070/user/driver-dashboard/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data;
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          NIC: data.NIC || "",
          dob: data.dob || "",
          gender: data.gender || "",
          contactNumber: data.contactNumber || "",
          email: data.email || "",
          yearsOfExperience: data.yearsOfExperience || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching driver details", err);
      }
    };
    fetchDriver();
  }, [username, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8070/user/update-driver/${username}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Driver details updated successfully!");
      navigate(`/driver-dashboard/${username}`);
    } catch (error) {
      console.error("Error updating driver:", error);
      alert("Failed to update driver details.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="update-driver-form">
      <h2>Update Driver Details</h2>
      <form onSubmit={handleSubmit}>
        <label>First Name:
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </label>

        <label>Last Name:
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </label>

        <label>NIC:
          <input type="text" name="NIC" value={formData.NIC} onChange={handleChange} required />
        </label>

        <label>Date of Birth:
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
        </label>

        <label>Gender:
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>Contact Number:
          <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
        </label>

        <label>Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>

        <label>Years of Experience:
          <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} required />
        </label>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default UpdateDriver;
