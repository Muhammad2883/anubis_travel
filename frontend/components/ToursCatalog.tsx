'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Currency, Locale, Tour } from '@/lib/types';
import { translations } from '@/lib/translations';
import { TOURS } from '@/lib/data';
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
  Calendar
} from 'lucide-react';

interface ToursCatalogProps {
  locale: Locale;
  currency: Currency;
}

export const ToursCatalog: React.FC<ToursCatalogProps> = ({ locale, currency }) => {
  const t = translations[locale];
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  const categories = [
    { id: 'all', label: t.tours.allCategories },
    { id: 'cultural', label: t.tours.cultural },
    { id: 'day_trip', label: t.tours.dayTrips },
    { id: 'adventure', label: t.tours.adventure },
    { id: 'nile_cruise', label: t.tours.nileCruise }
  ];

  const filteredTours = TOURS.filter(tour => {
    if (activeCategory === 'all') return true;
    return tour.category === activeCategory;
  });

  const handleBookTour = (tour: Tour) => {
    const priceConverted = convertPrice(tour.basePriceEgp, currency);
    const ref = generateBookingReference();
    const phone = '201091501160';

    let message = '';
    if (locale === 'ar') {
      message += `🏛️ *حجز جولة سياحية خاصة - أنوبيس ترافيل*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `🔖 *الرقم المرجعي:* ${ref}\n`;
      message += `🗺️ *اسم الجولة:* ${tour.title.ar}\n`;
      message += `⏳ *المدة المقررة:* ${tour.duration.ar}\n`;
      message += `💰 *السعر التقديري:* ${priceConverted} ${currency}\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `أود الاستفسار وتأكيد تفاصيل هذه الجولة مع إدارة أنوبيس ترافيل.`;
    } else {
      message += `🏛️ *PRIVATE TOUR RESERVATION - ANUBIS TRAVEL*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `🔖 *Reference:* ${ref}\n`;
      message += `🗺️ *Tour Title:* ${tour.title.en}\n`;
      message += `⏳ *Duration:* ${tour.duration.en}\n`;
      message += `💰 *Estimated Price:* ${priceConverted} ${currency}\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `I would like to inquire and confirm this bespoke tour with ANUBIS Travel.`;
    }

    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="tours" className="relative border-b border-[#d4af37]/20 bg-[#0b0906] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#140f0a] px-3.5 py-1 text-xs font-semibold text-[#fae48c] mb-3">
            <Compass className="h-3.5 w-3.5 text-[#d4af37]" />
            <span>{locale === 'ar' ? 'رحلات وبرامج ملكية' : 'Curated Royal Experiences'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
            {t.tours.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#a69883]">
            {t.tours.subtitle}
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
                  ? 'gold-gradient-bg shadow-md shadow-[#d4af37]/20 scale-105'
                  : 'border border-[#d4af37]/30 bg-[#140f0a] text-[#ede3d1] hover:border-[#d4af37] hover:text-[#fae48c]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tours Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTours.map((tour) => {
            const priceConverted = convertPrice(tour.basePriceEgp, currency);

            return (
              <div
                key={tour.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#d4af37]/25 bg-[#120e0a] shadow-xl hover:border-[#d4af37] hover:shadow-2xl hover:shadow-[#d4af37]/10 transition-all duration-300"
              >
                {/* Visual Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                  <Image
                    src={tour.imageUrl}
                    alt={tour.title[locale]}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120e0a] via-transparent to-black/40" />

                  {/* Rating Tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-xs font-bold text-[#fae48c] border border-[#d4af37]/30 backdrop-blur-sm">
                    <Star className="h-3.5 w-3.5 fill-[#d4af37] text-[#d4af37]" />
                    <span>{tour.rating}</span>
                    <span className="text-[10px] text-[#a69883]">({tour.reviewsCount})</span>
                  </div>

                  {/* Duration Tag */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-xs font-semibold text-[#ede3d1] border border-[#d4af37]/30 backdrop-blur-sm">
                    <Clock className="h-3 w-3 text-[#d4af37]" />
                    <span>{tour.duration[locale]}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-5 space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#fae48c] transition-colors line-clamp-2">
                      {tour.title[locale]}
                    </h3>
                    <p className="mt-1 text-xs text-[#a69883] line-clamp-2">
                      {tour.subtitle[locale]}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 border-t border-[#d4af37]/15 pt-3">
                    {tour.highlights[locale].slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#ede3d1]">
                        <Sparkles className="h-3.5 w-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
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
                      onClick={() => setSelectedTour(tour)}
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

        {/* Tour Detail Modal */}
        {selectedTour && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-[#d4af37] bg-[#120e0a] p-6 shadow-2xl text-start">
              {/* Modal Close */}
              <button
                onClick={() => setSelectedTour(null)}
                className="absolute top-4 right-4 rounded-full bg-[#1e160e] p-2 text-[#a69883] hover:text-white hover:bg-[#2e2316] cursor-pointer"
              >
                ✕
              </button>

              <div className="space-y-4">
                <div className="inline-flex items-center gap-1 rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-bold text-[#fae48c]">
                  <Clock className="h-3.5 w-3.5 text-[#d4af37]" />
                  <span>{selectedTour.duration[locale]}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white font-serif">
                  {selectedTour.title[locale]}
                </h3>

                <p className="text-xs sm:text-sm text-[#ede3d1] leading-relaxed">
                  {selectedTour.overview[locale]}
                </p>

                {/* Itinerary Timeline */}
                <div className="border-t border-[#d4af37]/20 pt-4">
                  <h4 className="text-sm font-bold text-[#fae48c] mb-3">
                    {t.tours.itinerary}
                  </h4>
                  <div className="space-y-3">
                    {selectedTour.itinerary.map((step, idx) => (
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

                {/* Inclusions & Exclusions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#d4af37]/20 pt-4">
                  <div className="rounded-xl border border-[#38ef7d]/20 bg-[#0d160f] p-3.5">
                    <h5 className="text-xs font-bold text-[#38ef7d] flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{t.tours.inclusions}</span>
                    </h5>
                    <ul className="space-y-1 text-[11px] text-[#ede3d1]">
                      {selectedTour.inclusions[locale].map((inc, i) => (
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
                      {selectedTour.exclusions[locale].map((exc, i) => (
                        <li key={i}>• {exc}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Modal Footer & CTA */}
                <div className="flex items-center justify-between border-t border-[#d4af37]/20 pt-5 mt-4">
                  <div>
                    <span className="text-[11px] text-[#a69883] block">
                      {locale === 'ar' ? 'سعر الجولة التقديري:' : 'Estimated Tour Price:'}
                    </span>
                    <span className="text-2xl font-black text-[#fae48c]">
                      {formatPrice(convertPrice(selectedTour.basePriceEgp, currency), currency, locale)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookTour(selectedTour)}
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
