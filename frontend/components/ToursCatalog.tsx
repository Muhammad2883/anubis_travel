'use client';

import React, { useState, useMemo } from 'react';
import { Currency, Locale, Route } from '@/lib/types';
import { convertPrice, formatPrice, generateBookingReference } from '@/lib/pricing-engine';
import confetti from 'canvas-confetti';
import {
  Search,
  CheckCircle,
  MessageCircle,
  Sparkles,
  X,
  Calendar,
  Clock,
  Plane,
  Phone,
  User,
  MapPin,
  Car
} from 'lucide-react';

interface TableTourItem {
  id: string;
  name_ar: string;
  name_en: string;
  detail_ar: string;
  detail_en: string;
  duration_ar?: string;
  duration_en?: string;
  sedan: number;
  family: number;
  h1: number | null;
  hiace: number | null;
}

// Master Data synchronized exactly from index.html (Official Excel Sheet)
const tableDataCairo: TableTourItem[] = [
  {
    id: "cairo-1",
    name_ar: "هرم - ممفيس - سقارة",
    name_en: "Pyramids - Memphis - Saqqara",
    detail_ar: "أهرامات الجيزة، تمثال رمسيس بممفيس، هرم زوسر المدرج بسقارة",
    detail_en: "Giza Pyramids, Sphinx, Colossus of Ramesses II at Memphis, and Djoser Step Pyramid in Saqqara",
    sedan: 1000,
    family: 1500,
    h1: 2300,
    hiace: 2600
  },
  {
    id: "cairo-2",
    name_ar: "هرم - ممفيس - سقارة - دهشور",
    name_en: "Pyramids - Memphis - Saqqara - Dahshur",
    detail_ar: "جولة فرعونية كاملة تشمل الهرم المنحني والهرم الأحمر بدهشور",
    detail_en: "Grand Pharaonic circuit including the Bent Pyramid & Red Pyramid at Dahshur",
    sedan: 1200,
    family: 1700,
    h1: 2500,
    hiace: 2800
  },
  {
    id: "cairo-3",
    name_ar: "يومية بلد 3 مزار",
    name_en: "Cairo City Day (3 Sights)",
    detail_ar: "8 ساعات فقط أو عند الانتهاء من الـ 3 مزارات (لأي تفاصيل أخرى خاصة باليومية تواصل على الواتساب)",
    detail_en: "8 hours only or upon completing the 3 sights (for any other day tour details, please contact via WhatsApp)",
    sedan: 1000,
    family: 1500,
    h1: 2300,
    hiace: 2600
  },
  {
    id: "cairo-4",
    name_ar: "يومية بلد 4 مزار",
    name_en: "Cairo City Grand Day (4 Sights)",
    detail_ar: "برنامج مكثف يشمل 4 معالم تاريخية وإسلامية وقبطية كبرى (العمل من 8 ص حتى 5 م)",
    detail_en: "Intensive 4-sight itinerary spanning Islamic, Coptic, and ancient landmarks (9 hrs)",
    sedan: 1150,
    family: 1700,
    h1: 2500,
    hiace: 2800
  },
  {
    id: "cairo-5",
    name_ar: "نصف يومية مزار فقط",
    name_en: "Half-Day Tour (Single Sight)",
    detail_ar: "زيارة مزار واحد محدد داخل القاهرة والجيزة (مدة حتى 4 إلى 5 ساعات)",
    detail_en: "Visit 1 specific landmark within Greater Cairo/Giza (up to 4-5 hours)",
    sedan: 900,
    family: 1300,
    h1: 1800,
    hiace: 3500
  },
  {
    id: "cairo-6",
    name_ar: "سهرة عشاء",
    name_en: "Nile Dinner Cruise",
    detail_ar: "توصيل وانتظار أثناء العشاء على الباخرة النيلية ثم العودة للفندق",
    detail_en: "Pickup, cruise waiting time during show & dinner, and return hotel transfer",
    sedan: 800,
    family: 1000,
    h1: 1500,
    hiace: 1700
  },
  {
    id: "cairo-7",
    name_ar: "مطار سفر أو استقبال",
    name_en: "Cairo Airport (Arrival / Departure)",
    detail_ar: "استقبال بلافتة الاسم من صالة الوصول أو التوصيل لصالات السفر (أي فندق داخل المطار يُحسب أوفر داي)",
    detail_en: "Meet & greet with name sign at arrival hall or departure transfer (Airport hotels = Overday)",
    sedan: 800,
    family: 1000,
    h1: 1600,
    hiace: 1700
  },
  {
    id: "cairo-8",
    name_ar: "مطار سفنكس",
    name_en: "Sphinx Airport (Arrival / Departure)",
    detail_ar: "خدمة ليموزين مباشرة من وإلى مطار سفنكس الدولي (غرب القاهرة والشيخ زايد)",
    detail_en: "Direct limousine service to/from Sphinx International Airport (West Cairo/Zayed)",
    sedan: 800,
    family: 1000,
    h1: 1700,
    hiace: 1800
  }
];

const tableDataOverday: TableTourItem[] = [
  {
    id: "overday-1",
    name_ar: "أوفر داي إسكندرية",
    name_en: "Alexandria Overday Day Trip",
    detail_ar: "قلعة قايتباي، مكتبة الإسكندرية، حدائق المنتزه، كوبري ستانلي والعودة بنفس اليوم",
    detail_en: "Citadel of Qaitbay, Bibliotheca Alexandrina, Montaza Palace & Stanley Bridge",
    sedan: 3000,
    family: 3500,
    h1: 5000,
    hiace: 5500
  },
  {
    id: "overday-2",
    name_ar: "أوفر داي الفيوم",
    name_en: "Fayoum Oasis & Wadi El-Rayan",
    detail_ar: "وادي الريان والشلالات، بحيرة قارون، قرية تونس، وادي الحيتان والعودة",
    detail_en: "Waterfalls, Lake Qarun, Tunis Pottery Village, Wadi El Hitan & Magic Lake",
    sedan: 2800,
    family: 3250,
    h1: 4500,
    hiace: 5000
  },
  {
    id: "overday-3",
    name_ar: "أوفر داي السخنة",
    name_en: "Ain Sokhna Red Sea Day Trip",
    detail_ar: "يوم شاطئي كامل على ساحل البحر الأحمر مع الاستمتاع بالمنتجعات والأنشطة والعودة",
    detail_en: "Full beach day on the Red Sea coast with resort access and water activities",
    sedan: 2800,
    family: 3250,
    h1: 4500,
    hiace: 5000
  },
  {
    id: "overday-4",
    name_ar: "أوفر داي المطار",
    name_en: "Cairo Airport Overday Tour",
    detail_ar: "الاستقبال من المطار وعمل اليومية والعودة للمطار",
    detail_en: "Airport reception & meet-and-greet, full-day tour itinerary, and return transfer back to the airport",
    sedan: 2500,
    family: 3000,
    h1: 3900,
    hiace: 4300
  },
  {
    id: "overday-5",
    name_ar: "توصيلة إسكندرية",
    name_en: "Alexandria One-Way Transfer",
    detail_ar: "توصيل اتجاه واحد مباشر من أي مكان بالقاهرة إلى الإسكندرية أو العكس",
    detail_en: "Direct single-direction transfer from any Cairo address to Alexandria or vice-versa",
    sedan: 2800,
    family: 3500,
    h1: 4700,
    hiace: 5200
  },
  {
    id: "overday-6",
    name_ar: "توصيلة الأقصر",
    name_en: "Upper Egypt & Luxor Transfer",
    detail_ar: "نقل سياحي مريح وسلس لمحافظات الصعيد (بني سويف، أسيوط، سوهاج، قنا، الأقصر)",
    detail_en: "Comfortable private transfer to Upper Egypt (Beni Suef, Asyut, Sohag, Qena, Luxor)",
    sedan: 8500,
    family: 9500,
    h1: null,
    hiace: null
  }
];

