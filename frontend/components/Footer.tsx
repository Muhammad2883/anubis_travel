'use client';

import React from 'react';
import Image from 'next/image';
import { Locale } from '@/lib/types';
import { translations } from '@/lib/translations';
import { Phone, MessageCircle, MapPin, Mail, ShieldCheck } from 'lucide-react';

interface FooterProps {
  locale: Locale;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ locale, onNavigate }) => {
  const t = translations[locale];

  return (
    <footer id="contact" className="border-t border-[#d4af37]/30 bg-[#060402] text-[#a69883] text-xs">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 p-0.5 shrink-0">
                <Image
                  src="/anubis-logo.png"
                  alt="ANUBIS TRAVEL"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain drop-shadow-[0_3px_10px_rgba(212,175,55,0.35)]"
                />
              </div>
              <div>
                <span className="text-lg font-black text-[#fae48c] font-serif block">
                  {t.brandName}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#a69883] font-mono">
                  {t.brandTagline}
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-[#a69883] max-w-sm">
              {t.footer.desc}
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#fae48c]">
              <ShieldCheck className="h-4 w-4 text-[#d4af37]" />
              <span>{t.management}</span>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('transfers')}
                  className="hover:text-[#fae48c] transition-colors cursor-pointer"
                >
                  {t.nav.transfers}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tours')}
                  className="hover:text-[#fae48c] transition-colors cursor-pointer"
                >
                  {t.nav.tours}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('fleet')}
                  className="hover:text-[#fae48c] transition-colors cursor-pointer"
                >
                  {t.nav.fleet}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#fae48c] transition-colors cursor-pointer"
                >
                  {t.nav.about}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Booking (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              {t.footer.contactInfo}
            </h4>
            <div className="space-y-2.5">
              <a
                href="https://api.whatsapp.com/send?phone=201091501160"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-white hover:text-[#25D366] transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                <span dir="ltr">+20 109 150 1160 (واتساب الحجز)</span>
              </a>

              <a
                href="tel:01091501160"
                className="flex items-center gap-2.5 text-white hover:text-[#d4af37] transition-colors"
              >
                <Phone className="h-4 w-4 text-[#d4af37]" />
                <span dir="ltr">+20 109 150 1160 (مكتب العمليات)</span>
              </a>

              <div className="flex items-center gap-2.5 text-[#a69883]">
                <MapPin className="h-4 w-4 text-[#d4af37] shrink-0" />
                <span>{t.footer.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="mt-12 border-t border-[#d4af37]/15 pt-6 text-center text-[11px] text-[#6e6456]">
          <p>{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};
