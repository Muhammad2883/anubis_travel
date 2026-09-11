import { Vehicle, Route, RegularClient } from './types';

export const VEHICLES: Vehicle[] = [
  {
    id: 1,
    slug: 'sedan',
    name: {
      ar: 'ملاكي سيدان (سيارة خاصة فاخرة)',
      en: 'Luxury Private Sedan'
    },
    passenger_capacity: 2,
    luggage_capacity: 2,
    features: {
      ar: ['تكييف هوائي فائق', 'سائق محترف ولبق', 'مياه معدنية مجاناً', 'واي فاي متوفر'],
      en: ['Climate Control AC', 'Professional Chauffeur', 'Complimentary Bottled Water', 'Onboard Wi-Fi']
    },
    image_url: '🚗',
    badge: {
      ar: 'مثالية للأزواج ورجال الأعمال',
      en: 'Ideal for Couples & Solo VIPs'
    },
    models: [
      {
        id: 'sedan-1',
        categorySlug: 'sedan',
        name: { ar: 'مرسيدس E-Class الفارهة', en: 'Mercedes-Benz E-Class Luxury' },
        year: 2024,
        features: {
          ar: ['مقاعد جلد طبيعي', 'زجاج عازل للصوت والحرارة', 'شواحن لاسلكية'],
          en: ['Nappa Leather Interior', 'Acoustic Glass', 'Wireless Charging']
        },
        showOnHomepage: true
      },
      {
        id: 'sedan-2',
        categorySlug: 'sedan',
        name: { ar: 'تويوتا كورولا VIP حديثة', en: 'Toyota Corolla VIP' },
        year: 2025,
        features: {
          ar: ['تكييف قوي', 'راحة تامة للمسافات الطويلة', 'هدوء وأمان'],
          en: ['Heavy Duty AC', 'Long-range Comfort', 'Maximum Safety']
        },
        showOnHomepage: true
      }
    ]
  },
  {
    id: 2,
    slug: '7seater',
    name: {
      ar: '7 راكب عائلي (SUV / ميني فان)',
      en: '7-Seater Family MPV / SUV'
    },
    passenger_capacity: 5,
    luggage_capacity: 4,
    features: {
      ar: ['سعة رحبة حتى 5 ركاب', 'صندوق أمتعة كبير', 'تكييف مزدوج أمامي وخلفي', 'شواحن هواتف متنقلة'],
      en: ['Spacious up to 5 Passengers', 'Large Luggage Boot', 'Dual Front & Rear AC', 'USB Fast Chargers']
    },
    image_url: '🚙',
    badge: {
      ar: 'الخيار العائلي الأفضل',
      en: 'Best for Families'
    },
    models: [
      {
        id: '7s-1',
        categorySlug: '7seater',
        name: { ar: 'كيا كرنفال رويال VIP', en: 'Kia Carnival Royal Executive' },
        year: 2024,
        features: {
          ar: ['أبواب كهربائية منزلقة', 'مقاعد قبطان منفصلة', 'شاشات ترفيه'],
          en: ['Power Sliding Doors', 'Captain Seats', 'Entertainment Screens']
        },
        showOnHomepage: true
      },
      {
        id: '7s-2',
        categorySlug: '7seater',
        name: { ar: 'ميتسوبيشي إكسباندر عائلية', en: 'Mitsubishi Xpander' },
        year: 2024,
        features: {
          ar: ['مساحة حقائب رحبة', 'تكييف سقف خلفي مستقل', 'شواحن خلفية'],
          en: ['Generous Luggage Boot', 'Independent Rear Roof AC', 'USB Ports']
        },
        showOnHomepage: true
      }
    ]
  },
  {
    id: 3,
    slug: 'h1',
    name: {
      ar: 'هيونداي إتش وان (H1 Luxury Van)',
      en: 'Hyundai H1 Grand Starex'
    },
    passenger_capacity: 6,
    luggage_capacity: 6,
    features: {
      ar: ['مقاعد فارهة مريحة جداً', 'سعة حتى 6 ركاب براحة تامة', 'زجاج عازل ومظلل للخصوصية', 'حيز حقائب رحب'],
      en: ['Executive Reclining Seats', 'Comfortably seats up to 6', 'Privacy Tinted Windows', 'Ample Luggage Bay']
    },
    image_url: '🚐',
    badge: {
      ar: 'فخامة وراحة للمجموعات الصغيرة',
      en: 'VIP Group Comfort'
    },
    requiresAdvanceNoticeDays: 2,
    models: [
      {
        id: 'h1-1',
        categorySlug: 'h1',
        name: { ar: 'هيونداي H1 رويال VIP فارهة', en: 'Hyundai H1 Grand Starex VIP' },
        year: 2024,
        features: {
          ar: ['صالون تنفيذي رحب', 'ستائر جانبية للخصوصية', 'تكييف مركزي مزدوج'],
          en: ['Executive VIP Salon', 'Privacy Side Blinds', 'Dual Central AC']
        },
        showOnHomepage: true
      }
    ]
  },
  {
    id: 4,
    slug: 'hiace',
    name: {
      ar: 'تويوتا هاي إس (Toyota HiAce Tourer)',
      en: 'Toyota HiAce Luxury Tourer'
    },
    passenger_capacity: 10,
    luggage_capacity: 10,
    features: {
      ar: ['سقف مرتفع ومساحة فسيحة', 'سعة حتى 10 ركاب', 'تكييف سياحي مركزي قوي', 'مثالية للوفود والجولات السياحية'],
      en: ['High Roof & Spacious Cabin', 'Accommodates up to 10 Guests', 'Heavy Duty Central Tour AC', 'Perfect for Tour Groups']
    },
    image_url: '🚌',
    badge: {
      ar: 'الأفضل للمجموعات والوفود',
      en: 'Ultimate Group Choice'
    },
    requiresAdvanceNoticeDays: 2,
    models: [
      {
        id: 'hiace-1',
        categorySlug: 'hiace',
        name: { ar: 'تويوتا هاي إس سقف عالي سياحية', en: 'Toyota HiAce High-Roof GL' },
        year: 2024,
        features: {
          ar: ['سقف شاهق يتيح الوقوف والراحة', 'ميكروفون سياحي للمرشد', 'حيز أمتعة خلفي عملاق'],
          en: ['Standing High Roof', 'Guide PA Microphone', 'Oversized Luggage Bay']
        },
        showOnHomepage: true
      }
    ]
  }
];

