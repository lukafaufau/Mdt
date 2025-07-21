import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour les données
export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  license_number: string;
  file_number: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  color: string;
  status: 'clean' | 'stolen' | 'suspected' | 'wanted';
  owner_id?: string;
  registration_date: string;
  created_at: string;
  updated_at: string;
}

export interface Incident {
  id: string;
  title: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'resolved' | 'pending';
  location: string;
  description?: string;
  reporting_officer: string;
  involved_profiles: string[];
  involved_units: string[];
  created_at: string;
  updated_at: string;
}

export interface CriminalRecord {
  id: string;
  profile_id: string;
  date: string;
  charge: string;
  description?: string;
  officer: string;
  status: 'pending' | 'convicted' | 'dismissed';
  created_at: string;
}

export interface Address {
  id: string;
  profile_id: string;
  street: string;
  city: string;
  zip_code: string;
  type: 'primary' | 'secondary';
  created_at: string;
}

export interface Warrant {
  id: string;
  target_name: string;
  target_id?: string;
  charge: string;
  description?: string;
  issued_by: string;
  issued_at: string;
  expires_at: string;
  status: 'active' | 'executed' | 'expired';
}

export interface BOLO {
  id: string;
  type: 'person' | 'vehicle';
  subject: string;
  description: string;
  last_seen?: string;
  created_by: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  priority: 'low' | 'medium' | 'high';
  expires_at: string;
  created_at: string;
}

export interface Activity {
  id: string;
  type: 'created' | 'updated' | 'deleted';
  category: string;
  description: string;
  user_name: string;
  timestamp: string;
}

export interface DispatchCall {
  id: string;
  code: string;
  title: string;
  description?: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'responding' | 'on-scene' | 'resolved';
  responding_units: string[];
  created_at: string;
  updated_at: string;
}

// Services pour les données
export class SupabaseService {
  // Profils
  static async searchProfiles(query: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        addresses(*),
        criminal_records(*),
        vehicles(*)
      `)
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,license_number.ilike.%${query}%,file_number.ilike.%${query}%`)
      .order('last_name');

    if (error) throw error;
    return data;
  }

  static async createProfile(profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) throw error;

    // Log l'activité
    await this.logActivity('created', 'profiles', `Created profile: ${profileData.first_name} ${profileData.last_name}`, 'System');
    
    return data;
  }

  static async getProfile(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        addresses(*),
        criminal_records(*),
        vehicles(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Véhicules
  static async searchVehicles(query: string) {
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        profiles(first_name, last_name)
      `)
      .or(`plate.ilike.%${query}%,make.ilike.%${query}%,model.ilike.%${query}%`)
      .order('plate');

    if (error) throw error;
    return data;
  }

  static async createVehicle(vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('vehicles')
      .insert(vehicleData)
      .select()
      .single();

    if (error) throw error;

    await this.logActivity('created', 'vehicles', `Created vehicle: ${vehicleData.plate}`, 'System');
    
    return data;
  }

  // Incidents
  static async getIncidents(status?: string) {
    let query = supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async createIncident(incidentData: Omit<Incident, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('incidents')
      .insert(incidentData)
      .select()
      .single();

    if (error) throw error;

    await this.logActivity('created', 'incidents', `Created incident: ${incidentData.title}`, incidentData.reporting_officer);
    
    return data;
  }

  // Mandats
  static async getActiveWarrants() {
    const { data, error } = await supabase
      .from('warrants')
      .select('*')
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .order('issued_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createWarrant(warrantData: Omit<Warrant, 'id' | 'issued_at'>) {
    const { data, error } = await supabase
      .from('warrants')
      .insert(warrantData)
      .select()
      .single();

    if (error) throw error;

    await this.logActivity('created', 'warrants', `Created warrant for: ${warrantData.target_name}`, warrantData.issued_by);
    
    return data;
  }

  // BOLOs
  static async getActiveBOLOs() {
    const { data, error } = await supabase
      .from('bolos')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createBOLO(boloData: Omit<BOLO, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('bolos')
      .insert(boloData)
      .select()
      .single();

    if (error) throw error;

    await this.logActivity('created', 'bolos', `Created BOLO: ${boloData.subject}`, boloData.created_by);
    
    return data;
  }

  // Annonces
  static async getActiveAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .gt('expires_at', new Date().toISOString())
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createAnnouncement(announcementData: Omit<Announcement, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('announcements')
      .insert(announcementData)
      .select()
      .single();

    if (error) throw error;

    await this.logActivity('created', 'announcements', `Created announcement: ${announcementData.title}`, announcementData.author);
    
    return data;
  }

  // Dispatch
  static async getDispatchCalls(status?: string) {
    let query = supabase
      .from('dispatch_calls')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async createDispatchCall(callData: Omit<DispatchCall, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('dispatch_calls')
      .insert(callData)
      .select()
      .single();

    if (error) throw error;

    await this.logActivity('created', 'dispatch', `Created dispatch call: ${callData.code} - ${callData.title}`, 'Dispatch');
    
    return data;
  }

  // Activités
  static async getRecentActivities(limit = 10) {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  static async logActivity(type: 'created' | 'updated' | 'deleted', category: string, description: string, userName: string) {
    const { error } = await supabase
      .from('activities')
      .insert({
        type,
        category,
        description,
        user_name: userName
      });

    if (error) console.error('Error logging activity:', error);
  }

  // Casier judiciaire
  static async addCriminalRecord(recordData: Omit<CriminalRecord, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('criminal_records')
      .insert(recordData)
      .select()
      .single();

    if (error) throw error;

    await this.logActivity('created', 'criminal_records', `Added criminal record: ${recordData.charge}`, recordData.officer);
    
    return data;
  }

  // Adresses
  static async addAddress(addressData: Omit<Address, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('addresses')
      .insert(addressData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}