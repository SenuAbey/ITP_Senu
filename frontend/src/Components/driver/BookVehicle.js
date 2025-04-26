/*import React, { useState } from "react";
import axios from "axios";

const BookingVehicle = () => {
  const [booking, setBooking] = useState({
    customerName: "",
    contactNumber: "",
    email: "",
    driverLicenseNumber: "",
    needsDriver: false,
    rentalDuration: {
      type: "days", // default
      value: 1,
    },
    totalAmount: 0,
    tripDate: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "needsDriver") {
      setBooking({ ...booking, needsDriver: checked });
    } else if (name === "rentalType") {
      setBooking({
        ...booking,
        rentalDuration: { ...booking.rentalDuration, type: value },
      });
    } else if (name === "rentalValue") {
      setBooking({
        ...booking,
        rentalDuration: { ...booking.rentalDuration, value: Number(value) },
      });
    } else if (name === "totalAmount") {
      setBooking({ ...booking, totalAmount: Number(value) });
    } else {
      setBooking({ ...booking, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8070/bookings/add", booking);
      alert(res.data.message || "Booking successful!");
    } catch (error) {
      alert("Error submitting booking");
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Book a Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <label>Customer Name:</label>
        <input
          type="text"
          name="customerName"
          value={booking.customerName}
          onChange={handleChange}
          required
        />

        <label>Contact Number:</label>
        <input
          type="text"
          name="contactNumber"
          value={booking.contactNumber}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={booking.email}
          onChange={handleChange}
          required
        />

        <label>Driver License Number:</label>
        <input
          type="text"
          name="driverLicenseNumber"
          value={booking.driverLicenseNumber}
          onChange={handleChange}
          required
        />

        <label>Need a Driver?</label>
        <input
          type="checkbox"
          name="needsDriver"
          checked={booking.needsDriver}
          onChange={handleChange}
        />

        <label>Rental Duration Type:</label>
        <select
          name="rentalType"
          value={booking.rentalDuration.type}
          onChange={handleChange}
          required
        >
          <option value="hours">Hours</option>
          <option value="days">Days</option>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
        </select>

        <label>Rental Duration Value:</label>
        <input
          type="number"
          name="rentalValue"
          value={booking.rentalDuration.value}
          onChange={handleChange}
          required
          min={1}
        />

        <label>Total Amount (LKR):</label>
        <input
          type="number"
          name="totalAmount"
          value={booking.totalAmount}
          onChange={handleChange}
          required
          min={0}
        />

        <label>Trip Date:</label>
        <input
          type="date"
          name="tripDate"
          value={booking.tripDate}
          onChange={handleChange}
          required
        />

        <button type="submit">Book Vehicle</button>
      </form>
    </div>
  );
};

export default BookingVehicle;*/

import React, { useState } from "react";
import axios from "axios";

const BookingVehicle = () => {
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
  });

  const [errors, setErrors] = useState({});
  const [chosenVehicle, setChosenVehicle] = useState({
    name: "Toyota Corolla",
    image:
      "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    price: 2500,
  });

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
        child === "value" ? Math.max(1, Number(value)) : value;

      const updatedFormData = {
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === "checkbox" ? checked : updatedValue,
        },
      };

      setFormData(updatedFormData);

      if (parent === "rentalDuration") {
        const totalAmount = calculateTotalAmount(
          updatedFormData.rentalDuration.type,
          updatedFormData.rentalDuration.value,
          formData.needsDriver
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
        if (checked) {
          alert(
            "Note: Choosing a driver will increase the total amount by Rs.2500 per unit duration."
          );
        }

        const totalAmount = calculateTotalAmount(
          formData.rentalDuration.type,
          formData.rentalDuration.value,
          checked
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

    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://localhost:8070/bokings/add",
          formData
        );

        console.log("Booking created successfully:", response.data);
        alert("Booking confirmed successfully!");

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
        });
      } catch (error) {
        console.error(
          "Error creating booking:",
          error.response?.data || error.message
        );
        alert("Failed to create booking.");
      }
    } else {
      console.log("Form has errors.");
    }
  };

  return (
    <div className="container">
      <div className="right-column">
        <h2 className="form-title">Customer Booking Form</h2>
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
              value={formData.email}
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
              value={formData.driverLicenseNumber}
              onChange={handleChange}
              className="form-input"
            />
            {errors.driverLicenseNumber && (
              <span className="error-message">
                {errors.driverLicenseNumber}
              </span>
            )}
          </div>

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
            {errors.rentalDuration && (
              <span className="error-message">{errors.rentalDuration}</span>
            )}
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
            {errors.totalAmount && (
              <span className="error-message">{errors.totalAmount}</span>
            )}
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
            {errors.tripDate && (
              <span className="error-message">{errors.tripDate}</span>
            )}
          </div>

          {/* TERMS AND CONDITIONS LIST */}
          <div className="form-group">
            <label className="form-label">Terms and Conditions:</label>
            <ul className="terms-list">
              <li>Customer must present a valid driver’s license at pickup.</li>
              <li>Vehicles must be returned with the same fuel level as pickup.</li>
              <li>Any damage to the vehicle must be reported immediately.</li>
              <li>Late returns may incur additional charges.</li>
              <li>Drivers must be at least 21 years old.</li>
              <li>Bookings are non-refundable within 24 hours of the trip date.</li>
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
            {errors.termsAccepted && (
              <span className="error-message">{errors.termsAccepted}</span>
            )}
          </div>

          <button type="submit" className="submit-button">
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingVehicle;
