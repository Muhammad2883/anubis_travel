'use client';

import React, { useState } from 'react';
import { Locale } from '@/lib/types';
import { translations } from '@/lib/translations';
import { VEHICLES } from '@/lib/data';
import { Users, Briefcase, CheckCircle2, AlertTriangle, Sparkles, Car } from 'lucide-react';

interface FleetSectionProps {
  locale: Locale;
  onSelectVehicleForTransfer: (slug: string) => void;
}

export const FleetSection: React.FC<FleetSectionProps> = ({ locale, onSelectVehicleForTransfer }) => {
  const t = translations[locale];
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('sedan');

  const activeCategory = VEHICLES.find(v => v.slug === selectedCategorySlug) || VEHICLES[0];

  return (
    <section id="fleet" className="relative border-b border-[#d4af37]/20 bg-[#070503] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#140f0a] px-3.5 py-1 text-xs font-semibold text-[#fae48c] mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
            <span>{locale === 'ar' ? 'أسطول أنوبيس الملكي' : 'Royal Fleet Selection'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
            {t.fleet.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#a69883]">
            {locale === 'ar'
              ? '4 فئات رئيسية معتمدة تناسب العائلات ورجال الأعمال والوفود السياحية، مع خيارات سيارات متعددة لكل فئة'
              : '4 official primary vehicle categories tailored for families, VIP executives, and delegations'}
          </p>
        </div>

        {/* 4 Main Categories Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {VEHICLES.map((vehicle) => {
            const isSelected = selectedCategorySlug === vehicle.slug;

            return (
              <button
                key={vehicle.slug}
                onClick={() => setSelectedCategorySlug(vehicle.slug)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#d4af37] bg-gradient-to-b from-[#1c160e] to-[#120e0a] shadow-xl shadow-[#d4af37]/15 ring-1 ring-[#d4af37]'
                    : 'border-[#d4af37]/25 bg-[#120e0a] hover:border-[#d4af37]/60 hover:bg-[#18130d]'
                }`}
              >
                <span className="text-3xl mb-2">{vehicle.image_url}</span>
                <h3 className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#fae48c]' : 'text-white'}`}>
                  {vehicle.name[locale]}
                </h3>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-[#a69883]">
                  <span>{vehicle.passenger_capacity} {locale === 'ar' ? 'ركاب' : 'Guests'}</span>
                  <span>•</span>
                  <span>{vehicle.luggage_capacity} {locale === 'ar' ? 'حقائب' : 'Bags'}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Category Details & Individual Cars Showcase */}
        <div className="rounded-3xl border border-[#d4af37]/30 bg-[#120e0a] p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#d4af37]/15">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeCategory.image_url}</span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-serif">
                    {activeCategory.name[locale]}
                  </h3>
                  {activeCategory.badge && (
                    <span className="text-xs font-semibold text-[#fae48c]">
                      ★ {activeCategory.badge[locale]}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectVehicleForTransfer(activeCategory.slug)}
              className="rounded-xl gold-gradient-bg px-5 py-2.5 text-xs sm:text-sm font-bold text-black hover:opacity-95 transition-all shadow-md cursor-pointer shrink-0"
            >
              {locale === 'ar' ? 'احجز هذه الفئة في الحاسبة' : 'Book this Category'}
            </button>
          </div>

          {/* Features Checklist */}
          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-3">
              {locale === 'ar' ? 'تجهيزات ومميزات الفئة الأساسية:' : 'Category Amenities:'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activeCategory.features[locale].map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#ede3d1] bg-[#1a140e] p-2.5 rounded-xl border border-[#d4af37]/15">
                  <CheckCircle2 className="h-4 w-4 text-[#38ef7d] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Car Models Under This Category */}
          {activeCategory.models && activeCategory.models.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#d4af37]/15">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#fae48c] mb-4 flex items-center gap-2">
                <Car className="h-4 w-4 text-[#d4af37]" />
                <span>{locale === 'ar' ? 'السيارات والموديلات المتاحة ضمن هذه الفئة:' : 'Available Car Models:'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeCategory.models.map((model) => (
                  <div
                    key={model.id}
                    className="rounded-2xl border border-[#d4af37]/25 bg-[#17120c] p-4 flex flex-col justify-between hover:border-[#d4af37]/60 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-bold text-white">
                          {model.name[locale]}
                        </h5>
                        {model.year && (
                          <span className="rounded-full bg-[#d4af37]/20 px-2 py-0.5 text-[10px] font-mono font-bold text-[#fae48c] border border-[#d4af37]/30">
                            موديل {model.year}
                          </span>
                        )}
                      </div>

                      <ul className="mt-3 space-y-1.5 text-xs text-[#a69883]">
                        {model.features[locale].map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="text-[#d4af37]">•</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#d4af37]/10 flex items-center justify-between text-[11px] text-[#38ef7d]">
                      <span>✓ سيارة معقمة وجاهزة للطلب</span>
                      <span className="text-[#a69883]">سائق سياحي مرخص</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advance Notice Banner */}
          {activeCategory.requiresAdvanceNoticeDays && (
            <div className="mt-6 rounded-xl border border-[#f5d34c]/30 bg-[#241c09] p-3 text-xs text-[#f5d34c] flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>
                {locale === 'ar'
                  ? 'تنبيه: حجز هذه الفئة يتطلب إشعاراً وتأكيداً مسبقاً قبل الموعد بيومين على الأقل.'
                  : 'Notice: This category requires reservation confirmation at least 2 days in advance.'}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
