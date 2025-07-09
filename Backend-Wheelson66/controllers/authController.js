const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Inscription utilisateur
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Vérifie si l'email existe déjà
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: 'Email déjà utilisé' });

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    // Génère un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Réponse
    res.status(201).json({
      message: 'Utilisateur créé',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Connexion utilisateur
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email invalide' });

    if (user.isBlocked) return res.status(403).json({ message: 'Compte bloqué' }); // <-- ajoute cette ligne

    // Vérifie le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

    // Génère un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Réponse
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin // <-- ajoute cette ligne
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Modifier email et/ou mot de passe utilisateur
exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { email, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // Si changement d'email
    if (email && email !== user.email) {
      // Vérifie si l'email est déjà pris
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: "Cet email est déjà utilisé." });
      user.email = email;
    }

    // Si changement de mot de passe
    if (oldPassword && newPassword) {
      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match) return res.status(400).json({ message: "Ancien mot de passe incorrect" });
      if (newPassword.length < 6) return res.status(400).json({ message: "Le nouveau mot de passe doit faire au moins 6 caractères." });
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.json({
      message: "Profil mis à jour avec succès",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};