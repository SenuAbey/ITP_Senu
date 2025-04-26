import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ticket.css';

const TicketAdmin = () => {
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState({});
  const [reply, setReply] = useState({});
  
  // Filter and Sort state
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('date'); // Sorting by date by default

  const prioritizeTicket = (description) => {
    const highPriorityKeywords = ['urgent', 'critical', 'immediate', 'emergency'];
    const mediumPriorityKeywords = ['important', 'delay', 'pending'];

    if (highPriorityKeywords.some((keyword) => description.toLowerCase().includes(keyword))) {
      return 'High';
    } else if (mediumPriorityKeywords.some((keyword) => description.toLowerCase().includes(keyword))) {
      return 'Medium';
    } else {
      return 'Low';
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const result = await axios.get('http://localhost:5000/api/tickets');
        const updatedTickets = result.data.map((ticket) => ({
          ...ticket,
          priority: prioritizeTicket(ticket.description),
        }));
        setTickets(updatedTickets);
      } catch (error) {
        alert('Failed to fetch tickets');
      }
    };
    fetchTickets();
  }, []);

  // Filter tickets based on selected filters
  const filteredTickets = tickets.filter((ticket) => {
    const isCategoryMatch = filterCategory ? ticket.category === filterCategory : true;
    const isPriorityMatch = filterPriority ? ticket.priority === filterPriority : true;
    const isStatusMatch = filterStatus ? ticket.status === filterStatus : true;
    return isCategoryMatch && isPriorityMatch && isStatusMatch;
  });

  // Sort tickets based on selected sorting option
  const sortedTickets = filteredTickets.sort((a, b) => {
    if (sortOrder === 'priority') {
      return a.priority.localeCompare(b.priority);
    } else if (sortOrder === 'date') {
      return new Date(b.createdAt) - new Date(a.createdAt); // Assuming `createdAt` exists in your ticket data
    }
    return 0;
  });

  const handleUpdate = async (ticketId) => {
    if (!status[ticketId]) {
      alert('Please select a status before updating.');
      return;
    }
    try {
      await axios.patch(`http://localhost:5000/api/tickets/${ticketId}`, { status: status[ticketId] });
      alert('Ticket status updated');
      setTickets(tickets.map((ticket) =>
        ticket._id === ticketId ? { ...ticket, status: status[ticketId] } : ticket
      ));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (ticketId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this ticket?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/tickets/${ticketId}`);
      setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
      alert('Ticket deleted');
    } catch (error) {
      alert('Failed to delete ticket');
    }
  };

  const handleReplyChange = (ticketId, value) => {
    setReply({ ...reply, [ticketId]: value });
  };

  const handleReplySubmit = async (ticketId, replyText) => {
    if (!replyText) {
      alert('Please enter a reply before submitting.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/tickets/${ticketId}/reply`, {
        reply: replyText,
      });
      setTickets(tickets.map((ticket) =>
        ticket._id === ticketId ? { ...ticket, reply: replyText } : ticket
      ));
      alert('Reply submitted');
      setReply({ ...reply, [ticketId]: '' });
    } catch (error) {
      alert('Failed to submit reply');
    }
  };

  
  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tickets/generate-pdf', {
        responseType: 'blob',  // Important for PDF download
      });

      // Create a link to download the PDF file
      const link = document.createElement('a');
      link.href = URL.createObjectURL(response.data);
      link.download = 'Ticket_Report.pdf';  // File name for download
      link.click();
    } catch (error) {
      console.error('Error downloading PDF', error);
    }
  };
  
  

  return (
    <div className="manage_tickets">
      <h2>Manage Tickets</h2>
      
      {/* Filters Section */}
      <div className="filters">
        <select onChange={(e) => setFilterCategory(e.target.value)} value={filterCategory}>
          <option value="">All Categories</option>
          <option value="vehicle">Vehicle</option>
          <option value="driver">Driver</option>
          <option value="booking">Booking</option>
        </select>

        <select onChange={(e) => setFilterPriority(e.target.value)} value={filterPriority}>
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
          <option value="">All Statuses</option>
          <option value="Under Review">Under Review</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="date">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>
      
    
      <div class="pdf-wrapper">
        <button className= "pdf" onClick={handleDownloadPDF}>Download PDF Report</button>
      </div>

      <div className="ticket-container">
        {sortedTickets.map((ticket) => (
          <div key={ticket._id} className={`ticket-card ${ticket.priority.toLowerCase()}`}>
            <p><strong>Category:</strong> {ticket.category}</p>
            <p><strong>Description:</strong> {ticket.description}</p>
            <p><strong>Status:</strong> {ticket.status}</p>
            <p><strong>Priority:</strong> {ticket.priority}</p>
            <p><strong>Reply:</strong> {ticket.reply && (
              <div className="admin-reply">
                <h4>Admin Reply:</h4>
                <p>{ticket.reply}</p>
              </div>
            )}</p>
            
            <select
              value={status[ticket._id] || ''}
              onChange={(e) => setStatus({ ...status, [ticket._id]: e.target.value })}
            >
              <option value="">Select Status</option>
              <option value="Under Review">Under Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <button className="update-btn" onClick={() => handleUpdate(ticket._id)}>Update Status</button>

            <button className="delete-btn" onClick={() => handleDelete(ticket._id)}>Delete</button>

            <textarea
              placeholder="Enter reply"
              value={reply[ticket._id] || ''}
              onChange={(e) => handleReplyChange(ticket._id, e.target.value)}
              rows="3"
              cols="50"
            ></textarea>
            <button className="reply-btn" onClick={() => handleReplySubmit(ticket._id, reply[ticket._id])}>Reply</button>
          </div>
        ))}
      </div>
      {tickets.length === 0 && <p>No tickets found</p>}
    </div>
  );
};

export default TicketAdmin;
