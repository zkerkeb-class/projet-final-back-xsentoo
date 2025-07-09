const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: String,
  imageUrl:    String,
  coordinates: {
    lat: Number,
    lng: Number
  }
}, { _id: false });

const roadTripSchema = new mongoose.Schema({
  destination:  { type: String, required: true },
  name:         { type: String, required: true },
  description:  String,
  mapImageUrl:  String,
  stops:        [stopSchema],
  items:        [String] // <-- Ajouté ici
});

module.exports = mongoose.model('RoadTrip', roadTripSchema);