'use client';

import React from 'react';
import Image from 'next/image';
import { Locale } from '@/lib/types';
import { translations } from '@/lib/translations';
import { ShieldCheck, Compass, Car, Sparkles, Clock, CheckCircle2, Award } from 'lucide-react';

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Copy */}
          <div className="lg:col-span-7 flex flex-col items-start text-start space-y-6">
            {/* Top Brand Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#140f0a]/90 px-3.5 py-1.5 text-xs font-semibold text-[#fae48c] shadow-lg shadow-[#d4af37]/5">
              <Sparkles className="h-3.5 w-3.5 text-[#d4af37] animate-pulse" />
              <span>{t.hero.badge}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
              <span className="text-[#a69883] font-normal">{t.management}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white font-serif">
              <span className="block text-[#ede3d1]">{t.hero.titleLine1}</span>
              <span className="block mt-2 gold-gradient-text">{t.hero.titleLine2}</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base leading-relaxed text-[#a69883] max-w-2xl font-sans">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('transfers')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl gold-gradient-bg px-6 py-3.5 text-sm font-bold shadow-xl shadow-[#d4af37]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Car className="h-4 w-4" />
                <span>{t.hero.ctaTransfers}</span>
              </button>

              <button
                onClick={() => onNavigate('fleet')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-[#d4af37]/50 bg-[#120e0a]/90 px-6 py-3.5 text-sm font-semibold text-[#fae48c] hover:bg-[#1a140e] hover:border-[#d4af37] transition-all cursor-pointer"
              >
                <Car className="h-4 w-4 text-[#d4af37]" />
                <span>{locale === 'ar' ? 'استعراض أسطول المركبات' : 'Explore Elite Fleet'}</span>
              </button>
            </div>

            {/* Value Props Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 w-full border-t border-[#d4af37]/15">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#38ef7d] shrink-0" />
                <span className="text-xs text-[#ede3d1] font-medium">19 مساراً معتمداً</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#d4af37] shrink-0" />
                <span className="text-xs text-[#ede3d1] font-medium">انضباط مواعيد 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#d4af37] shrink-0" />
                <span className="text-xs text-[#ede3d1] font-medium">أسعار ثابتة بدون زيادة</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-[#fae48c] shrink-0" />
                <span className="text-xs text-[#ede3d1] font-medium">خدمة VIP راقية</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card / Brand Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative overflow-hidden rounded-2xl border border-[#d4af37]/40 bg-[#120e0a] p-2 shadow-2xl shadow-[#d4af37]/10">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                <Image
                  src="/hero-pyramids.jpg"
                  alt="ANUBIS Luxury Egyptian Tours"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070503] via-transparent to-black/30" />

                {/* Overlaid Floating Tag */}
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-[#d4af37]/30 bg-[#070503]/85 p-3.5 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">Official Fleet & Tours</p>
                      <p className="text-sm font-bold text-white">ANUBIS TRAVEL EGYPT</p>
                    </div>
                    <span className="rounded-full bg-[#d4af37]/20 px-2.5 py-1 text-[11px] font-bold text-[#fae48c] border border-[#d4af37]/40">
                      ★ 4.9 / 5.0
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
