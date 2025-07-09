const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ItemSuggestion = require('../models/ItemSuggestion');

dotenv.config();

const SUGGESTION_BASES = {
  plage: [
    { name: 'Passeport', quantityPerPerson: 1 },
    { name: 'Maillot de bain', quantityPerPerson: 1 },
    { name: 'Serviette de plage', quantityPerPerson: 1 },
    { name: 'Crème solaire', quantityPerPerson: 1 },
    { name: 'Chapeau', quantityPerPerson: 1 },
    { name: 'Sandales', quantityPerPerson: 1 },
    { name: 'Lunettes de soleil', quantityPerPerson: 1 },
    { name: 'Gourde', quantityPerPerson: 1 },
    { name: 'Powerbank', quantity: 1 },
    { name: 'Trousse de secours', quantity: 1 }
  ],
  froid: [
    { name: 'Passeport', quantityPerPerson: 1 },
    { name: 'Manteau chaud', quantityPerPerson: 1 },
    { name: 'Bonnet', quantityPerPerson: 1 },
    { name: 'Gants', quantityPerPerson: 1 },
    { name: 'Pulls', quantityPerPerson: 2 },
    { name: 'Bottes', quantityPerPerson: 1 },
    { name: 'Écharpe', quantityPerPerson: 1 },
    { name: 'Vêtements chauds', quantityPerPerson: 3 },
    { name: 'Powerbank', quantity: 1 },
    { name: 'Trousse de secours', quantity: 1 }
  ],
  city: [
    { name: 'Passeport/Carte identité', quantityPerPerson: 1 },
    { name: 'Carte bancaire', quantity: 1 },
    { name: 'Guide touristique', quantity: 1 },
    { name: 'Appareil photo', quantity: 1 },
    { name: 'Vêtements confort', quantityPerPerson: 3 },
    { name: 'Pull', quantityPerPerson: 1 },
    { name: 'Chaussures confort', quantityPerPerson: 1 },
    { name: 'Parapluie compact', quantity: 1 },
    { name: 'Trousse de toilette', quantity: 1 },
    { name: 'Powerbank', quantity: 1 }
  ],
  safari: [
    { name: 'Passeport', quantityPerPerson: 1 },
    { name: 'Crème solaire', quantityPerPerson: 1 },
    { name: 'Chapeau', quantityPerPerson: 1 },
    { name: 'Répulsif moustique', quantityPerPerson: 1 },
    { name: 'Vêtements légers', quantityPerPerson: 3 },
    { name: 'Chaussures marche', quantityPerPerson: 1 },
    { name: 'Lunettes de soleil', quantityPerPerson: 1 },
    { name: 'Powerbank', quantity: 1 },
    { name: 'Trousse de secours', quantity: 1 },
    { name: 'Gourde', quantityPerPerson: 1 }
  ]
};

// Pour chaque pays, affecte une base d’items adaptée :
const suggestions = [
  { destination: 'États-Unis', items: SUGGESTION_BASES.city },
  { destination: 'France', items: SUGGESTION_BASES.city },
  { destination: 'Canada', items: SUGGESTION_BASES.froid },
  { destination: 'Brésil', items: SUGGESTION_BASES.plage },
  { destination: 'Mexique', items: SUGGESTION_BASES.plage },
  { destination: 'Argentine', items: SUGGESTION_BASES.city },
  { destination: 'Colombie', items: SUGGESTION_BASES.plage },
  { destination: 'Chili', items: SUGGESTION_BASES.froid },
  { destination: 'Pérou', items: SUGGESTION_BASES.city },
  { destination: 'Costa Rica', items: SUGGESTION_BASES.plage },
  { destination: 'Cuba', items: SUGGESTION_BASES.plage },
  { destination: 'Espagne', items: SUGGESTION_BASES.city },
  { destination: 'Italie', items: SUGGESTION_BASES.city },
  { destination: 'Allemagne', items: SUGGESTION_BASES.city },
  { destination: 'Royaume-Uni', items: SUGGESTION_BASES.city },
  { destination: 'Irlande', items: SUGGESTION_BASES.froid },
  { destination: 'Islande', items: SUGGESTION_BASES.froid },
  { destination: 'Norvège', items: SUGGESTION_BASES.froid },
  { destination: 'Suède', items: SUGGESTION_BASES.froid },
  { destination: 'Danemark', items: SUGGESTION_BASES.froid },
  { destination: 'Pays-Bas', items: SUGGESTION_BASES.city },
  { destination: 'Portugal', items: SUGGESTION_BASES.plage },
  { destination: 'Grèce', items: SUGGESTION_BASES.plage },
  { destination: 'Croatie', items: SUGGESTION_BASES.plage },
  { destination: 'Suisse', items: SUGGESTION_BASES.froid },
  { destination: 'Autriche', items: SUGGESTION_BASES.froid },
  { destination: 'Turquie', items: SUGGESTION_BASES.city },
  { destination: 'Maroc', items: SUGGESTION_BASES.safari },
  { destination: 'Égypte', items: SUGGESTION_BASES.safari },
  { destination: 'Afrique du Sud', items: SUGGESTION_BASES.safari },
  { destination: 'Sénégal', items: SUGGESTION_BASES.plage },
  { destination: 'Tunisie', items: SUGGESTION_BASES.safari },
  { destination: 'Kenya', items: SUGGESTION_BASES.safari },
  { destination: 'Tanzanie', items: SUGGESTION_BASES.safari },
  { destination: 'Éthiopie', items: SUGGESTION_BASES.safari },
  { destination: 'Inde', items: SUGGESTION_BASES.city },
  { destination: 'Sri Lanka', items: SUGGESTION_BASES.safari },
  { destination: 'Chine', items: SUGGESTION_BASES.city },
  { destination: 'Japon', items: SUGGESTION_BASES.city },
  { destination: 'Corée du Sud', items: SUGGESTION_BASES.city },
  { destination: 'Thaïlande', items: SUGGESTION_BASES.plage },
  { destination: 'Vietnam', items: SUGGESTION_BASES.plage },
  { destination: 'Cambodge', items: SUGGESTION_BASES.plage },
  { destination: 'Malaisie', items: SUGGESTION_BASES.plage },
  { destination: 'Indonésie', items: SUGGESTION_BASES.plage },
  { destination: 'Philippines', items: SUGGESTION_BASES.plage },
  { destination: 'Australie', items: SUGGESTION_BASES.plage },
  { destination: 'Nouvelle-Zélande', items: SUGGESTION_BASES.city }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await ItemSuggestion.deleteMany();
    await ItemSuggestion.insertMany(suggestions);
    console.log('✅ Suggestions insérées pour 50 pays');
    process.exit();
  } catch (err) {
    console.error('❌ Erreur :', err);
    process.exit(1);
  }
};

seed();