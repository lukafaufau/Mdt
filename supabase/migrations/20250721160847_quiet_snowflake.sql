-- Schéma complet MDT FiveM
-- Base de données SQLite locale

-- Table des utilisateurs (officiers)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    badge VARCHAR(20) NOT NULL,
    call_sign VARCHAR(20) NOT NULL,
    rank VARCHAR(50) NOT NULL,
    permission VARCHAR(10) CHECK(permission IN ('admin', 'user')) DEFAULT 'user',
    is_active BOOLEAN DEFAULT 0,
    last_login DATETIME,
    attached_unit VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des profils citoyens
CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    license_number VARCHAR(50) UNIQUE,
    file_number VARCHAR(50) UNIQUE NOT NULL,
    photo_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des adresses
CREATE TABLE IF NOT EXISTS addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    type VARCHAR(20) CHECK(type IN ('primary', 'secondary')) DEFAULT 'primary',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Table des véhicules
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plate VARCHAR(20) UNIQUE NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    color VARCHAR(30) NOT NULL,
    status VARCHAR(20) CHECK(status IN ('clean', 'stolen', 'suspected', 'wanted')) DEFAULT 'clean',
    owner_id INTEGER,
    registration_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES profiles(id) ON DELETE SET NULL
);

-- Table des casiers judiciaires
CREATE TABLE IF NOT EXISTS criminal_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER NOT NULL,
    date DATE NOT NULL,
    charge VARCHAR(255) NOT NULL,
    description TEXT,
    officer VARCHAR(100) NOT NULL,
    status VARCHAR(20) CHECK(status IN ('pending', 'convicted', 'dismissed')) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Table des dossiers médicaux
CREATE TABLE IF NOT EXISTS medical_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER UNIQUE NOT NULL,
    conditions TEXT, -- JSON array
    medications TEXT, -- JSON array
    allergies TEXT, -- JSON array
    emergency_contact VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Table des incidents
CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) CHECK(priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    status VARCHAR(20) CHECK(status IN ('active', 'resolved', 'pending')) DEFAULT 'active',
    location VARCHAR(255) NOT NULL,
    description TEXT,
    reporting_officer VARCHAR(100) NOT NULL,
    involved_profiles TEXT, -- JSON array of profile IDs
    involved_units TEXT, -- JSON array of unit IDs
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des preuves
CREATE TABLE IF NOT EXISTS evidence (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    incident_id INTEGER NOT NULL,
    type VARCHAR(20) CHECK(type IN ('image', 'video', 'document')) NOT NULL,
    url VARCHAR(255) NOT NULL,
    description TEXT,
    uploaded_by VARCHAR(100) NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE
);

-- Table des rapports
CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type VARCHAR(20) CHECK(type IN ('patrol', 'incident', 'arrest', 'traffic')) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    officer VARCHAR(100) NOT NULL,
    involved_profiles TEXT, -- JSON array of profile IDs
    location VARCHAR(255) NOT NULL,
    status VARCHAR(20) CHECK(status IN ('draft', 'submitted', 'approved')) DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des appels dispatch
CREATE TABLE IF NOT EXISTS dispatch_calls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    priority VARCHAR(20) CHECK(priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    status VARCHAR(20) CHECK(status IN ('pending', 'responding', 'on-scene', 'resolved')) DEFAULT 'pending',
    responding_units TEXT, -- JSON array of unit IDs
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des mandats
CREATE TABLE IF NOT EXISTS warrants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    target_name VARCHAR(255) NOT NULL,
    target_id INTEGER,
    charge VARCHAR(255) NOT NULL,
    description TEXT,
    issued_by VARCHAR(100) NOT NULL,
    issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    status VARCHAR(20) CHECK(status IN ('active', 'executed', 'expired')) DEFAULT 'active',
    FOREIGN KEY (target_id) REFERENCES profiles(id) ON DELETE SET NULL
);

-- Table des BOLOs
CREATE TABLE IF NOT EXISTS bolos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type VARCHAR(20) CHECK(type IN ('person', 'vehicle')) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    last_seen VARCHAR(255),
    created_by VARCHAR(100) NOT NULL,
    priority VARCHAR(20) CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des annonces
CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    priority VARCHAR(20) CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des activités (logs)
CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type VARCHAR(20) CHECK(type IN ('created', 'updated', 'deleted')) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    user VARCHAR(100) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_profiles_license ON profiles(license_number);
CREATE INDEX IF NOT EXISTS idx_profiles_file ON profiles(file_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_dispatch_status ON dispatch_calls(status);
CREATE INDEX IF NOT EXISTS idx_warrants_status ON warrants(status);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp);