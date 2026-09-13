'use client';

import React from 'react';
import Image from 'next/image';
import { Locale } from '@/lib/types';
import { translations } from '@/lib/translations';
import { ShieldCheck, Compass, Car, Sparkles, Clock, Award } from 'lucide-react';

interface HeroProps {
  locale: Locale;
  onNavigate: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ locale, onNavigate }) => {
  const t = translations[locale];

  return (
    <section className="relative overflow-hidden border-b border-[#d4af37]/20 bg-gradient-to-b from-[#060402] via-[#0b0906] to-[#060402] py-16 sm:py-24">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-full max-w-4xl rounded-full bg-[#d4af37]/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Visual Card / Brand Showcase - Order 1 on mobile to appear first! */}
          <div className="order-1 lg:order-2 lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* Ambient Golden Halo Glow */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#d4af37]/30 via-[#fae48c]/15 to-[#d4af37]/30 blur-3xl opacity-80 pointer-events-none transition-all duration-700 group-hover:opacity-100" />

            <div className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-none overflow-hidden rounded-3xl border-2 border-[#d4af37]/50 bg-gradient-to-b from-[#16110a] via-[#0d0905] to-[#040302] p-4 sm:p-6 lg:p-8 shadow-2xl shadow-[#d4af37]/25 group flex items-center justify-center">
              {/* Pure Large & Clear Emblem */}
              <div className="relative w-full aspect-square max-w-[260px] sm:max-w-[340px] lg:max-w-[400px] flex items-center justify-center">
                <Image
                  src="/anubis-logo.png"
                  alt="ANUBIS TRAVEL"
                  width={400}
                  height={400}
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_28px_rgba(212,175,55,0.45)] transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Main Copy - Order 2 on mobile */}
          <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-start space-y-5 sm:space-y-6">
            {/* Royal Brand Presentation - Arabic & English */}
            <div className="space-y-2 flex flex-col items-center lg:items-start select-none">
              <div className="flex flex-wrap items-baseline justify-center lg:justify-start gap-2.5 sm:gap-3.5">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif bg-gradient-to-r from-[#ffe899] via-[#d4af37] to-[#fae48c] bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(212,175,55,0.45)] select-none">
                  أنوبيس ترافيل
                </span>
                <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-[0.16em] sm:tracking-[0.22em] uppercase font-serif text-[#fae48c] select-none">
                  ANUBIS <span className="text-[#d4af37]">TRAVEL</span>
                </span>
              </div>
              {/* Supervision Centered Directly Under Brand Name */}
              <div className="w-full flex items-center justify-center gap-2.5 pt-1">
                <span className="h-0.5 flex-1 max-w-[40px] sm:max-w-[65px] bg-gradient-to-r from-transparent to-[#d4af37] rounded-full" />
                <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#fae48c] bg-[#16110a] px-3.5 py-1 rounded-full border border-[#d4af37]/40 shadow-md whitespace-nowrap">
                  {t.management}
                </span>
                <span className="h-0.5 flex-1 max-w-[40px] sm:max-w-[65px] bg-gradient-to-l from-transparent to-[#d4af37] rounded-full" />
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-snug sm:leading-tight tracking-tight text-white font-serif">
              <span className="block text-[#ede3d1]">{t.hero.titleLine1}</span>
              <span className="block mt-1 sm:mt-2 gold-gradient-text">{t.hero.titleLine2}</span>
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-base leading-relaxed text-[#a69883] max-w-2xl font-sans">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('transfers')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl gold-gradient-bg px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold shadow-xl shadow-[#d4af37]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Car className="h-4 w-4" />
                <span>{t.hero.ctaTransfers}</span>
              </button>

              <button
                onClick={() => onNavigate('tours')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-[#d4af37]/50 bg-[#120e0a]/90 px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-[#fae48c] hover:bg-[#1a140e] hover:border-[#d4af37] transition-all cursor-pointer"
              >
                <Compass className="h-4 w-4 text-[#d4af37]" />
                <span>{t.hero.ctaTours}</span>
              </button>
            </div>

            {/* Value Props Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-5 sm:pt-6 w-full border-t border-[#d4af37]/15">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Clock className="h-4 w-4 text-[#d4af37] shrink-0" />
                <span className="text-[11px] sm:text-xs text-[#ede3d1] font-medium">انضباط مواعيد 100%</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <ShieldCheck className="h-4 w-4 text-[#d4af37] shrink-0" />
                <span className="text-[11px] sm:text-xs text-[#ede3d1] font-medium">أسعار ثابتة بدون زيادة</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Award className="h-4 w-4 text-[#fae48c] shrink-0" />
                <span className="text-[11px] sm:text-xs text-[#ede3d1] font-medium">خدمة VIP راقية</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