const tableDataMultiday: TableTourItem[] = [
  {
    id: "multi-1",
    name_ar: "الغردقة",
    name_en: "Hurghada Excursion",
    duration_ar: "توصيل / إقامة",
    duration_en: "Transfer / Stay",
    detail_ar: "توصيل سياحي فاخر مع إمكانية المبيت أو التوصيل والاستقبال من الفندق",
    detail_en: "Luxury Red Sea transit with multi-day driver availability or hotel pickup/drop",
    sedan: 5500,
    family: 6500,
    h1: 8500,
    hiace: 9500
  },
  {
    id: "multi-2",
    name_ar: "شرم الشيخ",
    name_en: "Sharm El Sheikh Excursion",
    duration_ar: "توصيل / إقامة",
    duration_en: "Transfer / Stay",
    detail_ar: "رحلات سيناء الساحرة عبر نفق الشهيد أحمد حمدي بأحدث السيارات المجهزة",
    detail_en: "South Sinai journeys via Ahmed Hamdi Tunnel with modern, vetted vehicles",
    sedan: 6000,
    family: 7000,
    h1: 9000,
    hiace: 10000
  },
  {
    id: "multi-3",
    name_ar: "الواحات 2 يوم / 1 ليلة",
    name_en: "Bahariya Oasis (2 Days / 1 Night)",
    duration_ar: "2 يوم / 1 ليلة",
    duration_en: "2 Days / 1 Night",
    detail_ar: "مغامرة الصحراء السوداء والبيضاء، جبل الكريستال، وعيون المياه الكبريتية",
    detail_en: "Black & White Desert expedition, Crystal Mountain, hot springs and camping",
    sedan: 7000,
    family: 8000,
    h1: 10000,
    hiace: 12000
  },
  {
    id: "multi-4",
    name_ar: "سيوة 3 يوم / 2 ليلة",
    name_en: "Siwa Oasis Expedition (3D/2N)",
    duration_ar: "3 أيام / 2 ليلة",
    duration_en: "3 Days / 2 Nights",
    detail_ar: "قلعة شالي، معبد آمون، عين كليوباترا، بحيرات الملح، وجولات بحر الرمال الأعظم",
    detail_en: "Shali Fortress, Temple of Amun, Cleopatra Spring, Salt Lakes & Great Sand Sea",
    sedan: 14000,
    family: 16000,
    h1: 20000,
    hiace: 22000
  },
  {
    id: "multi-5",
    name_ar: "إسكندرية 2 يوم / 1 ليلة",
    name_en: "Alexandria Tour (2 Days / 1 Night)",
    duration_ar: "2 يوم / 1 ليلة",
    duration_en: "2 Days / 1 Night",
    detail_ar: "جولة الساحل والآثار السكندرية مع مبيت ليلة والعودة لليوم التالي",
    detail_en: "Alexandria historical landmarks tour with overnight stay and next-day return",
    sedan: 5500,
    family: 7000,
    h1: 9000,
    hiace: 10000
  }
];

interface ToursCatalogProps {
  locale: Locale;
  currency: Currency;
  routes?: Route[];
}

