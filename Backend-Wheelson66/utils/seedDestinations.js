const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Destination = require('../models/Destination');

dotenv.config();

const destinations = [
  { name: "États-Unis", description: "Grandes villes, parcs nationaux et road trips mythiques." },
  { name: "France", description: "Culture, gastronomie et paysages variés." },
  { name: "Canada", description: "Nature sauvage, villes cosmopolites et vastes espaces." },
  { name: "Brésil", description: "Carnaval, plages et Amazonie." },
  { name: "Mexique", description: "Ruines mayas, plages de rêve et cuisine épicée." },
  { name: "Argentine", description: "Patagonie, tango et grandes steppes." },
  { name: "Colombie", description: "Café, montagnes et Caraïbes." },
  { name: "Chili", description: "Déserts, glaciers et Andes." },
  { name: "Pérou", description: "Machu Picchu, Andes et cultures anciennes." },
  { name: "Costa Rica", description: "Nature exubérante et plages sauvages." },
  { name: "Cuba", description: "Salsa, vieilles voitures et plages idylliques." },
  { name: "Espagne", description: "Fiesta, soleil, art et plages." },
  { name: "Italie", description: "Rome, Venise, gastronomie et histoire." },
  { name: "Allemagne", description: "Châteaux, forêts et villes dynamiques." },
  { name: "Royaume-Uni", description: "Londres, pubs et campagnes verdoyantes." },
  { name: "Irlande", description: "Falaises, pubs et légendes celtiques." },
  { name: "Islande", description: "Aurores boréales, volcans et glaciers." },
  { name: "Norvège", description: "Fjords, montagnes et aurores boréales." },
  { name: "Suède", description: "Nature, design et lacs immenses." },
  { name: "Danemark", description: "Vélos, hygge et châteaux." },
  { name: "Pays-Bas", description: "Canaux, tulipes et vélos." },
  { name: "Portugal", description: "Lisbonne, plages et fado." },
  { name: "Grèce", description: "Îles paradisiaques et mythologie." },
  { name: "Croatie", description: "Côte Adriatique et villes médiévales." },
  { name: "Suisse", description: "Montagnes, lacs et chocolat." },
  { name: "Autriche", description: "Alpes, musique et traditions." },
  { name: "Turquie", description: "Istanbul, Cappadoce et plages turquoises." },
  { name: "Maroc", description: "Déserts, montagnes et médinas." },
  { name: "Égypte", description: "Pyramides, Nil et histoire ancienne." },
  { name: "Afrique du Sud", description: "Safari, vignobles et villes branchées." },
  { name: "Sénégal", description: "Teranga, plages et traditions." },
  { name: "Tunisie", description: "Sites antiques, médinas et désert." },
  { name: "Kenya", description: "Safari, Maasai Mara et plages de l’océan Indien." },
  { name: "Tanzanie", description: "Kilimandjaro, Zanzibar et safaris." },
  { name: "Éthiopie", description: "Histoire millénaire et paysages uniques." },
  { name: "Inde", description: "Taj Mahal, spiritualité et diversité." },
  { name: "Sri Lanka", description: "Plages, temples et nature sauvage." },
  { name: "Chine", description: "Grande Muraille, villes géantes et traditions." },
  { name: "Japon", description: "Tokyo, traditions, sakuras et modernité." },
  { name: "Corée du Sud", description: "Séoul, K-pop et culture high-tech." },
  { name: "Thaïlande", description: "Îles, temples et street food." },
  { name: "Vietnam", description: "Rizières, cuisine raffinée et Halong." },
  { name: "Cambodge", description: "Temples d’Angkor et rivières paisibles." },
  { name: "Malaisie", description: "Îles paradisiaques et diversité culturelle." },
  { name: "Indonésie", description: "Bali, volcans et plages de rêve." },
  { name: "Philippines", description: "Plages paradisiaques et archipels." },
  { name: "Australie", description: "Sydney, plages et Outback." },
  { name: "Nouvelle-Zélande", description: "Paysages du Seigneur des Anneaux et aventures." }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Destination.deleteMany(); // pour éviter les doublons
    await Destination.insertMany(destinations);
    console.log("✅ 50 Destinations insérées !");
    process.exit();
  } catch (error) {
    console.error("❌ Erreur :", error.message);
    process.exit(1);
  }
};

seed();