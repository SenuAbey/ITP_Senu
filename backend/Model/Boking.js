const mongoose = require("mongoose");

/*const bookingSchema = new mongoose.Schema({
  customerName: String,
  contactNumber: String,
  vehicleType: String,
  pickupLocation: String,
  dropoffLocation: String,
  tripDate: String,
  driverNeeded: Boolean,
  driverStatus: {  // Renamed field to driverStatus
    type: String,
    enum: ['Pending', 'Assigned', 'Completed', 'Cancelled'], // Status of driver assignment
    default: 'Pending',
  },
  assignedDriver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Staff", 
    default: null 
  },
  notified: {       //tracks whether the driver has seen the new trip yet.
    type: Boolean,
    default: false,
  },
  tripStatus: { // ✅ Added this to track trip progress
    type: String,
    enum: ['Not Started', 'Started', 'Completed'],
    default: 'Not Started'
  },


});

module.exports = mongoose.model("Booking", bookingSchema);*/

/*const bookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  driverLicenseNumber: { type: String, required: true },
  needsDriver: { type: Boolean, required: true },
  rentalDuration: {
  type: { type: String, enum: ['hours', 'days', 'weeks', 'months'], required: true },
  value: { type: Number, required: true }
  },  
  totalAmount: { type: Number, required: true },
  assignedDriver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Staff", 
    default: null 
  },
  tripDate: { type: Date, required: true },
   tripStatus: { // ✅ Added this to track trip progress
    type: String,
    enum: ['Not Started', 'Started', 'Completed'],
    default: 'Not Started'
  },


});

module.exports = mongoose.model("Booking", bookingSchema);*/

const bookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  driverLicenseNumber: { type: String, required: true },
  needsDriver: { type: Boolean, required: true },
  rentalDuration: {
    type: { type: String, enum: ['hours', 'days', 'weeks', 'months'], required: true },
    value: { type: Number, required: true }
  },
  totalAmount: { type: Number, required: true },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null },
  tripDate: { type: Date, required: true },
  tripStatus: {type: String,enum:['Not Started','Started','Completed'],default:'Not Started'}
});

//module.exports = mongoose.model('Boking', bookingSchema);
module.exports = mongoose.models.Boking || mongoose.model('Boking', bookingSchema);

//define API endpoints to handle the crud and allow backend to interact with the database