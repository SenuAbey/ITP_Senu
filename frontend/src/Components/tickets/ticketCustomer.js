import React, { useEffect, useState } from 'react';
import './ticket.css';

function TicketCustomer() {
  const [ticketData, setTicketData] = useState({
    username: '',
    type: '',
    description: '',
    category: '',
    bookingId: '',
  });

  const [tickets, setTickets] = useState([]);
  const usernameh = "manu";
  
  const typeOptions = {
    vehicle: ["Engine Issue", "Flat Tire", "Fuel Problem", "AC Not Working", "Broken Mirror", "Other"],
    driver: ["Rude Behavior", "Late Arrival", "Unsafe Driving", "Did Not Show Up", "Overcharged", "Other"],
    booking: ["Payment Issue", "Wrong Schedule", "Overbooked", "Booking Not Confirmed", "Double Booking", "Other"],
    other: ["Other"],
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tickets');
        const data = await response.json();

        // Filter tickets for the logged-in user
        const userTickets = data.filter(ticket => ticket.username === usernameh);
        setTickets(userTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    if (usernameh) {
      fetchTickets();
    }
  }, [usernameh]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Reset ticket type when category is changed
    if (name === 'category') {
      setTicketData(prev => ({
        ...prev,
        category: value,
        type: value === 'other' ? 'Other' : '',
      }));
    } else {
      setTicketData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });

      const responseText = await response.text();  // Get raw response text
      console.log('Raw Response:', responseText);

      if (response.ok) {
        try {
          const parsedResponse = JSON.parse(responseText); // Try to parse it
          console.log('Parsed Response:', parsedResponse);
          alert('Ticket submitted successfully');
          setTicketData({
            username: '',
            type: '',
            description: '',
            category: '',
            bookingId: '',
          });
        } catch (error) {
          console.error('Error parsing JSON:', error);
          alert('Error: Invalid JSON response from server');
        }
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert('Failed to submit ticket');
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Failed to submit ticket');
    }
  };

  return (
    <div className = "cusTicket">
      <h2>Submit a Ticket</h2>
      <form className = "ticketForm" onSubmit={handleSubmit}>
        <label>Category</label>
        <select name="category" value={ticketData.category} onChange={handleInputChange} required>
          <option value="">Select Category</option>
          <option value="vehicle">Vehicle</option>
          <option value="driver">Driver</option>
          <option value="booking">Booking</option>
          <option value="other">Other</option>
        </select>

        {ticketData.category === 'booking' && (
          <>
            <label>Booking ID</label>
            <input
              type="text"
              name="bookingId"
              value={ticketData.bookingId}
              placeholder="Booking ID"
              onChange={handleInputChange}
            />
          </>
        )}

        <label>Username</label>
        <input
          type="text"
          name="username"
          value={ticketData.username}
          placeholder="Username"
          onChange={handleInputChange}
          required
        />

        {ticketData.category && (
          <>
            <label>Ticket Type</label>
            <select
              name="type"
              value={ticketData.type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Type</option>
              {typeOptions[ticketData.category]?.map((typeOption, idx) => (
                <option key={idx} value={typeOption}>{typeOption}</option>
              ))}
            </select>
          </>
        )}

        <label>Description</label>
        <textarea
          name="description"
          value={ticketData.description}
          placeholder="Description"
          onChange={handleInputChange}
          required
        />

        <button className= "download-pdf-button" type="submit">Submit</button>
      </form>

      <hr height="3px" />
      <div style={{
        maxWidth: '600px',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px'
      }}>
        <h2>My Tickets</h2>
        {tickets.length > 0 ? (
  <div className="ticket-list">
    {tickets.map(ticket => (
      <div className="ticket-card" key={ticket._id}>
        <p><strong>Category:</strong> {ticket.category}</p>
        <p><strong>Type:</strong> {ticket.type}</p>
        {ticket.bookingId && (
          <p><strong>Booking ID:</strong> {ticket.bookingId}</p>
        )}
        <p><strong>Description:</strong> {ticket.description}</p>
        <p><strong>Status:</strong> {ticket.status}</p>
        <p><strong>Admin Reply:</strong> {ticket.reply || "No reply yet"}</p>
      </div>
    ))}
  </div>
) : (
  <p>No tickets found.</p>
)}

      </div>
    </div>
  );
}

export default TicketCustomer;
