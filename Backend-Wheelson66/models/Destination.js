// models/Destination.js
const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  roadTripId: { type: mongoose.Schema.Types.ObjectId, ref: 'RoadTrip' }, // <--- AJOUT
  items: [String], // <--- AJOUT
});

module.exports = mongoose.model('Destination', destinationSchema);