const express = require("express");
const jwt = require("jsonwebtoken");  //for authentication
const bcrypt = require("bcryptjs");
const User = require("../Model/User");
const Staff = require("../Model/Staff");

const router = express.Router();
const SECRET_KEY = "your_secret_key"; // Use environment variables in production



// Middleware to protect driver routes
//Extracts JWT token from Authorization header
const authenticateDriver = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded; // Store user info in req object
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid token" });
    }
  };

// 🔸 LOGIN Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, {
      expiresIn: "2h"
    });

    let redirectUrl = "";
    if (user.role === "ADMIN") {
      redirectUrl = "/admin-dashboard";
    } else if (user.role === "DRIVER") {
      redirectUrl = `/driver-dashboard/${user.username}`;
    } else if (user.role === "CUSTOMER") {
      redirectUrl = `/customer-dashboard/${user.username}`;
    }

    res.json({
      message: "Login successful",
      token,
      username: user.username,
      role: user.role,
      redirect: redirectUrl
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔸 REGISTER Route
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = new User({ username, password, role });
    await newUser.save();

    res.status(200).json({
      message: "User registered successfully",
      user: { username: newUser.username, role: newUser.role }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Error registering user" });
  }
});


// Route for fetching driver details based on username
router.get("/driver-dashboard/:username", async (req, res) => {
    const { username } = req.params;
    console.log(`Requesting driver dashboard for driver ${username}`);
    try {
      const driver = await Staff.findOne({ username });
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }
  
      res.json(driver); // Respond with driver data
    } catch (error) {
        console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });


  // Update driver details
router.put("/update-driver/:username", async (req, res) => {
  const { username } = req.params;
  const { contactNumber, email, yearsOfExperience } = req.body;

  try {
    const updatedDriver = await Staff.findOneAndUpdate(
      { username },
      { contactNumber, email, yearsOfExperience },
      { new: true } // return updated doc
    );

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json(updatedDriver);
  } catch (error) {
    console.error("Error updating driver:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Route for fetching customer details based on username
router.get("/customer-dashboard/:username", async (req, res) => {
  const { username } = req.params;
  console.log(`Requesting customer dashboard for customer ${username}`);
  try {
    const customer = await User.findOne({ username }); // Replace with your customer data model if necessary
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer); // Respond with customer data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
