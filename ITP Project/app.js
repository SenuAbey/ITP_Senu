//console.log("bye");
//pw = JtdSurlGLVu7dXMk

const express = require("express");
const mongoose = require("mongoose");
const router = require("./Route/VehicleRoute.js");
const multer = require("multer");  // Add multer for file handling
const path = require("path");  // Add path for managing file paths

const app = express();
const  cors = require("cors");

//middleware
app.use(express.json());
app.use(cors());
app.use("/Vehicles",router);

// Define the upload folder and configure multer
const upload = multer({ dest: 'uploads/' });

// Serve the static files (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to handle vehicle image upload
app.post('/uploadVehicleImage', upload.single('vehicleImage'), (req, res) => {
  if (req.file) {
    // Save the image file name to the database (or process it accordingly)
    const vehicleImagePath = req.file.filename;  // The saved image filename

    // Respond with the image file name or path (to be stored in DB)
    res.json({ vehicleImage: vehicleImagePath });
  } else {
    res.status(400).json({ message: 'No image file uploaded' });
  }
});

//senuthi
//mongoose.connect("mongodb+srv://admin:JtdSurlGLVu7dXMk@cluster0.2fg7a.mongodb.net/")
//manuthi
//mongoose.connect("mongodb+srv://teamUser:feL6CTyz36jPPkvo@vehicledb.re0rd.mongodb.net/?retryWrites=true&w=majority&appName=vehicleDB")
mongoose.connect("mongodb+srv://Wathsala:Wath123@cluster0.lb1gs.mongodb.net/staff_db?retryWrites=true&w=majority")

	

.then(()=>console.log("Connected to MongoDB"))
.then(()=>{
    app.listen(5000);
})
.catch((err)=> console.log((err)));

