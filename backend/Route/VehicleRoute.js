const express = require("express");
const router = express.Router();
//insert model
const Vehicle = require("../Model/VehicleModel");
//insert vehcile controller
const VehicleController = require("../Controlers/VehicleControllers");

// Multer setup for file upload
const multer = require("multer");
const path = require("path");

// Configure multer storage and file handling
const upload = multer({
    dest: 'uploads/',  // Folder where images will be saved
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB (optional)
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        // Only allow jpg, jpeg, and png files
        return cb(new Error("Please upload a valid image file (jpg, jpeg, png)"));
      }
      cb(null, true);
    }
});

// Handle Vehicle Image Upload
router.post('/uploadVehicleImage', upload.single('vehicleImage'), (req, res) => {
    if (req.file) {
      // File uploaded successfully
      const vehicleImagePath = req.file.filename;  // Get the uploaded image filename
  
      // You can store the image path in the database if needed
      // For example, save the path to the Vehicle model here:
      // Vehicle.create({ vehicleImage: vehicleImagePath });
  
      res.json({ vehicleImage: vehicleImagePath });  // Send the image filename as response
    } else {
      res.status(400).json({ message: 'No image file uploaded' });
    }
});

router.get("/",VehicleController.getAllVehicles);
router.post("/",VehicleController.addVehicles);
router.get("/:id",VehicleController.getById);
router.put("/:id",VehicleController.updateVehicle);
router.delete("/:id",VehicleController.deleteVehicle);

//export
module.exports = router;