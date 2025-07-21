const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

class MDTDatabase {
  constructor() {
    // Créer le dossier database s'il n'existe pas
    const dbDir = path.join(__dirname, '..', 'database');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Initialiser la base de données
    this.db = new Database(path.join(dbDir, 'mdt.db'));
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    
    this.initializeDatabase();
  }

  initializeDatabase() {
    try {
      // Lire et exécuter le schéma
      const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      this.db.exec(schema);

      // Vérifier si des données existent déjà
      const userCount = this.db.prepare('SELECT COUNT(*) as count FROM users').get();
      
      if (userCount.count === 0) {
        // Lire et exécuter les données de test
        const seedPath = path.join(__dirname, '..', 'database', 'seed.sql');
        const seedData = fs.readFileSync(seedPath, 'utf8');
        this.db.exec(seedData);
        console.log('✅ Base de données initialisée avec les données de test');
      } else {
        console.log('✅ Base de données déjà initialisée');
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
      throw error;
    }
  }

  // Méthodes d'authentification
  async authenticateUser(username, password) {
    try {
      const user = this.db.prepare(`
        SELECT * FROM users WHERE username = ?
      `).get(username);

      if (!user) {
        return null;
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return null;
      }

      // Mettre à jour le statut actif et la dernière connexion
      this.db.prepare(`
        UPDATE users 
        SET is_active = 1, last_login = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).run(user.id);

      // Retourner l'utilisateur sans le hash du mot de passe
      const { password_hash, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        isActive: true,
        lastLogin: new Date()
      };
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      throw error;
    }
  }

  logoutUser(userId) {
    try {
      this.db.prepare(`
        UPDATE users SET is_active = 0 WHERE id = ?
      `).run(userId);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      throw error;
    }
  }

  // Méthodes pour les profils
  searchProfiles(searchTerm) {
    try {
      const profiles = this.db.prepare(`
        SELECT p.*, 
               COUNT(cr.id) as criminal_record_count,
               COUNT(v.id) as vehicle_count
        FROM profiles p
        LEFT JOIN criminal_records cr ON p.id = cr.profile_id
        LEFT JOIN vehicles v ON p.id = v.owner_id
        WHERE p.first_name LIKE ? 
           OR p.last_name LIKE ? 
           OR p.license_number LIKE ?
           OR p.file_number LIKE ?
        GROUP BY p.id
        ORDER BY p.last_name, p.first_name
      `).all(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);

      return profiles;
    } catch (error) {
      console.error('Erreur de recherche de profils:', error);
      throw error;
    }
  }

  getProfileById(id) {
    try {
      const profile = this.db.prepare('SELECT * FROM profiles WHERE id = ?').get(id);
      if (!profile) return null;

      // Récupérer les adresses
      const addresses = this.db.prepare('SELECT * FROM addresses WHERE profile_id = ?').all(id);
      
      // Récupérer les véhicules
      const vehicles = this.db.prepare('SELECT * FROM vehicles WHERE owner_id = ?').all(id);
      
      // Récupérer le casier judiciaire
      const criminalRecord = this.db.prepare('SELECT * FROM criminal_records WHERE profile_id = ? ORDER BY date DESC').all(id);
      
      // Récupérer le dossier médical
      const medicalRecord = this.db.prepare('SELECT * FROM medical_records WHERE profile_id = ?').get(id);

      return {
        ...profile,
        addresses,
        vehicles,
        criminalRecord,
        medicalRecord
      };
    } catch (error) {
      console.error('Erreur de récupération du profil:', error);
      throw error;
    }
  }

  // Méthodes pour les véhicules
  searchVehicles(searchTerm) {
    try {
      const vehicles = this.db.prepare(`
        SELECT v.*, p.first_name, p.last_name
        FROM vehicles v
        LEFT JOIN profiles p ON v.owner_id = p.id
        WHERE v.plate LIKE ? 
           OR v.make LIKE ?
           OR v.model LIKE ?
           OR p.first_name LIKE ?
           OR p.last_name LIKE ?
        ORDER BY v.plate
      `).all(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);

      return vehicles;
    } catch (error) {
      console.error('Erreur de recherche de véhicules:', error);
      throw error;
    }
  }

  // Méthodes pour les incidents
  getIncidents(status = null) {
    try {
      let query = 'SELECT * FROM incidents';
      let params = [];

      if (status) {
        query += ' WHERE status = ?';
        params.push(status);
      }

      query += ' ORDER BY created_at DESC';

      return this.db.prepare(query).all(...params);
    } catch (error) {
      console.error('Erreur de récupération des incidents:', error);
      throw error;
    }
  }

  createIncident(incidentData) {
    try {
      const result = this.db.prepare(`
        INSERT INTO incidents (title, type, priority, status, location, description, reporting_officer, involved_profiles, involved_units)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        incidentData.title,
        incidentData.type,
        incidentData.priority,
        incidentData.status,
        incidentData.location,
        incidentData.description,
        incidentData.reporting_officer,
        JSON.stringify(incidentData.involved_profiles || []),
        JSON.stringify(incidentData.involved_units || [])
      );

      // Logger l'activité
      this.logActivity('created', 'incidents', `Created incident: ${incidentData.title}`, incidentData.reporting_officer);

      return result.lastInsertRowid;
    } catch (error) {
      console.error('Erreur de création d\'incident:', error);
      throw error;
    }
  }

  // Méthodes pour les activités
  getRecentActivities(limit = 10) {
    try {
      return this.db.prepare(`
        SELECT * FROM activities 
        ORDER BY timestamp DESC 
        LIMIT ?
      `).all(limit);
    } catch (error) {
      console.error('Erreur de récupération des activités:', error);
      throw error;
    }
  }

  logActivity(type, category, description, user) {
    try {
      this.db.prepare(`
        INSERT INTO activities (type, category, description, user)
        VALUES (?, ?, ?, ?)
      `).run(type, category, description, user);
    } catch (error) {
      console.error('Erreur de log d\'activité:', error);
      throw error;
    }
  }

  // Méthodes pour les utilisateurs actifs
  getActiveUsers() {
    try {
      return this.db.prepare(`
        SELECT id, username, first_name, last_name, call_sign, rank, attached_unit, last_login
        FROM users 
        WHERE is_active = 1
        ORDER BY last_login DESC
      `).all();
    } catch (error) {
      console.error('Erreur de récupération des utilisateurs actifs:', error);
      throw error;
    }
  }

  // Méthodes pour les mandats
  getActiveWarrants() {
    try {
      return this.db.prepare(`
        SELECT * FROM warrants 
        WHERE status = 'active' AND expires_at > CURRENT_TIMESTAMP
        ORDER BY issued_at DESC
      `).all();
    } catch (error) {
      console.error('Erreur de récupération des mandats:', error);
      throw error;
    }
  }

  // Méthodes pour les annonces
  getActiveAnnouncements() {
    try {
      return this.db.prepare(`
        SELECT * FROM announcements 
        WHERE expires_at > CURRENT_TIMESTAMP
        ORDER BY priority DESC, created_at DESC
      `).all();
    } catch (error) {
      console.error('Erreur de récupération des annonces:', error);
      throw error;
    }
  }

  // Méthodes pour les BOLOs
  getActiveBOLOs() {
    try {
      return this.db.prepare(`
        SELECT * FROM bolos 
        ORDER BY priority DESC, created_at DESC
      `).all();
    } catch (error) {
      console.error('Erreur de récupération des BOLOs:', error);
      throw error;
    }
  }

  // Méthodes pour le dispatch
  getDispatchCalls(status = null) {
    try {
      let query = 'SELECT * FROM dispatch_calls';
      let params = [];

      if (status) {
        query += ' WHERE status = ?';
        params.push(status);
      }

      query += ' ORDER BY priority DESC, created_at DESC';

      return this.db.prepare(query).all(...params);
    } catch (error) {
      console.error('Erreur de récupération des appels dispatch:', error);
      throw error;
    }
  }

  // Fermer la base de données
  close() {
    this.db.close();
  }
}

module.exports = MDTDatabase;