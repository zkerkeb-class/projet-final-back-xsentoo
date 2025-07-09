// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const ItemSuggestion = require('../models/ItemSuggestion');

// GET /api/items — liste toutes les destinations avec suggestions d’items
router.get('/', async (req, res) => {
  try {
    const destinations = await ItemSuggestion.find().select('destination -_id');
    // Retourne un tableau de noms ["Route 66", "Sri Lanka", ...]
    res.json(destinations.map(d => d.destination));
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// GET /api/items/:destination — suggestions d’items pour une destination
router.get('/:destination', async (req, res) => {
  try {
    const suggestion = await ItemSuggestion.findOne({ destination: req.params.destination });
    if (!suggestion) {
      return res.status(404).json({ message: "Pas de suggestion pour cette destination" });
    }
    res.json(suggestion.items);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;