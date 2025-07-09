const express = require('express');
const router = express.Router();
const RoadTrip = require('../models/RoadTrip');

// GET /api/roadtrips/all — Liste tous les roadtrips
router.get('/all', async (req, res) => {
  try {
    const trips = await RoadTrip.find();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// GET /api/roadtrips?destination=États-Unis — Roadtrips pour une destination
router.get('/', async (req, res) => {
  try {
    const { destination } = req.query;
    if (!destination) {
      return res.status(400).json({ message: 'Destination requise dans la query' });
    }
    const trips = await RoadTrip.find({ destination });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// GET /api/roadtrips/:id — Détails d’un roadtrip précis
router.get('/:id', async (req, res) => {
  try {
    const trip = await RoadTrip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Road trip non trouvé' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// POST /api/roadtrips — Ajout d’un roadtrip avec stops et items
router.post('/', async (req, res) => {
  try {
    const { name, destination, description, stops, items } = req.body;
    const roadTrip = await RoadTrip.create({
      name,
      destination,
      description,
      stops: stops || [],
      items: items || []
    });
    res.status(201).json(roadTrip);
  } catch (err) {
    res.status(500).json({ message: 'Erreur ajout roadtrip', error: err.message });
  }
});

// PUT /api/roadtrips/:id — Modifier un roadtrip
router.put('/:id', async (req, res) => {
  try {
    const { name, destination, description, stops, items } = req.body;
    const roadTrip = await RoadTrip.findByIdAndUpdate(
      req.params.id,
      { name, destination, description, stops, items },
      { new: true }
    );
    res.json(roadTrip);
  } catch (err) {
    res.status(500).json({ message: 'Erreur modification roadtrip', error: err.message });
  }
});

// DELETE /api/roadtrips/:id — Supprimer un roadtrip
router.delete('/:id', async (req, res) => {
  try {
    await RoadTrip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Roadtrip supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression roadtrip', error: err.message });
  }
});

module.exports = router;