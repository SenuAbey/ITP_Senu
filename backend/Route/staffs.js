const router = require("express").Router();
const Staff = require("../Model/Staff");
const multer = require("multer"); //handle image/pdf uploads
const path = require("path");    //staffs.js -- defines API endpoints for handle crud & allows backend to interact with the database

// Define storage and file handling
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads")); // Ensure "uploads/" directory exists at the project level
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|pdf/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb("Error: Only .jpg, .jpeg, .png, .pdf files are allowed.");
        }
    }
});

// API to get total count of all staff
router.get("/total-staffs", async (req, res) => {
    try {
        console.log("Fetching total staff count...");  // Log to ensure you're entering the route
        
        const totalStaffs = await Staff.countDocuments();
        console.log(`Total staff count: ${totalStaffs}`);  // Log the count
        
        res.json({ totalStaffs });  // Respond with the count only
    } catch (error) {
        console.error("Error counting total staff:", error);
        res.status(500).json({ error: error.message });
    }
});
  // API to get count of available drivers
  router.get("/available-staffs", async (req, res) => {
    try {
      const availableDrivers = await Staff.countDocuments({ availability: "Available" });
      console.log("Available drivers count:", availableDrivers);  // Check the count
      res.json({ availableDrivers });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // API to get count of assigned drivers
  router.get("/assigned-staffs", async (req, res) => {
    try {
      const assignedDrivers = await Staff.countDocuments({ availability: "Assigned" });
      res.json({ assignedDrivers });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // API to get count of onleave drivers
  router.get("/onleave-staffs", async (req, res) => {
    try {
      const onLeaveDrivers = await Staff.countDocuments({ availability: "On Leave" });
      res.json({ onLeaveDrivers });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

   // API to get available drivers
  router.get("/available-drivers", async (req, res) => {
    try {
        console.log("Fetching available drivers...");

        // Query drivers who are explicitly marked as 'Available'
        const availableDrivers = await Staff.find({ availability: "Available" }).lean();

        if (availableDrivers.length === 0) {
            console.log("No available drivers found.");
            return res.status(404).json({ message: "No available drivers found" });
        }

        console.log(`Found ${availableDrivers.length} available driver(s).`);
        return res.status(200).json(availableDrivers);

    } catch (error) {
        console.error("Error fetching available drivers:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


//Backend url-> http://localhost:8070/staff/add
router.route("/add").post(upload.single("driversLicense"), (req, res) => {
    const { staffID,username, firstName, lastName, NIC, dob, gender, contactNumber, email, yearsOfExperience } = req.body;
    const driversLicense = req.file ? req.file.path : null;

    if (!driversLicense) {
        return res.status(400).json({ message: "Driver's license is required" });
    }
    const newStaff = new Staff({

        staffID,
        username,
        firstName,
        lastName,
        NIC,
        dob,
        gender,
        contactNumber,
        email,
        yearsOfExperience,
        driversLicense: driversLicense,


    })
                    
    newStaff.save() // Save the new staff object to the database
    .then(() => {
        res.status(200).json({ message: "Staff added successfully!" });
    })
    .catch((err) => {
        console.error("Error during staff save: ", err); // Log the error for debugging
        res.status(500).json({ message: "Error adding staff", error: err.message });
    });
})

// Delete staff by ID
router.route("/delete/:staffID").delete(async (req, res) => {
    try {
        const deletedStaff = await Staff.findOneAndDelete({ staffID: req.params.staffID });
        if (!deletedStaff) {
            return res.status(404).json({ message: "Staff not found!" });
        }
        res.status(200).json({ message: "Staff deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting staff", error: err.message });
    }
});

// Update staff by ID
router.put("/update/:staffID", async (req, res) => {
    try {
        const { 
            firstName, 
            lastName, 
            contactNumber, 
            email, 
            yearsOfExperience, 
            availability,
            status 
        } = req.body;  // Destructure the fields 

        // Prepare the update object dynamically
        const updateData = {};

        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (contactNumber) updateData.contactNumber = contactNumber;
        if (email) updateData.email = email;
        if (yearsOfExperience) updateData.yearsOfExperience = yearsOfExperience;
        if (availability) updateData.availability = availability;
        if (status) updateData.status = status; // Only update if 'status' is provided

        // Find staff by staffID and update the relevant fields
        const updatedStaff = await Staff.findOneAndUpdate(
            { staffID: req.params.staffID },  // Find by staffID
            updateData,  // Update only the fields provided in the body
            { new: true }  // Return the updated document
        );

        if (!updatedStaff) {
            return res.status(404).json({ message: "Staff not found!" });
        }

        // Return the updated staff details
        res.status(200).json({
            message: "Driver details updated successfully!",
            staff: updatedStaff
        });
    } catch (err) {
      
        res.status(500).json({ message: "Error updating driver details", error: err.message });
    }
});

//Backend url-> http://localhost:8070/staff/
router.route("/").get((req,res)=>{
    console.log("Finding all staff!");
    Staff.find().then((staffs)=>{
        res.json(staffs)
    }).catch((err)=>{
        console.log(err)
    })
})

// Route to get driver by staffID
router.get("/:staffID", async (req, res) => {
    try {
        const staff = await Staff.findOne({ staffID: req.params.staffID });
        if (!staff) {
            return res.status(404).send("Driver not found");
        }
        res.json(staff); // Respond with the staff data as JSON
    } catch (err) {
        res.status(500).send("Server error"); // Handle server error
    }
});

// Update driver availability
router.put("/set-availability/:username", async (req, res) => {
    const { availability } = req.body;
  
    if (!['Available', 'On Leave', 'Assigned'].includes(availability)) {
      return res.status(400).json({ message: "Invalid availability value" });
    }
  
    try {
      const updatedStaff = await Staff.findOneAndUpdate(
        { username: req.params.username },
        { availability },
        { new: true }
      );
  
      if (!updatedStaff) {
        return res.status(404).json({ message: "Staff not found" });
      }
  
      res.json({ message: "Availability updated", staff: updatedStaff });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
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

  // PUT - Mark all notifications as read
router.put("/notifications/mark-read/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const staff = await Staff.findOne({ username });
  
      if (!staff) {
        return res.status(404).json({ error: "Driver not found" });
      }
  
      staff.notifications.forEach((notif) => {
        notif.isRead = true;
      });
  
      await staff.save();
      res.status(200).json({ message: "Notifications marked as read" });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  
  




module.exports = router;