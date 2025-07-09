const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const RoadTrip = require('../models/RoadTrip');

// GET /api/destinations — Liste toutes les destinations AVEC roadtrip peuplé
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find().populate('roadTripId');
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// POST /api/destinations — Ajout d'une destination
router.post('/', async (req, res) => {
  try {
    const { name, roadTripId, items } = req.body;
    const dest = await Destination.create({
      name,
      roadTripId: roadTripId || undefined,
      items: items || [],
    });
    res.status(201).json(dest);
  } catch (error) {
    res.status(500).json({ message: 'Erreur ajout', error: error.message });
  }
});

// PUT /api/destinations/:id — Modification d'une destination
router.put('/:id', async (req, res) => {
  try {
    const { name, roadTripId, items } = req.body;
    const dest = await Destination.findByIdAndUpdate(
      req.params.id,
      {
        name,
        roadTripId: roadTripId || undefined,
        items: items || [],
      },
      { new: true }
    );
    res.json(dest);
  } catch (error) {
    res.status(500).json({ message: 'Erreur modification', error: error.message });
  }
});

// DELETE /api/destinations/:id — Suppression
router.delete('/:id', async (req, res) => {
  try {
    await Destination.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur suppression', error: error.message });
  }
});

module.exports = router;