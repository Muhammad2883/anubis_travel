'use client';

import React, { useState, useMemo } from 'react';
import { Currency, Locale, Vehicle, Route, BookingPayload } from '@/lib/types';
import { translations } from '@/lib/translations';
import { VEHICLES, ROUTES, GENERAL_TERMS } from '@/lib/data';
import { convertPrice, formatPrice, calculateFarHotelSurcharge, generateBookingReference, buildWhatsAppLink } from '@/lib/pricing-engine';
import confetti from 'canvas-confetti';
import {
  Car,
  Users,
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  Plane,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  Sparkles,
  Info
} from 'lucide-react';

interface TransferBookingEngineProps {
  locale: Locale;
  currency: Currency;
  routes?: Route[];
}

export const TransferBookingEngine: React.FC<TransferBookingEngineProps> = ({ locale, currency, routes = ROUTES }) => {
  const t = translations[locale];
  const routesList = routes && routes.length > 0 ? routes : ROUTES;

  // Form State
  const [selectedRouteId, setSelectedRouteId] = useState<number>(() => routesList[0]?.id || 1);
  const [selectedVehicleSlug, setSelectedVehicleSlug] = useState<string>('sedan');
  const [pickupDate, setPickupDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [pickupTime, setPickupTime] = useState<string>('09:00');
  const [pickupLocation, setPickupLocation] = useState<string>('');
  const [dropoffLocation, setDropoffLocation] = useState<string>('');
  const [flightNumber, setFlightNumber] = useState<string>('');
  const [isFarHotel, setIsFarHotel] = useState<boolean>(false);
  const [passengersCount, setPassengersCount] = useState<number>(1);
  const [luggageCount, setLuggageCount] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Confirmation Modal State
  const [bookingSuccessPayload, setBookingSuccessPayload] = useState<BookingPayload | null>(null);

  // Active Route
  const activeRoute = useMemo(() => {
    return routesList.find(r => r.id === selectedRouteId) || routesList[0] || ROUTES[0];
  }, [routesList, selectedRouteId]);

  // Active Vehicle
  const activeVehicle = useMemo(() => {
    return VEHICLES.find(v => v.slug === selectedVehicleSlug) || VEHICLES[0];
  }, [selectedVehicleSlug]);

  // Is Selected Route an Airport Route?
  const isAirportRoute = activeRoute.category === 'airport';

  // Calculate Base Price in EGP for a vehicle
  const getVehiclePriceEgp = (vehicle: Vehicle): number | null => {
    const rawPrice = activeRoute.prices[vehicle.slug as keyof typeof activeRoute.prices];
    if (rawPrice === null || rawPrice === undefined) return null;

    let totalEgp = rawPrice;
    if (isFarHotel) {
      totalEgp += calculateFarHotelSurcharge(vehicle.slug);
    }
    return totalEgp;
  };

  // Current Total Price in active currency
  const currentTotalEgp = useMemo(() => {
    return getVehiclePriceEgp(activeVehicle) || 0;
  }, [activeVehicle, activeRoute, isFarHotel]);

  const currentTotalConverted = useMemo(() => {
    return convertPrice(currentTotalEgp, currency);
  }, [currentTotalEgp, currency]);

  // Handle Booking - Automatically dispatches to Management WhatsApp and saves to CRM
  const handleBooking = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert(locale === 'ar' ? 'يرجى إدخال اسم العميل ورقم الهاتف / الواتساب للمتابعة.' : 'Please provide your name and phone/WhatsApp number.');
      return;
    }

    const ref = generateBookingReference();
    const payload: BookingPayload = {
      bookingReference: ref,
      type: 'transfer',
      itemId: activeRoute.id,
      itemName: activeRoute.title[locale],
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      flightNumber: flightNumber.trim() || undefined,
      pickupDate,
      pickupTime,
      pickupLocation: pickupLocation.trim() || (locale === 'ar' ? 'فندق العميل' : 'Hotel Lobby'),
      dropoffLocation: dropoffLocation.trim() || undefined,
      selectedVehicle: activeVehicle.name[locale],
      isFarHotel,
      passengersCount,
      luggageCount,
      totalAmount: currentTotalConverted,
      currency,
      notes: notes.trim() || undefined
    };

    // 1. Prepare Admin CRM record
    const newBookingAdmin = {
      id: String(Date.now()),
      reference: ref,
      type: 'transfer' as const,
      title: `${activeRoute.title.ar} (${activeVehicle.name.ar})`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      pickupDate,
      pickupTime,
      pickupLocation: pickupLocation.trim() || (locale === 'ar' ? 'فندق العميل' : 'Hotel Lobby'),
      dropoffLocation: dropoffLocation.trim() || undefined,
      vehicleName: activeVehicle.name.ar,
      amountEgp: currentTotalEgp,
      status: 'pending' as const,
      flightNumber: flightNumber.trim() || undefined,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    // 2. Persist booking to /api/bookings and local sync
    try {
      fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking: newBookingAdmin })
      }).catch(e => console.warn('Could not POST /api/bookings:', e));

      const existingCached = localStorage.getItem('anubis_bookings');
      const list = existingCached ? JSON.parse(existingCached) : [];
      localStorage.setItem('anubis_bookings', JSON.stringify([newBookingAdmin, ...list]));
      window.dispatchEvent(new Event('anubis_bookings_updated'));
    } catch (e) {
      console.error('Booking sync error:', e);
    }

    setBookingSuccessPayload(payload);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    // 3. AUTOMATIC DISPATCH TO MANAGEMENT WHATSAPP (+20 109 150 1160)
    const link = buildWhatsAppLink(payload, locale);
    window.open(link, '_blank');
  };

  return (
    <section id="transfers" className="relative border-b border-[#d4af37]/20 bg-[#070503] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#140f0a] px-3.5 py-1 text-xs font-semibold text-[#fae48c] mb-3">
            <Car className="h-3.5 w-3.5 text-[#d4af37]" />
            <span>{locale === 'ar' ? 'حاسبة النقل المباشرة' : 'Instant Fare Calculator'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
            {t.transfers.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#a69883]">
            {t.transfers.subtitle}
          </p>
        </div>

        {/* Main Booking Engine Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-5 sm:p-7 shadow-xl shadow-black/60">
            {/* Step 1: Select Route */}
            <div>
              <label className="block text-sm font-bold text-[#fae48c] mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#d4af37]" />
                <span>{t.transfers.selectRoute}</span>
              </label>
              <div className="relative">
                <select
                  value={selectedRouteId}
                  onChange={(e) => setSelectedRouteId(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#d4af37]/40 bg-[#1a140e] px-4 py-3 text-sm font-medium text-[#ede3d1] focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                >
                  {routesList.map((route) => (
                    <option key={route.id} value={route.id} className="bg-[#120e0a] text-white">
                      {route.id}. {route.title[locale]} ({route.estimatedDuration[locale]})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-[#a69883]">
                <span>{locale === 'ar' ? 'المدة التقديرية:' : 'Estimated Duration:'} <strong className="text-[#fae48c]">{activeRoute.estimatedDuration[locale]}</strong></span>
                <span>{locale === 'ar' ? 'تسعير رسمي معتمد' : 'Official Verified Tariff'}</span>
              </div>
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#ede3d1] mb-1.5 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#d4af37]" />
                  <span>{t.transfers.pickupDate}</span>
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2.5 text-xs text-[#ede3d1] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ede3d1] mb-1.5 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#d4af37]" />
                  <span>{t.transfers.pickupTime}</span>
                </label>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2.5 text-xs text-[#ede3d1] focus:border-[#d4af37] focus:outline-none"
                />
              </div>
            </div>

            {/* Locations Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#ede3d1] mb-1.5">
                  {t.transfers.pickupLocation}
                </label>
                <input
                  type="text"
                  placeholder={locale === 'ar' ? 'مثال: فندق ماريوت الزمالك / صالة 3' : 'e.g. Marriott Hotel / Terminal 3'}
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2.5 text-xs text-[#ede3d1] placeholder-[#6e6456] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ede3d1] mb-1.5">
                  {t.transfers.dropoffLocation}
                </label>
                <input
                  type="text"
                  placeholder={locale === 'ar' ? 'مثال: الأهرامات / المعادي / المطار' : 'e.g. Pyramids / Maadi / Airport'}
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2.5 text-xs text-[#ede3d1] placeholder-[#6e6456] focus:border-[#d4af37] focus:outline-none"
                />
              </div>
            </div>

            {/* Flight Number if Airport */}
            <div>
              <label className="block text-xs font-semibold text-[#ede3d1] mb-1.5 flex items-center gap-1.5">
                <Plane className="h-3.5 w-3.5 text-[#d4af37]" />
                <span>{t.transfers.flightNumber}</span>
              </label>
              <input
                type="text"
                placeholder={t.transfers.flightPlaceholder}
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2.5 text-xs text-[#ede3d1] placeholder-[#6e6456] focus:border-[#d4af37] focus:outline-none uppercase font-mono"
              />
            </div>

            {/* Far Hotel Surcharge Checkbox */}
            <div className="rounded-xl border border-[#d4af37]/20 bg-[#16110b] p-3.5 flex items-start gap-3">
              <input
                id="farHotelToggle"
                type="checkbox"
                checked={isFarHotel}
                onChange={(e) => setIsFarHotel(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#d4af37] text-[#d4af37] focus:ring-[#d4af37] cursor-pointer"
              />
              <label htmlFor="farHotelToggle" className="text-xs leading-relaxed text-[#ede3d1] cursor-pointer">
                <span className="font-bold text-[#fae48c]">{t.transfers.farHotelQuestion}</span>
                <span className="block text-[#a69883] text-[11px] mt-0.5">{t.transfers.farHotelHint}</span>
              </label>
            </div>

            {/* Customer Contact Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#d4af37]/15">
              <div>
                <label className="block text-xs font-semibold text-[#fae48c] mb-1.5">
                  {locale === 'ar' ? 'اسم العميل الكريم:' : 'Client Full Name:'} *
                </label>
                <input
                  type="text"
                  placeholder={locale === 'ar' ? 'الاسم بالكامل' : 'Your full name'}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-[#d4af37]/40 bg-[#1a140e] px-3.5 py-2.5 text-xs text-[#ede3d1] focus:border-[#d4af37] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#fae48c] mb-1.5">
                  {locale === 'ar' ? 'رقم الهاتف / الواتساب للتأكيد:' : 'WhatsApp / Mobile Phone:'} *
                </label>
                <input
                  type="tel"
                  placeholder={locale === 'ar' ? '010XXXXXXXX أو مع كود الدولة' : '+20 10X XXX XXXX'}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#d4af37]/40 bg-[#1a140e] px-3.5 py-2.5 text-xs text-[#ede3d1] focus:border-[#d4af37] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Notes Field */}
            <div>
              <label className="block text-xs font-semibold text-[#ede3d1] mb-1.5">
                {locale === 'ar' ? 'ملاحظات خاصة (مقاعد أطفال، طلبات معينة):' : 'Special Requests & Notes:'}
              </label>
              <textarea
                rows={2}
                placeholder={locale === 'ar' ? 'أي تعليمات خاصة بالسائق أو موعد الهبوط...' : 'Child seats, extra stops, or arrival instructions...'}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-xs text-[#ede3d1] placeholder-[#6e6456] focus:border-[#d4af37] focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Right Column: Fleet Comparison & Price Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <h3 className="text-base font-bold text-[#fae48c] flex items-center gap-2">
              <Car className="h-4 w-4 text-[#d4af37]" />
              <span>{t.transfers.selectVehicle}</span>
            </h3>

            {/* Vehicle Selection Cards */}
            <div className="space-y-3">
              {VEHICLES.map((vehicle) => {
                const priceEgp = getVehiclePriceEgp(vehicle);
                const isSelected = selectedVehicleSlug === vehicle.slug;
                const isAvailable = priceEgp !== null;
                const priceConverted = isAvailable ? convertPrice(priceEgp, currency) : null;

                return (
                  <div
                    key={vehicle.slug}
                    onClick={() => isAvailable && setSelectedVehicleSlug(vehicle.slug)}
                    className={`relative rounded-xl border p-4 transition-all ${
                      !isAvailable
                        ? 'opacity-40 border-gray-800 bg-[#0d0a07] cursor-not-allowed'
                        : isSelected
                        ? 'border-[#d4af37] bg-[#1a140d] shadow-lg shadow-[#d4af37]/10 ring-1 ring-[#d4af37] cursor-pointer'
                        : 'border-[#d4af37]/25 bg-[#120e0a] hover:border-[#d4af37]/60 hover:bg-[#16110c] cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{vehicle.image_url}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">
                              {vehicle.name[locale]}
                            </h4>
                            {vehicle.badge && (
                              <span className="rounded bg-[#d4af37]/20 px-2 py-0.5 text-[10px] font-semibold text-[#fae48c]">
                                {vehicle.badge[locale]}
                              </span>
                            )}
                          </div>

                          {/* Capacity badges */}
                          <div className="mt-1 flex items-center gap-3 text-xs text-[#a69883]">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-[#d4af37]" />
                              {vehicle.passenger_capacity} {locale === 'ar' ? 'ركاب' : 'Guests'}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3 text-[#d4af37]" />
                              {vehicle.luggage_capacity} {locale === 'ar' ? 'حقائب' : 'Bags'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Price Badge */}
                      <div className="text-end shrink-0">
                        {isAvailable ? (
                          <div className="text-base font-black text-[#fae48c]">
                            {formatPrice(priceConverted!, currency, locale)}
                          </div>
                        ) : (
                          <span className="text-xs text-[#a69883]">غير متاح</span>
                        )}
                      </div>
                    </div>

                    {/* Advance Notice Alert for H1 / HiAce */}
                    {vehicle.requiresAdvanceNoticeDays && isSelected && (
                      <div className="mt-3 rounded-lg border border-[#f5d34c]/30 bg-[#241c09] p-2 text-[11px] text-[#f5d34c] flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        <span>{t.transfers.advanceNoticeAlert}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Total Fare Card & Actions */}
            <div className="rounded-2xl border-2 border-[#d4af37] bg-gradient-to-br from-[#1c160e] to-[#120e0a] p-6 shadow-2xl shadow-[#d4af37]/15">
              <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/20">
                <span className="text-sm font-bold text-[#ede3d1]">{t.transfers.totalEstimated}</span>
                <div className="text-end">
                  <div className="text-2xl sm:text-3xl font-black text-[#fae48c]">
                    {formatPrice(currentTotalConverted, currency, locale)}
                  </div>
                  <span className="text-[11px] text-[#38ef7d] font-semibold">
                    ✓ {locale === 'ar' ? 'شامل البنزين والرسوم' : 'All-inclusive guaranteed'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={handleBooking}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#1ebe5d] px-5 py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-[#25D366]/20 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{locale === 'ar' ? 'تأكيد الحجز والإرسال المباشر لواتساب الإدارة' : 'Confirm & Send to Management WhatsApp'}</span>
                </button>
              </div>

              <p className="mt-3 text-center text-[11px] text-[#a69883]">
                {GENERAL_TERMS[locale].management}
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {bookingSuccessPayload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-lg rounded-2xl border-2 border-[#d4af37] bg-[#120e0a] p-6 shadow-2xl text-start">
              <div className="flex items-center gap-3 text-[#38ef7d] mb-4">
                <Sparkles className="h-6 w-6" />
                <h3 className="text-lg font-bold text-white">
                  {locale === 'ar' ? 'تم إرسال طلب الحجز لواتساب الإدارة بنجاح!' : 'Booking Sent to Management WhatsApp!'}
                </h3>
              </div>

              <div className="rounded-xl border border-[#d4af37]/30 bg-[#1a140e] p-4 space-y-2 text-xs text-[#ede3d1] mb-5">
                <div className="flex justify-between border-b border-[#d4af37]/15 pb-2">
                  <span className="text-[#a69883]">{t.transfers.bookingRef}</span>
                  <span className="font-mono font-bold text-[#fae48c] text-sm">{bookingSuccessPayload.bookingReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a69883]">{locale === 'ar' ? 'الخدمة:' : 'Service:'}</span>
                  <span className="font-medium text-white">{bookingSuccessPayload.itemName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a69883]">{locale === 'ar' ? 'المركبة:' : 'Vehicle:'}</span>
                  <span className="font-medium text-white">{bookingSuccessPayload.selectedVehicle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a69883]">{locale === 'ar' ? 'الموعد:' : 'Pickup:'}</span>
                  <span className="font-medium text-white">{bookingSuccessPayload.pickupDate} ({bookingSuccessPayload.pickupTime})</span>
                </div>
                <div className="flex justify-between border-t border-[#d4af37]/15 pt-2">
                  <span className="text-[#a69883]">{locale === 'ar' ? 'الإجمالي التقديري:' : 'Total:'}</span>
                  <span className="font-bold text-[#fae48c] text-sm">{bookingSuccessPayload.totalAmount} {bookingSuccessPayload.currency}</span>
                </div>
              </div>

              <p className="text-xs text-[#a69883] mb-6">
                {locale === 'ar'
                  ? 'تم فتح تطبيق واتساب وتجهيز تفاصيل الحجز بالكامل لإرسالها مباشرة لرقم إدارة أنوبيس ترافيل (01091501160) للمتابعة والتأكيد الفوري.'
                  : 'WhatsApp has been opened with your full reservation details addressed to ANUBIS Travel management (+20 109 150 1160).'}
              </p>

              <div className="flex items-center gap-3">
                <a
                  href={buildWhatsAppLink(bookingSuccessPayload, locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#1ebe5d] py-3 text-xs font-bold text-white shadow-md hover:opacity-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{locale === 'ar' ? 'إعادة فتح محادثة الواتساب الآن' : 'Re-open WhatsApp Chat'}</span>
                </a>

                <button
                  onClick={() => setBookingSuccessPayload(null)}
                  className="rounded-xl border border-[#d4af37]/40 bg-[#1a140e] px-4 py-3 text-xs font-semibold text-[#ede3d1] hover:bg-[#241c14] cursor-pointer"
                >
                  {locale === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
