import { Donor, Hospital, Donation, BloodGroup, getBadgeForDonations, BadgeLevel } from './types';

const USERS_KEY = 'bloodlink_users';
const DONATIONS_KEY = 'bloodlink_donations';
const CURRENT_USER_KEY = 'bloodlink_current_user';

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getUsers(): (Donor | Hospital)[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveUsers(users: (Donor | Hospital)[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getDonations(): Donation[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(DONATIONS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveDonations(donations: Donation[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
}

export function getCurrentUser(): Donor | Hospital | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: Donor | Hospital | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function registerDonor(
  email: string,
  password: string,
  name: string,
  bloodGroup: BloodGroup,
  phone?: string
): Donor | null {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return null;
  }
  const donor: Donor = {
    id: generateId(),
    email,
    role: 'donor',
    name,
    bloodGroup,
    phone,
    available: true,
    donationCount: 0,
    badgeLevel: 0 as BadgeLevel,
    verified: false,
    locationHidden: false,
    phoneHidden: true,
    createdAt: new Date().toISOString(),
  };
  users.push(donor);
  saveUsers(users);
  setCurrentUser(donor);
  return donor;
}

export function registerHospital(
  email: string,
  password: string,
  name: string,
  hospitalName: string,
  address: string
): Hospital | null {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return null;
  }
  const hospital: Hospital = {
    id: generateId(),
    email,
    role: 'hospital',
    name,
    hospitalName,
    address,
    createdAt: new Date().toISOString(),
  };
  users.push(hospital);
  saveUsers(users);
  setCurrentUser(hospital);
  return hospital;
}

export function login(email: string, password: string): Donor | Hospital | null {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (user) {
    setCurrentUser(user);
    return user;
  }
  return null;
}

export function logout(): void {
  setCurrentUser(null);
}

export function updateDonor(donorId: string, updates: Partial<Donor>): Donor | null {
  const users = getUsers();
  const index = users.findIndex(u => u.id === donorId);
  if (index === -1) return null;
  const updated = { ...users[index], ...updates } as Donor;
  users[index] = updated;
  saveUsers(users);
  const current = getCurrentUser();
  if (current && current.id === donorId) {
    setCurrentUser(updated);
  }
  return updated;
}

export function updateHospital(hospitalId: string, updates: Partial<Hospital>): Hospital | null {
  const users = getUsers();
  const index = users.findIndex(u => u.id === hospitalId);
  if (index === -1) return null;
  const updated = { ...users[index], ...updates } as Hospital;
  users[index] = updated;
  saveUsers(users);
  const current = getCurrentUser();
  if (current && current.id === hospitalId) {
    setCurrentUser(updated);
  }
  return updated;
}

export function getDonors(): Donor[] {
  return getUsers().filter((u): u is Donor => u.role === 'donor');
}

export function getHospitals(): Hospital[] {
  return getUsers().filter((u): u is Hospital => u.role === 'hospital');
}

export function createDonation(donorId: string, hospitalId: string): Donation | null {
  const users = getUsers();
  const donor = users.find(u => u.id === donorId) as Donor | undefined;
  const hospital = users.find(u => u.id === hospitalId) as Hospital | undefined;
  if (!donor || !hospital) return null;
  
  const donations = getDonations();
  const donation: Donation = {
    id: generateId(),
    donorId,
    hospitalId,
    hospitalName: hospital.hospitalName,
    donorName: donor.name,
    status: 'pending',
    timestamp: new Date().toISOString(),
  };
  donations.push(donation);
  saveDonations(donations);
  return donation;
}

export function verifyDonation(donationId: string): Donation | null {
  const donations = getDonations();
  const index = donations.findIndex(d => d.id === donationId);
  if (index === -1) return null;
  
  donations[index].status = 'verified';
  donations[index].verifiedAt = new Date().toISOString();
  saveDonations(donations);
  
  const donorId = donations[index].donorId;
  const users = getUsers();
  const donorIndex = users.findIndex(u => u.id === donorId);
  if (donorIndex !== -1 && users[donorIndex].role === 'donor') {
    const donor = users[donorIndex] as Donor;
    donor.donationCount += 1;
    donor.badgeLevel = getBadgeForDonations(donor.donationCount).level;
    donor.lastDonation = new Date().toISOString();
    donor.verified = true;
    users[donorIndex] = donor;
    saveUsers(users);
  }
  
  return donations[index];
}

export function getDonorDonations(donorId: string): Donation[] {
  return getDonations().filter(d => d.donorId === donorId);
}

export function getHospitalDonations(hospitalId: string): Donation[] {
  return getDonations().filter(d => d.hospitalId === hospitalId);
}

export function getPendingDonations(): Donation[] {
  return getDonations().filter(d => d.status === 'pending');
}

export function initializeMockData(): void {
  if (typeof window === 'undefined') return;
  const users = getUsers();
  if (users.length > 0) return;
  
  const mockDonors: Donor[] = [
    {
      id: 'donor1',
      email: 'john@example.com',
      role: 'donor',
      name: 'John Smith',
      bloodGroup: 'O+',
      phone: '+1234567890',
      available: true,
      donationCount: 5,
      badgeLevel: 3,
      verified: true,
      lastDonation: '2024-12-01',
      lat: 40.7128,
      lng: -74.0060,
      locationHidden: false,
      phoneHidden: false,
      createdAt: '2024-01-15',
    },
    {
      id: 'donor2',
      email: 'jane@example.com',
      role: 'donor',
      name: 'Jane Doe',
      bloodGroup: 'A-',
      phone: '+1234567891',
      available: true,
      donationCount: 12,
      badgeLevel: 4,
      verified: true,
      lastDonation: '2024-11-20',
      lat: 40.7580,
      lng: -73.9855,
      locationHidden: false,
      phoneHidden: true,
      createdAt: '2023-06-10',
    },
    {
      id: 'donor3',
      email: 'bob@example.com',
      role: 'donor',
      name: 'Bob Wilson',
      bloodGroup: 'B+',
      available: false,
      donationCount: 2,
      badgeLevel: 1,
      verified: true,
      lastDonation: '2024-10-15',
      lat: 40.6892,
      lng: -74.0445,
      locationHidden: false,
      phoneHidden: true,
      createdAt: '2024-03-20',
    },
    {
      id: 'donor4',
      email: 'sarah@example.com',
      role: 'donor',
      name: 'Sarah Johnson',
      bloodGroup: 'AB+',
      phone: '+1234567893',
      available: true,
      donationCount: 25,
      badgeLevel: 5,
      verified: true,
      lastDonation: '2024-12-10',
      lat: 40.7484,
      lng: -73.9857,
      locationHidden: false,
      phoneHidden: false,
      createdAt: '2022-01-01',
    },
    {
      id: 'donor5',
      email: 'mike@example.com',
      role: 'donor',
      name: 'Mike Brown',
      bloodGroup: 'O-',
      available: true,
      donationCount: 0,
      badgeLevel: 0 as BadgeLevel,
      verified: false,
      lat: 40.7306,
      lng: -73.9352,
      locationHidden: false,
      phoneHidden: true,
      createdAt: '2024-12-01',
    },
  ];
  
  const mockHospitals: Hospital[] = [
    {
      id: 'hospital1',
      email: 'cityhospital@example.com',
      role: 'hospital',
      name: 'Admin',
      hospitalName: 'City General Hospital',
      address: '123 Medical Center Drive, New York, NY',
      lat: 40.7128,
      lng: -74.0060,
      createdAt: '2023-01-01',
    },
    {
      id: 'hospital2',
      email: 'mercy@example.com',
      role: 'hospital',
      name: 'Admin',
      hospitalName: 'Mercy Medical Center',
      address: '456 Healthcare Ave, Brooklyn, NY',
      lat: 40.6782,
      lng: -73.9442,
      createdAt: '2023-03-15',
    },
  ];
  
  const allUsers = [...mockDonors, ...mockHospitals];
  saveUsers(allUsers);
  
  const mockDonations: Donation[] = [
    {
      id: 'donation1',
      donorId: 'donor1',
      hospitalId: 'hospital1',
      hospitalName: 'City General Hospital',
      donorName: 'John Smith',
      status: 'verified',
      timestamp: '2024-12-01T10:00:00Z',
      verifiedAt: '2024-12-01T12:00:00Z',
    },
    {
      id: 'donation2',
      donorId: 'donor2',
      hospitalId: 'hospital1',
      hospitalName: 'City General Hospital',
      donorName: 'Jane Doe',
      status: 'pending',
      timestamp: '2024-12-15T14:00:00Z',
    },
  ];
  saveDonations(mockDonations);
}
