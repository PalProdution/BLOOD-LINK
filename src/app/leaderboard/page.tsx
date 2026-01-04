"use client";

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDonors } from '@/lib/store';
import { Donor, getBadgeForDonations, BloodGroup } from '@/lib/types';
import { Trophy, Medal, Award, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allDonors = getDonors();
    const sorted = allDonors
      .filter(d => d.donationCount > 0)
      .sort((a, b) => b.donationCount - a.donationCount);
    setDonors(sorted);
    setLoading(false);
  }, []);

  const bloodGroupColors: Record<BloodGroup, string> = {
    'A+': 'bg-red-100 text-red-700',
    'A-': 'bg-red-100 text-red-700',
    'B+': 'bg-blue-100 text-blue-700',
    'B-': 'bg-blue-100 text-blue-700',
    'O+': 'bg-green-100 text-green-700',
    'O-': 'bg-green-100 text-green-700',
    'AB+': 'bg-purple-100 text-purple-700',
    'AB-': 'bg-purple-100 text-purple-700',
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">#{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
    if (rank === 3) return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
    return 'bg-card';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-10 bg-gradient-to-br from-red-50/50 via-white to-red-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full mb-4">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">Hall of Heroes</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Donor Leaderboard</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Celebrating our top blood donors who are making a difference in their communities.
            </p>
          </motion.div>

          {donors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {donors.slice(0, 3).map((donor, index) => {
                const badge = getBadgeForDonations(donor.donationCount);
                const rank = index + 1;
                return (
                  <motion.div
                    key={donor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`${getRankBg(rank)} border-2 ${rank === 1 ? 'md:-mt-4 md:scale-105' : ''}`}>
                      <CardContent className="pt-6 text-center">
                        <div className="mb-4">
                          {getRankIcon(rank)}
                        </div>
                        <div 
                          className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl shadow-lg mb-3"
                          style={{ 
                            background: `linear-gradient(135deg, ${badge.color} 0%, ${badge.color}CC 100%)`,
                            border: `3px solid ${badge.color}` 
                          }}
                        >
                          {badge.icon}
                        </div>
                        <h3 className="font-bold text-lg">{donor.name}</h3>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${bloodGroupColors[donor.bloodGroup]}`}>
                            {donor.bloodGroup}
                          </span>
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-1 text-primary">
                          <Heart className="w-5 h-5 fill-primary" />
                          <span className="text-2xl font-bold">{donor.donationCount}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{badge.name}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                All-Time Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {donors.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No donations recorded yet.</p>
                  <p className="text-sm">Be the first to make a difference!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {donors.map((donor, index) => {
                    const badge = getBadgeForDonations(donor.donationCount);
                    const rank = index + 1;
                    return (
                      <motion.div
                        key={donor.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center gap-4 p-3 rounded-lg border ${getRankBg(rank)}`}
                      >
                        <div className="w-8 flex justify-center">
                          {getRankIcon(rank)}
                        </div>
                        
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow flex-shrink-0"
                          style={{ 
                            background: `linear-gradient(135deg, ${badge.color} 0%, ${badge.color}CC 100%)`,
                            border: `2px solid ${badge.color}` 
                          }}
                        >
                          {badge.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold truncate">{donor.name}</p>
                            <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${bloodGroupColors[donor.bloodGroup]}`}>
                              {donor.bloodGroup}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{badge.name}</p>
                        </div>
                        
                        <div className="flex items-center gap-1 text-primary font-bold">
                          <Heart className="w-4 h-4 fill-primary" />
                          {donor.donationCount}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
