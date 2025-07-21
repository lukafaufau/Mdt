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
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  licenseNumber: string;
  fileNumber: string;
  photo?: string;
  addresses: Address[];
  vehicles: Vehicle[];
  criminalRecord: CriminalRecord[];
  medicalRecord?: MedicalRecord;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  zipCode: string;
  type: 'primary' | 'secondary';
}

export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  color: string;
  status: 'clean' | 'stolen' | 'suspected' | 'wanted';
  owner: string;
  registrationDate: string;
}

export interface CriminalRecord {
  id: string;
  date: string;
  charge: string;
  description: string;
  officer: string;
  status: 'pending' | 'convicted' | 'dismissed';
}

export interface MedicalRecord {
  id: string;
  conditions: string[];
  medications: string[];
  allergies: string[];
  emergencyContact: string;
}

export interface Incident {
  id: string;
  title: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'resolved' | 'pending';
  location: string;
  description: string;
  reportingOfficer: string;
  involvedProfiles: string[];
  involvedUnits: string[];
  createdAt: string;
  updatedAt: string;
  evidence?: Evidence[];
}

export interface Evidence {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  description: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Report {
  id: string;
  type: 'patrol' | 'incident' | 'arrest' | 'traffic';
  title: string;
  description: string;
  officer: string;
  involvedProfiles: string[];
  location: string;
  createdAt: string;
  status: 'draft' | 'submitted' | 'approved';
}

export interface DispatchCall {
  id: string;
  code: string;
  title: string;
  description: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'responding' | 'on-scene' | 'resolved';
  createdAt: string;
  respondingUnits: string[];
}

export interface Warrant {
  id: string;
  targetName: string;
  targetId: string;
  charge: string;
  description: string;
  issuedBy: string;
  issuedAt: string;
  expiresAt: string;
  status: 'active' | 'executed' | 'expired';
}

export interface BOLO {
  id: string;
  type: 'person' | 'vehicle';
  subject: string;
  description: string;
  lastSeen?: string;
  createdBy: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  expiresAt: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Activity {
  id: string;
  type: 'created' | 'updated' | 'deleted';
  category: 'incidents' | 'reports' | 'profiles' | 'vehicles' | 'warrants';
  description: string;
  user: string;
  timestamp: string;
}