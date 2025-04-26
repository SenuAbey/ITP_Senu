const express = require('express');
const router = express.Router();
const ticketController = require('../Controlers/ticketController');


router.get('/generate-pdf', ticketController.generatePDFReport);

router.get('/', ticketController.getAllTickets);
router.get('/:username', ticketController.getTickets);
router.post('/', ticketController.createTicket);
router.put('/:id/status', ticketController.updateStatus);
router.delete('/:id', ticketController.deleteTicket);
router.put('/:id/reply', ticketController.updateReply);




module.exports = router;
