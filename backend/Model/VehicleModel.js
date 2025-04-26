const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    vehicleID:{
        type:Number,
        required:true,
        unique:true
    },
    vehicleModel:{
        type:String,
        required:true,
    },
    vehicleType:{
        type:String,
        required:true,
    },
    vehiclePriceHour:{
        type:Number,
        required:true,
    },
    vehiclePriceDay:{
        type:Number,
        required:true,
    },
    vehicleStatus:{
        type:String,
        required:true,
    },
    vehicleMileage:{
        type:Number,
        required:true,
    },
    vehicleImage:{
        type:String,
        required:true,
    },
    vehicleIsNew:{
        type:Boolean
    },
    VehicleAddedDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model(
    "VehicleModel", //filename
    vehicleSchema // function name
)