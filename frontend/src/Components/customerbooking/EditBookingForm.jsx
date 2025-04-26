import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
//import "../App.css";
import "../../App.css";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const EditBookingForm = ({ bookingId, onCancel }) => {
  const { id } = useParams(); // Get booking ID from URL
  const [formData, setFormData] = useState({
    customerName: "",
    contactNumber: "",
    email: "",
    driverLicenseNumber: "",
    needsDriver: false,
    rentalDuration: {
      type: "hours",
      value: 1,
    },
    totalAmount: 0,
  });

  const navigate = useNavigate(); // Initialize navigate
  const [errors, setErrors] = useState({});
  const [chosenVehicle, setChosenVehicle] = useState({
    name: "Toyota Corolla",
    image:
      "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    price: 50,
  });

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/bookings/${id}`)
        .then((response) => setFormData(response.data))
        .catch((error) => console.error("Error fetching booking:", error));
    }
  }, [id]);

  const calculateTotalAmount = (durationType, durationValue, needsDriver) => {
    let basePrice = chosenVehicle.price;

    switch (durationType) {
      case "hours":
        basePrice *= durationValue;
        break;
      case "days":
        basePrice *= durationValue * 24;
        break;
      case "weeks":
        basePrice *= durationValue * 24 * 7;
        break;
      case "months":
        basePrice *= durationValue * 24 * 30;
        break;
      default:
        break;
    }

    const driverCost = needsDriver ? 20 * durationValue : 0;

    return basePrice + driverCost;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      const updatedValue =
        child === "value" ? Math.max(1, Number(value)) : value; // Ensure positive number

      const updatedFormData = {
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === "checkbox" ? checked : updatedValue,
        },
      };

      setFormData(updatedFormData);

      if (parent === "rentalDuration" || name === "needsDriver") {
        const totalAmount = calculateTotalAmount(
          updatedFormData.rentalDuration.type,
          updatedFormData.rentalDuration.value,
          updatedFormData.needsDriver
        );
        setFormData((prevData) => ({
          ...prevData,
          totalAmount,
        }));
      }
    } else {
      const updatedFormData = {
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      };

      setFormData(updatedFormData);

      if (name === "needsDriver") {
        const totalAmount = calculateTotalAmount(
          updatedFormData.rentalDuration.type,
          updatedFormData.rentalDuration.value,
          updatedFormData.needsDriver
        );
        setFormData((prevData) => ({
          ...prevData,
          totalAmount,
        }));
      }
    }

    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName)
      newErrors.customerName = "Customer Name is required.";
    if (!formData.contactNumber)
      newErrors.contactNumber = "Contact Number is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.driverLicenseNumber)
      newErrors.driverLicenseNumber = "Driver License Number is required.";
    if (!formData.rentalDuration.value || formData.rentalDuration.value <= 0)
      newErrors.rentalDuration = "Rental Duration must be a positive number.";
    if (!formData.totalAmount || formData.totalAmount <= 0)
      newErrors.totalAmount = "Total Amount must be a positive number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingID = bookingId || id; // Fallback to URL param
    if (!bookingID) {
      alert("Invalid booking ID.");
      return;
    }

    if (validateForm()) {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/bookings/${bookingID}`,
          formData
        );

        console.log("Booking updated successfully:", response.data);
        alert("Booking updated successfully!");
      } catch (error) {
        console.error("Error updating booking:", error);
        alert("Failed to update booking. Please try again.");
      }
    }
  };

  const handleCAncel = (id) => {
    navigate("/bookings");
  };

  return (
    <div className="container">
      <div className="left-column">
        <h2 className="halo">Chosen Vehicle</h2>
        <img
          src={chosenVehicle.image}
          alt={chosenVehicle.name}
          className="vehicle-image"
        />
        <div className="flex">
          <h3 className="sub_title">{chosenVehicle.name}</h3>
          <p className="sub_para">
            <span className="short_span">Price:</span>Rs.{chosenVehicle.price} per
            hour
          </p>
        </div>
      </div>

      <div className="right-column">
        <h2 className="form-title">Edit Booking Form</h2>
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label className="form-label">Customer Name:</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="form-input"
            />
            {errors.customerName && (
              <span className="error-message">{errors.customerName}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Contact Number:</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="form-input"
            />
            {errors.contactNumber && (
              <span className="error-message">{errors.contactNumber}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Email:</label>
            <input
              type="email"
              name="email"
              value={formData?.email}
              onChange={handleChange}
              className="form-input"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Driver License Number:</label>
            <input
              type="text"
              name="driverLicenseNumber"
              value={formData?.driverLicenseNumber}
              onChange={handleChange}
              className="form-input"
            />
            {errors.driverLicenseNumber && (
              <span className="error-message">
                {errors.driverLicenseNumber}
              </span>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label className="form-label">Needs Driver:</label>
            <input
              type="checkbox"
              name="needsDriver"
              checked={formData.needsDriver}
              onChange={handleChange}
              className="form-checkbox"
            />
            <span className="hint-text">
              (* Choosing a driver will increase the total amount by Rs. 2500 per
              unit duration)
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Rental Duration:</label>
            <div className="duration-group">
              <select
                name="rentalDuration.type"
                value={formData?.rentalDuration.type}
                onChange={handleChange}
                className="form-select"
              >
                <option value="hours">Hours</option>
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
              <input
                type="number"
                name="rentalDuration.value"
                value={formData.rentalDuration.value}
                onChange={handleChange}
                min="1"
                className="form-input duration-input"
              />
            </div>
            {errors.rentalDuration && (
              <span className="error-message">{errors.rentalDuration}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Total Amount:</label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              min="0"
              readOnly
              className="form-input total-amount"
            />
            {errors.totalAmount && (
              <span className="error-message">{errors.totalAmount}</span>
            )}
          </div>
          <div className="flexx">
            <button type="submit" className="submit-button">
              Submit Changes
            </button>

            <button
              type="button"
              onClick={handleCAncel}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingForm;
