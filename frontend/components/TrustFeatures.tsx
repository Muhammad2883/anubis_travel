'use client';

import React from 'react';
import { Locale } from '@/lib/types';
import { translations } from '@/lib/translations';
import { ShieldCheck, Clock, Award, DollarSign, CheckCircle } from 'lucide-react';

interface TrustFeaturesProps {
  locale: Locale;
}

export const TrustFeatures: React.FC<TrustFeaturesProps> = ({ locale }) => {
  const t = translations[locale];

  const features = [
    {
      icon: <Clock className="h-6 w-6 text-[#d4af37]" />,
      title: t.features.punctuality,
      desc: t.features.punctualitySub
    },
    {
      icon: <Award className="h-6 w-6 text-[#d4af37]" />,
      title: t.features.luxury,
      desc: t.features.luxurySub
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-[#d4af37]" />,
      title: t.features.drivers,
      desc: t.features.driversSub
    },
    {
      icon: <DollarSign className="h-6 w-6 text-[#d4af37]" />,
      title: t.features.pricing,
      desc: t.features.pricingSub
    }
  ];

  return (
    <section id="about" className="relative border-b border-[#d4af37]/20 bg-[#0b0906] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#d4af37]/20 bg-[#120e0a] p-6 text-start hover:border-[#d4af37]/60 transition-all shadow-lg"
            >
              <div className="mb-4 inline-block rounded-xl border border-[#d4af37]/30 bg-[#1a140e] p-3 shadow-inner">
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-xs text-[#a69883] leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Executive Management Banner */}
        <div className="mt-12 rounded-2xl border-2 border-[#d4af37]/40 bg-gradient-to-r from-[#16110b] via-[#1c150c] to-[#16110b] p-6 sm:p-8 text-center sm:text-start flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-mono">
              ANUBIS VIP TRAVEL MANAGEMENT
            </span>
            <h4 className="text-lg sm:text-xl font-extrabold text-white font-serif">
              {locale === 'ar' ? 'إشراف مباشر وإدارة تنفيذية متخصصة' : 'Direct Executive Supervision & Logistics'}
            </h4>
            <p className="text-xs sm:text-sm text-[#a69883]">
              {locale === 'ar'
                ? 'بإشراف الأستاذ / جهاد حسين (Gihad Hussien) - نلتزم بتقديم أرقى تجربة ضيافة مصرية تليق بضيوفنا من كافة أنحاء العالم.'
                : 'Under the personal direction of Gihad Hussien - Dedicated to delivering regal Egyptian hospitality for international and local guests.'}
            </p>
          </div>

          <a
            href="tel:01091501160"
            className="shrink-0 rounded-xl gold-gradient-bg px-6 py-3 text-xs sm:text-sm font-bold shadow-lg hover:scale-105 transition-all text-black"
          >
            {locale === 'ar' ? 'اتصال مباشر: 01091501160' : 'Call Chauffeur Desk: +20 109 150 1160'}
          </a>
        </div>
      </div>
    </section>
  );
};
