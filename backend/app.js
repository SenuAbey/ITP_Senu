const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");

// Routers
const vehicleRouter = require("./Route/VehicleRoute.js");
const ticketRoutes = require('./Route/ticketRoutes.js');
const bookingRoutes = require("./Route/bookingRoutes");

const staffRouter = require("./Route/staffs.js");
const userRouter = require("./Route/users.js");
const bookingRouter = require("./Route/bokings.js");

dotenv.config();  // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000;  // Keep 5000 as in your original app.js

// Middleware
app.use(cors());

app.use(cors({
  origin: 'http://localhost:3000' // or whatever your frontend URL is
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Vehicle routes
app.use("/Vehicles", vehicleRouter);

// Staff routes
app.use("/staff", staffRouter);

// User routes
app.use("/user", userRouter);
app.use("/driver-dashboard", userRouter); // driver-dashboard routes use userRouter

// Booking routes
app.use("/bokings", bookingRouter);

// Ticket routes
app.use("/api/tickets", ticketRoutes);

// Booking routes from original app.js
app.use("/api", bookingRoutes);

// Define the upload folder and configure multer
const upload = multer({ dest: 'uploads/' });

// Serve the static files (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to handle vehicle image upload
app.post('/uploadVehicleImage', upload.single('vehicleImage'), (req, res) => {
  if (req.file) {
    const vehicleImagePath = req.file.filename;
    res.json({ vehicleImage: vehicleImagePath });
  } else {
    res.status(400).json({ message: 'No image file uploaded' });
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URL || process.env.MONGODB_URL || "mongodb+srv://Wathsala:Wath123@cluster0.lb1gs.mongodb.net/staff_db?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Additional connection success message
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongodb Connection success!");
});

// Test route to check server
app.get("/", (req, res) => {
  res.send("Server is working");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.listen(8070, () => {
  console.log("Backend server running on port 8070");
});
