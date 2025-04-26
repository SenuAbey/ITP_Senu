const Ticket = require('../Model/ticket');
const PDFDocument = require('pdfkit');

exports.createTicket = async (req, res) => {
  try {
    const { username, type, description, category, bookingId } = req.body;

    const ticket = new Ticket({
      username,  
      type,
      description,
      category,
      bookingId,
      status: 'Under Review',
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ message: 'Error creating ticket', error: err });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ username: req.params.username });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching tickets', error: err });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching tickets', error: err });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error updating status' });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting ticket' });
  }
};

exports.updateReply = async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { reply }, 
      { new: true } 
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update reply', error: error.message });
  }
};

exports.generatePDFReport = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });

    if (!tickets.length) {
      return res.status(404).send('No tickets found');
    }

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Ticket_Report.pdf"');

    doc.pipe(res);

    doc.fontSize(20).text('Ticket Report', { align: 'center' });
    doc.moveDown(1.5);

    // Column headers
    const headers = ['ID', 'Username', 'Type', 'Category', 'Booking ID', 'Status', 'Reply', 'Date'];
    const columnWidths = [50, 80, 60, 70, 60, 60, 100, 60];
    const columnX = [50];

    // Calculate X positions for columns
    for (let i = 1; i < columnWidths.length; i++) {
      columnX[i] = columnX[i - 1] + columnWidths[i - 1];
    }

    // Draw header row
    let y = doc.y;
    doc.font('Helvetica-Bold').fontSize(10);
    headers.forEach((header, i) => {
      doc.rect(columnX[i], y, columnWidths[i], 25).stroke(); // Increased height for header cells
      doc.text(header, columnX[i] + 2, y + 5, {
        width: columnWidths[i] - 4,
        align: 'left'
      });
    });

    y += 25;

    // Draw each ticket row
    doc.font('Helvetica').fontSize(9);

    for (const ticket of tickets) {
      const replyText = ticket.reply || '-';
      const replyHeight = doc.heightOfString(replyText, { width: columnWidths[6] - 4 });
      const rowHeight = Math.max(replyHeight, 30); // Increased minimum row height to 30px

      const rowData = [
        ticket._id.toString().slice(-5),
        ticket.username,
        ticket.type,
        ticket.category,
        ticket.bookingId || '-',
        ticket.status,
        replyText,
        ticket.createdAt.toISOString().split('T')[0],
      ];

      rowData.forEach((value, i) => {
        doc.rect(columnX[i], y, columnWidths[i], rowHeight).stroke(); // Draw cell box with increased row height
        doc.text(value, columnX[i] + 2, y + 5, {
          width: columnWidths[i] - 4,
          align: 'left'
        });
      });

      y += rowHeight;

      // Add page break if needed
      if (y > doc.page.height - 50) {
        doc.addPage();
        y = 50;
      }
    }

    doc.end();
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).send('Failed to generate PDF.');
  }
};

