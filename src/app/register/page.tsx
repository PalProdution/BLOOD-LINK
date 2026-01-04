"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth-context';
import { registerDonor, registerHospital } from '@/lib/store';
import { BloodGroup } from '@/lib/types';
import { Heart, Mail, Lock, User, Phone, Building2, MapPin, AlertCircle, Droplets } from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'donor' | 'hospital'>('donor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [donorForm, setDonorForm] = useState({
    name: '',
    email: '',
    password: '',
    bloodGroup: '' as BloodGroup | '',
    phone: '',
  });

  const [hospitalForm, setHospitalForm] = useState({
    name: '',
    email: '',
    password: '',
    hospitalName: '',
    address: '',
  });

  useEffect(() => {
    const role = searchParams.get('role');
    if (role === 'hospital') {
      setActiveTab('hospital');
    }
  }, [searchParams]);

  const handleDonorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!donorForm.bloodGroup) {
      setError('Please select your blood group');
      setLoading(false);
      return;
    }

    const user = registerDonor(
      donorForm.email,
      donorForm.password,
      donorForm.name,
      donorForm.bloodGroup as BloodGroup,
      donorForm.phone || undefined
    );

    if (user) {
      setUser(user);
      router.push('/dashboard/donor');
    } else {
      setError('Email already exists. Please use a different email or login.');
    }
    setLoading(false);
  };

  const handleHospitalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const user = registerHospital(
      hospitalForm.email,
      hospitalForm.password,
      hospitalForm.name,
      hospitalForm.hospitalName,
      hospitalForm.address
    );

    if (user) {
      setUser(user);
      router.push('/dashboard/hospital');
    } else {
      setError('Email already exists. Please use a different email or login.');
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-lg shadow-xl border-0">
      <CardHeader className="text-center pb-2">
        <div className="w-16 h-16 rounded-2xl blood-gradient flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Heart className="w-8 h-8 text-white fill-white" />
        </div>
        <CardTitle className="text-2xl font-bold">Join BloodLink</CardTitle>
        <CardDescription>Create your account and start saving lives</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'donor' | 'hospital')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="donor" className="gap-2">
              <Droplets className="w-4 h-4" />
              Donor
            </TabsTrigger>
            <TabsTrigger value="hospital" className="gap-2">
              <Building2 className="w-4 h-4" />
              Hospital
            </TabsTrigger>
          </TabsList>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <TabsContent value="donor">
            <form onSubmit={handleDonorSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="donor-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="donor-name"
                    placeholder="John Doe"
                    value={donorForm.name}
                    onChange={(e) => setDonorForm({ ...donorForm, name: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="donor-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="donor-email"
                    type="email"
                    placeholder="you@example.com"
                    value={donorForm.email}
                    onChange={(e) => setDonorForm({ ...donorForm, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="donor-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="donor-password"
                    type="password"
                    placeholder="••••••••"
                    value={donorForm.password}
                    onChange={(e) => setDonorForm({ ...donorForm, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Select
                    value={donorForm.bloodGroup}
                    onValueChange={(v) => setDonorForm({ ...donorForm, bloodGroup: v as BloodGroup })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((bg) => (
                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donor-phone">Phone (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="donor-phone"
                      type="tel"
                      placeholder="+1234567890"
                      value={donorForm.phone}
                      onChange={(e) => setDonorForm({ ...donorForm, phone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full blood-gradient border-0 h-11" disabled={loading}>
                {loading ? 'Creating Account...' : 'Register as Donor'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="hospital">
            <form onSubmit={handleHospitalSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hospital-name">Contact Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="hospital-name"
                    placeholder="Admin Name"
                    value={hospitalForm.name}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospital-facility">Hospital / Facility Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="hospital-facility"
                    placeholder="City General Hospital"
                    value={hospitalForm.hospitalName}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, hospitalName: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospital-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="hospital-email"
                    type="email"
                    placeholder="hospital@example.com"
                    value={hospitalForm.email}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospital-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="hospital-password"
                    type="password"
                    placeholder="••••••••"
                    value={hospitalForm.password}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospital-address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="hospital-address"
                    placeholder="123 Medical Center Drive, City"
                    value={hospitalForm.address}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, address: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full blood-gradient border-0 h-11" disabled={loading}>
                {loading ? 'Creating Account...' : 'Register Hospital'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground mt-6">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-20 bg-gradient-to-br from-red-50 via-white to-red-50">
        <Suspense fallback={<div className="w-full max-w-lg h-96 bg-card animate-pulse rounded-xl" />}>
          <RegisterForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
