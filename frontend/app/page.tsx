'use client';

import React, { useState, useEffect } from 'react';
import { Locale, Currency, Route } from '@/lib/types';
import { ROUTES } from '@/lib/data';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { TransferBookingEngine } from '@/components/TransferBookingEngine';
import { ToursCatalog } from '@/components/ToursCatalog';
import { FleetSection } from '@/components/FleetSection';
import { TrustFeatures } from '@/components/TrustFeatures';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>('ar');
  const [currency, setCurrency] = useState<Currency>('EGP');
  const [routes, setRoutes] = useState<Route[]>(ROUTES);

  // Handle Dynamic Direction & Language Attribute
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  // Load and Synchronize Dynamic Routes & Pricing
  useEffect(() => {
    // 1. Initial local cache check
    try {
      const cached = localStorage.getItem('anubis_routes');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRoutes(parsed);
        }
      }
    } catch (e) {
      console.error('Error loading cached routes:', e);
    }

    // 2. Fetch fresh routes from API
    const fetchRoutes = async () => {
      try {
        const res = await fetch('/api/routes');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.routes)) {
            setRoutes(data.routes);
            localStorage.setItem('anubis_routes', JSON.stringify(data.routes));
          }
        }
      } catch (err) {
        console.warn('Could not fetch /api/routes, using fallback routes data:', err);
      }
    };

    fetchRoutes();

    // 3. Multi-tab and Same-window synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'anubis_routes' && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) {
            setRoutes(updated);
          }
        } catch (err) {
          console.error('Storage sync error:', err);
        }
      }
    };

    const handleCustomSync = (e: Event) => {
      try {
        const cached = localStorage.getItem('anubis_routes');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setRoutes(parsed);
          }
        }
      } catch (err) {
        console.error('Custom event sync error:', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('anubis_routes_updated', handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('anubis_routes_updated', handleCustomSync);
    };
  }, []);

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectVehicleForTransfer = (vehicleSlug: string) => {
    handleNavigate('transfers');
  };

  return (
    <div
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#060402] text-[#ede3d1] selection:bg-[#d4af37] selection:text-black font-sans transition-colors"
    >
      <Navbar
        locale={locale}
        setLocale={setLocale}
        currency={currency}
        setCurrency={setCurrency}
        onNavigate={handleNavigate}
      />

      <main>
        <Hero
          locale={locale}
          onNavigate={handleNavigate}
        />

        <TransferBookingEngine
          locale={locale}
          currency={currency}
          routes={routes}
        />

        <ToursCatalog
          locale={locale}
          currency={currency}
          routes={routes}
        />

        <FleetSection
          locale={locale}
          onSelectVehicleForTransfer={handleSelectVehicleForTransfer}
        />

        <TrustFeatures
          locale={locale}
        />
      </main>

      <Footer
        locale={locale}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
