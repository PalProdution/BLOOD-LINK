"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import { useAuth } from '@/lib/auth-context';
import { updateDonor, getDonorDonations } from '@/lib/store';
import { Donor, Donation, getBadgeForDonations, BADGE_LEVELS } from '@/lib/types';
import { 
  Heart, MapPin, Clock, Award, Eye, EyeOff, Phone, 
  CheckCircle, AlertCircle, Calendar, TrendingUp, Shield
} from 'lucide-react';

export default function DonorDashboard() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [donor, setDonor] = useState<Donor | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/dashboard/donor');
      return;
    }
    if (user && user.role !== 'donor') {
      router.push('/dashboard/hospital');
      return;
    }
    if (user && user.role === 'donor') {
      setDonor(user as Donor);
      setDonations(getDonorDonations(user.id));
    }
  }, [user, loading, router]);

  const handleAvailabilityToggle = () => {
    if (!donor) return;
    const updated = updateDonor(donor.id, { available: !donor.available });
    if (updated) {
      setDonor(updated);
      refreshUser();
    }
  };

  const handleLocationVisibilityToggle = () => {
    if (!donor) return;
    const updated = updateDonor(donor.id, { locationHidden: !donor.locationHidden });
    if (updated) {
      setDonor(updated);
      refreshUser();
    }
  };

  const handlePhoneVisibilityToggle = () => {
    if (!donor) return;
    const updated = updateDonor(donor.id, { phoneHidden: !donor.phoneHidden });
    if (updated) {
      setDonor(updated);
      refreshUser();
    }
  };

  const handleUpdateLocation = () => {
    if (!donor) return;
    setLocationLoading(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const updated = updateDonor(donor.id, {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          if (updated) {
            setDonor(updated);
            refreshUser();
          }
          setLocationLoading(false);
        },
        () => {
          alert('Unable to get location. Please enable location services.');
          setLocationLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setLocationLoading(false);
    }
  };

  if (loading || !donor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const badge = getBadgeForDonations(donor.donationCount);
  const nextBadge = BADGE_LEVELS.find(b => b.minDonations > donor.donationCount);
  const verifiedDonations = donations.filter(d => d.status === 'verified').length;
  const pendingDonations = donations.filter(d => d.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50/50 via-white to-red-50/50">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome back, {donor.name}!</h1>
            <p className="text-muted-foreground">Manage your donor profile and track your impact.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card className="overflow-hidden">
                <div className="h-24 blood-gradient" />
                <CardContent className="pt-0">
                  <div className="flex flex-col items-center -mt-12">
                    <BadgeDisplay donationCount={donor.donationCount} size="lg" />
                    <h2 className="text-xl font-bold mt-3">{donor.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-700 border border-red-200">
                        {donor.bloodGroup}
                      </span>
                      {donor.verified && (
                        <Badge variant="secondary" className="gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-primary" />
                        <span className="text-sm">Available to Donate</span>
                      </div>
                      <Switch 
                        checked={donor.available} 
                        onCheckedChange={handleAvailabilityToggle}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {donor.locationHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span className="text-sm">Show Location</span>
                      </div>
                      <Switch 
                        checked={!donor.locationHidden} 
                        onCheckedChange={handleLocationVisibilityToggle}
                      />
                    </div>

                    {donor.phone && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">Show Phone</span>
                        </div>
                        <Switch 
                          checked={!donor.phoneHidden} 
                          onCheckedChange={handlePhoneVisibilityToggle}
                        />
                      </div>
                    )}
                  </div>

                  <Button 
                    className="w-full mt-6 gap-2" 
                    variant="outline"
                    onClick={handleUpdateLocation}
                    disabled={locationLoading}
                  >
                    <MapPin className="w-4 h-4" />
                    {locationLoading ? 'Updating...' : 'Update Location'}
                  </Button>
                  
                  {donor.lat && donor.lng && (
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Location saved (approximate)
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Privacy Notice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Your exact location is never shared. We only show approximate distances to hospitals. 
                    Phone number is only visible when you enable it.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
                  <CardContent className="p-4">
                    <Heart className="w-6 h-6 mb-2 opacity-80" />
                    <p className="text-2xl font-bold">{donor.donationCount}</p>
                    <p className="text-sm opacity-80">Total Donations</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <CheckCircle className="w-6 h-6 mb-2 text-green-500" />
                    <p className="text-2xl font-bold">{verifiedDonations}</p>
                    <p className="text-sm text-muted-foreground">Verified</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <Clock className="w-6 h-6 mb-2 text-yellow-500" />
                    <p className="text-2xl font-bold">{pendingDonations}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <Award className="w-6 h-6 mb-2 text-primary" />
                    <p className="text-2xl font-bold">Lvl {badge.level || 0}</p>
                    <p className="text-sm text-muted-foreground">{badge.name}</p>
                  </CardContent>
                </Card>
              </div>

              {nextBadge && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Next Badge Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md"
                        style={{ background: nextBadge.color, opacity: 0.7 }}
                      >
                        {nextBadge.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{nextBadge.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {nextBadge.minDonations - donor.donationCount} more donations needed
                        </p>
                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                          <div 
                            className="blood-gradient h-2 rounded-full transition-all"
                            style={{ 
                              width: `${Math.min(100, (donor.donationCount / nextBadge.minDonations) * 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Recent Donations
                  </CardTitle>
                  <CardDescription>Your donation history</CardDescription>
                </CardHeader>
                <CardContent>
                  {donations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>No donations yet.</p>
                      <p className="text-sm">Your donation history will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {donations.slice(0, 5).map((donation) => (
                        <div 
                          key={donation.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{donation.hospitalName}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(donation.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge 
                            variant={donation.status === 'verified' ? 'default' : 'secondary'}
                            className="gap-1"
                          >
                            {donation.status === 'verified' ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <AlertCircle className="w-3 h-3" />
                            )}
                            {donation.status === 'verified' ? 'Verified' : 'Pending'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Badge Collection
                  </CardTitle>
                  <CardDescription>Earn badges by donating blood</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4">
                    {BADGE_LEVELS.map((b) => {
                      const earned = donor.donationCount >= b.minDonations;
                      return (
                        <div 
                          key={b.level}
                          className={`text-center ${!earned ? 'opacity-30 grayscale' : ''}`}
                        >
                          <div 
                            className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-xl shadow-md"
                            style={{ 
                              background: `linear-gradient(135deg, ${b.color} 0%, ${b.color}CC 100%)`,
                              border: `2px solid ${b.color}` 
                            }}
                          >
                            {b.icon}
                          </div>
                          <p className="text-xs font-medium mt-1">{b.name}</p>
                          <p className="text-xs text-muted-foreground">{b.minDonations}+</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
