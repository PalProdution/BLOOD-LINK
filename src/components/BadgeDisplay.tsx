"use client";

import { getBadgeForDonations } from '@/lib/types';

interface BadgeDisplayProps {
  donationCount: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function BadgeDisplay({ donationCount, size = 'md', showLabel = true }: BadgeDisplayProps) {
  const badge = getBadgeForDonations(donationCount);

  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
  };

  const labelSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center shadow-lg`}
        style={{ 
          background: `linear-gradient(135deg, ${badge.color} 0%, ${badge.color}CC 100%)`,
          border: `2px solid ${badge.color}` 
        }}
      >
        <span>{badge.icon}</span>
      </div>
      {showLabel && (
        <div className="text-center">
          <p className={`font-semibold ${labelSizes[size]}`}>{badge.name}</p>
          {badge.level > 0 && (
            <p className="text-muted-foreground text-xs">Level {badge.level}</p>
          )}
        </div>
      )}
    </div>
  );
}