export const ROUTES: Route[] = [
  {
    id: 1,
    title: {
      ar: 'هرم - ممفيس - سقارة',
      en: 'Giza Pyramids - Memphis - Saqqara'
    },
    category: 'day_tour',
    estimatedDuration: { ar: '8-9 ساعات', en: '8-9 Hours' },
    prices: { sedan: 1000, '7seater': 1500, h1: 2300, hiace: 2600 },
    isPopular: true
  },
  {
    id: 2,
    title: {
      ar: 'هرم - ممفيس - سقارة - دهشور',
      en: 'Pyramids - Memphis - Saqqara - Dahshur'
    },
    category: 'day_tour',
    estimatedDuration: { ar: '9-10 ساعات', en: '9-10 Hours' },
    prices: { sedan: 1200, '7seater': 1700, h1: 2500, hiace: 2800 },
    isPopular: true
  },
  {
    id: 3,
    title: {
      ar: 'يومية بلد 3 مزارات بالقاهرة',
      en: 'Cairo City Tour (3 Sights)'
    },
    category: 'day_tour',
    estimatedDuration: { ar: '9 ساعات (8 ص - 5 م)', en: '9 Hours (8 AM - 5 PM)' },
    prices: { sedan: 1000, '7seater': 1500, h1: 2300, hiace: 2600 },
    isPopular: true
  },
  {
    id: 4,
    title: {
      ar: 'يومية بلد 4 مزارات بالقاهرة',
      en: 'Cairo City Tour (4 Sights)'
    },
    category: 'day_tour',
    estimatedDuration: { ar: '9 ساعات (8 ص - 5 م)', en: '9 Hours (8 AM - 5 PM)' },
    prices: { sedan: 1150, '7seater': 1700, h1: 2500, hiace: 2800 }
  },
  {
    id: 5,
    title: {
      ar: 'نصف يومية مزار فقط',
      en: 'Half Day Sightseeing Tour'
    },
    category: 'day_tour',
    estimatedDuration: { ar: '4-5 ساعات', en: '4-5 Hours' },
    prices: { sedan: 900, '7seater': 1300, h1: 1800, hiace: 3500 }
  },
  {
    id: 6,
    title: {
      ar: 'سهرة عشاء (مركب نيلي / مطعم)',
      en: 'Evening Dinner Tour / Nile Cruise Transfer'
    },
    category: 'day_tour',
    estimatedDuration: { ar: '4-5 ساعات', en: '4-5 Hours' },
    prices: { sedan: 800, '7seater': 1000, h1: 1500, hiace: 1700 },
    isPopular: true
  },
  {
    id: 7,
    title: {
      ar: 'مطار القاهرة الدولي (استقبال أو تسفير)',
      en: 'Cairo International Airport Transfer'
    },
    category: 'airport',
    estimatedDuration: { ar: '1-2 ساعة', en: '1-2 Hours' },
    prices: { sedan: 800, '7seater': 1000, h1: 1600, hiace: 1700 },
    isPopular: true
  },
  {
    id: 8,
    title: {
      ar: 'مطار سفنكس الدولي (استقبال أو تسفير)',
      en: 'Sphinx International Airport Transfer'
    },
    category: 'airport',
    estimatedDuration: { ar: '1-2 ساعة', en: '1-2 Hours' },
    prices: { sedan: 800, '7seater': 1000, h1: 1700, hiace: 1800 },
    isPopular: true
  },
  {
    id: 9,
    title: {
      ar: 'أوفر داي إسكندرية (رحلة يوم كامل)',
      en: 'Alexandria Full Day Tour (Overday)'
    },
    category: 'overday',
    estimatedDuration: { ar: '12-14 ساعة', en: '12-14 Hours' },
    prices: { sedan: 3000, '7seater': 3500, h1: 5000, hiace: 5500 },
    isPopular: true
  },
  {
    id: 10,
    title: {
      ar: 'أوفر داي الفيوم ووادي الريان',
      en: 'Fayoum Oasis & Wadi El Rayan Overday'
    },
    category: 'overday',
    estimatedDuration: { ar: '10-12 ساعة', en: '10-12 Hours' },
    prices: { sedan: 2800, '7seater': 3250, h1: 4500, hiace: 5000 },
    isPopular: true
  },
  {
    id: 11,
    title: {
      ar: 'أوفر داي العين السخنة (يوم على البحر الأحمر)',
      en: 'Ain Sokhna Beach Overday'
    },
    category: 'overday',
    estimatedDuration: { ar: '10-12 ساعة', en: '10-12 Hours' },
    prices: { sedan: 2800, '7seater': 3250, h1: 4500, hiace: 5000 }
  },
  {
    id: 12,
    title: {
      ar: 'أوفر داي المنيا (آثار تل العمارنة وتونة الجبل)',
      en: 'Minya & Tell El-Amarna Historic Overday'
    },
    category: 'overday',
    estimatedDuration: { ar: '14-16 ساعة', en: '14-16 Hours' },
    prices: { sedan: 2500, '7seater': 3000, h1: 3900, hiace: 4300 }
  },
  {
    id: 13,
    title: {
      ar: 'توصيل الغردقة (طريق اتجاه واحد)',
      en: 'Cairo to Hurghada Transfer (One-Way)'
    },
    category: 'intercity',
    estimatedDuration: { ar: '5-6 ساعات', en: '5-6 Hours' },
    prices: { sedan: 5500, '7seater': 6500, h1: 8500, hiace: 9500 }
  },
  {
    id: 14,
    title: {
      ar: 'توصيل شرم الشيخ (طريق اتجاه واحد)',
      en: 'Cairo to Sharm El Sheikh Transfer (One-Way)'
    },
    category: 'intercity',
    estimatedDuration: { ar: '6-7 ساعات', en: '6-7 Hours' },
    prices: { sedan: 6000, '7seater': 7000, h1: 9000, hiace: 10000 }
  },
  {
    id: 15,
    title: {
      ar: 'توصيلة إسكندرية (اتجاه واحد)',
      en: 'Cairo to Alexandria Transfer (One-Way)'
    },
    category: 'intercity',
    estimatedDuration: { ar: '3 ساعات', en: '3 Hours' },
    prices: { sedan: 2800, '7seater': 3500, h1: 4700, hiace: 5200 }
  },
  {
    id: 16,
    title: {
      ar: 'توصيلة الأقصر (طريق بري)',
      en: 'Cairo to Luxor Transfer (Private Car)'
    },
    category: 'intercity',
    estimatedDuration: { ar: '8-9 ساعات', en: '8-9 Hours' },
    prices: { sedan: 8500, '7seater': 9500, h1: null, hiace: null }
  },
  {
    id: 17,
    title: {
      ar: 'الواحات البحرية (2 يوم / 1 ليلة)',
      en: 'Bahariya Oasis Tour (2 Days / 1 Night)'
    },
    category: 'multiday',
    estimatedDuration: { ar: 'يومان بليلة', en: '2 Days / 1 Night' },
    prices: { sedan: 7000, '7seater': 8000, h1: 10000, hiace: 12000 }
  },
  {
    id: 18,
    title: {
      ar: 'سيوة والواحات (3 يوم / 2 ليلة)',
      en: 'Siwa Oasis Dream Safari (3 Days / 2 Nights)'
    },
    category: 'multiday',
    estimatedDuration: { ar: '3 أيام بليلتين', en: '3 Days / 2 Nights' },
    prices: { sedan: 14000, '7seater': 16000, h1: 20000, hiace: 22000 },
    isPopular: true
  },
  {
    id: 19,
    title: {
      ar: 'إسكندرية إقامة (2 يوم / 1 ليلة)',
      en: 'Alexandria Getaway (2 Days / 1 Night)'
    },
    category: 'multiday',
    estimatedDuration: { ar: 'يومان بليلة', en: '2 Days / 1 Night' },
    prices: { sedan: 5500, '7seater': 7000, h1: 9000, hiace: 10000 }
  }
];

