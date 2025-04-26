const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const multer = require("multer");  // Add multer for file handling
const path = require("path");  // Add path for managing file paths
const dotenv = require("dotenv");  // dotenv for environment variables

const router = require("./Route/VehicleRoute.js");
const ticketRoutes = require('./Route/ticketRoutes.js');
const bookingRoutes = require("./Route/bookingRoutes");

dotenv.config();  // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000;  // Set port from environment variable or default to 5000

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Vehicle routes
app.use("/Vehicles", router);

// Define the upload folder and configure multer
const upload = multer({ dest: 'uploads/' });

// Serve the static files (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to handle vehicle image upload
app.post('/uploadVehicleImage', upload.single('vehicleImage'), (req, res) => {
  if (req.file) {
    // Save the image file name to the database (or process it accordingly)
    const vehicleImagePath = req.file.filename;  // The saved image filename
    res.json({ vehicleImage: vehicleImagePath });
  } else {
    res.status(400).json({ message: 'No image file uploaded' });
  }
});

// MongoDB connection (using MONGO_URL from environment variable or fallback URL)
mongoose.connect(process.env.MONGO_URL || "mongodb+srv://Wathsala:Wath123@cluster0.lb1gs.mongodb.net/staff_db?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/tickets", ticketRoutes);
app.use("/api", bookingRoutes);

// Test route to check server
app.get("/", (req, res) => {
  res.send("Server is working ");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
