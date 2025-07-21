/*
  # Schéma MDT pour stockage des données

  1. Nouvelles Tables
    - `profiles` - Profils citoyens avec informations personnelles
    - `addresses` - Adresses liées aux profils
    - `vehicles` - Base de données véhicules
    - `criminal_records` - Casiers judiciaires
    - `medical_records` - Dossiers médicaux
    - `incidents` - Incidents et rapports
    - `evidence` - Preuves liées aux incidents
    - `reports` - Rapports de patrouille
    - `dispatch_calls` - Appels dispatch en temps réel
    - `warrants` - Mandats actifs
    - `bolos` - Avis de recherche
    - `announcements` - Annonces internes
    - `activities` - Logs d'activité système

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques pour permettre lecture/écriture publique (pour demo)
*/

-- Table des profils citoyens
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  license_number text UNIQUE,
  file_number text UNIQUE NOT NULL,
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to profiles"
  ON profiles
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Table des adresses
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  street text NOT NULL,
  city text NOT NULL,
  zip_code text NOT NULL,
  type text CHECK(type IN ('primary', 'secondary')) DEFAULT 'primary',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to addresses"
  ON addresses
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Table des véhicules
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate text UNIQUE NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  color text NOT NULL,
  status text CHECK(status IN ('clean', 'stolen', 'suspected', 'wanted')) DEFAULT 'clean',
  owner_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  registration_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to vehicles"
  ON vehicles
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Table des casiers judiciaires
CREATE TABLE IF NOT EXISTS criminal_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  charge text NOT NULL,
  description text,
  officer text NOT NULL,
  status text CHECK(status IN ('pending', 'convicted', 'dismissed')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE criminal_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to criminal_records"
  ON criminal_records
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Table des dossiers médicaux
CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  conditions jsonb DEFAULT '[]'::jsonb,
  medications jsonb DEFAULT '[]'::jsonb,
  allergies jsonb DEFAULT '[]'::jsonb,
  emergency_contact text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to medical_records"
  ON medical_records
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Table des incidents
CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL,
  priority text CHECK(priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status text CHECK(status IN ('active', 'resolved', 'pending')) DEFAULT 'active',
  location text NOT NULL,
  description text,
  reporting_officer text NOT NULL,
  involved_profiles jsonb DEFAULT '[]'::jsonb,
  involved_units jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to incidents"
  ON incidents
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Table des preuves
CREATE TABLE IF NOT EXISTS evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  type text CHECK(type IN ('image', 'video', 'document')) NOT NULL,
  url text NOT NULL,
  description text,
  uploaded_by text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to evidence"
  ON evidence
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Table des rapports
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text CHECK(type IN ('patrol', 'incident', 'arrest', 'traffic')) NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  officer text NOT NULL,
  involved_profiles jsonb DEFAULT '[]'::jsonb,
  location text NOT NULL,
  status text CHECK(status IN ('draft', 'submitted', 'approved')) DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to reports"
  ON reports
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Table des appels dispatch
CREATE TABLE IF NOT EXISTS dispatch_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  title text NOT NULL,
  description text,
  location text NOT NULL,
  priority text CHECK(priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status text CHECK(status IN ('pending', 'responding', 'on-scene', 'resolved')) DEFAULT 'pending',
  responding_units jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE dispatch_calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to dispatch_calls"
  ON dispatch_calls
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Table des mandats
CREATE TABLE IF NOT EXISTS warrants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_name text NOT NULL,
  target_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  charge text NOT NULL,
  description text,
  issued_by text NOT NULL,
  issued_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  status text CHECK(status IN ('active', 'executed', 'expired')) DEFAULT 'active'
);

ALTER TABLE warrants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to warrants"
  ON warrants
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Table des BOLOs
CREATE TABLE IF NOT EXISTS bolos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text CHECK(type IN ('person', 'vehicle')) NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  last_seen text,
  created_by text NOT NULL,
  priority text CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bolos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to bolos"
  ON bolos
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Table des annonces
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  priority text CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to announcements"
  ON announcements
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Table des activités (logs)
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text CHECK(type IN ('created', 'updated', 'deleted')) NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  user_name text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to activities"
  ON activities
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_profiles_license ON profiles(license_number);
CREATE INDEX IF NOT EXISTS idx_profiles_file ON profiles(file_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_dispatch_status ON dispatch_calls(status);
CREATE INDEX IF NOT EXISTS idx_warrants_status ON warrants(status);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp);