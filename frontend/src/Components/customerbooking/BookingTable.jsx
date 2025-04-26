 import React, { useState, useEffect, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./BookingTable.css";

const BookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Error fetching bookings:", err));
  }, []);

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) =>
        [booking.customerName, booking.email, booking.contactNumber]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    [bookings, searchTerm]
  );

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleString();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Booking Details", 14, 15);

    const headers = [
      "Customer Name",
      "Contact",
      "Email",
      "Driver License",
      "Needs Driver",
      "Rental Duration",
      "Total Amount",
      "Trip Date"
    ];

    const data = filteredBookings.map((booking) => [
      booking.customerName || "N/A",
      booking.contactNumber || "N/A",
      booking.email || "N/A",
      booking.driverLicenseNumber || "N/A",
      booking.needsDriver ? "Yes" : "No",
      booking.rentalDuration
        ? `${booking.rentalDuration.value} ${booking.rentalDuration.type}`
        : "N/A",
      `Rs.${booking.totalAmount || "0.00"}`,
      formatDate(booking.tripDate)
    ]);

    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 25,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }
    });

    doc.save("booking_details.pdf");
  };

  const cancelBooking = (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      fetch(`http://localhost:5000/api/bookings/${id}`, { method: "DELETE" })
        .then(() => setBookings(bookings.filter((booking) => booking._id !== id)))
        .catch((err) => console.error("Error cancelling booking:", err));
    }
  };

  return (
    <div className="booking-container">
      <h2 className="booking-title">Booking Details</h2>
      <div className="flexed">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, email, or contact"
            className="booking-searchs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={downloadPDF} className="download-pdf-button">
          Download PDF
        </button>
      </div>
      <table className="booking-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Contact Number</th>
            <th>Email</th>
            <th>Driver License</th>
            <th>Needs Driver</th>
            <th>Rental Duration</th>
            <th>Total Amount</th>
            <th>Trip Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.customerName || "N/A"}</td>
                <td>{booking.contactNumber || "N/A"}</td>
                <td>{booking.email || "N/A"}</td>
                <td>{booking.driverLicenseNumber || "N/A"}</td>
                <td>{booking.needsDriver ? "Yes" : "No"}</td>
                <td>
                  {booking.rentalDuration
                    ? `${booking.rentalDuration.value} ${booking.rentalDuration.type}`
                    : "N/A"}
                </td>
                <td>Rs.{booking.totalAmount || "0.00"}</td>
                <td>{formatDate(booking.tripDate)}</td>
                <td>
                  <button
                    className="cancel-btn"
                    onClick={() => cancelBooking(booking._id)}
                  >
                    Cancel Booking
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="no-bookings">
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
