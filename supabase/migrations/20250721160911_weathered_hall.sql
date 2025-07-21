-- Données de test pour le système MDT
-- Mot de passe par défaut: "password" (hashé avec bcrypt)

-- Insertion des utilisateurs de test
INSERT OR IGNORE INTO users (username, password_hash, first_name, last_name, badge, call_sign, rank, permission, is_active, attached_unit) VALUES
('whatever.jordan', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Whatever', 'Jordan', '123', '123', 'Chief', 'admin', 1, '123'),
('john.doe', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', '456', '456', 'Officer', 'user', 0, NULL),
('jane.smith', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane', 'Smith', '789', '789', 'Sergeant', 'user', 1, '789');

-- Insertion des profils citoyens
INSERT OR IGNORE INTO profiles (first_name, last_name, date_of_birth, license_number, file_number) VALUES
('John', 'Doe', '1985-03-15', 'DL123456789', 'P001234'),
('Jane', 'Smith', '1990-07-22', 'DL987654321', 'P001235'),
('Mike', 'Johnson', '1978-11-08', 'DL456789123', 'P001236');

-- Insertion des adresses
INSERT OR IGNORE INTO addresses (profile_id, street, city, zip_code, type) VALUES
(1, '123 Main St', 'Los Santos', '90210', 'primary'),
(2, '456 Oak Ave', 'Los Santos', '90211', 'primary'),
(3, '789 Pine Rd', 'Sandy Shores', '90212', 'primary');

-- Insertion des véhicules
INSERT OR IGNORE INTO vehicles (plate, make, model, year, color, status, owner_id, registration_date) VALUES
('99AJZ011', 'Toyota', 'Camry', 2022, 'Blue', 'clean', 1, '2022-05-15'),
('ABC123', 'Honda', 'Civic', 2021, 'Red', 'stolen', 2, '2021-08-20'),
('XYZ789', 'Ford', 'F-150', 2020, 'Black', 'suspected', 3, '2020-03-10');

-- Insertion des casiers judiciaires
INSERT OR IGNORE INTO criminal_records (profile_id, date, charge, description, officer, status) VALUES
(1, '2024-01-15', 'Speeding', 'Exceeding speed limit by 15 mph', 'Whatever Jordan', 'convicted'),
(2, '2024-02-20', 'Theft', 'Shoplifting at convenience store', 'John Doe', 'pending'),
(3, '2023-12-05', 'DUI', 'Driving under influence', 'Jane Smith', 'convicted');

-- Insertion des incidents
INSERT OR IGNORE INTO incidents (title, type, priority, status, location, description, reporting_officer, involved_profiles, involved_units) VALUES
('Shooting in progress', '10-11', 'urgent', 'active', 'Didion Dr', 'Multiple shots fired, possible casualties', 'Whatever Jordan', '[1]', '["123"]'),
('Officer Down', '10-99', 'urgent', 'active', 'Downtown', 'Officer needs immediate assistance', 'Whatever Jordan', '[]', '["456"]'),
('Traffic Stop', '10-38', 'medium', 'resolved', 'Highway 1', 'Routine traffic stop completed', 'John Doe', '[2]', '["456"]');

-- Insertion des rapports
INSERT OR IGNORE INTO reports (type, title, description, officer, involved_profiles, location, status) VALUES
('patrol', 'Routine Patrol Report', 'Patrol of downtown area completed without incident', 'Whatever Jordan', '[]', 'Downtown Los Santos', 'submitted'),
('traffic', 'Traffic Violation Report', 'Issued citation for speeding', 'John Doe', '[1]', 'Highway 1', 'approved');

-- Insertion des appels dispatch
INSERT OR IGNORE INTO dispatch_calls (code, title, description, location, priority, status, responding_units) VALUES
('10-11', 'Shooting in progress', 'Multiple shots fired at Didion Dr', 'Didion Dr', 'urgent', 'responding', '["123"]'),
('10-99', 'Officer Down', 'Officer needs immediate assistance', 'Downtown', 'urgent', 'on-scene', '[]'),
('10-54', 'Possible Dead Body', 'Unresponsive person found', 'Pier', 'high', 'pending', '[]');

-- Insertion des mandats
INSERT OR IGNORE INTO warrants (target_name, target_id, charge, description, issued_by, expires_at, status) VALUES
('John Doe', 1, 'Armed Robbery', 'Suspect wanted for armed robbery of convenience store', 'Whatever Jordan', datetime('now', '+14 days'), 'active'),
('Unknown Suspect', NULL, 'Hit and Run', 'Driver fled scene of accident', 'Jane Smith', datetime('now', '+30 days'), 'active');

-- Insertion des BOLOs
INSERT OR IGNORE INTO bolos (type, subject, description, last_seen, created_by, priority) VALUES
('vehicle', '99AJZ011', 'Blue Toyota Camry involved in hit and run', 'Downtown Los Santos', 'Whatever Jordan', 'high'),
('person', 'Mike Johnson', 'Suspect in armed robbery, considered dangerous', 'Sandy Shores', 'John Doe', 'high');

-- Insertion des annonces
INSERT OR IGNORE INTO announcements (title, content, author, priority, expires_at) VALUES
('System Update', 'MDT system will be updated tonight at 2 AM', 'Whatever Jordan', 'medium', datetime('now', '+7 days')),
('Training Session', 'Mandatory training session this Friday at 3 PM', 'Whatever Jordan', 'high', datetime('now', '+3 days'));

-- Insertion des activités récentes
INSERT OR IGNORE INTO activities (type, category, description, user) VALUES
('updated', 'incidents', 'Updated incident report', 'Whatever Jordan'),
('updated', 'incidents', 'Updated incident status', 'Whatever Jordan'),
('updated', 'profiles', 'Updated citizen profile', 'Whatever Jordan'),
('created', 'reports', 'Created new patrol report', 'Whatever Jordan'),
('updated', 'incidents', 'Updated incident priority', 'Whatever Jordan'),
('updated', 'incidents', 'Added evidence to incident', 'Whatever Jordan');