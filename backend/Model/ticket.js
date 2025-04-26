
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  username: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  bookingId: { type: String, required: false }, 
  status: { type: String, default: 'Under Review' },
  reply: { type: String, default: "" },
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
