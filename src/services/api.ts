const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const USE_SUPABASE = import.meta.env.VITE_SUPABASE_URL;
const USE_MOCK_DATA = !USE_SUPABASE && !import.meta.env.VITE_API_URL;

// Import Supabase service
import { SupabaseService } from './supabase';

class APIService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('mdt_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    // Si on utilise Supabase, rediriger vers les services Supabase
    if (USE_SUPABASE) {
      return this.supabaseRequest(endpoint, options);
    }

    // Si on utilise les données mockées, simuler les réponses
    if (USE_MOCK_DATA) {
      return this.mockRequest(endpoint, options);
    }

    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur API');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  }

  private async supabaseRequest(endpoint: string, options: RequestInit = {}) {
    const method = options.method || 'GET';
    
    try {
      // Router vers les bonnes méthodes Supabase selon l'endpoint
      switch (endpoint) {
        case '/dashboard/activities':
          return await SupabaseService.getRecentActivities();
        
        case '/dashboard/warrants':
          return await SupabaseService.getActiveWarrants();
        
        case '/dashboard/announcements':
          return await SupabaseService.getActiveAnnouncements();
        
        case '/dashboard/bolos':
          return await SupabaseService.getActiveBOLOs();
        
        case '/dashboard/dispatch':
          return await SupabaseService.getDispatchCalls();
        
        default:
          if (endpoint.startsWith('/profiles/search')) {
            const query = new URL(`http://localhost${endpoint}`).searchParams.get('q') || '';
            return await SupabaseService.searchProfiles(query);
          }
          if (endpoint.startsWith('/vehicles/search')) {
            const query = new URL(`http://localhost${endpoint}`).searchParams.get('q') || '';
            return await SupabaseService.searchVehicles(query);
          }
          if (endpoint === '/incidents') {
            const status = new URL(`http://localhost${endpoint}`).searchParams.get('status') || undefined;
            return await SupabaseService.getIncidents(status);
          }
          if (endpoint === '/incidents' && method === 'POST') {
            const body = JSON.parse(options.body as string);
            return await SupabaseService.createIncident(body);
          }
          
          return [];
      }
    } catch (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  }

  private async mockRequest(endpoint: string, options: RequestInit = {}) {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));

    const method = options.method || 'GET';
    
    // Simuler les réponses selon l'endpoint
    if (endpoint === '/auth/login' && method === 'POST') {
      const body = JSON.parse(options.body as string);
      if (body.username === 'whatever.jordan' && body.password === 'password') {
        const mockUser = {
          id: '1',
          username: 'whatever.jordan',
          firstName: 'Whatever',
          lastName: 'Jordan',
          badge: '123',
          callSign: '123',
          rank: 'Chief',
          permission: 'admin',
          isActive: true,
          lastLogin: new Date(),
          attachedUnit: '123'
        };
        return { token: 'mock-jwt-token', user: mockUser };
      } else {
        throw new Error('Invalid credentials');
      }
    }

    if (endpoint === '/auth/logout') {
      return { message: 'Logged out successfully' };
    }

    // Importer les données mockées
    const { mockActivities, mockUsers, mockWarrants, mockAnnouncements, mockBOLOs, mockDispatchCalls, mockProfiles, mockVehicles } = await import('../data/mockData');

    switch (endpoint) {
      case '/dashboard/activities':
        return mockActivities;
      case '/dashboard/active-users':
        return mockUsers.filter(u => u.isActive);
      case '/dashboard/warrants':
        return mockWarrants.filter(w => w.status === 'active');
      case '/dashboard/announcements':
        return mockAnnouncements;
      case '/dashboard/bolos':
        return mockBOLOs;
      case '/dashboard/dispatch':
        return mockDispatchCalls;
      default:
        if (endpoint.startsWith('/profiles/search')) {
          const query = new URL(`http://localhost${endpoint}`).searchParams.get('q') || '';
          return mockProfiles.filter(p => 
            p.firstName.toLowerCase().includes(query.toLowerCase()) ||
            p.lastName.toLowerCase().includes(query.toLowerCase()) ||
            p.licenseNumber.toLowerCase().includes(query.toLowerCase()) ||
            p.fileNumber.toLowerCase().includes(query.toLowerCase())
          );
        }
        if (endpoint.startsWith('/vehicles/search')) {
          const query = new URL(`http://localhost${endpoint}`).searchParams.get('q') || '';
          return mockVehicles.filter(v => 
            v.plate.toLowerCase().includes(query.toLowerCase()) ||
            v.make.toLowerCase().includes(query.toLowerCase()) ||
            v.model.toLowerCase().includes(query.toLowerCase())
          );
        }
        return [];
    }
  }
  // Authentification
  async login(username: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    this.token = response.token;
    localStorage.setItem('mdt_token', response.token);
    
    return response.user;
  }

  async logout() {
    if (this.token) {
      await this.request('/auth/logout', { method: 'POST' });
    }
    
    this.token = null;
    localStorage.removeItem('mdt_token');
  }

  // Dashboard
  async getDashboardActivities() {
    return this.request('/dashboard/activities');
  }

  async getActiveUsers() {
    return this.request('/dashboard/active-users');
  }

  async getActiveWarrants() {
    return this.request('/dashboard/warrants');
  }

  async getActiveAnnouncements() {
    return this.request('/dashboard/announcements');
  }

  async getActiveBOLOs() {
    return this.request('/dashboard/bolos');
  }

  async getDispatchCalls() {
    return this.request('/dashboard/dispatch');
  }

  // Profils
  async searchProfiles(query: string) {
    if (USE_SUPABASE) {
      return SupabaseService.searchProfiles(query);
    }
    return this.request(`/profiles/search?q=${encodeURIComponent(query)}`);
  }

  async getProfile(id: string) {
    if (USE_SUPABASE) {
      return SupabaseService.getProfile(id);
    }
    return this.request(`/profiles/${id}`);
  }

  async createProfile(profileData: any) {
    if (USE_SUPABASE) {
      return SupabaseService.createProfile(profileData);
    }
    return this.request('/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }
  // Véhicules
  async searchVehicles(query: string) {
    if (USE_SUPABASE) {
      return SupabaseService.searchVehicles(query);
    }
    return this.request(`/vehicles/search?q=${encodeURIComponent(query)}`);
  }

  async createVehicle(vehicleData: any) {
    if (USE_SUPABASE) {
      return SupabaseService.createVehicle(vehicleData);
    }
    return this.request('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }
  // Incidents
  async getIncidents(status?: string) {
    if (USE_SUPABASE) {
      return SupabaseService.getIncidents(status);
    }
    const params = status ? `?status=${status}` : '';
    return this.request(`/incidents${params}`);
  }

  async createIncident(incidentData: any) {
    if (USE_SUPABASE) {
      return SupabaseService.createIncident(incidentData);
    }
    return this.request('/incidents', {
      method: 'POST',
      body: JSON.stringify(incidentData),
    });
  }

  // Mandats
  async createWarrant(warrantData: any) {
    if (USE_SUPABASE) {
      return SupabaseService.createWarrant(warrantData);
    }
    return this.request('/warrants', {
      method: 'POST',
      body: JSON.stringify(warrantData),
    });
  }

  // BOLOs
  async createBOLO(boloData: any) {
    if (USE_SUPABASE) {
      return SupabaseService.createBOLO(boloData);
    }
    return this.request('/bolos', {
      method: 'POST',
      body: JSON.stringify(boloData),
    });
  }

  // Annonces
  async createAnnouncement(announcementData: any) {
    if (USE_SUPABASE) {
      return SupabaseService.createAnnouncement(announcementData);
    }
    return this.request('/announcements', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
  }

  // Dispatch
  async createDispatchCall(callData: any) {
    if (USE_SUPABASE) {
      return SupabaseService.createDispatchCall(callData);
    }
    return this.request('/dispatch', {
      method: 'POST',
      body: JSON.stringify(callData),
    });
  }

  // Casier judiciaire
  async addCriminalRecord(recordData: any) {
    if (USE_SUPABASE) {
      return SupabaseService.addCriminalRecord(recordData);
    }
    return this.request('/criminal-records', {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
  }
}

export const apiService = new APIService();