export const INITIAL_REGULAR_CLIENTS: RegularClient[] = [
  {
    id: 'c-1',
    name: 'أ. عبد الله المنصوري',
    companyName: 'مجموعة المنصوري القابضة (دبي / القاهرة)',
    phone: '01092345678',
    email: 'almansoori@holdings.ae',
    clientType: 'vip',
    accountBalanceEgp: 1800, // متبقي عليه
    tripsCount: 6,
    notes: 'عميل VIP دائم - يفضل دائماً سيارات هيونداي H1 الفارهة وسائق يتحدث الإنجليزية.',
    createdAt: '2026-08-15',
    trips: [
      {
        id: 't-101',
        date: '2026-09-08',
        routeTitle: 'مطار القاهرة الدولي (استقبال صالة 3 VIP)',
        vehicleName: 'هيونداي إتش وان (H1)',
        amountEgp: 1600,
        paidAmountEgp: 1600,
        status: 'paid',
        driverName: 'كابتن / هاني محمود',
        notes: 'تم الدفع كاش'
      },
      {
        id: 't-102',
        date: '2026-09-09',
        routeTitle: 'هرم - ممفيس - سقارة',
        vehicleName: 'هيونداي إتش وان (H1)',
        amountEgp: 2300,
        paidAmountEgp: 500,
        status: 'partial',
        driverName: 'كابتن / هاني محمود',
        notes: 'متبقي 1800 ج.م على الحساب'
      }
    ]
  },
  {
    id: 'c-2',
    name: 'مكتب كونسيرج فندق ماريوت الزمالك',
    companyName: 'فندق ماريوت القاهرة وكازينو عمر الخيام',
    phone: '01011223344',
    email: 'concierge@cairomarriott.com',
    clientType: 'hotel',
    accountBalanceEgp: 4500,
    tripsCount: 12,
    notes: 'حساب تعاقدي شهري مع إدارة أنوبيس - تسوية في نهاية كل شهر ميلادي.',
    createdAt: '2026-07-01',
    trips: [
      {
        id: 't-201',
        date: '2026-09-05',
        routeTitle: 'أوفر داي إسكندرية لنزلاء الفندق',
        vehicleName: 'تويوتا هاي إس (Toyota HiAce)',
        amountEgp: 5500,
        paidAmountEgp: 5500,
        status: 'paid',
        driverName: 'كابتن / أحمد كمال'
      },
      {
        id: 't-202',
        date: '2026-09-10',
        routeTitle: 'أوفر داي الفيوم ووادي الريان',
        vehicleName: '7 راكب عائلي (SUV)',
        amountEgp: 3250,
        paidAmountEgp: 0,
        status: 'unpaid',
        driverName: 'كابتن / وليد إبراهيم'
      },
      {
        id: 't-203',
        date: '2026-09-11',
        routeTitle: 'مطار القاهرة (تسفير نزيل)',
        vehicleName: 'ملاكي سيدان فاخرة',
        amountEgp: 1250,
        paidAmountEgp: 0,
        status: 'unpaid',
        driverName: 'كابتن / حسام حسن'
      }
    ]
  },
  {
    id: 'c-3',
    name: 'د. طارق المهدي',
    phone: '01223456789',
    email: 'tarek.elmahdy@clinic.com',
    clientType: 'vip',
    accountBalanceEgp: 0,
    tripsCount: 8,
    notes: 'عميل شخصي معتمد من الإدارة - يحاسب فوراً عند انتهاء الرحلة.',
    createdAt: '2026-08-01',
    trips: [
      {
        id: 't-301',
        date: '2026-09-02',
        routeTitle: 'يومية بلد 3 مزارات بالقاهرة',
        vehicleName: 'ملاكي سيدان فاخرة',
        amountEgp: 1000,
        paidAmountEgp: 1000,
        status: 'paid',
        driverName: 'كابتن / أحمد صلاح'
      }
    ]
  }
];

