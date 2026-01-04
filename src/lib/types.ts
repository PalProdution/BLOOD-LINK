export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export type UserRole = 'donor' | 'hospital';

export type BadgeLevel = 1 | 2 | 3 | 4 | 5;

export interface BadgeInfo {
  level: BadgeLevel;
  name: string;
  minDonations: number;
  color: string;
  icon: string;
}

export const BADGE_LEVELS: BadgeInfo[] = [
  { level: 1, name: 'Life Starter', minDonations: 1, color: '#CD7F32', icon: '🌱' },
  { level: 2, name: 'Life Saver', minDonations: 3, color: '#C0C0C0', icon: '💪' },
  { level: 3, name: 'Hero', minDonations: 5, color: '#FFD700', icon: '⭐' },
  { level: 4, name: 'Guardian', minDonations: 10, color: '#E5E4E2', icon: '🛡️' },
  { level: 5, name: 'Legend', minDonations: 20, color: '#B9F2FF', icon: '👑' },
];

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
}

export interface Donor extends User {
  role: 'donor';
  bloodGroup: BloodGroup;
  phone?: string;
  available: boolean;
  donationCount: number;
  badgeLevel: BadgeLevel;
  verified: boolean;
  lastDonation?: string;
  lat?: number;
  lng?: number;
  locationHidden: boolean;
  phoneHidden: boolean;
}

export interface Hospital extends User {
  role: 'hospital';
  hospitalName: string;
  address: string;
  lat?: number;
  lng?: number;
}

export type DonationStatus = 'pending' | 'verified';

export interface Donation {
  id: string;
  donorId: string;
  hospitalId: string;
  hospitalName: string;
  donorName: string;
  status: DonationStatus;
  timestamp: string;
  verifiedAt?: string;
}

export function getBadgeForDonations(count: number): BadgeInfo {
  const sorted = [...BADGE_LEVELS].sort((a, b) => b.minDonations - a.minDonations);
  for (const badge of sorted) {
    if (count >= badge.minDonations) {
      return badge;
    }
  }
  return { level: 0 as BadgeLevel, name: 'New Donor', minDonations: 0, color: '#9CA3AF', icon: '🩸' };
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
