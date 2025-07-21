// Service API simplifié pour l'application MDT
class APIService {
  private mockData = {
    profiles: [
      {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        date_of_birth: '1985-03-15',
        license_number: 'DL123456789',
        file_number: 'P001234',
        criminal_records: [],
        vehicles: []
      }
    ],
    activities: [],
    warrants: [],
    announcements: [],
    bolos: [],
    dispatch_calls: []
  };

  // Simuler un délai réseau
  private async delay(ms: number = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Authentification
  async login(username: string, password: string) {
    await this.delay();
    
    if (username === 'whatever.jordan' && password === 'password') {
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
      return mockUser;
    } else {
      throw new Error('Invalid credentials');
    }
  }

  async logout() {
    await this.delay();
    return { message: 'Logged out successfully' };
  }

  // Dashboard
  async getDashboardActivities() {
    await this.delay();
    return this.mockData.activities;
  }

  async getActiveUsers() {
    await this.delay();
    return [];
  }

  async getActiveWarrants() {
    await this.delay();
    return this.mockData.warrants;
  }

  async getActiveAnnouncements() {
    await this.delay();
    return this.mockData.announcements;
  }

  async getActiveBOLOs() {
    await this.delay();
    return this.mockData.bolos;
  }

  async getDispatchCalls() {
    await this.delay();
    return this.mockData.dispatch_calls;
  }

  // Profils
  async searchProfiles(query: string) {
    await this.delay();
    return this.mockData.profiles.filter(p => 
      p.first_name.toLowerCase().includes(query.toLowerCase()) ||
      p.last_name.toLowerCase().includes(query.toLowerCase()) ||
      (p.license_number && p.license_number.toLowerCase().includes(query.toLowerCase())) ||
      p.file_number.toLowerCase().includes(query.toLowerCase())
    );
  }

  async createProfile(profileData: any) {
    await this.delay();
    const newProfile = {
      id: Date.now().toString(),
      ...profileData,
      criminal_records: [],
      vehicles: []
    };
    this.mockData.profiles.push(newProfile);
    return newProfile;
  }
}

export const apiService = new APIService();