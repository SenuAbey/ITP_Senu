import React, { useState } from 'react';
import './ticket.css';

function TicketForm({ addTicket }) {
  const [ticket, setTicket] = useState({
    category: '',
    bookingId: '',
    title: '',
    description: '',
  });

  const handleChange = (e) => {
    setTicket({
      ...ticket,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setTicket({
      ...ticket,
      category: selectedCategory,
      bookingId: selectedCategory === 'Booking' ? '' : ticket.bookingId,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add ticket to state or notify parent component
    addTicket(ticket);

    // Send ticket data to the backend using fetch
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message); // Notify the user of success
        setTicket({ category: '', bookingId: '', title: '', description: '' }); // Reset form
      } else {
        alert(result.message); // Notify the user of an error
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ticket-form">
      <h3>Submit a Complaint</h3>
      <div>
        <label>Category:</label>
        <select name="category" value={ticket.category} onChange={handleCategoryChange} required>
          <option value="">Select Category</option>
          <option value="Vehicle">Vehicle</option>
          <option value="Driver">Driver</option>
          <option value="Booking">Booking</option>
        </select>
      </div>

      {ticket.category === 'Booking' && (
        <div>
          <label>Booking ID:</label>
          <input
            type="text"
            name="bookingId"
            placeholder="Booking ID"
            value={ticket.bookingId}
            onChange={handleChange}
            required
          />
        </div>
      )}

      <div>
        <label>Title:</label>
        <input type="text" placeholder="Title" name="title" value={ticket.title} onChange={handleChange} required />
      </div>

      <div>
        <label>Description:</label>
        <textarea name="description" placeholder="Description" value={ticket.description} onChange={handleChange} required />
      </div>

      <button type="submit">Submit Complaint</button>
    </form>
  );
}

export default TicketForm;
