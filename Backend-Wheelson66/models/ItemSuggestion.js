// models/ItemSuggestion.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  items: [
    {
      name: String,
      quantity: Number,           // quantité fixe (ex : 1 crème solaire)
      quantityPerPerson: Number   // quantité par personne (ex : 1 serviette/personne)
    }
  ]
});

module.exports = mongoose.model('ItemSuggestion', itemSchema);