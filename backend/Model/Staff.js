const mongoose = require('mongoose');

const Schema = mongoose.Schema;          

const staffSchema = new Schema({   //staff collection in mongoDb
    
    staffID : {
        type : String,
        required : true
    },

    username: {  
        type: String,
        required: true,
        unique: true
    },
    
    firstName :{
        type : String,
        required : true
    },
    lastName :{
        type : String,
        required : true
    },
    NIC : {
        type : String,
        required : true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    yearsOfExperience: {
        type: Number,
        required: true
    },
    driversLicense: {
        type: String,  //(e.g., URL or path)
        required: true
    },

    status: { 
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },

    availability: {  
        type: String,
        enum: ['Available', 'On Leave', 'Assigned'],
        default: 'Available',
    },
    currentTripStatus: {
        type: String,
        enum: ['Not Started', 'Started', 'Completed'],
        default: 'Not Started'
    },

    notifications: [{
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],

    createdAt: { type: Date, default: Date.now } // Timestamp



})
                            
const Staff = mongoose.model("Staff", staffSchema);  //table name,schema

module.exports = Staff;  //module export