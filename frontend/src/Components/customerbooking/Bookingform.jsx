import React, { useState, useEffect } from "react";
import axios from "axios";

const Bookingform = () => {
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
    tripDate: "",
    termsAccepted: false,
    vehicleType: "Car",
  });

  const [errors, setErrors] = useState({});

  const vehicles = {
    Car: { vehiclePriceHour: 2000, vehiclePriceDay: 20000 },
    Van: { vehiclePriceHour: 2500, vehiclePriceDay: 25000 },
    Lorry: { vehiclePriceHour: 3500, vehiclePriceDay: 35000 },
    "Motor Bicycle": { vehiclePriceHour: 1000, vehiclePriceDay: 10000 },
    "Hyper Bicycle": { vehiclePriceHour: 3000, vehiclePriceDay: 35000 },
  };

  const calculateTotalAmount = (vehicleType, durationType, durationValue, needsDriver) => {
    const vehicle = vehicles[vehicleType];
    let basePrice = 0;

    if (durationType === "hours") {
      basePrice = vehicle.vehiclePriceHour * durationValue;
    } else if (durationType === "days") {
      basePrice = vehicle.vehiclePriceDay * durationValue;
    } else if (durationType === "weeks") {
      basePrice = vehicle.vehiclePriceDay * 7 * durationValue;
    } else if (durationType === "months") {
      basePrice = vehicle.vehiclePriceDay * 30 * durationValue;
    }

    let driverCost = 0;
    if (needsDriver) {
      if (durationType === "hours") {
        driverCost = 350 * durationValue;
      } else {
        driverCost = 5000 * durationValue;
      }
    }

    return basePrice + driverCost;
  };

  useEffect(() => {
    const totalAmount = calculateTotalAmount(
      formData.vehicleType,
      formData.rentalDuration.type,
      formData.rentalDuration.value,
      formData.needsDriver
    );
    setFormData((prev) => ({ ...prev, totalAmount }));
  }, [formData.vehicleType, formData.rentalDuration.type, formData.rentalDuration.value, formData.needsDriver]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      const updatedFormData = {
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: child === "value" ? Math.max(1, Number(value)) : value,
        },
      };
      setFormData(updatedFormData);
    } else {
      const updatedFormData = {
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      };
      setFormData(updatedFormData);

      if (name === "needsDriver" && checked) {
        alert("Note: Choosing a driver will increase the total amount (Rs.350/hr or Rs.5000/day+).");
      }
    }

    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName) newErrors.customerName = "Customer Name is required.";
    if (!formData.contactNumber) newErrors.contactNumber = "Contact Number is required.";
    else if (!/^\d{10}$/.test(formData.contactNumber))
      newErrors.contactNumber = "Contact Number must be 10 digits.";
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format.";
    if (!formData.driverLicenseNumber)
      newErrors.driverLicenseNumber = "Driver License Number is required.";
    if (!formData.rentalDuration.value || formData.rentalDuration.value <= 0)
      newErrors.rentalDuration = "Rental Duration must be a positive number.";
    if (!formData.totalAmount || formData.totalAmount <= 0)
      newErrors.totalAmount = "Total Amount must be a positive number.";
    if (!formData.tripDate)
      newErrors.tripDate = "Trip date is required.";
    else if (new Date(formData.tripDate) <= new Date())
      newErrors.tripDate = "Trip date must be in the future.";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must agree to the terms and conditions.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:5000/api/bookings", formData);
      alert("Booking confirmed successfully!");
      console.log("Booking created:", response.data);

      setFormData({
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
        tripDate: "",
        termsAccepted: false,
        vehicleType: "Car",
      });
    } catch (error) {
      console.error("Error creating booking:", error.response?.data || error.message);
      alert("Failed to create booking.");
    }
  };

  return (
    <div className="container">
      <div className="right-column">
        <h2 className="form-title">Customer Booking Form</h2>
        <form onSubmit={handleSubmit} className="booking-form">
          {[["Customer Name", "customerName"], ["Contact Number", "contactNumber"], ["Email", "email"], ["Driver License Number", "driverLicenseNumber"]].map(([label, name]) => (
            <div key={name} className="form-group">
              <label className="form-label">{label}:</label>
              <input
                type={name === "email" ? "email" : "text"}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="form-input"
              />
              {errors[name] && <span className="error-message">{errors[name]}</span>}
            </div>
          ))}

          <div className="form-group">
            <label className="form-label">Need a Driver?</label>
            <input
              type="checkbox"
              name="needsDriver"
              checked={formData.needsDriver}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Select Vehicle Type:</label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="form-input"
            >
              {Object.keys(vehicles).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Rental Duration:</label>
            <select
              name="rentalDuration.type"
              value={formData.rentalDuration.type}
              onChange={handleChange}
              className="form-input"
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
              className="form-input"
              min="1"
            />
            {errors.rentalDuration && <span className="error-message">{errors.rentalDuration}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Total Amount (Rs):</label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              readOnly
              className="form-input"
            />
            {errors.totalAmount && <span className="error-message">{errors.totalAmount}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Trip Date:</label>
            <input
              type="datetime-local"
              name="tripDate"
              value={formData.tripDate}
              onChange={handleChange}
              className="form-input"
            />
            {errors.tripDate && <span className="error-message">{errors.tripDate}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Terms and Conditions:</label>
            <ul className="terms-list">
              <li>Customer must present a valid driver’s license.</li>
              <li>Vehicles must be returned with the same condition as pickup.</li>
              <li>Any damage to the vehicle must be reported immediately.</li>
              <li>Late returns may incur additional charges.</li>
              <li>Customer/Drivers must be at least 21 years old.</li>
              <li>Bookings are non-refundable.</li>
            </ul>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
              />
              I agree to the terms and conditions.
            </label>
            {errors.termsAccepted && <span className="error-message">{errors.termsAccepted}</span>}
          </div>

          <button type="submit" className="submit-button">Book Now</button>
        </form>
      </div>
    </div>
  );
};

export default Bookingform;