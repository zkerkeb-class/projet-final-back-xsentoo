const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Trip = require('../models/Trip');
const ItemSuggestion = require('../models/ItemSuggestion');
const RoadTrip = require('../models/RoadTrip');

// ✅ Créer un voyage
router.post('/plan', authMiddleware, async (req, res) => {
  try {
    const { destination, days, people, rentCar, departure, roadTripId } = req.body;

    // Suggestion d'items pour la destination choisie
    const suggestion = await ItemSuggestion.findOne({ destination });
    let items = [];
    if (suggestion) {
      items = suggestion.items.map(item => ({
        name: item.name,
        quantity: item.quantityPerPerson
          ? item.quantityPerPerson * people
          : (item.quantity || 1),
        price: 0
      }));
    }

    // ENREGISTRE BIEN le roadTripId
    const trip = new Trip({
      user: req.user.id,
      destination,
      days,
      people,
      rentCar,
      departureCountry: departure,
      roadTripId: roadTripId || null,
      items
    });

    await trip.save();

    res.status(201).json({ message: 'Voyage enregistré', trip });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// ✅ Récupérer le dernier voyage AVEC le roadTrip associé (si existant)
router.get('/latest', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('roadTripId');
    if (!trip) return res.status(404).json({ message: "Aucun voyage trouvé" });
    res.json({ trip });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// ✅ Mettre à jour le dernier voyage (items ou budget)
router.put('/latest', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    if (!trip) return res.status(404).json({ message: "Aucun voyage trouvé" });
    if (req.body.items) trip.items = req.body.items;
    if (req.body.totalBudget !== undefined) trip.totalBudget = req.body.totalBudget;
    await trip.save();
    res.json({ message: 'Voyage mis à jour', trip });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// ✅ Mettre à jour la liste des items indépendamment (ajout/suppression d’un matériel personnalisé)
router.put('/latest/items', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    const trip = await Trip.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    if (!trip) return res.status(404).json({ message: "Aucun voyage trouvé" });
    trip.items = items;
    await trip.save();
    res.json({ message: 'Liste du matériel à ramener mise à jour', trip });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// ✅ Sauvegarder les étapes personnalisées du road trip dans le dernier voyage de l'utilisateur
router.put('/latest/stops', authMiddleware, async (req, res) => {
  try {
    const { stops } = req.body;
    const trip = await Trip.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    if (!trip) return res.status(404).json({ message: 'Aucun voyage trouvé' });
    trip.customStops = stops;
    await trip.save();
    res.json({ message: "Étapes personnalisées enregistrées", trip });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// ✅ Mettre à jour l’histoire du voyage sur le dernier voyage
router.put('/story', authMiddleware, async (req, res) => {
  try {
    const { story } = req.body;
    const trip = await Trip.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    if (!trip) return res.status(404).json({ message: 'Aucun voyage trouvé' });
    trip.story = story;
    await trip.save();
    res.json({ message: "Histoire enregistrée", trip });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// ✅ Récupérer tout l’historique des voyages de l’utilisateur
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ trips });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});
// ✅ Supprimer un voyage par son ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!trip) return res.status(404).json({ message: "Voyage non trouvé" });
    res.json({ success: true, message: "Voyage supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;