export const GENERAL_TERMS = {
  ar: {
    airportOverday: 'أي فندق داخل المطار يُحسب أوفر داي.',
    farHotels: 'الفنادق البعيدة (أكتوبر / مدينة نصر / التجمع / مصر الجديدة): يُضاف 200 ج.م للملاكي و7 راكب، ويُضاف 500 ج.م للـ H1 والهاي إس.',
    dayTourHours: 'اليومية تبدأ من الساعة 8 صباحاً حتى الساعة 5 مساءً (مدة 9 ساعات)، وأي ساعة إضافية تحسب بتكلفة منفصلة.',
    advanceNotice: 'تنبيه هام: حجز مركبات H1 وهاي إس (HiAce) يتطلب إشعاراً وتأكيداً مسبقاً قبل الموعد بيومين على الأقل.',
    management: 'إدارة / جهاد حسين (Gihad Hussien) - هاتف وواتساب: 01091501160'
  },
  en: {
    airportOverday: 'Any hotel located within the Cairo Airport zone is billed as an Overday rate.',
    farHotels: 'Outer-zone hotels (6th of October, New Cairo / 5th Settlement, Nasr City, Heliopolis): add 200 EGP for Sedan & 7-Seater, add 500 EGP for H1 & HiAce.',
    dayTourHours: 'Full-day tours run from 8:00 AM to 5:00 PM (9 hours duration); additional hours are billed separately.',
    advanceNotice: 'Important Notice: Booking H1 Luxury Van or Toyota HiAce requires at least 2 days advance reservation.',
    management: 'Management: Gihad Hussien - Phone & WhatsApp: +20 109 150 1160'
  }
};
