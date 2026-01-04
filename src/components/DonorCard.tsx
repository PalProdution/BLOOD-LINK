"use client";

import { Donor, getBadgeForDonations, BloodGroup } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { BadgeDisplay } from './BadgeDisplay';
import { MapPin, Phone, Clock, CheckCircle } from 'lucide-react';

interface DonorCardProps {
  donor: Donor;
  distance?: number;
  showContact?: boolean;
  onSelect?: () => void;
}

export function DonorCard({ donor, distance, showContact = false, onSelect }: DonorCardProps) {
  const badge = getBadgeForDonations(donor.donationCount);

  const bloodGroupColors: Record<BloodGroup, string> = {
    'A+': 'bg-red-100 text-red-700 border-red-200',
    'A-': 'bg-red-100 text-red-700 border-red-200',
    'B+': 'bg-blue-100 text-blue-700 border-blue-200',
    'B-': 'bg-blue-100 text-blue-700 border-blue-200',
    'O+': 'bg-green-100 text-green-700 border-green-200',
    'O-': 'bg-green-100 text-green-700 border-green-200',
    'AB+': 'bg-purple-100 text-purple-700 border-purple-200',
    'AB-': 'bg-purple-100 text-purple-700 border-purple-200',
  };

  return (
    <div 
      className={`bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all ${onSelect ? 'cursor-pointer hover:border-primary/50' : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-4">
        <BadgeDisplay donationCount={donor.donationCount} size="sm" showLabel={false} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold truncate">{donor.name}</h3>
            {donor.verified && (
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${bloodGroupColors[donor.bloodGroup]}`}>
              {donor.bloodGroup}
            </span>
            <Badge variant={donor.available ? 'default' : 'secondary'} className="text-xs">
              {donor.available ? 'Available' : 'Unavailable'}
            </Badge>
          </div>

          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p className="flex items-center gap-1">
              <span className="text-xs">{badge.icon}</span>
              {badge.name} • {donor.donationCount} donations
            </p>
            
            {distance !== undefined && (
              <p className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {distance.toFixed(1)} km away
              </p>
            )}

            {donor.lastDonation && (
              <p className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last: {new Date(donor.lastDonation).toLocaleDateString()}
              </p>
            )}

            {showContact && !donor.phoneHidden && donor.phone && (
              <p className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {donor.phone}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
