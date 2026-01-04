"use client";

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Clock, Bell, Zap, Shield, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MapPage() {
  const upcomingFeatures = [
    {
      icon: MapPin,
      title: 'Interactive Live Map',
      description: 'View available donors on a real-time map with location markers',
    },
    {
      icon: Zap,
      title: 'Instant Notifications',
      description: 'Get notified when donors become available in your area',
    },
    {
      icon: Shield,
      title: 'Privacy-First Design',
      description: 'Approximate locations only - exact addresses never shown',
    },
    {
      icon: Bell,
      title: 'Emergency Alerts',
      description: 'Send urgent requests to nearby compatible donors',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4 gap-1">
              <Clock className="w-3 h-3" />
              Coming Soon
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Live Donor Map</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Real-time donor mapping is coming soon! Track and connect with nearby donors when seconds matter most.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative mb-12"
          >
            <Card className="overflow-hidden border-2 border-dashed border-primary/20">
              <CardContent className="p-0">
                <div className="relative aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" className="text-gray-400"/>
                    </svg>
                  </div>
                  
                  <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-primary animate-ping" />
                  <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-primary" />
                  
                  <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-blue-500 animate-ping" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-blue-500" />
                  
                  <div className="absolute bottom-1/3 left-1/3 w-3 h-3 rounded-full bg-green-500 animate-ping" style={{ animationDelay: '1s' }} />
                  <div className="absolute bottom-1/3 left-1/3 w-3 h-3 rounded-full bg-green-500" />
                  
                  <div className="absolute top-1/2 right-1/4 w-4 h-4 rounded-full bg-yellow-500 animate-ping" style={{ animationDelay: '0.3s' }} />
                  <div className="absolute top-1/2 right-1/4 w-4 h-4 rounded-full bg-yellow-500" />

                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full blood-gradient flex items-center justify-center mb-4 shadow-xl animate-pulse">
                      <MapPin className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Map Feature Coming Soon</h2>
                    <p className="text-muted-foreground">
                      We&apos;re building something amazing for you
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {upcomingFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-br from-red-50 to-white border-red-100">
              <CardContent className="py-12">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  Can&apos;t Wait? Start Helping Now!
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  While we build the map feature, you can still register as a donor or search for donors through our dashboard.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <Button className="blood-gradient border-0 gap-2 w-full sm:w-auto">
                      <Heart className="w-4 h-4" />
                      Become a Donor
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/hospital">
                    <Button variant="outline" className="gap-2 w-full sm:w-auto">
                      <MapPin className="w-4 h-4" />
                      Find Donors Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
