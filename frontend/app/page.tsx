'use client';

import React, { useState, useEffect } from 'react';
import { Locale, Currency } from '@/lib/types';
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

  // Handle Dynamic Direction & Language Attribute
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

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
    // small timeout to ensure scroll, then trigger
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
        />

        <ToursCatalog
          locale={locale}
          currency={currency}
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
