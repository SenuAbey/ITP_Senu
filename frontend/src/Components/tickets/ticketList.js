import React, { useState } from 'react';
import './ticket.css';

function TicketList({ tickets, updateTicket, deleteTicket, replyToTicket }) {
  const [reply, setReply] = useState({});

  return (
    <div>
      <div className="ticket-container">
        {tickets.map((ticket) => (
          <div key={ticket._id} className={`ticket-card ${ticket.priority}`}>
            <h3>{ticket.title}</h3>
            <p>{ticket.description}</p>
            <ul>
              <li><strong>Status:</strong> {ticket.status || 'Pending'}</li>
              <li><strong>Priority:</strong> {ticket.priority || 'Low'}</li>
              {ticket.response && <li><strong>Admin Response:</strong> {ticket.response}</li>}
            </ul>
            {ticket.category === 'Booking' && (
              <p><strong>Booking ID:</strong> {ticket.bookingId}</p>
            )}

            {/* Admin Actions */}
            {updateTicket && deleteTicket && replyToTicket && (
              <div>
                <button onClick={() => updateTicket(ticket._id)}>Update Priority</button>
                <button onClick={() => deleteTicket(ticket._id)}>Delete</button>
                <input 
                  type="text" 
                  placeholder="Respond to the customer" 
                  value={reply[ticket._id] || ''} 
                  onChange={(e) => setReply({ ...reply, [ticket._id]: e.target.value })}
                />
                <button onClick={() => replyToTicket(ticket._id, reply[ticket._id])}>Reply</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TicketList;
