'use client';

import React from 'react';
import { Locale } from '@/lib/types';
import { translations } from '@/lib/translations';
import { VEHICLES } from '@/lib/data';
import { Users, Briefcase, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface FleetSectionProps {
  locale: Locale;
  onSelectVehicleForTransfer: (slug: string) => void;
}

export const FleetSection: React.FC<FleetSectionProps> = ({ locale, onSelectVehicleForTransfer }) => {
  const t = translations[locale];

  return (
    <section id="fleet" className="relative border-b border-[#d4af37]/20 bg-[#070503] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#140f0a] px-3.5 py-1 text-xs font-semibold text-[#fae48c] mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
            <span>{locale === 'ar' ? 'معايير الراحة والسلامة' : 'Fleet Standards'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
            {t.fleet.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#a69883]">
            {t.fleet.subtitle}
          </p>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VEHICLES.map((vehicle) => (
            <div
              key={vehicle.slug}
              className="flex flex-col justify-between rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-6 shadow-xl hover:border-[#d4af37] hover:shadow-2xl hover:shadow-[#d4af37]/15 transition-all group"
            >
              <div>
                {/* Vehicle Emoji / Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl transform group-hover:scale-110 transition-transform">
                    {vehicle.image_url}
                  </span>
                  {vehicle.badge && (
                    <span className="rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-2.5 py-1 text-[10px] font-bold text-[#fae48c]">
                      {vehicle.badge[locale]}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-base font-bold text-white group-hover:text-[#fae48c] transition-colors">
                  {vehicle.name[locale]}
                </h3>

                {/* Capacity Badges */}
                <div className="mt-3 flex items-center gap-3 text-xs text-[#a69883] border-y border-[#d4af37]/15 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[#d4af37]" />
                    <span className="text-[#ede3d1] font-medium">{vehicle.passenger_capacity} {locale === 'ar' ? 'ركاب' : 'Guests'}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-[#d4af37]" />
                    <span className="text-[#ede3d1] font-medium">{vehicle.luggage_capacity} {locale === 'ar' ? 'حقائب' : 'Bags'}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="mt-4 space-y-2 text-xs text-[#a69883]">
                  {vehicle.features[locale].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#38ef7d] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Advance Notice Alert */}
                {vehicle.requiresAdvanceNoticeDays && (
                  <div className="mt-4 rounded-lg border border-[#f5d34c]/30 bg-[#241c09] p-2 text-[11px] text-[#f5d34c] flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>{locale === 'ar' ? 'حجز مسبق بيومين' : '2 Days Advance Notice'}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectVehicleForTransfer(vehicle.slug)}
                className="mt-6 w-full rounded-xl border border-[#d4af37]/50 bg-[#1a140e] py-2.5 text-xs font-bold text-[#ede3d1] hover:bg-[#d4af37] hover:text-black transition-all cursor-pointer"
              >
                {locale === 'ar' ? 'اختر في حاسبة النقل' : 'Select in Calculator'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
