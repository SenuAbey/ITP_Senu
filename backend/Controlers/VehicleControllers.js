const Vehicle = require("../Model/VehicleModel");
const multer = require('multer');
const path = require('path');

// Set up storage engine for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/'); // Define the directory where images will be saved
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with a timestamp
    }
  });

// Create the upload instance
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Only image files are allowed.'));
      }
      cb(null, true);
    }
  }).single('vehicleImage'); // Only accept one file, named 'vehicleImage'  

//data display
const getAllVehicles = async (req , res, next) => {
    let Vehicles;
    const isNew = req.query.new === 'true'; 

    try{
        Vehicles = await Vehicle.find();
    }catch(err){
        console.log(err);
    }
    //not found
    if(!Vehicles){
        return res.status(404).json({message:"Vehicle not found"});
    }

    //display all vehicles
    return res.status(200).json({Vehicles});
};

//data insert
const addVehicles = async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        // Extract fields from the request body
        const { vehicleModel, vehicleType, vehiclePriceHour, vehiclePriceDay, vehicleStatus, vehicleMileage } = req.body;
        const vehicleImage = req.file ? req.file.path : null;

        let lastVehicle;
        try {
            lastVehicle = await Vehicle.findOne().sort({ vehicleID: -1 }).limit(1);
        } catch (err) {
            console.error("Error fetching the last vehicle: ", err);
        }

        // Generate new vehicle ID
        let newVehicleID;
        if (lastVehicle) {
            newVehicleID = lastVehicle.vehicleID + 1;  // Increment the ID numerically
        } else {
            newVehicleID = 1; // If no vehicles exist, start with 1
        }

        const VehicleAddedDate = new Date();

        //const vehicleIsNew = true;

        // Create the new vehicle with the generated vehicleID
        const newVehicle = new Vehicle({
            vehicleID: newVehicleID,
            vehicleModel,
            vehicleType,
            vehiclePriceHour,
            vehiclePriceDay,
            vehicleStatus,
            vehicleMileage,
            vehicleImage
        });

        let Vehicles;
        try {
            // Save the new vehicle
            Vehicles = await newVehicle.save();
        } catch (err) {
            console.error("Error saving the vehicle: ", err);
        }

        // Check if the vehicle was added successfully
        if (!Vehicles) {
            return res.status(404).json({ message: "Unable to add vehicle" });
        }

        //return res.status(200).json({ Vehicles });
        return res.status(200).json({ Vehicles: newVehicle, vehicleID: newVehicleID });

    });
};


//get by id
const getById = async(req,res,next) =>{
    const id = req.params.id;

    let foundVehicle;

    try{
        foundVehicle = await Vehicle.findById(id);
    }catch(err){
        console.log(err);
    }

    //not available vehicle
    if(!foundVehicle){
        return res.status(404).json({message:"Vehicle not found"});
    }
    return res.status(200).json({foundVehicle});
};

//update vehicel details
const updateVehicle = async (req, res, next)=>{
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const id = req.params.id;
        const {vehicleID,vehicleModel,vehicleType,vehiclePriceHour,vehiclePriceDay,vehicleStatus,vehicleMileage} = req.body;
        const vehicleImage = req.file ? req.file.path : null;
        
        let foundVehicle;

        try{
            foundVehicle = await Vehicle.findByIdAndUpdate(
                id,
                {
                    vehicleID:vehicleID,
                    vehicleModel: vehicleModel,
                    vehicleType: vehicleType,
                    vehiclePriceHour: vehiclePriceHour,
                    vehiclePriceDay: vehiclePriceDay,
                    vehicleStatus: vehicleStatus,
                    vehicleMileage: vehicleMileage,
                    vehicleImage:vehicleImage
                },

            
                //{new:true}
            );

            foundVehicle = await foundVehicle.save();
        }catch(err){
            console.log(err);
        }

        //not available vehicle
        if(!foundVehicle){
            return res.status(404).json({message:"Unable to update Vehicle details"});
        }
        return res.status(200).json({foundVehicle});
    });
};

//delete Vehicle details
const deleteVehicle = async (req,res, next)=>{
    const id = req.params.id;

    let foundVehicle;

    try{
        foundVehicle = await Vehicle.findByIdAndDelete(id);
    }catch(err){
        console.log(err);
    }

    //not available vehicle
    if(!foundVehicle){
        return res.status(404).json({message:"Unable to delete Vehicle details"});
    }
    return res.status(200).json({foundVehicle});

    
}

exports.getAllVehicles = getAllVehicles;
exports.addVehicles = addVehicles;
exports.getById = getById;
exports.updateVehicle = updateVehicle;
exports.deleteVehicle = deleteVehicle;
