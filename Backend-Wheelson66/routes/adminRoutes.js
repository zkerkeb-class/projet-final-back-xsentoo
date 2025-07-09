const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Trip = require('../models/Trip');
const auth = require('../middleware/authMiddleware');

// Middleware pour vérifier si l'utilisateur est admin
const requireAdmin = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Non authentifié' });
  const user = await User.findById(req.user.id);
  if (!user || !user.isAdmin) return res.status(403).json({ message: 'Accès admin requis' });
  next();
};

// Liste tous les utilisateurs
router.get('/users', auth, requireAdmin, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Supprime un utilisateur
router.delete('/users/:id', auth, requireAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Utilisateur supprimé' });
});

// Bloque/débloque un utilisateur
router.put('/users/:id/block', auth, requireAdmin, async (req, res) => {
  const { block } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBlocked: !!block },
    { new: true }
  ).select('-password');
  res.json(user);
});

// Liste tous les voyages
router.get('/trips', auth, requireAdmin, async (req, res) => {
  const trips = await Trip.find().populate('user', 'name email');
  res.json(trips);
});

module.exports = router;