// Types pour l'application MDT

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  badge: string;
  callSign: string;
  rank: string;
  permission: 'admin' | 'user';
  isActive: boolean;
  lastLogin?: Date;
  attachedUnit?: string;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  license_number?: string;
  file_number: string;
  photo_url?: string;
  criminal_records?: CriminalRecord[];
  vehicles?: Vehicle[];
}

export interface CriminalRecord {
  id: string;
  date: string;
  charge: string;
  description: string;
  officer: string;
  status: 'pending' | 'convicted' | 'dismissed';
}

export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  color: string;
  status: 'clean' | 'stolen' | 'suspected' | 'wanted';
  owner?: string;
  registration_date: string;
}

export interface Activity {
  id: string;
  type: 'created' | 'updated' | 'deleted';
  category: string;
  description: string;
  user: string;
  timestamp: string;
}