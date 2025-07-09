const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connexion à la base MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/home', require('./routes/homeRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/destinations', require('./routes/destinationRoutes'));
const roadTripRoutes = require('./routes/roadTripRoutes');
app.use('/api/roadtrips', roadTripRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/user', require('./routes/userRoutes')); // Pour le profil utilisateur

// Lancement du serveur sur 0.0.0.0 pour accepter les connexions extérieures
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});