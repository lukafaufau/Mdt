const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const MDTDatabase = require('./database');

const app = express();
const db = new MDTDatabase();

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'mdt-secret-key-change-in-production';
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token d\'accès requis' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Routes d'authentification
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }

    const user = await db.authenticateUser(username, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        permission: user.permission 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        badge: user.badge,
        callSign: user.call_sign,
        rank: user.rank,
        permission: user.permission,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        attachedUnit: user.attached_unit
      }
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
  try {
    db.logoutUser(req.user.id);
    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour le dashboard
app.get('/api/dashboard/activities', authenticateToken, (req, res) => {
  try {
    const activities = db.getRecentActivities(10);
    res.json(activities);
  } catch (error) {
    console.error('Erreur récupération activités:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/dashboard/active-users', authenticateToken, (req, res) => {
  try {
    const users = db.getActiveUsers();
    res.json(users);
  } catch (error) {
    console.error('Erreur récupération utilisateurs actifs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/dashboard/warrants', authenticateToken, (req, res) => {
  try {
    const warrants = db.getActiveWarrants();
    res.json(warrants);
  } catch (error) {
    console.error('Erreur récupération mandats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/dashboard/announcements', authenticateToken, (req, res) => {
  try {
    const announcements = db.getActiveAnnouncements();
    res.json(announcements);
  } catch (error) {
    console.error('Erreur récupération annonces:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/dashboard/bolos', authenticateToken, (req, res) => {
  try {
    const bolos = db.getActiveBOLOs();
    res.json(bolos);
  } catch (error) {
    console.error('Erreur récupération BOLOs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/dashboard/dispatch', authenticateToken, (req, res) => {
  try {
    const calls = db.getDispatchCalls();
    res.json(calls);
  } catch (error) {
    console.error('Erreur récupération dispatch:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les profils
app.get('/api/profiles/search', authenticateToken, (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }

    const profiles = db.searchProfiles(q);
    res.json(profiles);
  } catch (error) {
    console.error('Erreur recherche profils:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/profiles/:id', authenticateToken, (req, res) => {
  try {
    const profile = db.getProfileById(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: 'Profil non trouvé' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les véhicules
app.get('/api/vehicles/search', authenticateToken, (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }

    const vehicles = db.searchVehicles(q);
    res.json(vehicles);
  } catch (error) {
    console.error('Erreur recherche véhicules:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les incidents
app.get('/api/incidents', authenticateToken, (req, res) => {
  try {
    const { status } = req.query;
    const incidents = db.getIncidents(status);
    res.json(incidents);
  } catch (error) {
    console.error('Erreur récupération incidents:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/incidents', authenticateToken, (req, res) => {
  try {
    const incidentData = {
      ...req.body,
      reporting_officer: `${req.user.firstName} ${req.user.lastName}`
    };

    const incidentId = db.createIncident(incidentData);
    res.status(201).json({ id: incidentId, message: 'Incident créé avec succès' });
  } catch (error) {
    console.error('Erreur création incident:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur API MDT démarré sur le port ${PORT}`);
  console.log(`📊 Base de données SQLite initialisée`);
  console.log(`🔐 Utilisateur de test: whatever.jordan / password`);
});

// Fermeture propre
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  db.close();
  process.exit(0);
});

module.exports = app;