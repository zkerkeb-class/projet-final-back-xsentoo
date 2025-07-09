const mongoose = require('mongoose');
const RoadTrip = require('../models/RoadTrip');
require('dotenv').config();

const roadTrips = [
  // États-Unis
  {
    destination: 'États-Unis',
    name: 'Route 66',
    description: 'De Chicago à Santa Monica à travers les USA.',
    stops: [
      { name: "Chicago", coordinates: { lat: 41.8781, lng: -87.6298 } },
      { name: "St. Louis", coordinates: { lat: 38.6270, lng: -90.1994 } },
      { name: "Oklahoma City", coordinates: { lat: 35.4676, lng: -97.5164 } },
      { name: "Albuquerque", coordinates: { lat: 35.0844, lng: -106.6504 } },
      { name: "Flagstaff", coordinates: { lat: 35.1983, lng: -111.6513 } },
      { name: "Santa Monica", coordinates: { lat: 34.0195, lng: -118.4912 } }
    ]
  },
  // France
  {
    destination: 'France',
    name: 'Découverte de la France',
    description: 'De Paris à Nice en passant par Lyon.',
    stops: [
      { name: "Paris", coordinates: { lat: 48.8566, lng: 2.3522 } },
      { name: "Lyon", coordinates: { lat: 45.7640, lng: 4.8357 } },
      { name: "Marseille", coordinates: { lat: 43.2965, lng: 5.3698 } },
      { name: "Nice", coordinates: { lat: 43.7102, lng: 7.2620 } }
    ]
  },
  // Canada
  {
    destination: 'Canada',
    name: 'Aventure au Canada',
    description: 'De Montréal à Vancouver en passant par Toronto.',
    stops: [
      { name: "Montréal", coordinates: { lat: 45.5017, lng: -73.5673 } },
      { name: "Toronto", coordinates: { lat: 43.6532, lng: -79.3832 } },
      { name: "Vancouver", coordinates: { lat: 49.2827, lng: -123.1207 } }
    ]
  },
  // Brésil
  {
    destination: 'Brésil',
    name: 'Découverte du Brésil',
    description: 'De Rio à Salvador en passant par Brasília.',
    stops: [
      { name: "Rio de Janeiro", coordinates: { lat: -22.9068, lng: -43.1729 } },
      { name: "Brasília", coordinates: { lat: -15.8267, lng: -47.9218 } },
      { name: "Salvador", coordinates: { lat: -12.9777, lng: -38.5016 } }
    ]
  },
  // Mexique
  {
    destination: 'Mexique',
    name: 'Trésors du Mexique',
    description: 'De Mexico à Cancún en passant par Guadalajara.',
    stops: [
      { name: "Mexico", coordinates: { lat: 19.4326, lng: -99.1332 } },
      { name: "Guadalajara", coordinates: { lat: 20.6597, lng: -103.3496 } },
      { name: "Cancún", coordinates: { lat: 21.1619, lng: -86.8515 } }
    ]
  },
  // Argentine
  {
    destination: 'Argentine',
    name: 'Road trip Argentine',
    description: 'De Buenos Aires à Ushuaïa.',
    stops: [
      { name: "Buenos Aires", coordinates: { lat: -34.6037, lng: -58.3816 } },
      { name: "Mendoza", coordinates: { lat: -32.8908, lng: -68.8272 } },
      { name: "Ushuaïa", coordinates: { lat: -54.8019, lng: -68.3030 } }
    ]
  },
  // Colombie
  {
    destination: 'Colombie',
    name: 'Tour de Colombie',
    description: 'De Bogotá à Medellín puis Carthagène.',
    stops: [
      { name: "Bogotá", coordinates: { lat: 4.7110, lng: -74.0721 } },
      { name: "Medellín", coordinates: { lat: 6.2442, lng: -75.5812 } },
      { name: "Carthagène", coordinates: { lat: 10.3910, lng: -75.4794 } }
    ]
  },
  // Chili
  {
    destination: 'Chili',
    name: 'Aventure Chilienne',
    description: 'De Santiago à Punta Arenas.',
    stops: [
      { name: "Santiago", coordinates: { lat: -33.4489, lng: -70.6693 } },
      { name: "Valparaiso", coordinates: { lat: -33.0472, lng: -71.6127 } },
      { name: "Punta Arenas", coordinates: { lat: -53.1638, lng: -70.9171 } }
    ]
  },
  // Pérou
  {
    destination: 'Pérou',
    name: 'Au coeur du Pérou',
    description: 'De Lima à Cuzco et Machu Picchu.',
    stops: [
      { name: "Lima", coordinates: { lat: -12.0464, lng: -77.0428 } },
      { name: "Cuzco", coordinates: { lat: -13.5319, lng: -71.9675 } },
      { name: "Machu Picchu", coordinates: { lat: -13.1631, lng: -72.5450 } }
    ]
  },
  // Costa Rica
  {
    destination: 'Costa Rica',
    name: 'Pura Vida',
    description: 'Nature et plages du Costa Rica.',
    stops: [
      { name: "San José", coordinates: { lat: 9.9281, lng: -84.0907 } },
      { name: "La Fortuna", coordinates: { lat: 10.4712, lng: -84.6458 } },
      { name: "Tamarindo", coordinates: { lat: 10.2993, lng: -85.8415 } }
    ]
  },
  // Cuba
  {
    destination: 'Cuba',
    name: 'Sur la route de Cuba',
    description: 'La Havane et Varadero.',
    stops: [
      { name: "La Havane", coordinates: { lat: 23.1136, lng: -82.3666 } },
      { name: "Varadero", coordinates: { lat: 23.1568, lng: -81.2432 } }
    ]
  },
  // Espagne
  {
    destination: 'Espagne',
    name: 'Espagne authentique',
    description: 'De Madrid à Barcelone.',
    stops: [
      { name: "Madrid", coordinates: { lat: 40.4168, lng: -3.7038 } },
      { name: "Séville", coordinates: { lat: 37.3891, lng: -5.9845 } },
      { name: "Barcelone", coordinates: { lat: 41.3851, lng: 2.1734 } }
    ]
  },
  // Italie
  {
    destination: 'Italie',
    name: 'Tour d’Italie',
    description: 'Rome, Florence, Venise, Milan.',
    stops: [
      { name: "Rome", coordinates: { lat: 41.9028, lng: 12.4964 } },
      { name: "Florence", coordinates: { lat: 43.7696, lng: 11.2558 } },
      { name: "Venise", coordinates: { lat: 45.4408, lng: 12.3155 } },
      { name: "Milan", coordinates: { lat: 45.4642, lng: 9.1900 } }
    ]
  },
  // Allemagne
  {
    destination: 'Allemagne',
    name: 'Road trip Germanique',
    description: 'De Berlin à Munich.',
    stops: [
      { name: "Berlin", coordinates: { lat: 52.5200, lng: 13.4050 } },
      { name: "Hambourg", coordinates: { lat: 53.5511, lng: 9.9937 } },
      { name: "Munich", coordinates: { lat: 48.1351, lng: 11.5820 } }
    ]
  },
  // Royaume-Uni
  {
    destination: 'Royaume-Uni',
    name: 'UK Trip',
    description: 'De Londres à Édimbourg.',
    stops: [
      { name: "Londres", coordinates: { lat: 51.5074, lng: -0.1278 } },
      { name: "Liverpool", coordinates: { lat: 53.4084, lng: -2.9916 } },
      { name: "Manchester", coordinates: { lat: 53.4808, lng: -2.2426 } },
      { name: "Édimbourg", coordinates: { lat: 55.9533, lng: -3.1883 } }
    ]
  },
  // Irlande
  {
    destination: 'Irlande',
    name: 'Tour d’Irlande',
    description: 'Dublin, Galway et Cork.',
    stops: [
      { name: "Dublin", coordinates: { lat: 53.3498, lng: -6.2603 } },
      { name: "Galway", coordinates: { lat: 53.2707, lng: -9.0568 } },
      { name: "Cork", coordinates: { lat: 51.8985, lng: -8.4756 } }
    ]
  },
  // Islande
  {
    destination: 'Islande',
    name: 'Cercle d’Or',
    description: 'Reykjavik et la nature islandaise.',
    stops: [
      { name: "Reykjavik", coordinates: { lat: 64.1466, lng: -21.9426 } },
      { name: "Thingvellir", coordinates: { lat: 64.2559, lng: -21.1295 } },
      { name: "Gullfoss", coordinates: { lat: 64.3275, lng: -20.1218 } },
      { name: "Geysir", coordinates: { lat: 64.3104, lng: -20.3024 } }
    ]
  },
  // Norvège
  {
    destination: 'Norvège',
    name: 'Fjords Norvégiens',
    description: 'Oslo, Bergen, Tromsø.',
    stops: [
      { name: "Oslo", coordinates: { lat: 59.9139, lng: 10.7522 } },
      { name: "Bergen", coordinates: { lat: 60.3913, lng: 5.3221 } },
      { name: "Tromsø", coordinates: { lat: 69.6496, lng: 18.9560 } }
    ]
  },
  // Suède
  {
    destination: 'Suède',
    name: 'Tour de Suède',
    description: 'Stockholm, Göteborg, Malmö.',
    stops: [
      { name: "Stockholm", coordinates: { lat: 59.3293, lng: 18.0686 } },
      { name: "Göteborg", coordinates: { lat: 57.7089, lng: 11.9746 } },
      { name: "Malmö", coordinates: { lat: 55.6050, lng: 13.0038 } }
    ]
  },
  // Danemark
  {
    destination: 'Danemark',
    name: 'Vikings Road',
    description: 'Copenhague et Aarhus.',
    stops: [
      { name: "Copenhague", coordinates: { lat: 55.6761, lng: 12.5683 } },
      { name: "Aarhus", coordinates: { lat: 56.1629, lng: 10.2039 } }
    ]
  },
  // Pays-Bas
  {
    destination: 'Pays-Bas',
    name: 'Route des canaux',
    description: 'Amsterdam, Rotterdam, Utrecht.',
    stops: [
      { name: "Amsterdam", coordinates: { lat: 52.3676, lng: 4.9041 } },
      { name: "Rotterdam", coordinates: { lat: 51.9225, lng: 4.4792 } },
      { name: "Utrecht", coordinates: { lat: 52.0907, lng: 5.1214 } }
    ]
  },
  // Portugal
  {
    destination: 'Portugal',
    name: 'Portugal Express',
    description: 'Lisbonne, Porto, Faro.',
    stops: [
      { name: "Lisbonne", coordinates: { lat: 38.7223, lng: -9.1393 } },
      { name: "Porto", coordinates: { lat: 41.1579, lng: -8.6291 } },
      { name: "Faro", coordinates: { lat: 37.0194, lng: -7.9304 } }
    ]
  },
  // Grèce
  {
    destination: 'Grèce',
    name: 'Odyssée Grecque',
    description: 'Athènes, Thessalonique, Santorin.',
    stops: [
      { name: "Athènes", coordinates: { lat: 37.9838, lng: 23.7275 } },
      { name: "Thessalonique", coordinates: { lat: 40.6401, lng: 22.9444 } },
      { name: "Santorin", coordinates: { lat: 36.3932, lng: 25.4615 } }
    ]
  },
  // Croatie
  {
    destination: 'Croatie',
    name: 'Beauté Croate',
    description: 'Zagreb, Split, Dubrovnik.',
    stops: [
      { name: "Zagreb", coordinates: { lat: 45.8150, lng: 15.9819 } },
      { name: "Split", coordinates: { lat: 43.5081, lng: 16.4402 } },
      { name: "Dubrovnik", coordinates: { lat: 42.6507, lng: 18.0944 } }
    ]
  },
  // Suisse
  {
    destination: 'Suisse',
    name: 'La Suisse en express',
    description: 'Berne, Genève, Zurich.',
    stops: [
      { name: "Berne", coordinates: { lat: 46.9480, lng: 7.4474 } },
      { name: "Genève", coordinates: { lat: 46.2044, lng: 6.1432 } },
      { name: "Zurich", coordinates: { lat: 47.3769, lng: 8.5417 } }
    ]
  },
  // Autriche
  {
    destination: 'Autriche',
    name: 'Rando autrichienne',
    description: 'Vienne, Salzbourg, Innsbruck.',
    stops: [
      { name: "Vienne", coordinates: { lat: 48.2082, lng: 16.3738 } },
      { name: "Salzbourg", coordinates: { lat: 47.8095, lng: 13.0550 } },
      { name: "Innsbruck", coordinates: { lat: 47.2692, lng: 11.4041 } }
    ]
  },
  // Turquie
  {
    destination: 'Turquie',
    name: 'Voyage Ottoman',
    description: 'Ankara, Istanbul, Izmir.',
    stops: [
      { name: "Ankara", coordinates: { lat: 39.9334, lng: 32.8597 } },
      { name: "Istanbul", coordinates: { lat: 41.0082, lng: 28.9784 } },
      { name: "Izmir", coordinates: { lat: 38.4192, lng: 27.1287 } }
    ]
  },
  // Maroc
  {
    destination: 'Maroc',
    name: 'Route du Maroc',
    description: 'Rabat, Marrakech, Fès.',
    stops: [
      { name: "Rabat", coordinates: { lat: 34.0209, lng: -6.8416 } },
      { name: "Marrakech", coordinates: { lat: 31.6295, lng: -7.9811 } },
      { name: "Fès", coordinates: { lat: 34.0181, lng: -5.0078 } }
    ]
  },
  // Égypte
  {
    destination: 'Égypte',
    name: 'Sur la trace des pharaons',
    description: 'Le Caire, Louxor, Alexandrie.',
    stops: [
      { name: "Le Caire", coordinates: { lat: 30.0444, lng: 31.2357 } },
      { name: "Louxor", coordinates: { lat: 25.6872, lng: 32.6396 } },
      { name: "Alexandrie", coordinates: { lat: 31.2001, lng: 29.9187 } }
    ]
  },
  // Afrique du Sud
  {
    destination: 'Afrique du Sud',
    name: 'Aventure en Afrique du Sud',
    description: 'Le Cap, Johannesburg, Durban.',
    stops: [
      { name: "Le Cap", coordinates: { lat: -33.9249, lng: 18.4241 } },
      { name: "Johannesburg", coordinates: { lat: -26.2041, lng: 28.0473 } },
      { name: "Durban", coordinates: { lat: -29.8587, lng: 31.0218 } }
    ]
  },
  // Sénégal
  {
    destination: 'Sénégal',
    name: 'Boucle Sénégalaise',
    description: 'Dakar, Saint-Louis, Saly.',
    stops: [
      { name: "Dakar", coordinates: { lat: 14.7167, lng: -17.4677 } },
      { name: "Saint-Louis", coordinates: { lat: 16.0321, lng: -16.4897 } },
      { name: "Saly", coordinates: { lat: 14.4379, lng: -17.0069 } }
    ]
  },
  // Tunisie
  {
    destination: 'Tunisie',
    name: 'Soleil Tunisien',
    description: 'Tunis, Sousse, Djerba.',
    stops: [
      { name: "Tunis", coordinates: { lat: 36.8065, lng: 10.1815 } },
      { name: "Sousse", coordinates: { lat: 35.8256, lng: 10.6084 } },
      { name: "Djerba", coordinates: { lat: 33.8076, lng: 10.8451 } }
    ]
  },
  // Kenya
  {
    destination: 'Kenya',
    name: 'Safari au Kenya',
    description: 'Nairobi, Mombasa, Nakuru.',
    stops: [
      { name: "Nairobi", coordinates: { lat: -1.2921, lng: 36.8219 } },
      { name: "Mombasa", coordinates: { lat: -4.0435, lng: 39.6682 } },
      { name: "Nakuru", coordinates: { lat: -0.3031, lng: 36.0800 } }
    ]
  },
  // Tanzanie
  {
    destination: 'Tanzanie',
    name: 'Lac et Kilimandjaro',
    description: 'Dodoma, Arusha, Dar es Salaam.',
    stops: [
      { name: "Dodoma", coordinates: { lat: -6.1630, lng: 35.7516 } },
      { name: "Arusha", coordinates: { lat: -3.3869, lng: 36.6822 } },
      { name: "Dar es Salaam", coordinates: { lat: -6.7924, lng: 39.2083 } }
    ]
  },
  // Éthiopie
  {
    destination: 'Éthiopie',
    name: 'Route Éthiopienne',
    description: 'Addis-Abeba, Lalibela, Gondar.',
    stops: [
      { name: "Addis-Abeba", coordinates: { lat: 9.0301, lng: 38.7408 } },
      { name: "Lalibela", coordinates: { lat: 12.0333, lng: 39.0500 } },
      { name: "Gondar", coordinates: { lat: 12.6100, lng: 37.4600 } }
    ]
  },
  // Inde
  {
    destination: 'Inde',
    name: 'L’Inde millénaire',
    description: 'New Delhi, Mumbai, Varanasi.',
    stops: [
      { name: "New Delhi", coordinates: { lat: 28.6139, lng: 77.2090 } },
      { name: "Mumbai", coordinates: { lat: 19.0760, lng: 72.8777 } },
      { name: "Varanasi", coordinates: { lat: 25.3176, lng: 83.0056 } }
    ]
  },
  // Sri Lanka
  {
    destination: 'Sri Lanka',
    name: 'Triangle Culturel',
    description: "Circuit au cœur du Sri Lanka ancien : Sigiriya, Dambulla, Polonnaruwa...",
    stops: [
      { name: "Kandy", coordinates: { lat: 7.2906, lng: 80.6337 } },
      { name: "Dambulla", coordinates: { lat: 7.8721, lng: 80.6511 } },
      { name: "Sigiriya", coordinates: { lat: 7.9570, lng: 80.7603 } },
      { name: "Polonnaruwa", coordinates: { lat: 7.9403, lng: 81.0188 } },
      { name: "Anuradhapura", coordinates: { lat: 8.3114, lng: 80.4037 } }
    ]
  },
  // Chine
  {
    destination: 'Chine',
    name: 'Empire du Milieu',
    description: "Pékin, Shanghai, Xi'an.",
    stops: [
      { name: "Pékin", coordinates: { lat: 39.9042, lng: 116.4074 } },
      { name: "Shanghai", coordinates: { lat: 31.2304, lng: 121.4737 } },
      { name: "Xi'an", coordinates: { lat: 34.3416, lng: 108.9398 } }
    ]
  },
  // Japon
  {
    destination: 'Japon',
    name: 'Tokyo-Kyoto-Osaka',
    description: 'Le Japon classique.',
    stops: [
      { name: "Tokyo", coordinates: { lat: 35.6895, lng: 139.6917 } },
      { name: "Hakone", coordinates: { lat: 35.2328, lng: 139.1060 } },
      { name: "Kyoto", coordinates: { lat: 35.0116, lng: 135.7681 } },
      { name: "Osaka", coordinates: { lat: 34.6937, lng: 135.5023 } }
    ]
  },
  // Corée du Sud
  {
    destination: 'Corée du Sud',
    name: 'Trip Corée',
    description: 'Séoul, Busan, Jeonju.',
    stops: [
      { name: "Séoul", coordinates: { lat: 37.5665, lng: 126.9780 } },
      { name: "Busan", coordinates: { lat: 35.1796, lng: 129.0756 } },
      { name: "Jeonju", coordinates: { lat: 35.8242, lng: 127.1480 } }
    ]
  },
  // Thaïlande
  {
    destination: 'Thaïlande',
    name: 'Îles & temples',
    description: 'Bangkok, Chiang Mai, Phuket.',
    stops: [
      { name: "Bangkok", coordinates: { lat: 13.7563, lng: 100.5018 } },
      { name: "Chiang Mai", coordinates: { lat: 18.7061, lng: 98.9817 } },
      { name: "Phuket", coordinates: { lat: 7.8804, lng: 98.3923 } }
    ]
  },
  // Vietnam
  {
    destination: 'Vietnam',
    name: 'Route du Vietnam',
    description: 'Hanoï, Hué, Ho Chi Minh.',
    stops: [
      { name: "Hanoï", coordinates: { lat: 21.0285, lng: 105.8542 } },
      { name: "Hué", coordinates: { lat: 16.4637, lng: 107.5909 } },
      { name: "Ho Chi Minh", coordinates: { lat: 10.8231, lng: 106.6297 } }
    ]
  },
  // Cambodge
  {
    destination: 'Cambodge',
    name: 'Angkor & capitale',
    description: 'Phnom Penh, Siem Reap.',
    stops: [
      { name: "Phnom Penh", coordinates: { lat: 11.5564, lng: 104.9282 } },
      { name: "Siem Reap", coordinates: { lat: 13.3671, lng: 103.8448 } }
    ]
  },
  // Malaisie
  {
    destination: 'Malaisie',
    name: 'Malaisie urbaine & sauvage',
    description: 'Kuala Lumpur, Penang, Kota Kinabalu.',
    stops: [
      { name: "Kuala Lumpur", coordinates: { lat: 3.1390, lng: 101.6869 } },
      { name: "Penang", coordinates: { lat: 5.4141, lng: 100.3288 } },
      { name: "Kota Kinabalu", coordinates: { lat: 5.9804, lng: 116.0735 } }
    ]
  },
  // Indonésie
  {
    destination: 'Indonésie',
    name: 'Bali & Java',
    description: 'Jakarta, Bali, Yogyakarta.',
    stops: [
      { name: "Jakarta", coordinates: { lat: -6.2088, lng: 106.8456 } },
      { name: "Denpasar (Bali)", coordinates: { lat: -8.6500, lng: 115.2167 } },
      { name: "Yogyakarta", coordinates: { lat: -7.7956, lng: 110.3695 } }
    ]
  },
  // Philippines
  {
    destination: 'Philippines',
    name: 'Aventure aux Philippines',
    description: 'Manille, Cebu, Palawan.',
    stops: [
      { name: "Manille", coordinates: { lat: 14.5995, lng: 120.9842 } },
      { name: "Cebu", coordinates: { lat: 10.3157, lng: 123.8854 } },
      { name: "Puerto Princesa (Palawan)", coordinates: { lat: 9.7402, lng: 118.7353 } }
    ]
  },
  // Australie
  {
    destination: 'Australie',
    name: 'De Sydney à Cairns',
    description: 'Sydney, Brisbane, Cairns.',
    stops: [
      { name: "Sydney", coordinates: { lat: -33.8688, lng: 151.2093 } },
      { name: "Brisbane", coordinates: { lat: -27.4698, lng: 153.0251 } },
      { name: "Cairns", coordinates: { lat: -16.9186, lng: 145.7781 } }
    ]
  },
  // Nouvelle-Zélande
  {
    destination: 'Nouvelle-Zélande',
    name: 'NZ Roadtrip',
    description: 'Wellington, Auckland, Queenstown.',
    stops: [
      { name: "Wellington", coordinates: { lat: -41.2865, lng: 174.7762 } },
      { name: "Auckland", coordinates: { lat: -36.8485, lng: 174.7633 } },
      { name: "Queenstown", coordinates: { lat: -45.0312, lng: 168.6626 } }
    ]
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await RoadTrip.deleteMany(); // Clean
    await RoadTrip.insertMany(roadTrips);
    console.log("✅ Road trips insérés !");
    process.exit();
  } catch (err) {
    console.error("❌ Erreur :", err.message);
    process.exit(1);
  }
}

seed();