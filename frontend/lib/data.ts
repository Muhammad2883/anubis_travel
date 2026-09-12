import { Vehicle, Route, RegularClient, Tour } from './types';

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

import routesJson from '@/data/routes.json';

export const ROUTES: Route[] = routesJson as Route[];

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

export const TOURS: Tour[] = [
  {
    id: 1,
    slug: 'giza-pyramids-sphinx-saqqara',
    category: 'cultural',
    title: {
      ar: 'أهرامات الجيزة، أبو الهول، هرم سقارة المدرج وممفيس',
      en: 'Giza Pyramids, Great Sphinx, Saqqara & Ancient Memphis'
    },
    subtitle: {
      ar: 'رحلة أسطورية إلى قلب التاريخ المصري القديم وأقدم بناء حجري في التاريخ',
      en: 'An unforgettable journey to the 7 Wonders of the Ancient World and Egypt oldest pyramid'
    },
    overview: {
      ar: 'انطلق في جولة متميزة بصحبة مرشد سياحي مرخص ومركبة خاصة مكيفة لاستكشاف أهرامات الجيزة الخالدة (خوفو، خفرع، منقرع) وأبو الهول المهيب، ثم التوجه إلى سقارة لمشاهدة هرم زوسر المدرج وأول عاصمة لمصر القديمة في ممفيس.',
      en: 'Embark on a private guided journey visiting the legendary Great Pyramids of Giza, Sphinx, Djoser Step Pyramid at Saqqara, and the open-air museum of Memphis with personal luxury transport and certified Egyptologist.'
    },
    duration: { ar: '8 ساعات', en: '8 Hours' },
    basePriceEgp: 1800,
    rating: 4.9,
    reviewsCount: 142,
    imageUrl: '/hero-pyramids.jpg',
    highlights: {
      ar: ['مشاهدة الأهرامات الثلاثة البانورامية من هضبة الجيزة', 'التقاط صور مميزة مع تمثال أبو الهول العظيم', 'دخول مجمع هرم زوسر المدرج بسقارة', 'زيارة تمثال رمسيس الثاني الضخم في ممفيس'],
      en: ['Panoramic photo stops at Giza Plateau', 'Up-close encounter with the Great Sphinx', 'Exploration of Saqqara Step Pyramid complex', 'Colossal statue of Ramses II at Memphis']
    },
    itinerary: [
      {
        time: '08:00 AM',
        title: { ar: 'الاستقبال من الفندق', en: 'Hotel Pickup' },
        description: { ar: 'استقبال خاص من فندقك في القاهرة أو الجيزة بسيارة سياحية فاخرة مكيفة.', en: 'Private pickup from your Cairo or Giza hotel in a climate-controlled vehicle.' }
      },
      {
        time: '09:00 AM',
        title: { ar: 'أهرامات الجيزة وأبو الهول', en: 'Giza Pyramids & Sphinx' },
        description: { ar: 'زيارة أهرامات خوفو وخفرع ومنقرع والبانوراما الصحراوية وأبو الهول ومعبد الوادي.', en: 'Guided walk around Khufu, Khafre, Menkaure, and Valley Temple of Sphinx.' }
      },
      {
        time: '01:00 PM',
        title: { ar: 'غداء مصري شرقي تقليدي', en: 'Authentic Egyptian Lunch' },
        description: { ar: 'تناول وجبة غداء شرقية شهية في مطعم سياحي ذي إطلالة مميزة.', en: 'Delicious authentic lunch served at a high-rated local restaurant.' }
      },
      {
        time: '02:30 PM',
        title: { ar: 'هرم سقارة المدرج وممفيس', en: 'Saqqara & Memphis Open Museum' },
        description: { ar: 'اكتشاف أقدم هرم حجري في العالم وزيارة عاصمة مصر الفرعونية الأولى.', en: 'Tour the world first stone pyramid complex and the ancient capital.' }
      },
      {
        time: '04:30 PM',
        title: { ar: 'العودة إلى الفندق', en: 'Return Transfer' },
        description: { ar: 'العودة بأمان وراحة إلى مقر إقامتك مع توديع الطاقم.', en: 'Relaxing ride back to your hotel.' }
      }
    ],
    inclusions: {
      ar: ['سيارة خاصة مكيفة حديثة طوال اليوم', 'سائق محترف ومياه معدنية مثلجة', 'مرشد سياحي متخصص باللغة المفضلة', 'وجبة غداء شرقية فاخرة', 'جميع الضرائب ورسوم الطرق'],
      en: ['Private air-conditioned vehicle for the day', 'Professional driver & bottled water', 'Expert licensed Egyptologist guide', 'Authentic traditional lunch', 'Tolls & parking fees']
    },
    exclusions: {
      ar: ['تذاكر دخول المزارات (تُشترى بالفيزا)', 'دخول الهرم الأكبر من الداخل', 'الإكراميات والمصروفات الشخصية'],
      en: ['Sightseeing entrance tickets (card only)', 'Entry inside the Great Pyramid chambers', 'Gratuities & personal expenses']
    },
    isFeatured: true
  },
  {
    id: 2,
    slug: 'grand-egyptian-museum-cairo-citadel',
    category: 'cultural',
    title: {
      ar: 'المتحف المصري الكبير (GEM) وقلعة صلاح الدين وخان الخليلي',
      en: 'Grand Egyptian Museum (GEM), Citadel & Khan El Khalili'
    },
    subtitle: {
      ar: 'أكبر متحف أثري في العالم يليه عبق القاهرة التاريخية وأسواقها الفاطمية',
      en: 'Experience the world largest archaeological museum followed by historic Islamic Cairo'
    },
    overview: {
      ar: 'جولة تجمع بين أحدث صرح أثري في العالم (المتحف المصري الكبير) بما يحويه من كنوز فرعونية وتمثال رمسيس المعلق، ثم الانتقال لقلعة صلاح الدين ومسجد محمد علي الباشا، وختام اليوم في أزقة خان الخليلي العتيقة.',
      en: 'A premier tour combining the Grand Egyptian Museum, the medieval Citadel of Saladin with the Alabaster Mosque, and vibrant bustling lanes of Khan El Khalili bazaar.'
    },
    duration: { ar: '8 ساعات', en: '8 Hours' },
    basePriceEgp: 1900,
    rating: 5.0,
    reviewsCount: 98,
    imageUrl: '/hero-pyramids.jpg',
    highlights: {
      ar: ['الدرج العظيم والبهو الرئيسي في المتحف المصري الكبير', 'بانوراما القاهرة من أعلى أسوار قلعة صلاح الدين', 'مسجد محمد علي المرمر (الألبستر)', 'شراء التذكارات والجلوس بمقهى الفيشاوي التاريخي'],
      en: ['Grand Staircase & Atrium of GEM', 'Panoramic vista of Cairo from the Citadel', 'Mosque of Muhammad Ali Pasha', 'Shopping & tea at iconic El Fishawy cafe']
    },
    itinerary: [
      {
        time: '08:30 AM',
        title: { ar: 'التحرك من الفندق', en: 'Hotel Departure' },
        description: { ar: 'الانطلاق بسيارة أنوبيس المريحة مباشرة للمتحف الكبير.', en: 'Private pickup and transfer to GEM.' }
      },
      {
        time: '09:15 AM',
        title: { ar: 'جولة المتحف المصري الكبير', en: 'Grand Egyptian Museum' },
        description: { ar: 'استكشاف بهو رمسيس الثاني والدرج الملكي والقطع النادرة.', en: 'Marvel at the Grand Hall, obelisk, and ancient masterpieces.' }
      },
      {
        time: '01:00 PM',
        title: { ar: 'قلعة صلاح الدين الأيوبي', en: 'Saladin Citadel & Mosque' },
        description: { ar: 'زيارة حصن القاهرة التاريخي ومسجد محمد علي الرخامي.', en: 'Explore the 12th-century fortress and iconic Alabaster Mosque.' }
      },
      {
        time: '03:00 PM',
        title: { ar: 'خان الخليلي وشارع المعز', en: 'Khan El Khalili & Moez Street' },
        description: { ar: 'جولة حرة في أقدم أسواق الشرق الأوسط وتذوق شاي النعناع.', en: 'Atmospheric walk in medieval souks and architecture.' }
      }
    ],
    inclusions: {
      ar: ['تنقلات خاصة بسيارة مكيفة', 'سائق محترف ومياه معدنية', 'مرشد سياحي مصاحب', 'رسوم الانتظار والبوابات'],
      en: ['Private luxury AC transport', 'Professional chauffeur & bottled water', 'Accompanying tour guide', 'Parking and toll fees']
    },
    exclusions: {
      ar: ['تذاكر المزارات', 'الوجبات والمشروبات الإضافية', 'الإكراميات'],
      en: ['Monument entrance fees', 'Meals & extra drinks', 'Gratuities']
    },
    isFeatured: true
  },
  {
    id: 3,
    slug: 'alexandria-mediterranean-pearl',
    category: 'day_trip',
    title: {
      ar: 'أوفر داي الإسكندرية (عروس البحر الأبيض المتوسط)',
      en: 'Alexandria Mediterranean Pearl Full-Day Tour'
    },
    subtitle: {
      ar: 'رحلة ساحلية لزيارة قلعة قايتباي ومكتبة الإسكندرية ومقابر كوم الشقافة مع غداء سي فود',
      en: 'Coastal day tour visiting Qaitbay Citadel, Library of Alexandria & Catacombs with fresh seafood'
    },
    overview: {
      ar: 'اكتشف عبق الحضارة اليونانية الرومانية وجمال ساحل البحر المتوسط في الإسكندرية. تشمل الجولة زيارة مقابر كوم الشقافة المنحوتة في الصخر، قلعة قايتباي في موقع فنار الإسكندرية القديم، مكتبة الإسكندرية الصرح الثقافي العالمي، مع وجبة غداء مأكولات بحرية طازجة على البحر.',
      en: 'Uncover the Greco-Roman wonders of Alexandria. Visit the subterranean Catacombs of Kom El Shoqafa, Citadel of Qaitbay at the Lighthouse site, and futuristic Bibliotheca Alexandrina with seaside seafood dining.'
    },
    duration: { ar: '12 ساعة', en: '12 Hours' },
    basePriceEgp: 3800,
    rating: 4.8,
    reviewsCount: 89,
    imageUrl: '/hero-pyramids.jpg',
    highlights: {
      ar: ['مقابر كوم الشقافة الأسطورية أعجوبة القرون الوسطى', 'قلعة السلطان قايتباي وإطلالة البحر المفتوح', 'صرح مكتبة الإسكندرية الحديث', 'غداء سي فود طازج مع إطلالة الكورنيش'],
      en: ['Subterranean Kom El Shoqafa Catacombs', '15th-century Qaitbay Citadel over the sea', 'Magnificent Bibliotheca Alexandrina', 'Fresh Mediterranean seafood lunch']
    },
    itinerary: [
      {
        time: '07:00 AM',
        title: { ar: 'الانطلاق من القاهرة', en: 'Cairo Departure' },
        description: { ar: 'التحرك صباحاً عبر طريق الإسكندرية الصحراوي السريع بسيارة مريحة.', en: 'Early departure via the desert highway in top comfort.' }
      },
      {
        time: '10:00 AM',
        title: { ar: 'مقابر كوم الشقافة وعمود السواري', en: 'Catacombs & Pompey Pillar' },
        description: { ar: 'النزول لثلاثة طوابق تحت الأرض لرؤية التمازج الفني الفرعوني الروماني.', en: 'Explore the fascinating underground necropolis.' }
      },
      {
        time: '12:30 PM',
        title: { ar: 'قلعة قايتباي وكورنيش البحر', en: 'Qaitbay Citadel on the Coast' },
        description: { ar: 'جولة داخل القلعة والتقاط الصور التذكارية على البحر المتوسط.', en: 'Walk the defensive battlements overlooking the harbour.' }
      },
      {
        time: '02:00 PM',
        title: { ar: 'غداء مأكولات بحرية فاخر', en: 'Seafood Lunch' },
        description: { ar: 'غداء سمك طازج وجمبري وسلطات في مطعم شهير على الكورنيش.', en: 'Enjoy fresh catch of the day by the sea.' }
      },
      {
        time: '03:30 PM',
        title: { ar: 'مكتبة الإسكندرية', en: 'Bibliotheca Alexandrina' },
        description: { ar: 'زيارة المعمار الفريد لأكبر مكتبة ومجمع ثقافي في المنطقة.', en: 'Marvel at the spectacular modern architectural masterpiece.' }
      },
      {
        time: '05:30 PM',
        title: { ar: 'رحلة العودة للقاهرة', en: 'Return to Cairo' },
        description: { ar: 'العودة والوصول إلى فندقك بالمساء براحة وأمان.', en: 'Evening arrival back at your Cairo hotel.' }
      }
    ],
    inclusions: {
      ar: ['سيارة خاصة مكيفة ذهاباً وإياباً من القاهرة', 'سائق محترف وجميع رسوم الطرق السريعة', 'مرشد سياحي معتمد بالإسكندرية', 'وجبة غداء سي فود فاخرة'],
      en: ['Private round-trip AC vehicle from Cairo', 'Professional chauffeur, road tolls & parking', 'Licensed guide in Alexandria', 'Deluxe fresh seafood lunch']
    },
    exclusions: {
      ar: ['تذاكر المزارات', 'المصروفات الشخصية', 'الإكراميات'],
      en: ['Site entrance tickets', 'Personal expenses', 'Gratuities']
    },
    isFeatured: true
  },
  {
    id: 4,
    slug: 'fayoum-wadi-el-rayan-magic-lake',
    category: 'adventure',
    title: {
      ar: 'سفاري الفيوم، وادي الريان والبحيرة السحرية',
      en: 'Fayoum Desert Safari, Wadi El Rayan & Magic Lake'
    },
    subtitle: {
      ar: 'مغامرة دفع رباعي بين الكثبان الرملية وشلالات وادي الريان والتزحلق على الرمال',
      en: 'Thrilling 4x4 desert dunes, cascading waterfalls, sandboarding and Bedouin campfire lunch'
    },
    overview: {
      ar: 'اهرب من صخب المدينة إلى سحر واحة الفيوم الطبيعية. استمتع برؤية شلالات وادي الريان الوحيدة في مصر، وركوب سيارات الدفع الرباعي (4x4) في الكثبان الرملية المحيطة بالبحيرة السحرية، وتجربة التزحلق على الرمال (Sandboarding) وحفلة شواء بدوية دافئة.',
      en: 'A premier eco-adventure into Fayoum Oasis. Witness Egypt only waterfalls at Wadi El Rayan, race across giant golden dunes by 4x4, surf the dunes with sandboards, and dine around a desert Bedouin barbecue.'
    },
    duration: { ar: '10 ساعات', en: '10 Hours' },
    basePriceEgp: 3600,
    rating: 4.9,
    reviewsCount: 76,
    imageUrl: '/hero-pyramids.jpg',
    highlights: {
      ar: ['شلالات وادي الريان والبحيرات الطبيعية', 'سفاري دفع رباعي 4x4 عبر الكثبان الرملية الشاهقة', 'التزحلق على الرمال (Sandboarding) الممتع', 'غداء شواء بدوي أصيل على ضفاف البحيرة السحرية'],
      en: ['Wadi El Rayan waterfalls and natural lakes', 'High-adrenaline 4x4 dune bashing adventure', 'Sandboarding down soft golden dunes', 'Authentic Bedouin BBQ lunch by Magic Lake']
    },
    itinerary: [
      {
        time: '07:30 AM',
        title: { ar: 'التحرك من القاهرة', en: 'Pickup from Cairo' },
        description: { ar: 'الانطلاق جنوباً نحو واحة الفيوم الطبيعية.', en: 'Morning drive towards Fayoum Oasis.' }
      },
      {
        time: '09:30 AM',
        title: { ar: 'شلالات وادي الريان وبحيرة قارون', en: 'Waterfalls & Lake Qarun' },
        description: { ar: 'زيارة الشلالات والتقاط الصور وقضاء وقت مميز.', en: 'See the scenic waterfalls and take picturesque photos.' }
      },
      {
        time: '11:30 AM',
        title: { ar: 'مغامرة الدفع الرباعي والكثبان', en: '4x4 Dune Bashing' },
        description: { ar: 'ركوب سيارات 4x4 مجهزة والتزحلق على رمال الصحراء الناعمة.', en: 'Exciting off-road dune safari and sandboarding session.' }
      },
      {
        time: '02:00 PM',
        title: { ar: 'غداء بدوي في مخيم البحيرة السحرية', en: 'Bedouin Lunch by Magic Lake' },
        description: { ar: 'فراخ مشوية على الفحم، أرز، وسلطات وشاي بالمرمرية.', en: 'Delicious freshly grilled chicken, rice, salads, and Bedouin tea.' }
      },
      {
        time: '04:30 PM',
        title: { ar: 'العودة إلى القاهرة', en: 'Return to Cairo' },
        description: { ar: 'الوصول إلى مقر الإقامة قبل المساء.', en: 'Comfortable evening return to your hotel.' }
      }
    ],
    inclusions: {
      ar: ['سيارة خاصة مكيفة من وإلى القاهرة', 'سيارة دفع رباعي 4x4 مع سائق صحراوي محترف بالفيوم', 'أدوات التزحلق على الرمال (Sandboards)', 'غداء شواء بدوي كامل وشاي بدوي', 'رسوم المحمية الطبيعية'],
      en: ['Private AC vehicle from/to Cairo', 'Equipped 4x4 desert vehicle with desert driver', 'Sandboarding equipment & assistance', 'Full Bedouin BBQ lunch & herbal tea', 'National park conservation fees']
    },
    exclusions: {
      ar: ['المصروفات الشخصية', 'ركوب الخيل أو الفلوكة', 'الإكراميات'],
      en: ['Personal expenses', 'Optional horseback or boat rides', 'Tips']
    },
    isFeatured: true
  },
  {
    id: 5,
    slug: 'nile-dinner-cruise-show',
    category: 'nile_cruise',
    title: {
      ar: 'سهرة عشاء نيلية 5 نجوم مع عرض فلكلوري شرقي وتانورة',
      en: '5-Star Luxury Nile Dinner Cruise with Oriental & Tanoura Show'
    },
    subtitle: {
      ar: 'أمسية ساحرة في أحضان النيل مع بوفيه مفتوح فاخر وأضواء القاهرة المتلألئة',
      en: 'Enchanting evening sail across the Nile with lavish open buffet and live Egyptian folklore'
    },
    overview: {
      ar: 'عش ليلة استثنائية على متن سفينة نيلية عائمة من فئة 5 نجوم تبحر في نيل القاهرة لمدة ساعتين. استمتع ببوفيه عشاء دولي مفتوح غني بأشهى المأكولات، وعروض الفلكلور والتنورة المصرية الراقصة والموسيقى الحية، مع تنقلات خاصة بباب الفندق.',
      en: 'A premier evening experience aboard a floating 5-star Nile cruise boat. Glide along the shimmering river for 2 hours while enjoying a sumptuous open buffet dinner, captivating Tanoura whirling dervish performance, and live Arabic band.'
    },
    duration: { ar: '4-5 ساعات', en: '4-5 Hours' },
    basePriceEgp: 1400,
    rating: 4.9,
    reviewsCount: 165,
    imageUrl: '/hero-pyramids.jpg',
    highlights: {
      ar: ['إبحار لمدة ساعتين في نيل القاهرة الساحر', 'بوفيه عشاء مفتوح 5 نجوم (لحوم، أسماك، مقبلات، حلويات)', 'عرض التنورة التراثي وعروض الرقص الشرقي الفلكلوري', 'تنقلات خاصة بسيارة مكيفة من الباب للباب'],
      en: ['2-hour scenic Nile River cruise', 'Lavish 5-star international open dinner buffet', 'Live spinning Tanoura & folkloric show', 'Private round-trip door-to-door hotel transport']
    },
    itinerary: [
      {
        time: '06:30 PM',
        title: { ar: 'الاستقبال من الفندق', en: 'Hotel Pickup' },
        description: { ar: 'سائق أنوبيس الخاص يستقبلك من بهو فندقك.', en: 'Chauffeur meets you at your hotel lobby.' }
      },
      {
        time: '07:30 PM',
        title: { ar: 'الصعود للمركب النيلي', en: 'Boarding the Cruise' },
        description: { ar: 'الترحيب والجلوس في الصالة المكيفة المطلة على النيل.', en: 'Welcome aboard and seating with panoramic river views.' }
      },
      {
        time: '08:00 PM',
        title: { ar: 'بدء الإبحار وبوفيه العشاء والعروض', en: 'Sail, Buffet & Folklore Show' },
        description: { ar: 'تناول العشاء والاستمتاع بعرض التنورة والفقرات الفنية وتصوير القاهرة ليلاً من السطح.', en: 'Dine, watch live performances, and enjoy Cairo skyline by night from the sundeck.' }
      },
      {
        time: '10:15 PM',
        title: { ar: 'العودة للفندق', en: 'Hotel Return' },
        description: { ar: 'التوصيل المريح لفندقك بعد سهرة لا تُنسى.', en: 'Smooth ride back to your hotel.' }
      }
    ],
    inclusions: {
      ar: ['تنقلات خاصة ذهاب وعودة بسيارة حديثة مكيفة', 'تذكرة الإبحار لمركب 5 نجوم', 'بوفيه عشاء مفتوح شامل الضريبة والخدمة', 'العروض الفنية والموسيقية الحية'],
      en: ['Private round-trip luxury vehicle transfers', '5-star cruise entry and sailing pass', 'Comprehensive international buffet dinner', 'Live entertainment & Tanoura show']
    },
    exclusions: {
      ar: ['المشروبات الغازية والعصائر (تُحاسب بالمركب)', 'الإكراميات'],
      en: ['Beverages on board (billed separately by boat)', 'Tips']
    },
    isFeatured: true
  },
  {
    id: 6,
    slug: 'siwa-oasis-dream-safari',
    category: 'adventure',
    title: {
      ar: 'سفاري واحة سيوة الأسطورية (3 أيام / 2 ليلة)',
      en: 'Legendary Siwa Oasis Safari Expedition (3 Days / 2 Nights)'
    },
    subtitle: {
      ar: 'رحلة الأحلام لبحر الرمال الأعظم، عيون كليوباترا، وبحيرات الملح الكريستالية',
      en: 'The ultimate desert journey to the Great Sand Sea, Cleopatra Spring & turquoise salt lakes'
    },
    overview: {
      ar: 'رحلة العمر إلى واحة الأساطير والسكينة في الصحراء الغربية. اكتشف قلعة شالي القديمة، معبد تتويج الإسكندر الأكبر، السباحة في عيون كليوباترا الكبريتية والطفو في بحيرات الملح الفيروزية، وسفاري 4x4 في بحر الرمال الأعظم والمبيت تحت سماء تعج بالنجوم.',
      en: 'A bucket-list expedition deep into the Western Desert. Explore the ancient salt-mud fortress of Shali, Oracle Temple of Alexander the Great, float weightlessly in crystal salt lakes, and traverse the massive dunes of the Great Sand Sea.'
    },
    duration: { ar: '3 أيام / 2 ليلة', en: '3 Days / 2 Nights' },
    basePriceEgp: 16500,
    rating: 5.0,
    reviewsCount: 52,
    imageUrl: '/hero-pyramids.jpg',
    highlights: {
      ar: ['الطفو في بحيرات الملح السحرية الشهيرة عالمياً', 'سفاري 4x4 عميق في بحر الرمال والتزلج الرملي', 'زيارة قلعة شالي الأثرية ومعبد آمون', 'الاسترخاء في عين كليوباترا وتناول عشاء سيوة الأصيل'],
      en: ['Weightless floating in therapeutic crystal turquoise salt lakes', 'Deep 4x4 expedition into the Great Sand Sea', 'Ancient mud fortress of Shali & Oracle Temple', 'Cleopatra Spring bath & candlelit Siwan dinner']
    },
    itinerary: [
      {
        time: 'اليوم الأول',
        title: { ar: 'السفر لسيوة وزيارة قلعة شالي', en: 'Day 1: Arrival & Shali Fortress' },
        description: { ar: 'الانطلاق من القاهرة، الوصول لسيوة واستلام الغرف بفندق تراثي بيئي، ثم زيارة قلعة شالي وغروب الشمس من جزيرة فطناس.', en: 'Private scenic transfer, check-in to an eco-lodge, tour Old Shali, and sunset at Fatnas Island.' }
      },
      {
        time: 'اليوم الثاني',
        title: { ar: 'بحيرات الملح وسفاري بحر الرمال', en: 'Day 2: Salt Lakes & Great Sand Sea' },
        description: { ar: 'السباحة في بحيرات الملح، عين كليوباترا، ثم انطلاق سفاري 4x4 الكثبان والتزلج على الرمال والمياه الكبريتية الساخنة.', en: 'Float in salt lakes, Cleopatra spring, then high-energy 4x4 safari, sandboarding and hot spring dip.' }
      },
      {
        time: 'اليوم الثالث',
        title: { ar: 'جبل الموتى ومعبد آمون والعودة', en: 'Day 3: Mountain of Dead & Return' },
        description: { ar: 'زيارة مقابر جبل الموتى، معبد الوحي، شراء منتجات التمور وزيت الزيتون السيوية ثم رحلة العودة للقاهرة.', en: 'Tour Mountain of the Dead, Oracle of Amun, souvenir olive market, and return trip to Cairo.' }
      }
    ],
    inclusions: {
      ar: ['سيارة خاصة حديثة مع وقود وسائق متفرغ طوال الرحلة', 'سفاري دفع رباعي 4x4 داخل بحر الرمال مع رخصة المحمية', 'إقامة ليلتين بفندق سياحي بيئي مع الإفطار', 'مرشد محلي متخصص في سيوة', 'جميع المزارات والتصاريح الأمنية'],
      en: ['Private luxury vehicle with chauffeur for the entire 3 days', '4x4 desert safari with desert permit', '2 nights eco-resort accommodation with daily breakfast', 'Dedicated local guide in Siwa', 'All entrance tickets and desert permits']
    },
    exclusions: {
      ar: ['الغداء والعشاء والمصروفات الشخصية', 'الإكراميات'],
      en: ['Lunches & dinners not specified', 'Personal souvenir shopping & tips']
    }
  }
];

