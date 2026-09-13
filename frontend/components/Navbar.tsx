'use client';

import React from 'react';
import Image from 'next/image';
import { Currency, Locale } from '@/lib/types';
import { translations } from '@/lib/translations';
import { Globe, Phone, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';

interface NavbarProps {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  currency: Currency;
  setCurrency: (cur: Currency) => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  locale,
  setLocale,
  currency,
  setCurrency,
  onNavigate
}) => {
  const t = translations[locale];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#d4af37]/20 bg-[#070503]/90 backdrop-blur-md transition-all">
      {/* Top Utility Bar */}
      <div className="border-b border-[#d4af37]/10 bg-[#0e0a06]/80 px-4 py-1.5 text-xs text-[#a69883]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[#d4af37]" />
            <span className="font-medium text-[#fae48c]">{t.management}</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:01091501160"
              className="flex items-center gap-1 text-[#ede3d1] hover:text-[#d4af37] transition-colors"
            >
              <Phone className="h-3 w-3 text-[#d4af37]" />
              <span dir="ltr">01091501160</span>
            </a>
            <span className="hidden sm:inline text-[#4a3f2c]">|</span>
            <span className="hidden sm:inline text-[#a69883]">VIP Tourism & Airport Transfers 24/7</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('hero')}
          className="flex items-center group cursor-pointer"
          title="أنوبيس ترافيل | ANUBIS TRAVEL"
        >
          <div className="relative h-12 w-12 sm:h-16 sm:w-16 p-0.5 group-hover:scale-105 transition-transform duration-300 shrink-0">
            <Image
              src="/anubis-logo.png"
              alt="أنوبيس ترافيل - ANUBIS TRAVEL"
              width={64}
              height={64}
              className="h-full w-full object-contain filter drop-shadow-[0_4px_16px_rgba(212,175,55,0.55)]"
              priority
            />
          </div>
        </button>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => onNavigate('transfers')}
            className="text-[#ede3d1] hover:text-[#fae48c] transition-colors cursor-pointer"
          >
            {t.nav.transfers}
          </button>
          <button
            onClick={() => onNavigate('tours')}
            className="text-[#ede3d1] hover:text-[#fae48c] transition-colors cursor-pointer"
          >
            {t.nav.tours}
          </button>
          <button
            onClick={() => onNavigate('fleet')}
            className="text-[#ede3d1] hover:text-[#fae48c] transition-colors cursor-pointer"
          >
            {t.nav.fleet}
          </button>
          <button
            onClick={() => onNavigate('about')}
            className="text-[#ede3d1] hover:text-[#fae48c] transition-colors cursor-pointer"
          >
            {t.nav.about}
          </button>
        </nav>

        {/* Action Controls: Language + WhatsApp CTA */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 rounded-lg border border-[#d4af37]/30 bg-[#120e0a] px-2.5 py-1.5 text-xs font-semibold text-[#ede3d1] hover:text-[#fae48c] hover:border-[#d4af37] transition-all cursor-pointer"
            title="Toggle Language / تبديل اللغة"
          >
            <Globe className="h-3.5 w-3.5 text-[#d4af37]" />
            <span>{locale === 'ar' ? 'English' : 'عربي'}</span>
          </button>

          {/* WhatsApp Direct Action */}
          <a
            href="https://api.whatsapp.com/send?phone=201091501160"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#25D366] to-[#1ebe5d] px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition-all"
          >
            <MessageCircle className="h-4 w-4" />
            <span>واتساب / WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
};
