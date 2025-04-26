const Booking = require('../Model/Booking');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const {
     
      customerName,
      contactNumber,
      email,
      driverLicenseNumber,
      needsDriver,
      rentalDuration,
      vehicleType,
      totalAmount,
      tripDate,
      tripStatus
    } = req.body;

    // Validations
    if (!customerName || !contactNumber || !email || !driverLicenseNumber || !rentalDuration || !totalAmount || !vehicleType ||!tripDate) {
      return res.status(400).json({ error: 'All fields are required including tripDate.' });
    }



    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format.' });

    // Contact number validation (must be 10 digits)
    const contactRegex = /^\d{10}$/;
    if (!contactRegex.test(contactNumber)) return res.status(400).json({ error: 'Contact number must be 10 digits.' });

    // Rental duration validation
    const validRentalTypes = ['hours', 'days', 'weeks', 'months'];
    if (!rentalDuration.type || !rentalDuration.value) {
      return res.status(400).json({ error: 'Rental duration type and value are required.' });
    }

    if (!validRentalTypes.includes(rentalDuration.type)) {
      return res.status(400).json({ error: 'Invalid rental duration type.' });
    }

    if (typeof rentalDuration.value !== 'number' || rentalDuration.value <= 0) {
      return res.status(400).json({ error: 'Rental duration value must be a positive number.' });
    }

    // Total amount validation
    if (typeof totalAmount !== 'number' || totalAmount <= 0) {
      return res.status(400).json({ error: 'Total amount must be a positive number.' });
    }

    // Trip date validation (must be a future date)
    const parsedTripDate = new Date(tripDate);
    if (isNaN(parsedTripDate.getTime()) || parsedTripDate <= new Date()) {
      return res.status(400).json({ error: 'Trip date must be a valid future date.' });
    }

    // Create the booking
    const booking = new Booking({
      
      customerName,
      contactNumber,
      email,
      driverLicenseNumber,
      needsDriver: needsDriver || false,
      rentalDuration,
      vehicleType,
      totalAmount,
      tripDate: parsedTripDate,
      tripStatus: tripStatus || 'Not Started',
      assignedDriver: needsDriver ? null : undefined // No driver ID needed if driver is not required
    });

    // Save the booking to the database
    await booking.save();

    // Log if a driver is required
    if (needsDriver) {
      console.log('Alert: Driver is required for this booking.');
    }

    // Respond with the success message and the booking data
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    // Catch any unexpected errors
    res.status(500).json({ error: error.message });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a booking by its ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a booking by its ID
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }
    res.status(200).json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a booking by its ID
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
