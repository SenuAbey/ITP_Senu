const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  vehicleID:{type: Number},
  customerName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  driverLicenseNumber: { type: String, required: true },
  needsDriver: { type: Boolean, required: true },
  rentalDuration: {
    type: { type: String, enum: ['hours', 'days', 'weeks', 'months'], required: true },
    value: { type: Number, required: true }
  },
  vehicleType: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'staffs', default: null },
  tripDate: { type: Date, required: true },
  tripStatus: {type: String,enum:['Not Started','Started','Completed'],default:'Not Started'}
});

module.exports = mongoose.model('Boking', bookingSchema);
//define API endpoints to handle the crud and allow backend to interact with the database