export const ToursCatalog: React.FC<ToursCatalogProps> = ({ locale, currency, routes }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'cairo' | 'overday' | 'multiday'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State for Direct Website Booking
  const [siteModalItem, setSiteModalItem] = useState<TableTourItem | null>(null);
  const [siteCustomerName, setSiteCustomerName] = useState<string>('');
  const [siteCustomerPhone, setSiteCustomerPhone] = useState<string>('');
  const [sitePickupDate, setSitePickupDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [sitePickupTime, setSitePickupTime] = useState<string>('09:00');
  const [sitePickupLocation, setSitePickupLocation] = useState<string>('');
  const [siteDropoffLocation, setSiteDropoffLocation] = useState<string>('');
  const [siteFlightNumber, setSiteFlightNumber] = useState<string>('');
  const [siteIsFarHotel, setSiteIsFarHotel] = useState<boolean>(false);
  const [siteVehicleType, setSiteVehicleType] = useState<'sedan' | 'family' | 'h1' | 'hiace'>('sedan');
  const [siteNotes, setSiteNotes] = useState<string>('');
  const [isSubmittingSite, setIsSubmittingSite] = useState<boolean>(false);
  const [siteBookingSuccess, setSiteBookingSuccess] = useState<any | null>(null);

  const isAr = locale === 'ar';

  // Surcharge for outer Cairo zones (October, Tagamoa, Nasr City, Heliopolis)
  const getFarHotelSurcharge = (vehicle: 'sedan' | 'family' | 'h1' | 'hiace') => {
    if (!siteIsFarHotel) return 0;
    return (vehicle === 'h1' || vehicle === 'hiace') ? 500 : 200;
  };

  const getVehiclePrice = (type: 'sedan' | 'family' | 'h1' | 'hiace') => {
    if (!siteModalItem) return null;
    const base = siteModalItem[type];
    if (base === null || base === undefined) return null;
    return base + getFarHotelSurcharge(type);
  };

  // Dynamic price synchronizer: if routes prop has updated prices, use them
  const syncWithRoutes = (items: TableTourItem[]): TableTourItem[] => {
    if (!routes || routes.length === 0) return items;
    return items.map(item => {
      const match = routes.find(r => 
        r.title.ar === item.name_ar || 
        r.title.en?.toLowerCase() === item.name_en.toLowerCase() ||
        (r.slug && item.id && r.slug.includes(item.id.replace(/^[a-z]+-/, '')))
      );
      if (match && match.prices) {
        return {
          ...item,
          sedan: match.prices.sedan ?? item.sedan,
          family: match.prices['7seater'] ?? item.family,
          h1: match.prices.h1 ?? item.h1,
          hiace: match.prices.hiace ?? item.hiace
        };
      }
      return item;
    });
  };

  const cairoData = useMemo(() => syncWithRoutes(tableDataCairo), [routes]);
  const overdayData = useMemo(() => syncWithRoutes(tableDataOverday), [routes]);
  const multidayData = useMemo(() => syncWithRoutes(tableDataMultiday), [routes]);

  // Real-time filtering function
  const filterList = (items: TableTourItem[]) => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.trim().toLowerCase();
    return items.filter(item => 
      item.name_ar.toLowerCase().includes(q) ||
      item.name_en.toLowerCase().includes(q) ||
      item.detail_ar.toLowerCase().includes(q) ||
      item.detail_en.toLowerCase().includes(q)
    );
  };

  const filteredCairo = useMemo(() => filterList(cairoData), [cairoData, searchQuery]);
  const filteredOverday = useMemo(() => filterList(overdayData), [overdayData, searchQuery]);
  const filteredMultiday = useMemo(() => filterList(multidayData), [multidayData, searchQuery]);

  const showCairo = (activeCategory === 'all' || activeCategory === 'cairo') && filteredCairo.length > 0;
  const showOverday = (activeCategory === 'all' || activeCategory === 'overday') && filteredOverday.length > 0;
  const showMultiday = (activeCategory === 'all' || activeCategory === 'multiday') && filteredMultiday.length > 0;

  const noResults = !showCairo && !showOverday && !showMultiday;

  // Open Direct Website Booking Modal for this row
  const handleOpenSiteBooking = (item: TableTourItem) => {
    setSiteModalItem(item);
    setSiteVehicleType('sedan');
    setSiteDropoffLocation(isAr ? item.name_ar : item.name_en);
    setSiteBookingSuccess(null);
  };

  // Submit Direct Website Booking
  const handleConfirmSiteBooking = async () => {
    if (!siteModalItem) return;
    if (!siteCustomerName.trim() || !siteCustomerPhone.trim()) {
      alert(isAr ? 'يرجى إدخال اسم العميل ورقم الهاتف / الواتساب للتأكيد.' : 'Please provide your name and phone number.');
      return;
    }

    setIsSubmittingSite(true);
    const ref = generateBookingReference();

    const vehicleNames: Record<string, { ar: string; en: string }> = {
      sedan: { ar: 'ملاكي سيدان فاخرة', en: 'Luxury Sedan' },
      family: { ar: '7 راكب عائلي (SUV)', en: '7-Seater Family' },
      h1: { ar: 'هيونداي إتش وان (H1)', en: 'Hyundai H1' },
      hiace: { ar: 'تويوتا هاي إس (HiAce)', en: 'Toyota HiAce' },
    };

    const vName = vehicleNames[siteVehicleType] || vehicleNames.sedan;
    const finalPriceEgp = getVehiclePrice(siteVehicleType) ?? siteModalItem.sedan;

    const newBooking = {
      id: String(Date.now()),
      reference: ref,
      type: 'tour' as const,
      bookingMethod: 'website' as const,
      source: 'حجز مباشر عبر الموقع (قائمة الأسعار)',
      title: `${siteModalItem.name_ar} (${vName.ar})`,
      customerName: siteCustomerName.trim(),
      customerPhone: siteCustomerPhone.trim(),
      pickupDate: sitePickupDate,
      pickupTime: sitePickupTime,
      pickupLocation: sitePickupLocation.trim() || (isAr ? 'فندق الإقامة' : 'Hotel Lobby'),
      dropoffLocation: siteDropoffLocation.trim() || (isAr ? siteModalItem.name_ar : siteModalItem.name_en),
      flightNumber: siteFlightNumber.trim() || undefined,
      isFarHotel: siteIsFarHotel,
      vehicleName: isAr ? vName.ar : vName.en,
      vehicleSlug: siteVehicleType,
      amountEgp: finalPriceEgp,
      status: 'pending' as const,
      notes: siteNotes.trim() || undefined,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking: newBooking })
      });

      const existing = localStorage.getItem('anubis_bookings');
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem('anubis_bookings', JSON.stringify([newBooking, ...list]));
      window.dispatchEvent(new Event('anubis_bookings_updated'));
    } catch (e) {
      console.warn('Booking save error:', e);
    } finally {
      setIsSubmittingSite(false);
    }

    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch {}

    setSiteBookingSuccess({
      ...newBooking,
      itemName: isAr ? siteModalItem.name_ar : siteModalItem.name_en,
      vehicleName: isAr ? vName.ar : vName.en,
      totalAmount: convertPrice(finalPriceEgp, currency)
    });
  };

  // Direct WhatsApp booking handler
  const handleBookViaWhatsApp = (item: TableTourItem) => {
    const phone = '201091501160';
    const serviceName = isAr ? item.name_ar : item.name_en;

    let message = '';
    if (isAr) {
      message = `السلام عليكم ورحمة الله،\nأود الاستفسار وحجز:\n*${serviceName}*\nمع أنوبيس ترافيل (إدارة / جهاد حسين). يرجى تزويدي بالأسعار والتفاصيل المتاحة.`;
    } else {
      message = `Hello Anubis Travel,\nI would like to inquire about & book the following tour:\n*${serviceName}*\n(Management / Gihad Hussien). Please provide me with the available schedule and best rates. Thank you!`;
    }

    // Record into admin bookings CRM
    const newBooking = {
      id: String(Date.now()),
      reference: `ANB-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'tour' as const,
      bookingMethod: 'whatsapp' as const,
      source: 'طلب عبر الواتساب',
      title: `برنامج: ${item.name_ar}`,
      customerName: isAr ? 'عميل واتساب مباشر' : 'Direct WhatsApp Client',
      customerPhone: 'طلب عبر الواتساب',
      pickupDate: new Date().toISOString().split('T')[0],
      pickupTime: 'حسب الرغبة',
      pickupLocation: 'فندق الإقامة',
      vehicleName: 'ملاكي سيدان فاخرة',
      amountEgp: item.sedan,
      status: 'pending' as const,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    try {
      fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking: newBooking })
      }).catch(err => console.warn('Could not register booking in API:', err));

      const existing = localStorage.getItem('anubis_bookings');
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem('anubis_bookings', JSON.stringify([newBooking, ...list]));
      window.dispatchEvent(new Event('anubis_bookings_updated'));
    } catch {}

    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`, '_blank');
  };

  const renderPricePill = (price: number | null) => {
    if (price === null || price === undefined || price === 0) {
      return <span className="price-pill text-[#6e6456] border-[#3a2e16]">-</span>;
    }
    const converted = convertPrice(price, currency);
    return <span className="price-pill">{formatPrice(converted, currency, locale)}</span>;
  };

  return (
    <section 
      id="tours" 
      className="pricing-tables-wrapper relative py-16 sm:py-24 border-b border-[#d4af37]/20 bg-[#070503]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
            {isAr ? 'قوائم أسعار الرحلات والمزارات السياحية' : 'Tours & Sightseeing Master Tariffs'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#a69883]">
            {isAr 
              ? 'اختر نوع الرحلة والسيارة المناسبة واحجز مباشرة عبر السايت أو عبر الواتساب.' 
              : 'Select your desired tour and vehicle class for instant direct booking or WhatsApp inquiry.'}
          </p>
        </div>

        {/* Filter & Search Controls */}
        <div className="tables-filter-bar">
          <div className="filter-tabs-group">
            <button
              onClick={() => setActiveCategory('all')}
              className={`filter-tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
            >
              {isAr ? 'جميع الرحلات' : 'All Tours'}
            </button>
            <button
              onClick={() => setActiveCategory('cairo')}
              className={`filter-tab-btn ${activeCategory === 'cairo' ? 'active' : ''}`}
            >
              {isAr ? 'داخل القاهرة والجيزة' : 'Cairo & Giza Sights'}
            </button>
            <button
              onClick={() => setActiveCategory('overday')}
              className={`filter-tab-btn ${activeCategory === 'overday' ? 'active' : ''}`}
            >
              {isAr ? 'رحلات الأوفردي' : 'Overday Trips'}
            </button>
            <button
              onClick={() => setActiveCategory('multiday')}
              className={`filter-tab-btn ${activeCategory === 'multiday' ? 'active' : ''}`}
            >
              {isAr ? 'السياحة والمحافظات' : 'Multi-Day & Intercity'}
            </button>
          </div>

          <div className="relative min-w-[240px] max-w-[340px] w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث عن رحلة أو مزار...' : 'Search tour or landmark...'}
              className="w-full rounded-full border border-[#d4af37]/35 bg-[#0a0805] px-4 pe-10 py-2.5 text-xs sm:text-sm text-[#ede3d1] outline-none focus:border-[#d4af37] focus:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all"
            />
            <Search className="absolute end-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#d4af37] pointer-events-none" />
          </div>
        </div>

        {/* Empty State */}
        {noResults && (
          <div className="rounded-2xl border border-[#d4af37]/20 bg-[#120e0a] p-10 text-center my-8">
            <h3 className="text-base sm:text-lg font-bold text-[#fae48c]">
              {isAr ? 'لم يتم العثور على نتائج بحث تطابق مدخلاتك' : 'No tours found matching your search'}
            </h3>
            <p className="text-xs text-[#a69883] mt-2">
              {isAr ? 'جرب البحث بكلمة أخرى مثل: أهرامات، إسكندرية، مطار، أو الفيوم.' : 'Try searching for: Pyramids, Alexandria, Airport, or Fayoum.'}
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 rounded-xl border border-[#d4af37] bg-[#1a140e] px-4 py-2 text-xs font-bold text-[#fae48c] hover:bg-[#d4af37] hover:text-black transition-all cursor-pointer"
            >
              {isAr ? 'عرض كافة الرحلات' : 'Reset Search'}
            </button>
          </div>
        )}

        {/* TABLE 1: المزارات واليوميات (داخل القاهرة والجيزة) */}
        {showCairo && (
          <div className="stone-table-card" id="table-cairo-section">
            <div className="table-card-header">
              <div className="table-header-info">
                <div className="table-header-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2L1 21h22L12 2zm0 3.84L18.48 19H5.52L12 5.84z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="table-header-title">
                    {isAr ? 'الجدول الأول: المزارات واليوميات' : 'Table 1: Cairo & Giza Day Tours'}
                  </h3>
                  <div className="table-header-desc">
                    {isAr ? 'داخل نطاق القاهرة الكبرى والجيزة وتوصيلات المطارات' : 'Within Greater Cairo, Giza sights, and Airport transfers'}
                  </div>
                </div>
              </div>
              <span className="table-badge-count">
                {isAr ? `${filteredCairo.length} خدمات رئيسية` : `${filteredCairo.length} Main Services`}
              </span>
            </div>

            <div className="table-mobile-hint">
              <span>👈</span>
              <span>{isAr ? 'اسحب الجدول أفقياً لمشاهدة أسعار كافة السيارات 📱' : 'Swipe horizontally to view all vehicle class rates 📱'}</span>
              <span>👉</span>
            </div>

            <div className="table-responsive">
              <table className="pharaonic-table">
                <thead>
                  <tr>
                    <th>{isAr ? 'الخدمة / المزار السياحي' : 'Service / Landmark'}</th>
                    <th>
                      <span>{isAr ? 'ملاكي' : 'Sedan'}</span>
                      <span className="th-sub">Sedan (1-2)</span>
                    </th>
                    <th>
                      <span>{isAr ? '7 راكب' : '7-Seater'}</span>
                      <span className="th-sub">Family (Up to 5)</span>
                    </th>
                    <th>
                      <span>{isAr ? 'إتش وان' : 'H1 Van'}</span>
                      <span className="th-sub">Hyundai H1 (Up to 6)</span>
                    </th>
                    <th>
                      <span>{isAr ? 'هاي إس' : 'HiAce'}</span>
                      <span className="th-sub">Toyota HiAce (Up to 10)</span>
                    </th>
                    <th>{isAr ? 'خيارات الحجز' : 'Booking Options'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCairo.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="service-cell">
                          <div className="service-bullet" />
                          <div>
                            <div className="service-text">{isAr ? item.name_ar : item.name_en}</div>
                            <div className="service-detail">{isAr ? item.detail_ar : item.detail_en}</div>
                          </div>
                        </div>
                      </td>
                      <td>{renderPricePill(item.sedan)}</td>
                      <td>{renderPricePill(item.family)}</td>
                      <td>{renderPricePill(item.h1)}</td>
                      <td>{renderPricePill(item.hiace)}</td>
                      <td className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {/* 1. Direct Website Booking */}
                          <button 
                            type="button"
                            onClick={() => handleOpenSiteBooking(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg gold-gradient-bg px-3 py-1.5 text-xs font-black text-[#0c0906] shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                            title={isAr ? 'تأكيد الحجز مباشرة عبر الموقع' : 'Book on Site Directly'}
                          >
                            <CheckCircle className="h-3.5 w-3.5 text-black" />
                            <span>{isAr ? 'حجز بالسايت' : 'Book on Site'}</span>
                          </button>

                          {/* 2. WhatsApp Direct Inquiry */}
                          <button 
                            type="button"
                            onClick={() => handleBookViaWhatsApp(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#25D366]/40 bg-[#122216]/80 hover:bg-[#18301e] px-2.5 py-1.5 text-xs font-bold text-[#38ef7d] hover:text-white hover:border-[#25D366] transition-all cursor-pointer shadow-sm"
                            title={isAr ? 'حجز وتواصل عبر واتساب' : 'Book via WhatsApp'}
                          >
                            <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
                            <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TABLE 2: رحلات الأوفردي (Overday Trips) */}
        {showOverday && (
          <div className="stone-table-card" id="table-overday-section">
            <div className="table-card-header">
              <div className="table-header-info">
                <div className="table-header-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zm-1-13h2v3h-2zm0 17h2v3h-2zm10-9h3v2h-3zm-19 0h3v2H2zm15.66-6.66l2.12 2.12-1.41 1.41-2.12-2.12zM5.64 16.95l2.12 2.12-1.41 1.41-2.12-2.12zm12.73 2.12l-2.12-2.12 1.41-1.41 2.12 2.12zM7.05 5.64l-2.12-2.12 1.41-1.41 2.12 2.12z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="table-header-title">
                    {isAr ? 'الجدول الثاني: رحلات الأوفردي (Overday Trips)' : 'Table 2: Overday Excursions'}
                  </h3>
                  <div className="table-header-desc">
                    {isAr ? 'رحلات الذهاب والعودة في نفس اليوم إلى المدن والمزارات الساحلية والأثرية' : 'Same-day return journeys to coastal cities and desert wonders'}
                  </div>
                </div>
              </div>
              <span className="table-badge-count">
                {isAr ? `${filteredOverday.length} وجهات سياحية` : `${filteredOverday.length} Destinations`}
              </span>
            </div>

            <div className="table-mobile-hint">
              <span>👈</span>
              <span>{isAr ? 'اسحب الجدول أفقياً لمشاهدة أسعار كافة السيارات 📱' : 'Swipe horizontally to view all vehicle class rates 📱'}</span>
              <span>👉</span>
            </div>

            <div className="table-responsive">
              <table className="pharaonic-table">
                <thead>
                  <tr>
                    <th>{isAr ? 'الوجهة / الرحلة' : 'Destination / Trip'}</th>
                    <th>
                      <span>{isAr ? 'ملاكي' : 'Sedan'}</span>
                      <span className="th-sub">Sedan (1-2)</span>
                    </th>
                    <th>
                      <span>{isAr ? '7 راكب' : '7-Seater'}</span>
                      <span className="th-sub">Family (Up to 5)</span>
                    </th>
                    <th>
                      <span>{isAr ? 'إتش وان' : 'H1 Van'}</span>
                      <span className="th-sub">Hyundai H1 (Up to 6)</span>
                    </th>
                    <th>
                      <span>{isAr ? 'هاي إس' : 'HiAce'}</span>
                      <span className="th-sub">Toyota HiAce (Up to 10)</span>
                    </th>
                    <th>{isAr ? 'خيارات الحجز' : 'Booking Options'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOverday.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="service-cell">
                          <div className="service-bullet" />
                          <div>
                            <div className="service-text">{isAr ? item.name_ar : item.name_en}</div>
                            <div className="service-detail">{isAr ? item.detail_ar : item.detail_en}</div>
                          </div>
                        </div>
                      </td>
                      <td>{renderPricePill(item.sedan)}</td>
                      <td>{renderPricePill(item.family)}</td>
                      <td>{renderPricePill(item.h1)}</td>
                      <td>{renderPricePill(item.hiace)}</td>
                      <td className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {/* 1. Direct Website Booking */}
                          <button 
                            type="button"
                            onClick={() => handleOpenSiteBooking(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg gold-gradient-bg px-3 py-1.5 text-xs font-black text-[#0c0906] shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                            title={isAr ? 'تأكيد الحجز مباشرة عبر الموقع' : 'Book on Site Directly'}
                          >
                            <CheckCircle className="h-3.5 w-3.5 text-black" />
                            <span>{isAr ? 'حجز بالسايت' : 'Book on Site'}</span>
                          </button>

                          {/* 2. WhatsApp Direct Inquiry */}
                          <button 
                            type="button"
                            onClick={() => handleBookViaWhatsApp(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#25D366]/40 bg-[#122216]/80 hover:bg-[#18301e] px-2.5 py-1.5 text-xs font-bold text-[#38ef7d] hover:text-white hover:border-[#25D366] transition-all cursor-pointer shadow-sm"
                            title={isAr ? 'حجز وتواصل عبر واتساب' : 'Book via WhatsApp'}
                          >
                            <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
                            <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TABLE 3: السياحة والمحافظات (متعددة الأيام) */}
        {showMultiday && (
          <div className="stone-table-card" id="table-multiday-section">
            <div className="table-card-header">
              <div className="table-header-info">
                <div className="table-header-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="table-header-title">
                    {isAr ? 'الجدول الثالث: السياحة والمحافظات (متعددة الأيام)' : 'Table 3: Multi-Day & Intercity Tours'}
                  </h3>
                  <div className="table-header-desc">
                    {isAr ? 'برامج الإقامة والمبيت وجولات المحافظات السياحية الشاملة' : 'Extended stays, safari expeditions, and intercity chauffeur packages'}
                  </div>
                </div>
              </div>
              <span className="table-badge-count">
                {isAr ? `${filteredMultiday.length} برامج سياحية` : `${filteredMultiday.length} Tour Programs`}
              </span>
            </div>

            <div className="table-mobile-hint">
              <span>👈</span>
              <span>{isAr ? 'اسحب الجدول أفقياً لمشاهدة أسعار كافة السيارات 📱' : 'Swipe horizontally to view all vehicle class rates 📱'}</span>
              <span>👉</span>
            </div>

            <div className="table-responsive">
              <table className="pharaonic-table">
                <thead>
                  <tr>
                    <th>{isAr ? 'البرنامج والوجهة السياحية' : 'Program / Destination'}</th>
                    <th>
                      <span>{isAr ? 'المدة' : 'Duration'}</span>
                      <span className="th-sub">Duration</span>
                    </th>
                    <th>
                      <span>{isAr ? 'ملاكي' : 'Sedan'}</span>
                      <span className="th-sub">Sedan (1-2)</span>
                    </th>
                    <th>
                      <span>{isAr ? '7 راكب' : '7-Seater'}</span>
                      <span className="th-sub">Family (Up to 5)</span>
                    </th>
                    <th>
                      <span>{isAr ? 'إتش وان' : 'H1 Van'}</span>
                      <span className="th-sub">Hyundai H1 (Up to 6)</span>
                    </th>
                    <th>
                      <span>{isAr ? 'هاي إس' : 'HiAce'}</span>
                      <span className="th-sub">Toyota HiAce (Up to 10)</span>
                    </th>
                    <th>{isAr ? 'خيارات الحجز' : 'Booking Options'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMultiday.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="service-cell">
                          <div className="service-bullet" />
                          <div>
                            <div className="service-text">{isAr ? item.name_ar : item.name_en}</div>
                            <div className="service-detail">{isAr ? item.detail_ar : item.detail_en}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="price-tag-badge">
                          {isAr ? item.duration_ar : item.duration_en}
                        </span>
                      </td>
                      <td>{renderPricePill(item.sedan)}</td>
                      <td>{renderPricePill(item.family)}</td>
                      <td>{renderPricePill(item.h1)}</td>
                      <td>{renderPricePill(item.hiace)}</td>
                      <td className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {/* 1. Direct Website Booking */}
                          <button 
                            type="button"
                            onClick={() => handleOpenSiteBooking(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg gold-gradient-bg px-3 py-1.5 text-xs font-black text-[#0c0906] shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                            title={isAr ? 'تأكيد الحجز مباشرة عبر الموقع' : 'Book on Site Directly'}
                          >
                            <CheckCircle className="h-3.5 w-3.5 text-black" />
                            <span>{isAr ? 'حجز بالسايت' : 'Book on Site'}</span>
                          </button>

                          {/* 2. WhatsApp Direct Inquiry */}
                          <button 
                            type="button"
                            onClick={() => handleBookViaWhatsApp(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#25D366]/40 bg-[#122216]/80 hover:bg-[#18301e] px-2.5 py-1.5 text-xs font-bold text-[#38ef7d] hover:text-white hover:border-[#25D366] transition-all cursor-pointer shadow-sm"
                            title={isAr ? 'حجز وتواصل عبر واتساب' : 'Book via WhatsApp'}
                          >
                            <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
                            <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* IMPORTANT NOTES & POLICY BOXES (Synchronized from index.html) */}
        <div className="mt-16 border-t border-[#d4af37]/20 pt-12" id="notes-section">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
              {isAr ? 'ملاحظات هامة وشروط الخدمة' : 'Important Notes & Service Terms'}
            </h3>
            <p className="text-xs sm:text-sm text-[#a69883] mt-1.5">
              {isAr 
                ? 'حرصاً منا على تقديم أرقى تجربة سفر وتوضيح كافة البنود بكل شفافية لعملائنا الكرام.' 
                : 'Ensuring royal journey standards with full transparency and verified policies.'}
            </p>
          </div>

          <div className="notes-grid">
            {/* Note 1: Advance Booking & Far Hotels */}
            <div className="note-box">
              <div className="note-header">
                <div className="note-icon-bubble">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                </div>
                <h4 className="note-title">
                  {isAr ? 'شروط حجز H1 وهاي إس وفنادق المطار والمناطق البعيدة' : 'Advance Booking Terms for H1, HiAce & Distant Hotels'}
                </h4>
              </div>
              <div className="note-body">
                {isAr ? (
                  <ul>
                    <li><strong>حجز سيارات H1 وهاي إس:</strong> يتطلب حجز سيارات <strong className="rate-highlight">الإتش وان (H1)</strong> و<strong className="rate-highlight">الهاي إس (HiAce)</strong> التنسيق والحجز المسبق قبل موعد الرحلة <strong className="rate-highlight">بما لا يقل عن يومين (48 ساعة)</strong> لضمان توافر وتجهيز السيارة.</li>
                    <li><strong>فنادق المطار:</strong> أي فندق داخل نطاق المطار يُحسب تسعير <strong className="rate-highlight">أوفر داي</strong>.</li>
                    <li><strong>الفنادق البعيدة:</strong> (أكتوبر / مدينة نصر / التجمع / مصر الجديدة / الشيخ زايد) يُضاف <strong className="rate-highlight">200 ج.م</strong> للملاكي و7 راكب، ويُضاف <strong className="rate-highlight">500 ج.م</strong> للإتش وان والهاي إس.</li>
                    <li>الأسعار تشمل السائق المحترف، البنزين، وكارتات وبوابات الطرق الرئيسية.</li>
                  </ul>
                ) : (
                  <ul>
                    <li><strong>Advance Booking for H1 & HiAce:</strong> Booking <strong className="rate-highlight">Hyundai H-1</strong> and <strong className="rate-highlight">Toyota HiAce</strong> requires prior reservation at least <strong className="rate-highlight">2 days (48 hours)</strong> prior to ensure availability.</li>
                    <li><strong>Airport Hotels:</strong> Any hotel inside Cairo Airport zone is billed at an <strong className="rate-highlight">Overday</strong> rate.</li>
                    <li><strong>Distant Hotels Surcharge:</strong> (6th of October / Nasr City / New Cairo / Heliopolis / Sheikh Zayed): +<strong className="rate-highlight">200 EGP</strong> for Sedan & 7-Seater, +<strong className="rate-highlight">500 EGP</strong> for H1 & HiAce.</li>
                    <li>All rates include a vetted chauffeur, fuel, and primary highway tolls.</li>
                  </ul>
                )}
              </div>
            </div>

            {/* Note 2: Overtime Rates */}
            <div className="note-box">
              <div className="note-header">
                <div className="note-icon-bubble" style={{ borderColor: '#38ef7d', background: 'rgba(56, 239, 125, 0.15)' }}>
                  <svg viewBox="0 0 24 24" style={{ fill: '#38ef7d' }}>
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                </div>
                <h4 className="note-title">
                  {isAr ? 'مواعيد اليومية وساعات الانتظار (Overtime)' : 'Tour Schedule & Overtime Rates'}
                </h4>
              </div>
              <div className="note-body">
                {isAr ? (
                  <ul>
                    <li><strong>مواعيد اليومية الرسمية:</strong> اليومية من الساعة <strong className="rate-highlight">8:00 صباحاً</strong> وحتى الساعة <strong className="rate-highlight">4:00 مساءً</strong> (مدة اليومية 8 ساعات أو حتى الانتهاء من المزارات، ولأي تفاصيل أخرى التواصل على الواتساب).</li>
                    <li><strong>ساعات الانتظار الإضافية:</strong> أي ساعة إضافية تحسب بتكلفة منفصلة: <strong className="rate-highlight">200 ج.م / للساعة</strong>.</li>
                    <li>يتم احتساب كسر الساعة بما يتناسب مع وقت الانتظار الفعلي.</li>
                  </ul>
                ) : (
                  <ul>
                    <li><strong>Official Tour Hours:</strong> Day tours run from <strong className="rate-highlight">8:00 AM</strong> to <strong className="rate-highlight">4:00 PM</strong> (Duration: 8 hours or upon completing the sights; for any other details, contact via WhatsApp).</li>
                    <li><strong>Overtime / Extra Waiting:</strong> Any additional waiting hour is billed separately at: <strong className="rate-highlight">200 EGP / hour</strong>.</li>
                    <li>Fractional hours are prorated based on actual waiting duration.</li>
                  </ul>
                )}
              </div>
            </div>

            {/* Note 3: VIP Royal Standard */}
            <div className="note-box">
              <div className="note-header">
                <div className="note-icon-bubble">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                  </svg>
                </div>
                <h4 className="note-title">
                  {isAr ? 'مميزات وضمانات الخدمة الملكية' : 'VIP Royal Quality Guarantees'}
                </h4>
              </div>
              <div className="note-body">
                {isAr ? (
                  <ul>
                    <li>السيارات مجهزة بأعلى وسائل الراحة والتكييف الكامل لضمان تجربة VIP فاخرة.</li>
                    <li>سائقون ذوو خبرة تامة بالمعالم الأثرية والمزارات الفرعونية والطرق السريعة.</li>
                    <li>إمكانية توفير مرشد سياحي مرخص معتمد بجميع اللغات العالمية عند الطلب المسبق.</li>
                    <li>خدمة متابعة مستمرة على مدار الساعة (24/7 VIP Support).</li>
                  </ul>
                ) : (
                  <ul>
                    <li>Sanitized luxury vehicles with powerful climate control and plush seating.</li>
                    <li>Experienced drivers with deep familiarity with Egypt's historical sites.</li>
                    <li>Official licensed Egyptologist guides available in all languages upon request.</li>
                    <li>Continuous operations support and flight tracking around the clock (24/7 Support).</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MODAL: DIRECT WEBSITE BOOKING FOR A SPECIFIC TOUR */}
        {siteModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border-2 border-[#d4af37] bg-[#120e0a] p-5 sm:p-7 shadow-2xl text-start">
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setSiteModalItem(null);
                  setSiteBookingSuccess(null);
                }}
                className="absolute top-4 end-4 rounded-full bg-[#1e160e] p-2 text-[#a69883] hover:text-white hover:bg-[#2e2316] cursor-pointer z-10"
              >
                <X className="h-4 w-4" />
              </button>

              {!siteBookingSuccess ? (
                <div className="space-y-4">
                  {/* Tour Header Banner */}
                  <div className="border-b border-[#d4af37]/20 pb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-white font-serif">
                      {isAr ? siteModalItem.name_ar : siteModalItem.name_en}
                    </h3>
                    <p className="text-xs text-[#a69883] mt-1 leading-relaxed">
                      {isAr ? siteModalItem.detail_ar : siteModalItem.detail_en}
                    </p>
                  </div>

                  {/* Form Fields: Row 1 - Date & Departure Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Date */}
                    <div>
                      <label className="block text-xs font-semibold text-[#ede3d1] mb-1.5 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#d4af37]" />
                        <span>{isAr ? 'تاريخ الرحلة:' : 'Tour Date:'}</span>
                      </label>
                      <input
                        type="date"
                        value={sitePickupDate}
                        onChange={(e) => setSitePickupDate(e.target.value)}
                        className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2.5 text-xs text-[#ede3d1] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    {/* Time */}
                    <div>
                      <label className="block text-xs font-semibold text-[#ede3d1] mb-1.5 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#d4af37]" />
                        <span>{isAr ? 'وقت الانطلاق:' : 'Departure Time:'}</span>
                      </label>
                      <input
                        type="time"
                        value={sitePickupTime}
                        onChange={(e) => setSitePickupTime(e.target.value)}
                        className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2.5 text-xs text-[#ede3d1] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Form Fields: Row 2 - Pickup Location & Dropoff Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Pickup Location */}
                    <div>
                      <label className="block text-xs font-semibold text-[#ede3d1] mb-1.5">
                        {isAr ? 'مكان الانطلاق / اسم الفندق:' : 'Pickup Location / Hotel:'}
                      </label>
                      <input
                        type="text"
                        placeholder={isAr ? 'مثال: فندق ماريوت الزمالك / صالة 3' : 'e.g. Marriott Hotel / Terminal 3'}
                        value={sitePickupLocation}
                        onChange={(e) => setSitePickupLocation(e.target.value)}
                        className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2.5 text-xs text-[#ede3d1] placeholder-[#6e6456] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>

                    {/* Dropoff Destination */}
                    <div>
                      <label className="block text-xs font-semibold text-[#ede3d1] mb-1.5">
                        {isAr ? 'مكان الوصول المحدد:' : 'Designated Destination:'}
                      </label>
                      <input
                        type="text"
                        placeholder={isAr ? 'مثال: الأهرامات / المعادي / المطار' : 'e.g. Pyramids / Maadi / Airport'}
                        value={siteDropoffLocation}
                        onChange={(e) => setSiteDropoffLocation(e.target.value)}
                        className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2.5 text-xs text-[#ede3d1] placeholder-[#6e6456] focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Form Fields: Row 3 - Flight Number (Optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-[#ede3d1] mb-1.5 flex items-center gap-1.5">
                      <Plane className="h-3.5 w-3.5 text-[#d4af37]" />
                      <span>{isAr ? 'رقم رحلة الطيران (اختياري للاستقبال بالمطار):' : 'Flight Number (Optional for Airport pickup):'}</span>
                    </label>
                    <input
                      type="text"
                      placeholder={isAr ? 'مثال: MS 777 أو SV 312' : 'e.g. MS 777 or SV 312'}
                      value={siteFlightNumber}
                      onChange={(e) => setSiteFlightNumber(e.target.value)}
                      className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2.5 text-xs text-[#ede3d1] placeholder-[#6e6456] focus:border-[#d4af37] focus:outline-none uppercase font-mono"
                    />
                  </div>

                  {/* Form Fields: Row 4 - Outer-zone Hotel Checkbox */}
                  <div className="rounded-xl border border-[#d4af37]/20 bg-[#16110b] p-3.5 flex items-start gap-3">
                    <input
                      id="siteFarHotelToggle"
                      type="checkbox"
                      checked={siteIsFarHotel}
                      onChange={(e) => setSiteIsFarHotel(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-[#d4af37] text-[#d4af37] focus:ring-[#d4af37] cursor-pointer"
                    />
                    <label htmlFor="siteFarHotelToggle" className="text-xs leading-relaxed text-[#ede3d1] cursor-pointer select-none">
                      <span className="font-bold text-[#fae48c]">
                        {isAr ? 'هل الفندق في المناطق الخارجية؟' : 'Is your hotel in outer Cairo suburbs?'}
                      </span>
                      <span className="block text-[#a69883] text-[11px] mt-0.5">
                        {isAr 
                          ? '(أكتوبر، التجمع، مدينة نصر، مصر الجديدة: +200 ج للملاكي و 7 راكب، +500 ج للـ H1 والهاي إس)' 
                          : '(6th of October, New Cairo/Tagamoa, Nasr City, Heliopolis: +200 EGP for Sedan & 7-seater, +500 EGP for H1 & HiAce)'}
                      </span>
                    </label>
                  </div>

                  {/* Form Fields: Row 5 - Customer Name & WhatsApp Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 border-t border-[#d4af37]/15">
                    {/* Customer Name */}
                    <div>
                      <label className="block text-xs font-semibold text-[#fae48c] mb-1.5">
                        {isAr ? 'اسم العميل الكريم: *' : 'Customer Name: *'}
                      </label>
                      <input
                        type="text"
                        placeholder={isAr ? 'الاسم بالكامل' : 'Your full name'}
                        value={siteCustomerName}
                        onChange={(e) => setSiteCustomerName(e.target.value)}
                        className="w-full rounded-xl border border-[#d4af37]/40 bg-[#1a140e] px-3.5 py-2.5 text-xs text-[#ede3d1] focus:border-[#d4af37] focus:outline-none"
                        required
                      />
                    </div>

                    {/* Customer Phone / WhatsApp */}
                    <div>
                      <label className="block text-xs font-semibold text-[#fae48c] mb-1.5">
                        {isAr ? 'رقم الهاتف / الواتساب للتأكيد: *' : 'Phone / WhatsApp: *'}
                      </label>
                      <input
                        type="tel"
                        placeholder={isAr ? '010XXXXXXXX أو مع كود الدولة' : '+20 10X XXX XXXX'}
                        value={siteCustomerPhone}
                        onChange={(e) => setSiteCustomerPhone(e.target.value)}
                        className="w-full rounded-xl border border-[#d4af37]/40 bg-[#1a140e] px-3.5 py-2.5 text-xs text-[#ede3d1] focus:border-[#d4af37] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Form Fields: Row 6 - Special Requests & Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-[#ede3d1] mb-1.5">
                      {isAr ? 'ملاحظات خاصة (مقاعد أطفال، طلبات معينة):' : 'Special Requests & Notes:'}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={isAr ? 'أي تعليمات خاصة بالسائق أو موعد الهبوط...' : 'Child seats, luggage notes, or special instructions...'}
                      value={siteNotes}
                      onChange={(e) => setSiteNotes(e.target.value)}
                      className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-xs text-[#ede3d1] placeholder-[#6e6456] focus:border-[#d4af37] focus:outline-none resize-none"
                    />
                  </div>

                  {/* Vehicle Class Selection Cards */}
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-[#fae48c] mb-2 flex items-center gap-1.5">
                      <Car className="h-3.5 w-3.5 text-[#d4af37]" />
                      <span>{isAr ? 'اختر فئة السيارة المطلوبة للرحلة:' : 'Select Vehicle Class:'}</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      {/* Sedan */}
                      <button
                        type="button"
                        onClick={() => setSiteVehicleType('sedan')}
                        className={`rounded-xl p-3 border text-start transition-all cursor-pointer ${
                          siteVehicleType === 'sedan'
                            ? 'border-[#d4af37] bg-[#241b11] text-[#fae48c] shadow-lg ring-1 ring-[#d4af37]'
                            : 'border-[#d4af37]/20 bg-[#18120c] text-[#ede3d1] hover:border-[#d4af37]/50'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{isAr ? 'ملاكي سيدان' : 'Sedan'}</span>
                        </div>
                        <div className="font-mono text-sm font-black text-[#fae48c] mt-1">
                          {formatPrice(convertPrice(getVehiclePrice('sedan') ?? siteModalItem.sedan, currency), currency, locale)}
                        </div>
                        <span className="text-[10px] text-[#a69883] block mt-1">1-2 ركاب</span>
                      </button>

                      {/* Family 7-seater */}
                      <button
                        type="button"
                        onClick={() => setSiteVehicleType('family')}
                        className={`rounded-xl p-3 border text-start transition-all cursor-pointer ${
                          siteVehicleType === 'family'
                            ? 'border-[#d4af37] bg-[#241b11] text-[#fae48c] shadow-lg ring-1 ring-[#d4af37]'
                            : 'border-[#d4af37]/20 bg-[#18120c] text-[#ede3d1] hover:border-[#d4af37]/50'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{isAr ? '7 راكب عائلي' : '7-Seater'}</span>
                        </div>
                        <div className="font-mono text-sm font-black text-[#fae48c] mt-1">
                          {formatPrice(convertPrice(getVehiclePrice('family') ?? siteModalItem.family, currency), currency, locale)}
                        </div>
                        <span className="text-[10px] text-[#a69883] block mt-1">حتى 5 ركاب</span>
                      </button>

                      {/* H1 (if available) */}
                      {siteModalItem.h1 ? (
                        <button
                          type="button"
                          onClick={() => setSiteVehicleType('h1')}
                          className={`rounded-xl p-3 border text-start transition-all cursor-pointer ${
                            siteVehicleType === 'h1'
                              ? 'border-[#d4af37] bg-[#241b11] text-[#fae48c] shadow-lg ring-1 ring-[#d4af37]'
                              : 'border-[#d4af37]/20 bg-[#18120c] text-[#ede3d1] hover:border-[#d4af37]/50'
                          }`}
                        >
                          <div className="font-bold flex items-center justify-between">
                            <span>{isAr ? 'إتش وان H1' : 'H1 Van'}</span>
                          </div>
                          <div className="font-mono text-sm font-black text-[#fae48c] mt-1">
                            {formatPrice(convertPrice(getVehiclePrice('h1')!, currency), currency, locale)}
                          </div>
                          <span className="text-[10px] text-[#a69883] block mt-1">حتى 6 ركاب</span>
                        </button>
                      ) : (
                        <div className="rounded-xl p-3 border border-gray-800 bg-[#0d0a07] opacity-40 text-start">
                          <span className="font-bold block text-xs">{isAr ? 'إتش وان H1' : 'H1 Van'}</span>
                          <span className="text-[10px] text-[#a69883] mt-1 block">غير متاح للرحلة</span>
                        </div>
                      )}

                      {/* HiAce (if available) */}
                      {siteModalItem.hiace ? (
                        <button
                          type="button"
                          onClick={() => setSiteVehicleType('hiace')}
                          className={`rounded-xl p-3 border text-start transition-all cursor-pointer ${
                            siteVehicleType === 'hiace'
                              ? 'border-[#d4af37] bg-[#241b11] text-[#fae48c] shadow-lg ring-1 ring-[#d4af37]'
                              : 'border-[#d4af37]/20 bg-[#18120c] text-[#ede3d1] hover:border-[#d4af37]/50'
                          }`}
                        >
                          <div className="font-bold flex items-center justify-between">
                            <span>{isAr ? 'تويوتا هاي إس' : 'HiAce'}</span>
                          </div>
                          <div className="font-mono text-sm font-black text-[#fae48c] mt-1">
                            {formatPrice(convertPrice(getVehiclePrice('hiace')!, currency), currency, locale)}
                          </div>
                          <span className="text-[10px] text-[#a69883] block mt-1">حتى 10 ركاب</span>
                        </button>
                      ) : (
                        <div className="rounded-xl p-3 border border-gray-800 bg-[#0d0a07] opacity-40 text-start">
                          <span className="font-bold block text-xs">{isAr ? 'هاي إس HiAce' : 'HiAce'}</span>
                          <span className="text-[10px] text-[#a69883] mt-1 block">غير متاح للرحلة</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total Cost Summary Card */}
                  <div className="rounded-2xl border-2 border-[#d4af37] bg-gradient-to-br from-[#1c160e] to-[#120e0a] p-4 sm:p-5 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-[#ede3d1] block">
                          {isAr ? 'التكلفة الإجمالية التقديرية:' : 'Total Estimated Cost:'}
                        </span>
                        <span className="text-[11px] text-[#38ef7d] font-semibold mt-0.5 block">
                          ✓ {isAr ? 'شامل البنزين والرسوم' : 'All-inclusive guaranteed'}
                        </span>
                      </div>
                      <div className="text-end">
                        <div className="text-2xl sm:text-3xl font-black text-[#fae48c]">
                          {formatPrice(convertPrice(getVehiclePrice(siteVehicleType) ?? siteModalItem.sedan, currency), currency, locale)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Primary CTA Submit Button */}
                  <div>
                    <button
                      type="button"
                      onClick={handleConfirmSiteBooking}
                      disabled={isSubmittingSite}
                      className="w-full flex items-center justify-center gap-2 rounded-xl gold-gradient-bg py-3.5 sm:py-4 text-xs sm:text-sm font-black text-[#0c0906] shadow-xl hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
                    >
                      <CheckCircle className="h-5 w-5 text-black shrink-0" />
                      <span>
                        {isSubmittingSite 
                          ? (isAr ? 'جاري تأكيد وتسجيل الحجز...' : 'Confirming Reservation...') 
                          : (isAr ? 'تأكيد الحجز مباشرة عبر الموقع' : 'Confirm Direct Website Booking')}
                      </span>
                    </button>
                  </div>

                  {/* Notice */}
                  <p className="text-[11px] text-[#a69883] leading-relaxed text-center">
                    {isAr 
                      ? '✓ سيتم تسجيل طلبك فوراً وإرسال إشعار آلي لواتساب الإدارة لتجهيز السيارة والتواصل معك دون أن تحتاج لإرسال أي رسالة بنفسك.'
                      : '✓ Your reservation will be processed instantly and our system will notify management automatically.'}
                  </p>
                </div>
              ) : (
                /* Success State */
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[#38ef7d] mb-2">
                    <CheckCircle className="h-6 w-6" />
                    <h3 className="text-lg font-bold text-white">
                      {isAr ? '🎉 تم تأكيد طلب حجزك مباشرة عبر الموقع بنجاح!' : '🎉 Reservation Confirmed Successfully!'}
                    </h3>
                  </div>

                  <div className="rounded-xl border border-[#d4af37]/30 bg-[#1a140e] p-4 space-y-2 text-xs text-[#ede3d1]">
                    <div className="flex justify-between border-b border-[#d4af37]/15 pb-2">
                      <span className="text-[#a69883]">{isAr ? 'رقم الحجز المرجعي:' : 'Booking Ref:'}</span>
                      <span className="font-mono font-bold text-[#fae48c] text-sm">{siteBookingSuccess.reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a69883]">{isAr ? 'الخدمة / البرنامج:' : 'Service:'}</span>
                      <span className="font-medium text-white">{siteBookingSuccess.itemName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a69883]">{isAr ? 'المركبة المختارة:' : 'Vehicle:'}</span>
                      <span className="font-medium text-white">{siteBookingSuccess.vehicleName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a69883]">{isAr ? 'تاريخ وتوقيت الرحلة:' : 'Date & Time:'}</span>
                      <span className="font-medium text-white">{siteBookingSuccess.pickupDate} ({siteBookingSuccess.pickupTime})</span>
                    </div>
                    {siteBookingSuccess.pickupLocation && (
                      <div className="flex justify-between">
                        <span className="text-[#a69883]">{isAr ? 'مكان الانطلاق:' : 'Pickup:'}</span>
                        <span className="font-medium text-white">{siteBookingSuccess.pickupLocation}</span>
                      </div>
                    )}
                    {siteBookingSuccess.dropoffLocation && (
                      <div className="flex justify-between">
                        <span className="text-[#a69883]">{isAr ? 'مكان الوصول:' : 'Dropoff:'}</span>
                        <span className="font-medium text-white">{siteBookingSuccess.dropoffLocation}</span>
                      </div>
                    )}
                    {siteBookingSuccess.flightNumber && (
                      <div className="flex justify-between">
                        <span className="text-[#a69883]">{isAr ? 'رقم الرحلة الجوية:' : 'Flight Number:'}</span>
                        <span className="font-medium text-white font-mono">{siteBookingSuccess.flightNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-[#d4af37]/15 pt-2">
                      <span className="text-[#a69883]">{isAr ? 'التكلفة الإجمالية:' : 'Total Cost:'}</span>
                      <span className="font-bold text-[#fae48c] text-sm">{formatPrice(siteBookingSuccess.totalAmount, currency, locale)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#a69883] leading-relaxed">
                    {isAr 
                      ? 'تم حفظ طلب حجزك بنجاح في قاعدة بيانات أنوبيس ترافيل، وقام السيستم بإرسال إشعار فوري وتفاصيل الرحلة آلياً لواتساب الإدارة (01091501160). سيتواصل معك كابتن العمليات هاتفياً لتأكيد كافة الترتيبات.'
                      : 'Your reservation was stored in our system and an automated notification was dispatched directly to management (+20 109 150 1160).'}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSiteModalItem(null);
                      setSiteBookingSuccess(null);
                    }}
                    className="w-full rounded-xl gold-gradient-bg py-3 text-xs sm:text-sm font-black text-[#0c0906] shadow-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {isAr ? 'تم، شكراً لكم (إغلاق)' : 'Done, Thank You (Close)'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
