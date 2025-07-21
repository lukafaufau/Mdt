import { User, Profile, Vehicle, Incident, Report, DispatchCall, Warrant, BOLO, Announcement, Activity } from '../types';

export const mockUsers: User[] = [
  {
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
  },
  {
    id: '2',
    username: 'john.doe',
    firstName: 'John',
    lastName: 'Doe',
    badge: '456',
    callSign: '456',
    rank: 'Officer',
    permission: 'user',
    isActive: false,
    lastLogin: new Date(Date.now() - 30 * 60 * 1000)
  }
];

export const mockProfiles: Profile[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1985-03-15',
    licenseNumber: 'DL123456789',
    fileNumber: 'P001234',
    addresses: [
      {
        id: '1',
        street: '123 Main St',
        city: 'Los Santos',
        zipCode: '90210',
        type: 'primary'
      }
    ],
    vehicles: ['1'],
    criminalRecord: [
      {
        id: '1',
        date: '2024-01-15',
        charge: 'Speeding',
        description: 'Exceeding speed limit by 15 mph',
        officer: 'Whatever Jordan',
        status: 'convicted'
      }
    ]
  }
];

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    plate: '99AJZ011',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    color: 'Blue',
    status: 'clean',
    owner: 'John Doe',
    registrationDate: '2022-05-15'
  },
  {
    id: '2',
    plate: 'ABC123',
    make: 'Honda',
    model: 'Civic',
    year: 2021,
    color: 'Red',
    status: 'stolen',
    owner: 'Jane Smith',
    registrationDate: '2021-08-20'
  }
];

export const mockIncidents: Incident[] = [
  {
    id: '1',
    title: 'Shooting in progress',
    type: '10-11',
    priority: 'urgent',
    status: 'active',
    location: 'Didion Dr',
    description: 'Multiple shots fired, possible casualties',
    reportingOfficer: 'Whatever Jordan',
    involvedProfiles: ['1'],
    involvedUnits: ['123'],
    createdAt: '2024-08-21T10:00:00Z',
    updatedAt: '2024-08-21T10:10:00Z'
  },
  {
    id: '2',
    title: 'Officer Down',
    type: '10-99',
    priority: 'urgent',
    status: 'active',
    location: 'Downtown',
    description: 'Officer needs immediate assistance',
    reportingOfficer: 'Whatever Jordan',
    involvedProfiles: [],
    involvedUnits: ['456'],
    createdAt: '2024-08-21T09:50:00Z',
    updatedAt: '2024-08-21T09:55:00Z'
  }
];

export const mockReports: Report[] = [
  {
    id: '1',
    type: 'patrol',
    title: 'Routine Patrol Report',
    description: 'Patrol of downtown area completed without incident',
    officer: 'Whatever Jordan',
    involvedProfiles: [],
    location: 'Downtown Los Santos',
    createdAt: '2024-08-21T08:00:00Z',
    status: 'submitted'
  }
];

export const mockDispatchCalls: DispatchCall[] = [
  {
    id: '1',
    code: '10-11',
    title: 'Shooting in progress',
    description: 'Multiple shots fired at Didion Dr',
    location: 'Didion Dr',
    priority: 'urgent',
    status: 'responding',
    createdAt: '2024-08-21T10:00:00Z',
    respondingUnits: ['123']
  },
  {
    id: '2',
    code: '10-99',
    title: 'Officer Down',
    description: 'Officer needs immediate assistance',
    location: 'Downtown',
    priority: 'urgent',
    status: 'on-scene',
    createdAt: '2024-08-21T09:50:00Z',
    respondingUnits: []
  }
];

export const mockWarrants: Warrant[] = [
  {
    id: '1',
    targetName: 'John Doe',
    targetId: '1',
    charge: 'Armed Robbery',
    description: 'Suspect wanted for armed robbery of convenience store',
    issuedBy: 'Whatever Jordan',
    issuedAt: '2024-08-15T10:00:00Z',
    expiresAt: '2024-08-29T10:00:00Z',
    status: 'active'
  }
];

export const mockBOLOs: BOLO[] = [
  {
    id: '1',
    type: 'vehicle',
    subject: '99AJZ011',
    description: 'Blue Toyota Camry involved in hit and run',
    lastSeen: 'Downtown Los Santos',
    createdBy: 'Whatever Jordan',
    createdAt: '2024-08-21T09:00:00Z',
    priority: 'high'
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'System Update',
    content: 'MDT system will be updated tonight at 2 AM',
    author: 'Whatever Jordan',
    createdAt: '2024-08-21T08:00:00Z',
    expiresAt: '2024-08-28T08:00:00Z',
    priority: 'medium'
  }
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'updated',
    category: 'incidents',
    description: 'Updated incident report',
    user: 'Whatever Jordan',
    timestamp: '2024-08-21T10:10:00Z'
  },
  {
    id: '2',
    type: 'updated',
    category: 'incidents',
    description: 'Updated incident status',
    user: 'Whatever Jordan',
    timestamp: '2024-08-21T10:01:00Z'
  },
  {
    id: '3',
    type: 'updated',
    category: 'profiles',
    description: 'Updated citizen profile',
    user: 'Whatever Jordan',
    timestamp: '2024-08-21T09:59:00Z'
  },
  {
    id: '4',
    type: 'created',
    category: 'reports',
    description: 'Created new patrol report',
    user: 'Whatever Jordan',
    timestamp: '2024-08-21T09:45:00Z'
  },
  {
    id: '5',
    type: 'updated',
    category: 'incidents',
    description: 'Updated incident priority',
    user: 'Whatever Jordan',
    timestamp: '2024-08-21T09:45:00Z'
  },
  {
    id: '6',
    type: 'updated',
    category: 'incidents',
    description: 'Added evidence to incident',
    user: 'Whatever Jordan',
    timestamp: '2024-08-21T09:34:00Z'
  }
];