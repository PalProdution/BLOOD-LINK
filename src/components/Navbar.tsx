"use client";

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X, LogOut, User, Building2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl blood-gradient flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Blood<span className="text-primary">Link</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Leaderboard
            </Link>
            <Link href="/map" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Map
            </Link>
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-4">
                    <Link 
                      href={user.role === 'donor' ? '/dashboard/donor' : '/dashboard/hospital'}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      {user.role === 'donor' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                      Dashboard
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/login">
                      <Button variant="ghost" size="sm">Login</Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm" className="blood-gradient border-0 shadow-lg hover:opacity-90">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden glass-effect border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <Link 
              href="/leaderboard" 
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Leaderboard
            </Link>
            <Link 
              href="/map" 
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Map
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link 
                      href={user.role === 'donor' ? '/dashboard/donor' : '/dashboard/hospital'}
                      className="block py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Button variant="outline" className="w-full gap-2" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2 pt-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full blood-gradient border-0">Register</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
