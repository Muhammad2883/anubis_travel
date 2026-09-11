'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Currency, Locale, Route } from '@/lib/types';
import { translations } from '@/lib/translations';
import { ROUTES } from '@/lib/data';
import { convertPrice, formatPrice, generateBookingReference } from '@/lib/pricing-engine';
import {
  Compass,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  MessageCircle,
  ChevronRight,
  Sparkles,
  MapPin,
  Calendar,
  Car
} from 'lucide-react';

interface ToursCatalogProps {
  locale: Locale;
  currency: Currency;
  routes?: Route[];
}

export const ToursCatalog: React.FC<ToursCatalogProps> = ({ locale, currency, routes = ROUTES }) => {
  const t = translations[locale];
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  const categories = [
    { id: 'all', label: locale === 'ar' ? 'جميع البرامج والجولات' : 'All Programs & Tours' },
    { id: 'day_tour', label: locale === 'ar' ? 'جولات اليوم الواحد' : 'Day Sightseeing Tours' },
    { id: 'overday', label: locale === 'ar' ? 'رحلات أوفر داي' : 'Overday Trips' },
    { id: 'multiday', label: locale === 'ar' ? 'سفاري وإقامة مبيت' : 'Safari & Multi-Day' },
    { id: 'nile_cruise', label: locale === 'ar' ? 'سهرات وعشاء نيلي' : 'Nile Dinner Cruises' }
  ];

  // Filter routes that are flagged for the catalog
  const catalogRoutes = (routes && routes.length > 0 ? routes : ROUTES).filter(route => {
    // Only show if not explicitly hidden
    if (route.showInCatalog === false) return false;

    if (activeCategory === 'all') return true;
    return route.category === activeCategory;
  });

  const getStartingPrice = (route: Route): number => {
    if (route.prices.sedan && route.prices.sedan > 0) return route.prices.sedan;
    if (route.prices['7seater'] && route.prices['7seater'] > 0) return route.prices['7seater'];
    if (route.prices.h1 && route.prices.h1 > 0) return route.prices.h1;
    if (route.prices.hiace && route.prices.hiace > 0) return route.prices.hiace;
    return 0;
  };

  const handleBookTour = (route: Route) => {
    const basePrice = getStartingPrice(route);
    const priceConverted = convertPrice(basePrice, currency);
    const ref = generateBookingReference();
    const phone = '201091501160';

    let message = '';
    if (locale === 'ar') {
      message += `🏛️ *حجز برنامج سياحي خاص - أنوبيس ترافيل*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `🔖 *الرقم المرجعي:* ${ref}\n`;
      message += `🗺️ *اسم البرنامج / المسار:* ${route.title.ar}\n`;
      message += `⏳ *المدة المقررة:* ${route.estimatedDuration.ar}\n`;
      message += `💰 *السعر التقديري (سيدان ملاكي):* ${priceConverted} ${currency}\n`;
      if (route.prices['7seater']) {
        message += `🚙 *سعر 7 راكب عائلي:* ${convertPrice(route.prices['7seater'], currency)} ${currency}\n`;
      }
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `أود الاستفسار وتأكيد تفاصيل هذا البرنامج السياحي مع إدارة أنوبيس ترافيل.`;
    } else {
      message += `🏛️ *BESPOKE TOUR RESERVATION - ANUBIS TRAVEL*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `🔖 *Reference:* ${ref}\n`;
      message += `🗺️ *Tour / Route:* ${route.title.en}\n`;
      message += `⏳ *Duration:* ${route.estimatedDuration.en}\n`;
      message += `💰 *Estimated Price (Sedan):* ${priceConverted} ${currency}\n`;
      if (route.prices['7seater']) {
        message += `🚙 *7-Seater Family Price:* ${convertPrice(route.prices['7seater'], currency)} ${currency}\n`;
      }
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `I would like to inquire and confirm this tour program with ANUBIS Travel management.`;
    }

    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="tours" className="relative border-b border-[#d4af37]/20 bg-[#0b0906] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#140f0a] px-3.5 py-1 text-xs font-semibold text-[#fae48c] mb-3">
            <Compass className="h-3.5 w-3.5 text-[#d4af37]" />
            <span>{locale === 'ar' ? 'برامج سياحية ملكية حصرية' : 'Curated Royal Experiences & Tours'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
            {locale === 'ar' ? 'كتالوج الجولات والبرامج السياحية المميزة' : 'Featured Bespoke Tours & Sightseeing'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#a69883]">
            {locale === 'ar'
              ? 'اختر من باقة برامج أنوبيس المتكاملة، تشمل سيارات حديثة مكيفة وسائقين معتمدين ومرونة تامة في خطوط السير.'
              : 'Discover private day tours and desert expeditions curated with luxury chauffeured vehicles and licensed guides.'}
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'gold-gradient-bg shadow-md shadow-[#d4af37]/20 scale-105 text-black'
                  : 'border border-[#d4af37]/30 bg-[#140f0a] text-[#ede3d1] hover:border-[#d4af37] hover:text-[#fae48c]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tours Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {catalogRoutes.map((route) => {
            const basePrice = getStartingPrice(route);
            const priceConverted = convertPrice(basePrice, currency);
            const highlightsList = route.highlights?.[locale] || [];

            return (
              <div
                key={route.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#d4af37]/25 bg-[#120e0a] shadow-xl hover:border-[#d4af37] hover:shadow-2xl hover:shadow-[#d4af37]/10 transition-all duration-300"
              >
                {/* Visual Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                  <Image
                    src={route.imageUrl || '/hero-pyramids.jpg'}
                    alt={route.title[locale]}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120e0a] via-transparent to-black/40" />

                  {/* Rating Tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-xs font-bold text-[#fae48c] border border-[#d4af37]/30 backdrop-blur-sm">
                    <Star className="h-3.5 w-3.5 fill-[#d4af37] text-[#d4af37]" />
                    <span>{route.rating || 4.9}</span>
                    <span className="text-[10px] text-[#a69883]">({route.reviewsCount || 85})</span>
                  </div>

                  {/* Duration Tag */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-xs font-semibold text-[#ede3d1] border border-[#d4af37]/30 backdrop-blur-sm">
                    <Clock className="h-3 w-3 text-[#d4af37]" />
                    <span>{route.estimatedDuration[locale]}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-5 space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#fae48c] transition-colors line-clamp-2">
                      {route.title[locale]}
                    </h3>
                    {route.subtitle?.[locale] && (
                      <p className="mt-1 text-xs text-[#a69883] line-clamp-2">
                        {route.subtitle[locale]}
                      </p>
                    )}
                  </div>

                  {/* Highlights */}
                  {highlightsList.length > 0 && (
                    <div className="space-y-1.5 border-t border-[#d4af37]/15 pt-3">
                      {highlightsList.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#ede3d1]">
                          <Sparkles className="h-3.5 w-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fleet Price Grid Pill */}
                  <div className="grid grid-cols-2 gap-2 border-t border-[#d4af37]/15 pt-3 text-[11px]">
                    <div className="rounded-lg bg-[#18120c] p-1.5 px-2 border border-[#d4af37]/10 flex items-center justify-between">
                      <span className="text-[#a69883]">سيدان:</span>
                      <strong className="font-mono text-[#fae48c]">
                        {formatPrice(convertPrice(route.prices.sedan, currency), currency, locale)}
                      </strong>
                    </div>
                    <div className="rounded-lg bg-[#18120c] p-1.5 px-2 border border-[#d4af37]/10 flex items-center justify-between">
                      <span className="text-[#a69883]">7 راكب:</span>
                      <strong className="font-mono text-[#fae48c]">
                        {formatPrice(convertPrice(route.prices['7seater'], currency), currency, locale)}
                      </strong>
                    </div>
                  </div>

                  {/* Price & Action Row */}
                  <div className="mt-auto flex items-center justify-between border-t border-[#d4af37]/15 pt-4">
                    <div>
                      <span className="text-[10px] uppercase text-[#a69883] block">
                        {locale === 'ar' ? 'يبدأ من' : 'Starting from'}
                      </span>
                      <span className="text-lg font-black text-[#fae48c]">
                        {formatPrice(priceConverted, currency, locale)}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedRoute(route)}
                      className="flex items-center gap-1 rounded-xl border border-[#d4af37]/50 bg-[#1a140e] px-3.5 py-2 text-xs font-bold text-[#ede3d1] hover:bg-[#d4af37] hover:text-black transition-all cursor-pointer"
                    >
                      <span>{t.tours.detailsBtn}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Route / Tour Detail Modal */}
        {selectedRoute && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-[#d4af37] bg-[#120e0a] p-6 shadow-2xl text-start">
              {/* Modal Close */}
              <button
                onClick={() => setSelectedRoute(null)}
                className="absolute top-4 right-4 rounded-full bg-[#1e160e] p-2 text-[#a69883] hover:text-white hover:bg-[#2e2316] cursor-pointer"
              >
                ✕
              </button>

              <div className="space-y-4">
                <div className="inline-flex items-center gap-1 rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#fae48c]">
                  <Clock className="h-3.5 w-3.5 text-[#d4af37]" />
                  <span>{selectedRoute.estimatedDuration[locale]}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white font-serif">
                  {selectedRoute.title[locale]}
                </h3>

                {selectedRoute.overview?.[locale] && (
                  <p className="text-xs sm:text-sm text-[#ede3d1] leading-relaxed">
                    {selectedRoute.overview[locale]}
                  </p>
                )}

                {/* Fleet Pricing Breakdown in Modal */}
                <div className="rounded-xl border border-[#d4af37]/30 bg-[#16110b] p-4">
                  <h4 className="text-xs font-bold text-[#fae48c] mb-2 flex items-center gap-1.5">
                    <Car className="h-4 w-4 text-[#d4af37]" />
                    <span>{locale === 'ar' ? 'تسعير البرنامج حسب فئة المركبة:' : 'Pricing by Vehicle Class:'}</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                    <div className="rounded-lg bg-[#120e0a] p-2 border border-[#d4af37]/15">
                      <span className="text-[10px] text-[#a69883] block">ملاكي سيدان</span>
                      <strong className="text-sm font-mono text-[#fae48c] mt-0.5 block">
                        {formatPrice(convertPrice(selectedRoute.prices.sedan, currency), currency, locale)}
                      </strong>
                    </div>
                    <div className="rounded-lg bg-[#120e0a] p-2 border border-[#d4af37]/15">
                      <span className="text-[10px] text-[#a69883] block">7 راكب عائلي</span>
                      <strong className="text-sm font-mono text-[#fae48c] mt-0.5 block">
                        {formatPrice(convertPrice(selectedRoute.prices['7seater'], currency), currency, locale)}
                      </strong>
                    </div>
                    <div className="rounded-lg bg-[#120e0a] p-2 border border-[#d4af37]/15">
                      <span className="text-[10px] text-[#a69883] block">H1 فارهة</span>
                      <strong className="text-sm font-mono text-[#fae48c] mt-0.5 block">
                        {selectedRoute.prices.h1 ? formatPrice(convertPrice(selectedRoute.prices.h1, currency), currency, locale) : '-'}
                      </strong>
                    </div>
                    <div className="rounded-lg bg-[#120e0a] p-2 border border-[#d4af37]/15">
                      <span className="text-[10px] text-[#a69883] block">هاي إس HiAce</span>
                      <strong className="text-sm font-mono text-[#fae48c] mt-0.5 block">
                        {selectedRoute.prices.hiace ? formatPrice(convertPrice(selectedRoute.prices.hiace, currency), currency, locale) : '-'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Itinerary Timeline */}
                {selectedRoute.itinerary && selectedRoute.itinerary.length > 0 && (
                  <div className="border-t border-[#d4af37]/20 pt-4">
                    <h4 className="text-sm font-bold text-[#fae48c] mb-3">
                      {t.tours.itinerary}
                    </h4>
                    <div className="space-y-3">
                      {selectedRoute.itinerary.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3 rounded-xl border border-[#d4af37]/20 bg-[#18120c] p-3 text-xs">
                          <span className="rounded bg-[#d4af37]/20 px-2 py-1 font-mono font-bold text-[#fae48c] shrink-0">
                            {step.time}
                          </span>
                          <div>
                            <strong className="block text-white font-semibold">{step.title[locale]}</strong>
                            <span className="text-[#a69883] mt-0.5 block">{step.description[locale]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inclusions & Exclusions */}
                {selectedRoute.inclusions?.[locale] && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#d4af37]/20 pt-4">
                    <div className="rounded-xl border border-[#38ef7d]/20 bg-[#0d160f] p-3.5">
                      <h5 className="text-xs font-bold text-[#38ef7d] flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{t.tours.inclusions}</span>
                      </h5>
                      <ul className="space-y-1 text-[11px] text-[#ede3d1]">
                        {selectedRoute.inclusions[locale].map((inc, i) => (
                          <li key={i}>• {inc}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-[#ff4757]/20 bg-[#1a0f0f] p-3.5">
                      <h5 className="text-xs font-bold text-[#ff4757] flex items-center gap-1.5 mb-2">
                        <XCircle className="h-4 w-4" />
                        <span>{t.tours.exclusions}</span>
                      </h5>
                      <ul className="space-y-1 text-[11px] text-[#a69883]">
                        {(selectedRoute.exclusions?.[locale] || []).map((exc, i) => (
                          <li key={i}>• {exc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Modal Footer & CTA */}
                <div className="flex items-center justify-between border-t border-[#d4af37]/20 pt-5 mt-4">
                  <div>
                    <span className="text-[11px] text-[#a69883] block">
                      {locale === 'ar' ? 'يبدأ السعر من (سيدان ملاكي):' : 'Starting from (Sedan):'}
                    </span>
                    <span className="text-2xl font-black text-[#fae48c]">
                      {formatPrice(convertPrice(getStartingPrice(selectedRoute), currency), currency, locale)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookTour(selectedRoute)}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#1ebe5d] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{t.tours.bookTourBtn}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
