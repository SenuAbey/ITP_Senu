const express = require("express");
const router = express.Router();
const Booking = require("../Model/Boking");
const Staff = require("../Model/Staff"); 

// Add Booking Route
router.post("/add", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.json({ message: "Booking added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add booking" });
  }
});

router.get("/driver-needed", async (req, res) => {
  try {
    // Find all bookings where driverNeeded is true
    const bookingsWithDriver = await Booking.find({ needsDriver: true });
    res.json(bookingsWithDriver);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.put("/assign-driver/:bookingId", async (req, res) => {
  try {
    const { staffId } = req.body;
    const { bookingId } = req.params;

    console.log("Assigning Driver:", { bookingId, staffId });

    if (!staffId) {
      return res.status(400).json({ error: "Driver ID is required" });
    }

    // Check if the booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    console.log("Booking found:", booking);

    // Check if the driver exists
    const driver = await Staff.findById(staffId);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    console.log("Driver found:", driver);

    // Check driver availability
    if (driver.availability !== "Available") {
      return res.status(400).json({ error: "Selected driver is not available" });
    }

    // Assign driver to booking
    booking.driverStatus = "Assigned";
    booking.assignedDriver = staffId;
    booking.notified = false;
    await booking.save();

    // Update driver availability
    driver.availability = "Assigned";

    // Add notification directly into staff's document
    const notificationMsg = `You have been assigned to a new trip (Booking ID: ${bookingId}) on ${new Date(booking.tripDate).toLocaleDateString()}.`;
    driver.notifications.push({
      message: notificationMsg,
      isRead: false,
      createdAt: new Date()
    });

    await driver.save();

    console.log("Driver assigned & notified:", driver.username);
    res.status(200).json({
      message: "Driver assigned and notified successfully",
      booking
    });

  } catch (error) {
    console.error("Error assigning driver:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
});


// GET unread notifications count for a driver
router.get("/notifications/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const staff = await Staff.findOne({ username });

    if (!staff) {
      return res.status(404).json({ error: "Driver not found" });
    }

    const unreadCount = staff.notifications.filter(notif => !notif.isRead).length;

    res.json({ unreadCount, notifications: staff.notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Get bookings assigned to a specific driver
// GET /bookings/driver-bookings/:username
router.get("/driver-bookings/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const driver = await Staff.findOne({ username });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const assignedBookings = await Booking.find({ assignedDriver: driver._id }).populate("assignedDriver");

    res.status(200).json(assignedBookings);
  } catch (error) {
    console.error("Error in driver-bookings route:", error);
    res.status(500).json({ error: "Failed to fetch assigned bookings", details: error.message });
  }
});


// Update trip status (and optionally staff availability)
// routes/booking.js or similar

router.put('/update-trip-status/:bookingId', async (req, res) => {
  const { bookingId } = req.params;
  const { tripStatus } = req.body;

  if (!['Started', 'Completed'].includes(tripStatus)) {
    return res.status(400).json({ message: 'Invalid tripStatus' });
  }

  try {
    // Fetch the current booking
    const currentBooking = await Booking.findById(bookingId);
    if (!currentBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Prevent "Completed" if the trip hasn't been "Started" yet
    if (tripStatus === 'Completed' && currentBooking.tripStatus !== 'Started') {
      return res.status(400).json({
        message: 'Trip must be started before it can be marked as completed.',
      });
    }

    // Proceed with status update
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { tripStatus },
      { new: true }
    );

    // Update driver's status if assigned
    if (updatedBooking.assignedDriver) {
      const availability = tripStatus === 'Started' ? 'Assigned' : 'Available';

      await Staff.findByIdAndUpdate(updatedBooking.assignedDriver, {
        availability,
        currentTripStatus: tripStatus,
      });
    }

    return res.json({
      message: `Trip status updated to '${tripStatus}'`,
      booking: updatedBooking,
    });

  } catch (err) {
    console.error('Error in update-trip-status:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


// Get all completed bookings for a specific driver
// Backend - routes/bookings.js
// GET completed trips for a specific driver
router.get("/completed/:username", async (req, res) => {
  const { username } = req.params;

  try {
    console.log(`Fetching completed bookings for driver: ${username}`);

    // Find the staff by username
    const staffMember = await Staff.findOne({ username });
    if (!staffMember) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Now use staffMember._id to query bookings
    const completedBookings = await Booking.find({
      assignedDriver: staffMember._id,
      tripStatus: "Completed",
    });

    console.log("Found completed bookings:", completedBookings.length);
    res.status(200).json(completedBookings);
  } catch (error) {
    console.error("Error fetching completed bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Count total trips for a specific driver
router.get("/total-trips/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const driver = await Staff.findOne({ username });
    if (!driver) return res.status(404).json({ error: "Driver not found" });

    const totalTrips = await Booking.countDocuments({ assignedDriver: driver._id });
    res.json({ totalTrips });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Count completed trips for a specific driver
router.get("/completed-trips/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const driver = await Staff.findOne({ username });
    if (!driver) return res.status(404).json({ error: "Driver not found" });

    const completedTrips = await Booking.countDocuments({
      assignedDriver: driver._id,
      tripStatus: "Completed"
    });

    res.json({ completedTrips });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Count pending trips for a specific driver
router.get("/pending-trips/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const driver = await Staff.findOne({ username });
    if (!driver) return res.status(404).json({ error: "Driver not found" });

    const pendingTrips = await Booking.countDocuments({
      assignedDriver: driver._id,
      tripStatus: "Not Started"
    });

    res.json({ pendingTrips });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Count active trips
router.get("/active-trips", async (req, res) => {
  try {
    // Find all bookings where a driver is assigned and the tripStatus is not "Completed"
    const activeTripsCount = await Booking.countDocuments({
      needsDriver: "true",
      tripStatus: "Started",
    });

    res.json({ activeTripsCount });
  } catch (error) {
    console.error("Error fetching active trips:", error);
    res.status(500).json({ error: "Failed to fetch active trips" });
  }
});

// Count completed trips
router.get("/completed-trips", async (req, res) => {
  try {
    // Find all bookings where a driver is assigned and the tripStatus is not "Completed"
    const completedTripsCount = await Booking.countDocuments({
      needsDriver: "true",
      tripStatus: "Completed",
    });

    res.json({ completedTripsCount });
  } catch (error) {
    console.error("Error fetching active trips:", error);
    res.status(500).json({ error: "Failed to fetch active trips" });
  }
});

// Count completed trips
router.get("/total-trips", async (req, res) => {
  try {
    // Find all bookings where a driver is assigned and the tripStatus is not "Completed"
    const totalTripsCount = await Booking.countDocuments({
      needsDriver: "true",
    });

    res.json({ totalTripsCount });
  } catch (error) {
    console.error("Error fetching active trips:", error);
    res.status(500).json({ error: "Failed to fetch active trips" });
  }
});




module.exports = router;
