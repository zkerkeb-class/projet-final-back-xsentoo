const Trip = require('../models/Trip');

// Génère la liste d'objets de base à emporter selon le nombre de personnes et voiture louée
const generateItems = (people, rentCar) => {
  const baseItems = [
    { name: 'Serviette', quantity: people },
    { name: 'Brosse à dents', quantity: people },
    { name: 'Chaussures', quantity: people },
    { name: 'Crème solaire', quantity: 1 },
    { name: 'Sac à dos', quantity: people },
    { name: 'Snacks', quantity: 1 },
  ];
  if (rentCar) baseItems.push({ name: 'Permis de conduire', quantity: 1 });
  return baseItems;
};

// Création d'un nouveau voyage (avec roadTripId)
// Création d'un nouveau voyage
exports.createTrip = async (req, res) => {
  try {
    const {
      destination, days, people, rentCar, departureCountry, departureDate, roadTripId
    } = req.body;

    // Génère la liste d'items (optionnel si tu veux une suggestion même sans roadTripId)
    // Tu peux améliorer pour utiliser la suggestion du road trip choisi si tu veux
    const items = [
      { name: 'Serviette', quantity: people },
      { name: 'Brosse à dents', quantity: people },
      { name: 'Chaussures', quantity: people },
      { name: 'Crème solaire', quantity: 1 },
      { name: 'Sac à dos', quantity: people },
      { name: 'Snacks', quantity: 1 },
      ...(rentCar ? [{ name: 'Permis de conduire', quantity: 1 }] : [])
    ];

    const trip = await Trip.create({
      user: req.user.id,
      destination,
      days,
      people,
      rentCar,
      departureCountry,
      departureDate,
      items,
      roadTripId: roadTripId || undefined   // <-- C'EST ICI LE POINT CLEF !!!
    });

    res.status(201).json({ trip });
  } catch (err) {
    res.status(500).json({ message: 'Erreur création voyage', error: err.message });
  }
};

// Mise à jour du budget et des prix des items
exports.updatePrices = async (req, res) => {
  try {
    const { tripId, items } = req.body;
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Voyage introuvable' });

    // Mise à jour des prix pour chaque item
    trip.items = trip.items.map(item => {
      const found = items.find(i => i.name === item.name);
      return {
        ...item._doc,
        price: found ? found.price : item.price,
      };
    });

    // Calcul du budget total
    trip.totalBudget = trip.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    await trip.save();

    res.json({ message: 'Budget mis à jour', trip });
  } catch (err) {
    res.status(500).json({ message: 'Erreur mise à jour budget', error: err.message });
  }
};

// Récupère le dernier voyage de l'utilisateur
exports.getLatestTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    if (!trip) return res.status(404).json({ message: 'Aucun voyage trouvé' });

    res.json({ trip });
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération voyage', error: err.message });
  }
};
// ...toutes tes fonctions existantes

// Ajoute à la fin :
exports.updateTripStory = async (req, res) => {
  try {
    const { tripId, story } = req.body;
    const Trip = require('../models/Trip');
    const trip = await Trip.findOne({ _id: tripId, user: req.user.id });
    if (!trip) return res.status(404).json({ message: "Trip introuvable" });
    trip.story = story || "";
    await trip.save();
    res.json({ message: "Histoire enregistrée", trip });
  } catch (err) {
    res.status(500).json({ message: "Erreur update story", error: err.message });
  }
};