export const GENERAL_TERMS = {
  ar: {
    airportOverday: 'أي فندق داخل المطار يُحسب أوفر داي.',
    farHotels: 'الفنادق البعيدة (أكتوبر / مدينة نصر / التجمع / مصر الجديدة): يُضاف 200 ج.م للملاكي و7 راكب، ويُضاف 500 ج.م للـ H1 والهاي إس.',
    dayTourHours: 'اليومية تبدأ من الساعة 8 صباحاً حتى الساعة 4 مساءً (مدة 8 ساعات أو حتى الانتهاء من المزارات، ولأي تفاصيل أخرى التواصل على الواتساب)، وأي ساعة إضافية تحسب بتكلفة منفصلة.',
    advanceNotice: 'تنبيه هام: حجز مركبات H1 وهاي إس (HiAce) يتطلب إشعاراً وتأكيداً مسبقاً قبل الموعد بيومين على الأقل.',
    management: 'إدارة / جهاد حسين (Gihad Hussien) - هاتف وواتساب: 01091501160'
  },
  en: {
    airportOverday: 'Any hotel located within the Cairo Airport zone is billed as an Overday rate.',
    farHotels: 'Outer-zone hotels (6th of October, New Cairo / 5th Settlement, Nasr City, Heliopolis): add 200 EGP for Sedan & 7-Seater, add 500 EGP for H1 & HiAce.',
    dayTourHours: 'Full-day tours run from 8:00 AM to 4:00 PM (Duration: 8 hours or upon completing sights; contact WhatsApp for details); additional hours are billed separately.',
    advanceNotice: 'Important Notice: Booking H1 Luxury Van or Toyota HiAce requires at least 2 days advance reservation.',
    management: 'Management: Gihad Hussien - Phone & WhatsApp: +20 109 150 1160'
  }
};
