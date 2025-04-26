const express = require('express');
const bookingController = require('../Controlers/bookingController'); // Imports the controller that contains the logic for handling booking-related operations.

const router = express.Router(); // Creates an instance of the Express router

// Route to create a new booking
router.post('/bookings', bookingController.createBooking);

// Route to get all bookings
router.get('/bookings', bookingController.getAllBookings);

// Route to get a booking by its ID
router.get('/bookings/:id', bookingController.getBookingById);

// Route to update a booking by its ID
router.put('/bookings/:id', bookingController.updateBooking);

// Route to delete a booking by its ID
router.delete('/bookings/:id', bookingController.deleteBooking);

module.exports = router; // Exports the router so it can be used in the main Express app
