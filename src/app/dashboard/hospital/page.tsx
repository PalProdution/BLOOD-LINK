"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DonorCard } from '@/components/DonorCard';
import { useAuth } from '@/lib/auth-context';
import { getDonors, getHospitalDonations, createDonation, verifyDonation, updateHospital } from '@/lib/store';
import { Donor, Hospital, Donation, BloodGroup, calculateDistance, getBadgeForDonations } from '@/lib/types';
import { 
  Search, Filter, MapPin, Users, CheckCircle, Clock,
  Building2, Heart, AlertCircle, X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BLOOD_GROUPS: (BloodGroup | 'all')[] = ['all', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const DISTANCE_OPTIONS = [
  { value: '2', label: '2 km' },
  { value: '5', label: '5 km' },
  { value: '10', label: '10 km' },
  { value: '50', label: '50 km' },
  { value: 'all', label: 'Any distance' },
];

export default function HospitalDashboard() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [allDonors, setAllDonors] = useState<Donor[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState<BloodGroup | 'all'>('all');
  const [distanceFilter, setDistanceFilter] = useState<string>('all');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showDonorDialog, setShowDonorDialog] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/dashboard/hospital');
      return;
    }
    if (user && user.role !== 'hospital') {
      router.push('/dashboard/donor');
      return;
    }
    if (user && user.role === 'hospital') {
      setHospital(user as Hospital);
      setAllDonors(getDonors());
      setDonations(getHospitalDonations(user.id));
    }
  }, [user, loading, router]);

  const handleUpdateLocation = () => {
    if (!hospital) return;
    setLocationLoading(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const updated = updateHospital(hospital.id, {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          if (updated) {
            setHospital(updated);
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

  const filteredDonors = useMemo(() => {
    let filtered = allDonors.filter(d => !d.locationHidden || (d.lat && d.lng));

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(query) ||
        d.bloodGroup.toLowerCase().includes(query)
      );
    }

    if (bloodGroupFilter !== 'all') {
      filtered = filtered.filter(d => d.bloodGroup === bloodGroupFilter);
    }

    if (distanceFilter !== 'all' && hospital?.lat && hospital?.lng) {
      const maxDistance = parseInt(distanceFilter);
      filtered = filtered.filter(d => {
        if (!d.lat || !d.lng) return false;
        const distance = calculateDistance(hospital.lat!, hospital.lng!, d.lat, d.lng);
        return distance <= maxDistance;
      });
    }

    if (hospital?.lat && hospital?.lng) {
      filtered.sort((a, b) => {
        if (!a.lat || !a.lng) return 1;
        if (!b.lat || !b.lng) return -1;
        const distA = calculateDistance(hospital.lat!, hospital.lng!, a.lat, a.lng);
        const distB = calculateDistance(hospital.lat!, hospital.lng!, b.lat, b.lng);
        return distA - distB;
      });
    }

    return filtered;
  }, [allDonors, searchQuery, bloodGroupFilter, distanceFilter, hospital]);

  const handleSelectDonor = (donor: Donor) => {
    setSelectedDonor(donor);
    setShowDonorDialog(true);
  };

  const handleMarkDonation = () => {
    if (!selectedDonor || !hospital) return;
    createDonation(selectedDonor.id, hospital.id);
    setDonations(getHospitalDonations(hospital.id));
    setShowDonorDialog(false);
    setSelectedDonor(null);
  };

  const handleVerifyDonation = (donationId: string) => {
    verifyDonation(donationId);
    if (hospital) {
      setDonations(getHospitalDonations(hospital.id));
      setAllDonors(getDonors());
    }
  };

  const getDonorDistance = (donor: Donor): number | undefined => {
    if (!hospital?.lat || !hospital?.lng || !donor.lat || !donor.lng) return undefined;
    return calculateDistance(hospital.lat, hospital.lng, donor.lat, donor.lng);
  };

  if (loading || !hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const pendingDonations = donations.filter(d => d.status === 'pending');
  const verifiedDonations = donations.filter(d => d.status === 'verified');
  const availableDonors = filteredDonors.filter(d => d.available);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50/50 via-white to-red-50/50">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">{hospital.hospitalName}</h1>
              <p className="text-muted-foreground">Hospital Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              {!hospital.lat || !hospital.lng ? (
                <Button onClick={handleUpdateLocation} disabled={locationLoading} className="gap-2">
                  <MapPin className="w-4 h-4" />
                  {locationLoading ? 'Getting Location...' : 'Set Location'}
                </Button>
              ) : (
                <Badge variant="secondary" className="gap-1 py-1.5">
                  <MapPin className="w-3 h-3" />
                  Location Set
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
              <CardContent className="p-4">
                <Users className="w-6 h-6 mb-2 opacity-80" />
                <p className="text-2xl font-bold">{availableDonors.length}</p>
                <p className="text-sm opacity-80">Available Donors</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <Heart className="w-6 h-6 mb-2 text-primary" />
                <p className="text-2xl font-bold">{filteredDonors.length}</p>
                <p className="text-sm text-muted-foreground">Total Matches</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <Clock className="w-6 h-6 mb-2 text-yellow-500" />
                <p className="text-2xl font-bold">{pendingDonations.length}</p>
                <p className="text-sm text-muted-foreground">Pending Verify</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <CheckCircle className="w-6 h-6 mb-2 text-green-500" />
                <p className="text-2xl font-bold">{verifiedDonations.length}</p>
                <p className="text-sm text-muted-foreground">Verified</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Find Donors
                  </CardTitle>
                  <CardDescription>
                    Search and filter available blood donors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or blood group..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={bloodGroupFilter} onValueChange={(v) => setBloodGroupFilter(v as BloodGroup | 'all')}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue placeholder="Blood Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_GROUPS.map((bg) => (
                          <SelectItem key={bg} value={bg}>
                            {bg === 'all' ? 'All Groups' : bg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue placeholder="Distance" />
                      </SelectTrigger>
                      <SelectContent>
                        {DISTANCE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {!hospital.lat || !hospital.lng ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-yellow-700">
                        <AlertCircle className="w-4 h-4" />
                        <p className="text-sm">Set your hospital location to see distance-based results.</p>
                      </div>
                    </div>
                  ) : null}

                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {filteredDonors.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>No donors found matching your criteria.</p>
                        <p className="text-sm">Try adjusting your filters.</p>
                      </div>
                    ) : (
                      filteredDonors.map((donor) => (
                        <DonorCard
                          key={donor.id}
                          donor={donor}
                          distance={getDonorDistance(donor)}
                          onSelect={() => handleSelectDonor(donor)}
                        />
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    Pending Verification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingDonations.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No pending donations
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {pendingDonations.map((donation) => (
                        <div 
                          key={donation.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-sm">{donation.donorName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(donation.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleVerifyDonation(donation.id)}
                            className="gap-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Verify
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Recent Verified
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {verifiedDonations.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No verified donations yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {verifiedDonations.slice(0, 5).map((donation) => (
                        <div 
                          key={donation.id}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-sm">{donation.donorName}</p>
                            <p className="text-xs text-muted-foreground">
                              Verified: {new Date(donation.verifiedAt!).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="secondary" className="gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            Done
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
                    <Building2 className="w-5 h-5" />
                    Hospital Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Facility</p>
                    <p className="font-medium">{hospital.hospitalName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{hospital.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-medium">{hospital.email}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showDonorDialog} onOpenChange={setShowDonorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Donor Details</DialogTitle>
            <DialogDescription>
              Review donor information and mark donation as completed
            </DialogDescription>
          </DialogHeader>
          
          {selectedDonor && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${getBadgeForDonations(selectedDonor.donationCount).color} 0%, ${getBadgeForDonations(selectedDonor.donationCount).color}CC 100%)` 
                  }}
                >
                  {getBadgeForDonations(selectedDonor.donationCount).icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedDonor.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                      {selectedDonor.bloodGroup}
                    </span>
                    <Badge variant={selectedDonor.available ? 'default' : 'secondary'}>
                      {selectedDonor.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Donations</p>
                  <p className="font-semibold">{selectedDonor.donationCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Badge Level</p>
                  <p className="font-semibold">{getBadgeForDonations(selectedDonor.donationCount).name}</p>
                </div>
                {selectedDonor.lastDonation && (
                  <div>
                    <p className="text-muted-foreground">Last Donation</p>
                    <p className="font-semibold">{new Date(selectedDonor.lastDonation).toLocaleDateString()}</p>
                  </div>
                )}
                {getDonorDistance(selectedDonor) !== undefined && (
                  <div>
                    <p className="text-muted-foreground">Distance</p>
                    <p className="font-semibold">{getDonorDistance(selectedDonor)?.toFixed(1)} km</p>
                  </div>
                )}
              </div>

              {!selectedDonor.phoneHidden && selectedDonor.phone && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{selectedDonor.phone}</p>
                </div>
              )}

              {selectedDonor.verified && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Verified Donor</span>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDonorDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMarkDonation} className="blood-gradient border-0 gap-2">
              <Heart className="w-4 h-4" />
              Mark Donation Completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
