"use client";

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BADGE_LEVELS } from '@/lib/types';
import Link from 'next/link';
import { Heart, Search, Shield, Award, Users, MapPin, Clock, Building2, ArrowRight, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find compatible donors near you with advanced filtering by blood group and distance.',
    },
    {
      icon: Shield,
      title: 'Verified Donors',
      description: 'All donations are verified by hospitals, ensuring trust and safety.',
    },
    {
      icon: Award,
      title: 'Gamification',
      description: 'Earn badges and climb the leaderboard as you save more lives.',
    },
    {
      icon: MapPin,
      title: 'Location Based',
      description: 'Approximate locations help connect donors with nearby emergencies.',
    },
    {
      icon: Clock,
      title: 'Real-time Status',
      description: 'Donors can update availability instantly for urgent requests.',
    },
    {
      icon: Building2,
      title: 'Hospital Portal',
      description: 'Dedicated dashboard for hospitals to manage and verify donations.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Registered Donors' },
    { value: '500+', label: 'Partner Hospitals' },
    { value: '25K+', label: 'Lives Saved' },
    { value: '8', label: 'Blood Groups' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-50" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-300/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div 
              className="text-center"
              initial="initial"
              animate="animate"
              variants={stagger}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-6">
                <Droplets className="w-4 h-4" />
                <span className="text-sm font-medium">Every Drop Counts</span>
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
              >
                Connect.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
                  Donate.
                </span>
                {' '}Save Lives.
              </motion.h1>

              <motion.p 
                variants={fadeInUp}
                className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
              >
                BloodLink connects blood donors with hospitals and emergency patients. 
                Join our community of heroes and help save lives when it matters most.
              </motion.p>

              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/register">
                  <Button size="lg" className="blood-gradient border-0 shadow-xl hover:opacity-90 text-lg px-8 h-14 gap-2 w-full sm:w-auto">
                    <Heart className="w-5 h-5" />
                    Become a Donor
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/register?role=hospital">
                  <Button variant="outline" size="lg" className="text-lg px-8 h-14 gap-2 w-full sm:w-auto">
                    <Building2 className="w-5 h-5" />
                    Hospital Portal
                  </Button>
                </Link>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                className="mt-16 flex items-center justify-center"
              >
                <div className="relative">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full blood-gradient flex items-center justify-center animate-pulse-glow shadow-2xl">
                    <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-white fill-white animate-float" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    O+
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-sm">
                    A-
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <p className="text-3xl sm:text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4">Features</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Why Choose BloodLink?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform is designed to make blood donation simple, safe, and rewarding for everyone involved.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                    <feature.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-red-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4">Gamification</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Earn Badges & Recognition
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every donation counts! Level up your profile and earn exclusive badges as you help save more lives.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
              {BADGE_LEVELS.map((badge, index) => (
                <motion.div
                  key={badge.level}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg transition-all"
                >
                  <div 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto flex items-center justify-center text-2xl sm:text-3xl mb-3 shadow-lg"
                    style={{ 
                      background: `linear-gradient(135deg, ${badge.color} 0%, ${badge.color}CC 100%)`,
                      border: `3px solid ${badge.color}` 
                    }}
                  >
                    {badge.icon}
                  </div>
                  <p className="font-bold text-sm sm:text-base">{badge.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {badge.minDonations}+ donations
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge variant="secondary" className="mb-4">How It Works</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Simple Steps to Save Lives
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Register', desc: 'Create your donor profile with blood group and location' },
                { step: '02', title: 'Get Matched', desc: 'Hospitals find you based on compatibility and proximity' },
                { step: '03', title: 'Donate & Earn', desc: 'Complete your donation and earn verified badges' },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="text-6xl sm:text-8xl font-extrabold text-red-100 absolute -top-4 -left-2">
                    {item.step}
                  </div>
                  <div className="relative z-10 pt-8 pl-4">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 blood-gradient">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Users className="w-16 h-16 text-white/80 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of donors who are already saving lives in their communities. 
                Your next donation could save up to 3 lives.
              </p>
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8 h-14 gap-2 shadow-xl">
                  <Heart className="w-5 h-5" />
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
