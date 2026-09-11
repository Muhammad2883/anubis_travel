'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { VEHICLES, ROUTES, INITIAL_REGULAR_CLIENTS } from '@/lib/data';
import { Route, Vehicle, RegularClient, ClientTrip, CarModel, Currency } from '@/lib/types';
import {
  LayoutDashboard,
  CalendarCheck,
  MapPin,
  Car,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Plus,
  ArrowRight,
  MessageCircle,
  Phone,
  Settings,
  ShieldCheck,
  ChevronRight,
  Save,
  RotateCcw,
  FileText,
  Trash2,
  Eye,
  EyeOff,
  Edit3,
  Compass,
  Check,
  CreditCard,
  Building,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

interface AdminBooking {
  id: string;
  reference: string;
  type: 'transfer';
  title: string;
  customerName: string;
  customerPhone: string;
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  dropoffLocation?: string;
  vehicleName: string;
  amountEgp: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  flightNumber?: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'routes' | 'clients' | 'fleet'>('overview');

  // 1. Bookings State
  const [bookings, setBookings] = useState<AdminBooking[]>([
    {
      id: '1',
      reference: 'ANB-0911-8841',
      type: 'transfer',
      title: 'مطار القاهرة الدولي (استقبال صالة 3)',
      customerName: 'د. خالد عبد الرحمن',
      customerPhone: '01098765432',
      pickupDate: '2026-09-12',
      pickupTime: '14:30',
      pickupLocation: 'مطار القاهرة - صالة 3',
      dropoffLocation: 'فندق ماريوت الزمالك',
      vehicleName: 'ملاكي سيدان فاخرة',
      amountEgp: 800,
      status: 'confirmed',
      flightNumber: 'MS 777',
      createdAt: '2026-09-11 10:15'
    },
    {
      id: '2',
      reference: 'ANB-0911-5420',
      type: 'transfer',
      title: 'أوفر داي إسكندرية (رحلة يوم كامل)',
      customerName: 'عائلة المهندس أحمد فؤاد',
      customerPhone: '01122334455',
      pickupDate: '2026-09-13',
      pickupTime: '07:00',
      pickupLocation: 'مدينتي - التجمع',
      dropoffLocation: 'كورنيش الإسكندرية وقايتباي',
      vehicleName: '7 راكب عائلي (SUV)',
      amountEgp: 3700,
      status: 'pending',
      createdAt: '2026-09-11 11:30'
    },
    {
      id: '3',
      reference: 'ANB-0910-1120',
      type: 'transfer',
      title: 'هرم - ممفيس - سقارة - دهشور',
      customerName: 'أ. محمود سامي',
      customerPhone: '01234567890',
      pickupDate: '2026-09-10',
      pickupTime: '08:00',
      pickupLocation: 'المعادي',
      dropoffLocation: 'منطقة الأهرامات',
      vehicleName: 'ملاكي سيدان',
      amountEgp: 1200,
      status: 'completed',
      createdAt: '2026-09-10 09:00'
    }
  ]);

  // 2. Routes & Unified Pricing State
  const [routesData, setRoutesData] = useState<Route[]>(ROUTES);
  const [usdRate, setUsdRate] = useState<number>(48.5);
  const [eurRate, setEurRate] = useState<number>(53.0);
  const [farHotelSedanSurcharge, setFarHotelSedanSurcharge] = useState<number>(200);
  const [farHotelVanSurcharge, setFarHotelVanSurcharge] = useState<number>(500);
  const [isSavingRoutes, setIsSavingRoutes] = useState(false);
  const [routesSaveStatus, setRoutesSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [editingRouteForDetails, setEditingRouteForDetails] = useState<Route | null>(null);

  // Load live routes from backend API / localStorage
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const cached = localStorage.getItem('anubis_routes');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRoutesData(parsed);
          }
        }
        const res = await fetch('/api/routes');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.routes)) {
            setRoutesData(data.routes);
            localStorage.setItem('anubis_routes', JSON.stringify(data.routes));
          }
        }
      } catch (err) {
        console.warn('Could not fetch routes:', err);
      }
    };
    loadRoutes();
  }, []);

  // 3. Regular Clients & Account Statements State
  const [clients, setClients] = useState<RegularClient[]>(INITIAL_REGULAR_CLIENTS);
  const [selectedClientForStatement, setSelectedClientForStatement] = useState<RegularClient | null>(null);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [newClientForm, setNewClientForm] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    clientType: 'vip' as 'vip' | 'corporate' | 'hotel' | 'agency',
    notes: ''
  });

  // Record Payment / Add Trip to Client
  const [isAddTripToClientOpen, setIsAddTripToClientOpen] = useState(false);
  const [newTripForm, setNewTripForm] = useState({
    date: new Date().toISOString().split('T')[0],
    routeTitle: ROUTES[0].title.ar,
    vehicleName: 'ملاكي سيدان فاخرة',
    amountEgp: 800,
    paidAmountEgp: 800,
    driverName: 'كابتن / أحمد صلاح',
    notes: ''
  });

  // 4. Fleet & Models State
  const [fleetCategories, setFleetCategories] = useState<Vehicle[]>(VEHICLES);
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [targetCategorySlug, setTargetCategorySlug] = useState<string>('sedan');
  const [newCarForm, setNewCarForm] = useState({
    nameAr: '',
    nameEn: '',
    year: 2025,
    featuresAr: '',
    showOnHomepage: true
  });

  // Filters & Search
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [clientSearch, setClientSearch] = useState('');
  const [routeSearch, setRouteSearch] = useState('');

  // Manual Booking Modal
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);
  const [newBookingForm, setNewBookingForm] = useState({
    customerName: '',
    customerPhone: '',
    routeId: ROUTES[0].id,
    vehicleSlug: 'sedan',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupTime: '10:00',
    pickupLocation: '',
    flightNumber: ''
  });

  // Add Route Modal
  const [isAddRouteOpen, setIsAddRouteOpen] = useState(false);
  const [newRouteForm, setNewRouteForm] = useState({
    titleAr: '',
    titleEn: '',
    category: 'day_tour' as any,
    durationAr: '8-9 ساعات',
    sedan: 1000,
    seater7: 1500,
    h1: 2300,
    hiace: 2600
  });

  // Calculations
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const totalRevenueEgp = bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((acc, b) => acc + b.amountEgp, 0);

    const totalClientsBalance = clients.reduce((acc, c) => acc + c.accountBalanceEgp, 0);

    return {
      total,
      pending,
      confirmed,
      completed,
      totalRevenueEgp,
      totalRevenueUsd: Math.round(totalRevenueEgp / usdRate),
      totalRevenueEur: Math.round(totalRevenueEgp / eurRate),
      totalClientsCount: clients.length,
      totalClientsBalance
    };
  }, [bookings, clients, usdRate, eurRate]);

  // Handle Client Management
  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientForm.name.trim() || !newClientForm.phone.trim()) {
      alert('يرجى كتابة اسم العميل ورقم الهاتف.');
      return;
    }

    const newC: RegularClient = {
      id: `c-${Date.now()}`,
      name: newClientForm.name.trim(),
      companyName: newClientForm.companyName.trim() || undefined,
      phone: newClientForm.phone.trim(),
      email: newClientForm.email.trim() || undefined,
      clientType: newClientForm.clientType,
      accountBalanceEgp: 0,
      tripsCount: 0,
      notes: newClientForm.notes.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0],
      trips: []
    };

    setClients([newC, ...clients]);
    setIsAddClientOpen(false);
    setNewClientForm({
      name: '',
      companyName: '',
      phone: '',
      email: '',
      clientType: 'vip',
      notes: ''
    });
    alert('تمت إضافة العميل الثابت بنجاح!');
  };

  const handleDeleteClient = (clientId: string, clientName: string) => {
    if (confirm(`هل أنت متأكد من حذف العميل "${clientName}" وكافة حساباته وسجلاته؟`)) {
      setClients(clients.filter(c => c.id !== clientId));
      if (selectedClientForStatement?.id === clientId) {
        setSelectedClientForStatement(null);
      }
    }
  };

  // Add Trip / Transaction to Client
  const handleAddTripToClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForStatement) return;

    const remaining = newTripForm.amountEgp - newTripForm.paidAmountEgp;
    const tripStatus: 'paid' | 'partial' | 'unpaid' =
      remaining <= 0 ? 'paid' : newTripForm.paidAmountEgp > 0 ? 'partial' : 'unpaid';

    const newTrip: ClientTrip = {
      id: `t-${Date.now()}`,
      date: newTripForm.date,
      routeTitle: newTripForm.routeTitle,
      vehicleName: newTripForm.vehicleName,
      amountEgp: newTripForm.amountEgp,
      paidAmountEgp: newTripForm.paidAmountEgp,
      status: tripStatus,
      driverName: newTripForm.driverName || undefined,
      notes: newTripForm.notes || undefined
    };

    const updatedClients = clients.map(c => {
      if (c.id === selectedClientForStatement.id) {
        const updatedTrips = [newTrip, ...c.trips];
        const newBalance = c.accountBalanceEgp + remaining;
        return {
          ...c,
          trips: updatedTrips,
          tripsCount: updatedTrips.length,
          accountBalanceEgp: newBalance
        };
      }
      return c;
    });

    setClients(updatedClients);
    setSelectedClientForStatement(updatedClients.find(c => c.id === selectedClientForStatement.id) || null);
    setIsAddTripToClientOpen(false);
    alert('تم تسجيل الرحلة وتحديث كشف حساب العميل بنجاح!');
  };

  // Handle Adding Car to Category
  const handleAddCarToCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCarForm.nameAr.trim()) {
      alert('يرجى كتابة اسم السيارة والموديل.');
      return;
    }

    const featuresList = newCarForm.featuresAr
      ? newCarForm.featuresAr.split(',').map(s => s.trim()).filter(Boolean)
      : ['تكييف فائق', 'سائق محترف'];

    const newCar: CarModel = {
      id: `car-${Date.now()}`,
      categorySlug: targetCategorySlug,
      name: {
        ar: newCarForm.nameAr.trim(),
        en: newCarForm.nameEn.trim() || newCarForm.nameAr.trim()
      },
      year: newCarForm.year,
      features: {
        ar: featuresList,
        en: featuresList
      },
      showOnHomepage: newCarForm.showOnHomepage
    };

    const updated = fleetCategories.map(cat => {
      if (cat.slug === targetCategorySlug) {
        return {
          ...cat,
          models: [...(cat.models || []), newCar]
        };
      }
      return cat;
    });

    setFleetCategories(updated);
    setIsAddCarModalOpen(false);
    setNewCarForm({
      nameAr: '',
      nameEn: '',
      year: 2025,
      featuresAr: '',
      showOnHomepage: true
    });
    alert('تمت إضافة السيارة بنجاح تحت الفئة المحددة وستظهر في الصفحة الرئيسية حسب اختيارك!');
  };

  const handleToggleCarHomepage = (categorySlug: string, carId: string) => {
    setFleetCategories(prev =>
      prev.map(cat => {
        if (cat.slug === categorySlug && cat.models) {
          return {
            ...cat,
            models: cat.models.map(m => m.id === carId ? { ...m, showOnHomepage: !m.showOnHomepage } : m)
          };
        }
        return cat;
      })
    );
  };

  const handleDeleteCar = (categorySlug: string, carId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه السيارة من الأسطول؟')) {
      setFleetCategories(prev =>
        prev.map(cat => {
          if (cat.slug === categorySlug && cat.models) {
            return {
              ...cat,
              models: cat.models.filter(m => m.id !== carId)
            };
          }
          return cat;
        })
      );
    }
  };

  // Route Price Change in Combined Section
  const handlePriceChange = (routeId: number, vehicleKey: 'sedan' | '7seater' | 'h1' | 'hiace', value: string) => {
    const num = value === '' ? null : Number(value);
    setRoutesData(prev =>
      prev.map(r => {
        if (r.id === routeId) {
          return {
            ...r,
            prices: {
              ...r.prices,
              [vehicleKey]: num
            }
          };
        }
        return r;
      })
    );
  };

  // Save All Routes to Backend API and localStorage
  const handleSaveRoutes = async () => {
    setIsSavingRoutes(true);
    setRoutesSaveStatus('idle');
    try {
      const res = await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routes: routesData })
      });

      if (res.ok) {
        localStorage.setItem('anubis_routes', JSON.stringify(routesData));
        window.dispatchEvent(new Event('anubis_routes_updated'));
        setRoutesSaveStatus('success');
        setTimeout(() => setRoutesSaveStatus('idle'), 4000);
      } else {
        throw new Error('Save failed');
      }
    } catch (err) {
      console.error('Error saving routes:', err);
      setRoutesSaveStatus('error');
      setTimeout(() => setRoutesSaveStatus('idle'), 4000);
    } finally {
      setIsSavingRoutes(false);
    }
  };

  // Toggle Route Visibility in Homepage Tours Catalog
  const handleToggleRouteCatalog = (routeId: number) => {
    setRoutesData(prev =>
      prev.map(r => {
        if (r.id === routeId) {
          const updatedVal = r.showInCatalog === false ? true : false;
          return { ...r, showInCatalog: updatedVal };
        }
        return r;
      })
    );
  };

  // Save Route Details from Modal
  const handleSaveEditedRouteDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRouteForDetails) return;

    setRoutesData(prev =>
      prev.map(r => r.id === editingRouteForDetails.id ? editingRouteForDetails : r)
    );
    const updatedId = editingRouteForDetails.id;
    setEditingRouteForDetails(null);
    alert('تم حفظ تفاصيل البرنامج السياحي بنجاح! لا تنسَ الضغط على "حفظ التعديلات" لنشرها مباشرة في الموقع.');
  };

  // Add Route
  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouteForm.titleAr.trim()) {
      alert('يرجى إدخال اسم المسار.');
      return;
    }

    const newR: Route = {
      id: routesData.length + 1,
      slug: `tour-${Date.now()}`,
      title: {
        ar: newRouteForm.titleAr.trim(),
        en: newRouteForm.titleEn.trim() || newRouteForm.titleAr.trim()
      },
      category: newRouteForm.category,
      estimatedDuration: {
        ar: newRouteForm.durationAr,
        en: newRouteForm.durationAr
      },
      prices: {
        sedan: Number(newRouteForm.sedan) || 1000,
        '7seater': Number(newRouteForm.seater7) || 1500,
        h1: newRouteForm.h1 ? Number(newRouteForm.h1) : null,
        hiace: newRouteForm.hiace ? Number(newRouteForm.hiace) : null
      },
      showInCatalog: true,
      rating: 4.9,
      reviewsCount: 1,
      imageUrl: '/hero-pyramids.jpg',
      highlights: {
        ar: ['خدمة راقية بسيارة خاصة مكيفة', 'سائق محترف ومواعيد دقيقة'],
        en: ['Private luxury chauffeur service', 'Punctual and professional transit']
      }
    };

    const updatedRoutes = [...routesData, newR];
    setRoutesData(updatedRoutes);
    setIsAddRouteOpen(false);
    alert('تمت إضافة المسار والبرنامج بنجاح! اضغط "حفظ التعديلات" لنشره فوراً في الموقع.');
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#070503] text-[#ede3d1] font-sans selection:bg-[#d4af37] selection:text-black">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 border-b border-[#d4af37]/30 bg-[#0e0a06]/95 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[#d4af37]/50 p-0.5 shadow-md group-hover:border-[#d4af37]">
                <Image
                  src="/anubis-logo.png"
                  alt="ANUBIS"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain rounded-full"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-[#fae48c] font-serif tracking-wide">
                    لوحة التحكم والإدارة
                  </span>
                  <span className="rounded bg-[#d4af37]/20 px-2 py-0.5 text-[10px] font-bold text-[#fae48c] border border-[#d4af37]/40">
                    ANUBIS OPS
                  </span>
                </div>
                <p className="text-[11px] text-[#a69883]">
                  إشراف الإدارة: جهاد حسين (Gihad Hussien)
                </p>
              </div>
            </Link>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-xl border border-[#d4af37]/40 bg-[#16110b] px-3.5 py-1.5 text-xs font-semibold text-[#ede3d1] hover:bg-[#20180f] hover:text-[#fae48c] transition-all"
          >
            <span>عرض الموقع للجمهور</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#d4af37]" />
          </Link>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-[#d4af37]/20 mb-8 scrollbar-thin">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'gold-gradient-bg shadow-md shadow-[#d4af37]/20 text-black'
                : 'border border-[#d4af37]/25 bg-[#120e0a] text-[#ede3d1] hover:border-[#d4af37] hover:text-[#fae48c]'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>نظرة عامة والتحليلات</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'gold-gradient-bg shadow-md shadow-[#d4af37]/20 text-black'
                : 'border border-[#d4af37]/25 bg-[#120e0a] text-[#ede3d1] hover:border-[#d4af37] hover:text-[#fae48c]'
            }`}
          >
            <CalendarCheck className="h-4 w-4" />
            <span>جدول الحجوزات والـ CRM</span>
            {stats.pending > 0 && (
              <span className="rounded-full bg-[#ff4757] px-2 py-0.2 text-[10px] font-black text-white">
                {stats.pending}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'clients'
                ? 'gold-gradient-bg shadow-md shadow-[#d4af37]/20 text-black'
                : 'border border-[#d4af37]/25 bg-[#120e0a] text-[#ede3d1] hover:border-[#d4af37] hover:text-[#fae48c]'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>العملاء الثابتين والحسابات</span>
            <span className="rounded-full bg-[#d4af37]/20 px-2 py-0.2 text-[10px] font-bold text-[#fae48c]">
              {clients.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('routes')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'routes'
                ? 'gold-gradient-bg shadow-md shadow-[#d4af37]/20 text-black'
                : 'border border-[#d4af37]/25 bg-[#120e0a] text-[#ede3d1] hover:border-[#d4af37] hover:text-[#fae48c]'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>المسارات الـ 19 والتسعير والعملات</span>
          </button>

          <button
            onClick={() => setActiveTab('fleet')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'fleet'
                ? 'gold-gradient-bg shadow-md shadow-[#d4af37]/20 text-black'
                : 'border border-[#d4af37]/25 bg-[#120e0a] text-[#ede3d1] hover:border-[#d4af37] hover:text-[#fae48c]'
            }`}
          >
            <Car className="h-4 w-4" />
            <span>أسطول المركبات والسيارات</span>
          </button>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-5 shadow-xl">
                <div className="flex items-center justify-between text-[#a69883] text-xs">
                  <span>إجمالي الحجوزات</span>
                  <CalendarCheck className="h-4 w-4 text-[#d4af37]" />
                </div>
                <div className="mt-3 text-3xl font-black text-white">{stats.total}</div>
                <p className="mt-1 text-[11px] text-[#38ef7d]">سجلات تشغيل نشطة</p>
              </div>

              <div className="rounded-2xl border border-[#f5d34c]/40 bg-[#1a140b] p-5 shadow-xl">
                <div className="flex items-center justify-between text-[#a69883] text-xs">
                  <span>حجوزات قيد الانتظار</span>
                  <Clock className="h-4 w-4 text-[#f5d34c]" />
                </div>
                <div className="mt-3 text-3xl font-black text-[#f5d34c]">{stats.pending}</div>
                <p className="mt-1 text-[11px] text-[#f5d34c]">تحتاج تأكيد وتعيين سائق</p>
              </div>

              <div className="rounded-2xl border border-[#38ef7d]/30 bg-[#0d160f] p-5 shadow-xl">
                <div className="flex items-center justify-between text-[#a69883] text-xs">
                  <span>العملاء الثابتين</span>
                  <Users className="h-4 w-4 text-[#38ef7d]" />
                </div>
                <div className="mt-3 text-3xl font-black text-[#38ef7d]">{stats.totalClientsCount}</div>
                <p className="mt-1 text-[11px] text-[#a69883]">
                  إجمالي المديونية المستحقة: <strong className="text-[#fae48c]">{stats.totalClientsBalance.toLocaleString('en-US')} ج.م</strong>
                </p>
              </div>

              <div className="rounded-2xl border-2 border-[#d4af37] bg-gradient-to-br from-[#1c160e] to-[#120e0a] p-5 shadow-2xl">
                <div className="flex items-center justify-between text-[#a69883] text-xs">
                  <span>إجمالي الإيرادات التقديرية</span>
                  <TrendingUp className="h-4 w-4 text-[#d4af37]" />
                </div>
                <div className="mt-3 text-2xl sm:text-3xl font-black text-[#fae48c]">
                  {stats.totalRevenueEgp.toLocaleString('en-US')} ج.م
                </div>
                <p className="mt-1 text-[11px] text-[#a69883]">
                  ≈ ${stats.totalRevenueUsd.toLocaleString('en-US')} USD | €{stats.totalRevenueEur.toLocaleString('en-US')} EUR
                </p>
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('clients')}
                className="flex items-center justify-between rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-5 hover:border-[#d4af37] transition-all text-start group cursor-pointer"
              >
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#fae48c]">العملاء الثابتين</h4>
                  <p className="text-xs text-[#a69883] mt-1">كشوفات الحساب والمديونيات والتسويات</p>
                </div>
                <Users className="h-6 w-6 text-[#d4af37]" />
              </button>

              <button
                onClick={() => setActiveTab('routes')}
                className="flex items-center justify-between rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-5 hover:border-[#d4af37] transition-all text-start group cursor-pointer"
              >
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#fae48c]">المسارات والتسعير</h4>
                  <p className="text-xs text-[#a69883] mt-1">تعديل أسعار المسارات والعملات والفنادق البعيدة</p>
                </div>
                <MapPin className="h-6 w-6 text-[#d4af37]" />
              </button>

              <button
                onClick={() => setActiveTab('fleet')}
                className="flex items-center justify-between rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-5 hover:border-[#d4af37] transition-all text-start group cursor-pointer"
              >
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#fae48c]">إدارة سيارات الأسطول</h4>
                  <p className="text-xs text-[#a69883] mt-1">إضافة سيارات وتحديد ظهورها بالرئيسية</p>
                </div>
                <Car className="h-6 w-6 text-[#d4af37]" />
              </button>
            </div>
          </div>
        )}

        {/* 2. BOOKINGS CRM TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-5 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a69883]" />
                  <input
                    type="text"
                    placeholder="بحث باسم العميل أو الهاتف..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] pr-9 pl-4 py-2 text-xs text-[#ede3d1] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value as any)}
                  className="rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2 text-xs text-[#fae48c] focus:outline-none cursor-pointer"
                >
                  <option value="all">جميع الحالات ({bookings.length})</option>
                  <option value="pending">معلق / جديد ({stats.pending})</option>
                  <option value="confirmed">مؤكد ({stats.confirmed})</option>
                  <option value="completed">مكتمل ({stats.completed})</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>

              <button
                onClick={() => setIsAddBookingOpen(true)}
                className="flex items-center gap-1.5 rounded-xl gold-gradient-bg px-4 py-2 text-xs font-bold text-black hover:opacity-95 transition-all cursor-pointer shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>إضافة حجز يدوي جديد</span>
              </button>
            </div>

            {/* Bookings Table */}
            <div className="rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead className="border-b border-[#d4af37]/20 bg-[#17120c] text-[#fae48c] uppercase font-bold">
                    <tr>
                      <th className="px-4 py-3.5 text-start">الرقم المرجعي</th>
                      <th className="px-4 py-3.5 text-start">العميل والتواصل</th>
                      <th className="px-4 py-3.5 text-start">الخدمة / خط السير</th>
                      <th className="px-4 py-3.5 text-start">المركبة</th>
                      <th className="px-4 py-3.5 text-start">الموعد</th>
                      <th className="px-4 py-3.5 text-start">السعر</th>
                      <th className="px-4 py-3.5 text-start">الحالة</th>
                      <th className="px-4 py-3.5 text-start">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d4af37]/10 text-[#ede3d1]">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#18130d] transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-[#fae48c] whitespace-nowrap">
                          {b.reference}
                        </td>
                        <td className="px-4 py-3">
                          <strong className="block text-white font-bold">{b.customerName}</strong>
                          <span className="text-[11px] text-[#a69883] font-mono">{b.customerPhone}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-white block">{b.title}</span>
                          {b.flightNumber && (
                            <span className="text-[10px] text-[#d4af37] font-mono">✈️ {b.flightNumber}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-[#ede3d1]">
                          {b.vehicleName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="block text-white font-medium">{b.pickupDate}</span>
                          <span className="text-[11px] text-[#a69883] font-mono">{b.pickupTime}</span>
                        </td>
                        <td className="px-4 py-3 font-black text-[#fae48c] whitespace-nowrap text-sm">
                          {b.amountEgp.toLocaleString('en-US')} ج.م
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                            b.status === 'confirmed' ? 'bg-[#38ef7d]/20 text-[#38ef7d]' :
                            b.status === 'pending' ? 'bg-[#f5d34c]/20 text-[#f5d34c]' :
                            b.status === 'completed' ? 'bg-[#209cee]/20 text-[#209cee]' : 'bg-[#ff4757]/20 text-[#ff4757]'
                          }`}>
                            {b.status === 'confirmed' ? 'مؤكد' : b.status === 'pending' ? 'معلق' : b.status === 'completed' ? 'مكتمل' : 'ملغي'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <a
                              href={`https://api.whatsapp.com/send?phone=${b.customerPhone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg bg-[#25D366] p-1.5 text-white hover:opacity-90"
                              title="محادثة واتساب"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </a>
                            <button
                              onClick={() => {
                                if (confirm('هل أنت متأكد من حذف الحجز؟')) {
                                  setBookings(bookings.filter(x => x.id !== b.id));
                                }
                              }}
                              className="rounded-lg border border-[#ff4757]/40 p-1.5 text-[#ff4757] hover:bg-[#ff4757]/20"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. REGULAR CLIENTS & ACCOUNT STATEMENTS TAB */}
        {activeTab === 'clients' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header & Controls */}
            <div className="rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-5 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#d4af37]" />
                  <span>سجل العملاء الثابتين والحسابات التفصيلية</span>
                </h3>
                <p className="text-xs text-[#a69883] mt-1">
                  إدارة بيانات العملاء الدائمين، متابعة مديونياتهم، وكشوفات الحساب بالرحلات والمدفوعات.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAddClientOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl gold-gradient-bg px-4 py-2 text-xs font-bold text-black hover:opacity-95 transition-all cursor-pointer shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  <span>إضافة عميل ثابت جديد</span>
                </button>
              </div>
            </div>

            {/* Clients List & Detail Split Screen */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Clients Directory (5 Cols) */}
              <div className="lg:col-span-5 space-y-3">
                {clients.map((client) => {
                  const isSelected = selectedClientForStatement?.id === client.id;

                  return (
                    <div
                      key={client.id}
                      onClick={() => setSelectedClientForStatement(client)}
                      className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#d4af37] bg-[#1a140d] shadow-xl shadow-[#d4af37]/15 ring-1 ring-[#d4af37]'
                          : 'border-[#d4af37]/25 bg-[#120e0a] hover:border-[#d4af37]/60 hover:bg-[#16110c]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{client.name}</h4>
                            <span className="rounded bg-[#d4af37]/20 px-2 py-0.5 text-[10px] font-semibold text-[#fae48c]">
                              {client.clientType === 'vip' ? 'فرد VIP' : client.clientType === 'hotel' ? 'فندق' : client.clientType === 'corporate' ? 'شركة' : 'وكالة'}
                            </span>
                          </div>
                          {client.companyName && (
                            <p className="text-xs text-[#a69883] mt-0.5">{client.companyName}</p>
                          )}
                          <p className="text-xs text-[#fae48c] font-mono mt-1">📞 {client.phone}</p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClient(client.id, client.name);
                          }}
                          className="text-[#ff4757] hover:bg-[#ff4757]/20 p-1 rounded-lg"
                          title="حذف العميل"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#d4af37]/15 flex items-center justify-between text-xs">
                        <span className="text-[#a69883]">عدد الرحلات: <strong className="text-white">{client.trips.length}</strong></span>
                        <div>
                          <span className="text-[#a69883] ml-1">الرصيد:</span>
                          <strong className={client.accountBalanceEgp > 0 ? 'text-[#ff4757] font-mono font-bold' : 'text-[#38ef7d] font-mono font-bold'}>
                            {client.accountBalanceEgp > 0 ? `${client.accountBalanceEgp.toLocaleString('en-US')} ج.م مستحق` : 'خالص'}
                          </strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Statement of Account (7 Cols) */}
              <div className="lg:col-span-7 rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-5 sm:p-6 shadow-2xl min-h-[450px]">
                {selectedClientForStatement ? (
                  <div className="space-y-6">
                    {/* Statement Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#d4af37]/20">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-white">{selectedClientForStatement.name}</h4>
                          <span className="rounded bg-[#d4af37]/20 px-2 py-0.5 text-xs text-[#fae48c]">
                            كشف حساب تفصيلي
                          </span>
                        </div>
                        <p className="text-xs text-[#a69883] mt-0.5">
                          {selectedClientForStatement.companyName || selectedClientForStatement.phone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://api.whatsapp.com/send?phone=${selectedClientForStatement.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-xl bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white hover:opacity-90"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>واتساب</span>
                        </a>

                        <button
                          onClick={() => setIsAddTripToClientOpen(true)}
                          className="flex items-center gap-1 rounded-xl gold-gradient-bg px-3 py-1.5 text-xs font-bold text-black hover:opacity-95"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>إضافة رحلة / فاتورة</span>
                        </button>
                      </div>
                    </div>

                    {/* Financial Summary Card */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-xl border border-[#d4af37]/20 bg-[#18120c] p-3 text-center">
                        <span className="text-[11px] text-[#a69883] block">إجمالي قيمة الرحلات</span>
                        <strong className="text-sm font-mono font-black text-white mt-1 block">
                          {selectedClientForStatement.trips.reduce((acc, t) => acc + t.amountEgp, 0).toLocaleString('en-US')} ج.م
                        </strong>
                      </div>

                      <div className="rounded-xl border border-[#38ef7d]/20 bg-[#0d160f] p-3 text-center">
                        <span className="text-[11px] text-[#38ef7d] block">إجمالي المسدد</span>
                        <strong className="text-sm font-mono font-black text-[#38ef7d] mt-1 block">
                          {selectedClientForStatement.trips.reduce((acc, t) => acc + t.paidAmountEgp, 0).toLocaleString('en-US')} ج.م
                        </strong>
                      </div>

                      <div className="rounded-xl border border-[#ff4757]/30 bg-[#1c1010] p-3 text-center">
                        <span className="text-[11px] text-[#ff4757] block">المتبقي / الرصيد</span>
                        <strong className="text-sm font-mono font-black text-[#ff4757] mt-1 block">
                          {selectedClientForStatement.accountBalanceEgp.toLocaleString('en-US')} ج.م
                        </strong>
                      </div>
                    </div>

                    {/* Notes if any */}
                    {selectedClientForStatement.notes && (
                      <div className="rounded-xl border border-[#d4af37]/20 bg-[#16110b] p-3 text-xs text-[#a69883]">
                        <strong className="text-[#fae48c] block mb-1">ملاحظات العميل الخاصة:</strong>
                        {selectedClientForStatement.notes}
                      </div>
                    )}

                    {/* Trips List in Statement */}
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-[#fae48c] mb-3 flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-[#d4af37]" />
                        <span>سجل الرحلات والفواتير:</span>
                      </h5>

                      {selectedClientForStatement.trips.length === 0 ? (
                        <div className="text-center py-8 text-xs text-[#a69883] border border-dashed border-[#d4af37]/20 rounded-xl">
                          لا توجد رحلات مسجلة لهذا العميل حتى الآن. يمكنك إضافة رحلة جديدة بالضغط على &quot;إضافة رحلة / فاتورة&quot;.
                        </div>
                      ) : (
                        <div className="space-y-2.5 max-h-72 overflow-y-auto">
                          {selectedClientForStatement.trips.map((trip) => (
                            <div
                              key={trip.id}
                              className="rounded-xl border border-[#d4af37]/20 bg-[#16110c] p-3 text-xs flex items-center justify-between gap-3"
                            >
                              <div>
                                <span className="font-mono text-[#fae48c] font-bold text-[11px]">{trip.date}</span>
                                <h6 className="font-bold text-white mt-0.5">{trip.routeTitle}</h6>
                                <p className="text-[11px] text-[#a69883]">
                                  المركبة: {trip.vehicleName} {trip.driverName && `• السائق: ${trip.driverName}`}
                                </p>
                              </div>

                              <div className="text-end shrink-0">
                                <div className="font-black text-sm text-white font-mono">
                                  {trip.amountEgp.toLocaleString('en-US')} ج.م
                                </div>
                                <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold mt-1 ${
                                  trip.status === 'paid' ? 'bg-[#38ef7d]/20 text-[#38ef7d]' :
                                  trip.status === 'partial' ? 'bg-[#f5d34c]/20 text-[#f5d34c]' : 'bg-[#ff4757]/20 text-[#ff4757]'
                                }`}>
                                  {trip.status === 'paid' ? 'مدفوع بالكامل' :
                                   trip.status === 'partial' ? `مسدد ${trip.paidAmountEgp.toLocaleString('en-US')} ج.م` : 'غير مسدد'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16 text-[#a69883]">
                    <Users className="h-12 w-12 text-[#d4af37]/40 mb-3" />
                    <p className="text-sm font-bold text-white">اختر عميلاً من القائمة الجانبية</p>
                    <p className="text-xs mt-1">لعرض حسابه التفصيلي وكافة رحلاته وفواتيره ومتبقي المديونية.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. ROUTES, COMBINED PRICING & CURRENCIES TAB */}
        {activeTab === 'routes' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Currency Rates & Outer Zone Surcharges Bar */}
            <div className="rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-5 shadow-xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#d4af37]/15">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#d4af37]" />
                    <span>إدارة المسارات والبرامج السياحية والتسعير الموحد</span>
                  </h3>
                  <p className="text-xs text-[#a69883] mt-1">
                    المسارات والتسعير متزامنة تلقائياً بين لوحة الإدارة وكتالوج الجولات ومحرك الحجز في الصفحة الرئيسية.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-[#1a140e] px-3 py-1.5 rounded-xl border border-[#d4af37]/30 text-xs">
                    <span className="text-[#a69883]">1 USD =</span>
                    <input
                      type="number"
                      value={usdRate}
                      onChange={(e) => setUsdRate(Number(e.target.value))}
                      className="w-16 bg-transparent text-[#fae48c] font-mono font-bold focus:outline-none"
                    />
                    <span className="text-[#a69883]">ج.م</span>
                  </div>

                  <div className="flex items-center gap-2 bg-[#1a140e] px-3 py-1.5 rounded-xl border border-[#d4af37]/30 text-xs">
                    <span className="text-[#a69883]">1 EUR =</span>
                    <input
                      type="number"
                      value={eurRate}
                      onChange={(e) => setEurRate(Number(e.target.value))}
                      className="w-16 bg-transparent text-[#fae48c] font-mono font-bold focus:outline-none"
                    />
                    <span className="text-[#a69883]">ج.م</span>
                  </div>

                  <button
                    onClick={handleSaveRoutes}
                    disabled={isSavingRoutes}
                    className="flex items-center gap-1.5 rounded-xl gold-gradient-bg px-4 py-2 text-xs font-bold text-black hover:opacity-95 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSavingRoutes ? 'جاري الحفظ والتزامن...' : 'حفظ ونشر التعديلات'}</span>
                  </button>

                  {routesSaveStatus === 'success' && (
                    <span className="flex items-center gap-1 text-xs text-[#38ef7d] bg-[#38ef7d]/15 border border-[#38ef7d]/30 px-3 py-1.5 rounded-xl animate-fadeIn">
                      <Check className="h-3.5 w-3.5" />
                      <span>تم الحفظ والتزامن مع الصفحة الرئيسية بنجاح!</span>
                    </span>
                  )}
                  {routesSaveStatus === 'error' && (
                    <span className="flex items-center gap-1 text-xs text-[#ff4757] bg-[#ff4757]/15 border border-[#ff4757]/30 px-3 py-1.5 rounded-xl animate-fadeIn">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>فشل حفظ التعديلات، حاول مجدداً</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Surcharges Controllers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
                <div className="flex items-center justify-between rounded-xl border border-[#d4af37]/20 bg-[#16110b] p-3">
                  <span className="text-[#ede3d1]">فارق الفنادق البعيدة (سيدان و 7 راكب):</span>
                  <div className="flex items-center gap-1 font-bold text-[#fae48c]">
                    <input
                      type="number"
                      value={farHotelSedanSurcharge}
                      onChange={(e) => setFarHotelSedanSurcharge(Number(e.target.value))}
                      className="w-16 rounded border border-[#d4af37]/30 bg-[#1a140e] px-2 py-0.5 text-end font-mono"
                    />
                    <span>ج.م</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-[#d4af37]/20 bg-[#16110b] p-3">
                  <span className="text-[#ede3d1]">فارق الفنادق البعيدة (H1 وهاي إس):</span>
                  <div className="flex items-center gap-1 font-bold text-[#fae48c]">
                    <input
                      type="number"
                      value={farHotelVanSurcharge}
                      onChange={(e) => setFarHotelVanSurcharge(Number(e.target.value))}
                      className="w-16 rounded border border-[#d4af37]/30 bg-[#1a140e] px-2 py-0.5 text-end font-mono"
                    />
                    <span>ج.م</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Combined Routes & Pricing Table */}
            <div className="rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-[#d4af37]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#fae48c]">
                    قائمة المسارات والبرامج السياحية المعتمدة ({routesData.length} مساراً)
                  </span>
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute right-3 top-2.5 text-[#a69883]" />
                    <input
                      type="text"
                      placeholder="بحث في المسارات..."
                      value={routeSearch}
                      onChange={(e) => setRouteSearch(e.target.value)}
                      className="rounded-xl border border-[#d4af37]/30 bg-[#1a140e] pr-8 pl-3 py-1 text-xs text-[#ede3d1] focus:outline-none focus:border-[#d4af37] w-44"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddRouteOpen(true)}
                    className="flex items-center gap-1 rounded-lg gold-gradient-bg px-3 py-1.5 text-xs font-bold text-black cursor-pointer shadow-md"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>إضافة مسار / برنامج جديد</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead className="border-b border-[#d4af37]/20 bg-[#17120c] text-[#fae48c] font-bold">
                    <tr>
                      <th className="px-3 py-3 text-start w-10">#</th>
                      <th className="px-4 py-3 text-start">البرنامج / خط السير والتصنيف</th>
                      <th className="px-3 py-3 text-start">المدة</th>
                      <th className="px-2 py-3 text-center">ملاكي سيدان</th>
                      <th className="px-2 py-3 text-center">7 راكب عائلي</th>
                      <th className="px-2 py-3 text-center">إتش وان H1</th>
                      <th className="px-2 py-3 text-center">هاي إس HiAce</th>
                      <th className="px-3 py-3 text-center">عرض بالكتالوج</th>
                      <th className="px-3 py-3 text-center">تعديل التفاصيل</th>
                      <th className="px-2 py-3 text-center">حذف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d4af37]/10 text-[#ede3d1]">
                    {routesData
                      .filter(r => {
                        if (!routeSearch.trim()) return true;
                        const query = routeSearch.toLowerCase();
                        return (
                          r.title.ar.toLowerCase().includes(query) ||
                          r.title.en.toLowerCase().includes(query)
                        );
                      })
                      .map((route) => {
                        const isVisibleInCatalog = route.showInCatalog !== false;
                        const categoryLabels: Record<string, { ar: string; bg: string }> = {
                          day_tour: { ar: 'جولة يومية', bg: 'bg-[#d4af37]/20 text-[#fae48c]' },
                          overday: { ar: 'أوفر داي', bg: 'bg-[#0984e3]/20 text-[#74b9ff]' },
                          multiday: { ar: 'سفاري ومبيت', bg: 'bg-[#e17055]/20 text-[#fab1a0]' },
                          nile_cruise: { ar: 'سهرة نيلية', bg: 'bg-[#6c5ce7]/20 text-[#a29bfe]' },
                          airport: { ar: 'توصيل مطار', bg: 'bg-[#00b894]/20 text-[#55efc4]' },
                          intercity: { ar: 'بين المحافظات', bg: 'bg-[#fdcb6e]/20 text-[#ffeaa7]' }
                        };
                        const catInfo = categoryLabels[route.category] || { ar: 'مسار', bg: 'bg-[#333] text-white' };

                        return (
                          <tr key={route.id} className="hover:bg-[#18130d] transition-colors">
                            <td className="px-3 py-2 font-mono text-[#a69883] font-bold">
                              {route.id}
                            </td>
                            <td className="px-4 py-2 font-semibold text-white">
                              <div className="flex items-center gap-2">
                                <span>{route.title.ar}</span>
                                <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${catInfo.bg}`}>
                                  {catInfo.ar}
                                </span>
                              </div>
                              <div className="text-[10px] text-[#a69883]" dir="ltr">{route.title.en}</div>
                            </td>
                            <td className="px-3 py-2 text-xs text-[#a69883]">
                              {route.estimatedDuration.ar}
                            </td>
                            <td className="px-2 py-2 text-center">
                              <input
                                type="number"
                                value={route.prices.sedan ?? ''}
                                onChange={(e) => handlePriceChange(route.id, 'sedan', e.target.value)}
                                className="w-18 rounded border border-[#d4af37]/30 bg-[#1a140e] px-1.5 py-1 text-center font-mono font-bold text-[#fae48c] focus:outline-none"
                              />
                            </td>
                            <td className="px-2 py-2 text-center">
                              <input
                                type="number"
                                value={route.prices['7seater'] ?? ''}
                                onChange={(e) => handlePriceChange(route.id, '7seater', e.target.value)}
                                className="w-18 rounded border border-[#d4af37]/30 bg-[#1a140e] px-1.5 py-1 text-center font-mono font-bold text-[#fae48c] focus:outline-none"
                              />
                            </td>
                            <td className="px-2 py-2 text-center">
                              <input
                                type="number"
                                placeholder="-"
                                value={route.prices.h1 ?? ''}
                                onChange={(e) => handlePriceChange(route.id, 'h1', e.target.value)}
                                className="w-18 rounded border border-[#d4af37]/30 bg-[#1a140e] px-1.5 py-1 text-center font-mono font-bold text-[#fae48c] focus:outline-none placeholder-[#555]"
                              />
                            </td>
                            <td className="px-2 py-2 text-center">
                              <input
                                type="number"
                                placeholder="-"
                                value={route.prices.hiace ?? ''}
                                onChange={(e) => handlePriceChange(route.id, 'hiace', e.target.value)}
                                className="w-18 rounded border border-[#d4af37]/30 bg-[#1a140e] px-1.5 py-1 text-center font-mono font-bold text-[#fae48c] focus:outline-none placeholder-[#555]"
                              />
                            </td>

                            {/* Show in Catalog Toggle Button */}
                            <td className="px-3 py-2 text-center">
                              <button
                                onClick={() => handleToggleRouteCatalog(route.id)}
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                                  isVisibleInCatalog
                                    ? 'bg-[#38ef7d]/20 text-[#38ef7d] border border-[#38ef7d]/40 hover:bg-[#38ef7d]/30'
                                    : 'bg-[#555]/20 text-[#888] border border-[#555]/40 hover:bg-[#555]/30'
                                }`}
                                title="اضغط للتبديل بين إظهار أو إخفاء هذا البرنامج من كتالوج الصفحة الرئيسية"
                              >
                                {isVisibleInCatalog ? (
                                  <>
                                    <Eye className="h-3 w-3" />
                                    <span>معروض بالرئيسية</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="h-3 w-3" />
                                    <span>مخفي</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Edit Program Details Button */}
                            <td className="px-3 py-2 text-center">
                              <button
                                onClick={() => setEditingRouteForDetails(route)}
                                className="inline-flex items-center gap-1 rounded-lg border border-[#d4af37]/40 bg-[#18120c] px-2.5 py-1 text-xs font-bold text-[#fae48c] hover:bg-[#d4af37] hover:text-black transition-all cursor-pointer"
                              >
                                <Edit3 className="h-3 w-3" />
                                <span>تعديل</span>
                              </button>
                            </td>

                            {/* Delete Route */}
                            <td className="px-2 py-2 text-center">
                              <button
                                onClick={() => {
                                  if (confirm(`هل تريد حذف مسار "${route.title.ar}"؟`)) {
                                    setRoutesData(routesData.filter(r => r.id !== route.id));
                                  }
                                }}
                                className="text-[#ff4757] hover:bg-[#ff4757]/20 p-1.5 rounded cursor-pointer transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. FLEET & CARS MANAGEMENT TAB */}
        {activeTab === 'fleet' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Car className="h-5 w-5 text-[#d4af37]" />
                  <span>أسطول المركبات: الفئات الـ 4 الأساسية والسيارات التابعة</span>
                </h3>
                <p className="text-xs text-[#a69883] mt-1">
                  الفئات الأربعة ثابتة كأقسام رئيسية، ويمكنك إضافة سيارات محددة تحت كل فئة وتحديد ما يُعرض منها في الصفحة الرئيسية.
                </p>
              </div>

              <button
                onClick={() => {
                  setTargetCategorySlug('sedan');
                  setIsAddCarModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-xl gold-gradient-bg px-4 py-2 text-xs font-bold text-black hover:opacity-95 transition-all cursor-pointer shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>إضافة سيارة جديدة لأسطول</span>
              </button>
            </div>

            {/* 4 Main Categories with Sub-cars */}
            <div className="space-y-6">
              {fleetCategories.map((category) => (
                <div
                  key={category.slug}
                  className="rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-6 shadow-xl"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/15">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{category.image_url}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white">{category.name.ar}</h4>
                          <span className="rounded-full bg-[#d4af37]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#fae48c] border border-[#d4af37]/30">
                            فئة أساسية
                          </span>
                        </div>
                        <p className="text-xs text-[#a69883] mt-0.5">
                          سعة {category.passenger_capacity} ركاب • {category.luggage_capacity} حقائب
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setTargetCategorySlug(category.slug);
                        setIsAddCarModalOpen(true);
                      }}
                      className="flex items-center gap-1 rounded-xl border border-[#d4af37]/40 bg-[#1a140e] px-3 py-1.5 text-xs font-bold text-[#fae48c] hover:bg-[#261c12] cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>إضافة سيارة لهذه الفئة</span>
                    </button>
                  </div>

                  {/* Cars under this category */}
                  <div className="mt-5">
                    <h5 className="text-xs font-bold text-[#a69883] uppercase tracking-wider mb-3">
                      السيارات والموديلات المسجلة ({category.models?.length || 0}):
                    </h5>

                    {(!category.models || category.models.length === 0) ? (
                      <div className="rounded-xl border border-dashed border-[#d4af37]/20 p-6 text-center text-xs text-[#a69883]">
                        لا توجد سيارات مضافة حالياً تحت هذه الفئة. اضغط على &quot;إضافة سيارة لهذه الفئة&quot; لإدراج موديل جديد.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.models.map((car) => (
                          <div
                            key={car.id}
                            className="rounded-xl border border-[#d4af37]/20 bg-[#16110b] p-4 flex flex-col justify-between hover:border-[#d4af37]/60 transition-all"
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <h6 className="text-sm font-bold text-white">{car.name.ar}</h6>
                                {car.year && (
                                  <span className="rounded bg-[#d4af37]/20 px-2 py-0.5 text-[10px] font-mono text-[#fae48c]">
                                    {car.year}
                                  </span>
                                )}
                              </div>

                              <ul className="mt-2.5 space-y-1 text-xs text-[#a69883]">
                                {car.features.ar.map((f, idx) => (
                                  <li key={idx} className="flex items-center gap-1.5">
                                    <span className="text-[#d4af37]">•</span>
                                    <span>{f}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#d4af37]/10 flex items-center justify-between text-xs">
                              {/* Show on Homepage Toggle */}
                              <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                                <input
                                  type="checkbox"
                                  checked={car.showOnHomepage}
                                  onChange={() => handleToggleCarHomepage(category.slug, car.id)}
                                  className="h-3.5 w-3.5 rounded border-[#d4af37] text-[#d4af37] focus:ring-[#d4af37]"
                                />
                                <span className={car.showOnHomepage ? 'text-[#38ef7d] font-bold' : 'text-[#a69883]'}>
                                  {car.showOnHomepage ? 'معروضة بالرئيسية' : 'مخفية بالرئيسية'}
                                </span>
                              </label>

                              <button
                                onClick={() => handleDeleteCar(category.slug, car.id)}
                                className="text-[#ff4757] hover:bg-[#ff4757]/20 p-1 rounded"
                                title="حذف السيارة"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD REGULAR CLIENT */}
      {isAddClientOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl border-2 border-[#d4af37] bg-[#120e0a] p-6 shadow-2xl text-start">
            <button
              onClick={() => setIsAddClientOpen(false)}
              className="absolute top-4 left-4 text-[#a69883] hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-[#d4af37]" />
              <span>إضافة عميل ثابت جديد إلى السجلات</span>
            </h3>

            <form onSubmit={handleAddClient} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#fae48c] font-bold mb-1">اسم العميل أو الجهة: *</label>
                <input
                  type="text"
                  required
                  value={newClientForm.name}
                  onChange={(e) => setNewClientForm({ ...newClientForm, name: e.target.value })}
                  placeholder="مثال: أ. عبد الرحمن المنصور"
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2.5 text-[#ede3d1] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#ede3d1] font-bold mb-1">اسم الشركة / الفندق (إن وجد):</label>
                <input
                  type="text"
                  value={newClientForm.companyName}
                  onChange={(e) => setNewClientForm({ ...newClientForm, companyName: e.target.value })}
                  placeholder="مثال: فندق كمبينسكي / شركة بترول"
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2.5 text-[#ede3d1] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#fae48c] font-bold mb-1">رقم الهاتف / الواتساب: *</label>
                  <input
                    type="tel"
                    required
                    value={newClientForm.phone}
                    onChange={(e) => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                    placeholder="010XXXXXXXX"
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2.5 text-[#ede3d1] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#ede3d1] font-bold mb-1">تصنيف العميل:</label>
                  <select
                    value={newClientForm.clientType}
                    onChange={(e) => setNewClientForm({ ...newClientForm, clientType: e.target.value as any })}
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2.5 text-[#ede3d1] focus:outline-none"
                  >
                    <option value="vip" className="bg-[#120e0a]">فرد VIP</option>
                    <option value="corporate" className="bg-[#120e0a]">شركة / قطاع أعمال</option>
                    <option value="hotel" className="bg-[#120e0a]">فندق / كونسيرج</option>
                    <option value="agency" className="bg-[#120e0a]">وكالة سياحة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#ede3d1] font-bold mb-1">البريد الإلكتروني:</label>
                <input
                  type="email"
                  value={newClientForm.email}
                  onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2.5 text-[#ede3d1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#ede3d1] font-bold mb-1">ملاحظات وشروط التعامل:</label>
                <textarea
                  rows={2}
                  value={newClientForm.notes}
                  onChange={(e) => setNewClientForm({ ...newClientForm, notes: e.target.value })}
                  placeholder="مثال: يفضل الدفع شهرياً، يحتاج سيارات H1..."
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-[#ede3d1] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl gold-gradient-bg py-2.5 font-bold text-black hover:opacity-95 shadow-lg"
                >
                  حفظ العميل
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddClientOpen(false)}
                  className="rounded-xl border border-[#d4af37]/40 px-4 py-2.5 font-semibold text-[#ede3d1]"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TRIP TO CLIENT */}
      {isAddTripToClientOpen && selectedClientForStatement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl border-2 border-[#d4af37] bg-[#120e0a] p-6 shadow-2xl text-start">
            <button
              onClick={() => setIsAddTripToClientOpen(false)}
              className="absolute top-4 left-4 text-[#a69883] hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-white mb-4">
              إضافة رحلة لكشف حساب: <span className="text-[#fae48c]">{selectedClientForStatement.name}</span>
            </h3>

            <form onSubmit={handleAddTripToClient} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#ede3d1] font-bold mb-1">تاريخ الرحلة:</label>
                <input
                  type="date"
                  required
                  value={newTripForm.date}
                  onChange={(e) => setNewTripForm({ ...newTripForm, date: e.target.value })}
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2 text-[#ede3d1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#ede3d1] font-bold mb-1">بيان المسار / الخدمة:</label>
                <input
                  type="text"
                  required
                  value={newTripForm.routeTitle}
                  onChange={(e) => setNewTripForm({ ...newTripForm, routeTitle: e.target.value })}
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-[#ede3d1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#ede3d1] font-bold mb-1">نوع المركبة:</label>
                <input
                  type="text"
                  value={newTripForm.vehicleName}
                  onChange={(e) => setNewTripForm({ ...newTripForm, vehicleName: e.target.value })}
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-[#ede3d1] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#fae48c] font-bold mb-1">إجمالي الحساب (ج.م):</label>
                  <input
                    type="number"
                    required
                    value={newTripForm.amountEgp}
                    onChange={(e) => setNewTripForm({ ...newTripForm, amountEgp: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2 text-[#ede3d1] font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#38ef7d] font-bold mb-1">المسدد نقداً (ج.م):</label>
                  <input
                    type="number"
                    required
                    value={newTripForm.paidAmountEgp}
                    onChange={(e) => setNewTripForm({ ...newTripForm, paidAmountEgp: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2 text-[#ede3d1] font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#ede3d1] font-bold mb-1">اسم السائق المنفذ (اختياري):</label>
                <input
                  type="text"
                  value={newTripForm.driverName}
                  onChange={(e) => setNewTripForm({ ...newTripForm, driverName: e.target.value })}
                  placeholder="كابتن / ..."
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-[#ede3d1] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl gold-gradient-bg py-2.5 font-bold text-black hover:opacity-95 shadow-lg"
                >
                  تسجيل الرحلة بالحساب
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddTripToClientOpen(false)}
                  className="rounded-xl border border-[#d4af37]/40 px-4 py-2.5 font-semibold text-[#ede3d1]"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CAR TO CATEGORY */}
      {isAddCarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl border-2 border-[#d4af37] bg-[#120e0a] p-6 shadow-2xl text-start">
            <button
              onClick={() => setIsAddCarModalOpen(false)}
              className="absolute top-4 left-4 text-[#a69883] hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Car className="h-5 w-5 text-[#d4af37]" />
              <span>إضافة سيارة جديدة لأسطول أنوبيس</span>
            </h3>

            <form onSubmit={handleAddCarToCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#ede3d1] font-bold mb-1">الفئة الأساسية:</label>
                <select
                  value={targetCategorySlug}
                  onChange={(e) => setTargetCategorySlug(e.target.value)}
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2 text-[#fae48c] focus:outline-none"
                >
                  {fleetCategories.map(c => (
                    <option key={c.slug} value={c.slug} className="bg-[#120e0a]">
                      {c.name.ar}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#fae48c] font-bold mb-1">اسم السيارة والموديل: *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مرسيدس E-Class 200 أو كيا كرنفال"
                  value={newCarForm.nameAr}
                  onChange={(e) => setNewCarForm({ ...newCarForm, nameAr: e.target.value })}
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-[#ede3d1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#ede3d1] font-bold mb-1">سنة الصنع / الموديل:</label>
                <input
                  type="number"
                  value={newCarForm.year}
                  onChange={(e) => setNewCarForm({ ...newCarForm, year: Number(e.target.value) })}
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-[#ede3d1] font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#ede3d1] font-bold mb-1">المميزات والتجهيزات (مفصولة بفاصلة):</label>
                <input
                  type="text"
                  placeholder="مثال: مقاعد جلد، تكييف مزدوج، شاحن لاسلكي"
                  value={newCarForm.featuresAr}
                  onChange={(e) => setNewCarForm({ ...newCarForm, featuresAr: e.target.value })}
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-[#ede3d1] focus:outline-none"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 text-[#ede3d1] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCarForm.showOnHomepage}
                    onChange={(e) => setNewCarForm({ ...newCarForm, showOnHomepage: e.target.checked })}
                    className="h-4 w-4 rounded border-[#d4af37] text-[#d4af37]"
                  />
                  <span className="font-bold text-[#fae48c]">عرض هذه السيارة في الصفحة الرئيسية للموقع</span>
                </label>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl gold-gradient-bg py-2.5 font-bold text-black hover:opacity-95 shadow-lg"
                >
                  إضافة السيارة للأسطول
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddCarModalOpen(false)}
                  className="rounded-xl border border-[#d4af37]/40 px-4 py-2.5 font-semibold text-[#ede3d1]"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ROUTE / TOUR PROGRAM */}
      {isAddRouteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl border-2 border-[#d4af37] bg-[#120e0a] p-6 shadow-2xl text-start">
            <button
              onClick={() => setIsAddRouteOpen(false)}
              className="absolute top-4 left-4 text-[#a69883] hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-white mb-1">إضافة مسار وبرنامج سياحي جديد</h3>
            <p className="text-xs text-[#a69883] mb-4">
              يمكنك ربطه بالكتالوج المعروض في الصفحة الرئيسية ومحرك الحساب الفوري.
            </p>

            <form onSubmit={handleAddRoute} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#fae48c] font-bold mb-1">اسم المسار (عربي): *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: القاهرة - العين السخنة"
                    value={newRouteForm.titleAr}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, titleAr: e.target.value })}
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2 text-[#ede3d1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#ede3d1] font-bold mb-1">اسم المسار (English):</label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="e.g. Cairo to Sokhna"
                    value={newRouteForm.titleEn}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, titleEn: e.target.value })}
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2 text-[#ede3d1] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#ede3d1] font-bold mb-1">تصنيف البرنامج:</label>
                  <select
                    value={newRouteForm.category}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, category: e.target.value as any })}
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-2.5 py-2 text-[#ede3d1] focus:outline-none"
                  >
                    <option value="day_tour" className="bg-[#120e0a]">جولة يومية (Day Tour)</option>
                    <option value="overday" className="bg-[#120e0a]">رحلة أوفر داي (Overday)</option>
                    <option value="multiday" className="bg-[#120e0a]">سفاري ومبيت (Multi-Day)</option>
                    <option value="nile_cruise" className="bg-[#120e0a]">سهرة نيلية (Nile Cruise)</option>
                    <option value="airport" className="bg-[#120e0a]">توصيل مطار (Airport Transfer)</option>
                    <option value="intercity" className="bg-[#120e0a]">بين المحافظات (Intercity Transfer)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#ede3d1] font-bold mb-1">المدة المقررة:</label>
                  <input
                    type="text"
                    value={newRouteForm.durationAr}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, durationAr: e.target.value })}
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2 text-[#ede3d1] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#ede3d1] font-bold mb-1">ملاكي سيدان (ج.م):</label>
                  <input
                    type="number"
                    value={newRouteForm.sedan}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, sedan: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-2.5 py-1.5 font-mono text-[#fae48c]"
                  />
                </div>
                <div>
                  <label className="block text-[#ede3d1] font-bold mb-1">7 راكب عائلي (ج.م):</label>
                  <input
                    type="number"
                    value={newRouteForm.seater7}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, seater7: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-2.5 py-1.5 font-mono text-[#fae48c]"
                  />
                </div>
                <div>
                  <label className="block text-[#ede3d1] font-bold mb-1">إتش وان H1 (ج.م):</label>
                  <input
                    type="number"
                    value={newRouteForm.h1}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, h1: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-2.5 py-1.5 font-mono text-[#fae48c]"
                  />
                </div>
                <div>
                  <label className="block text-[#ede3d1] font-bold mb-1">هاي إس HiAce (ج.م):</label>
                  <input
                    type="number"
                    value={newRouteForm.hiace}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, hiace: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-2.5 py-1.5 font-mono text-[#fae48c]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl gold-gradient-bg py-2.5 font-bold text-black hover:opacity-95 shadow-lg cursor-pointer"
                >
                  إضافة المسار
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddRouteOpen(false)}
                  className="rounded-xl border border-[#d4af37]/40 px-4 py-2.5 font-semibold text-[#ede3d1] cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ROUTE / TOUR PROGRAM DETAILS */}
      {editingRouteForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-[#d4af37] bg-[#120e0a] p-6 shadow-2xl text-start">
            <button
              onClick={() => setEditingRouteForDetails(null)}
              className="absolute top-4 left-4 text-[#a69883] hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-[#d4af37]" />
              <span>تعديل تفاصيل البرنامج السياحي</span>
            </h3>
            <p className="text-xs text-[#a69883] mb-4">
              تعديل الوصف، المميزات، المدة، وحالة العرض في كتالوج الجولات بالصفحة الرئيسية.
            </p>

            <form onSubmit={handleSaveEditedRouteDetails} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#fae48c] font-bold mb-1">اسم البرنامج (عربي): *</label>
                  <input
                    type="text"
                    required
                    value={editingRouteForDetails.title.ar}
                    onChange={(e) =>
                      setEditingRouteForDetails({
                        ...editingRouteForDetails,
                        title: { ...editingRouteForDetails.title, ar: e.target.value }
                      })
                    }
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2 text-[#ede3d1] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#ede3d1] font-bold mb-1">اسم البرنامج (English):</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={editingRouteForDetails.title.en}
                    onChange={(e) =>
                      setEditingRouteForDetails({
                        ...editingRouteForDetails,
                        title: { ...editingRouteForDetails.title, en: e.target.value }
                      })
                    }
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2 text-[#ede3d1] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#ede3d1] font-bold mb-1">تصنيف البرنامج:</label>
                  <select
                    value={editingRouteForDetails.category}
                    onChange={(e) =>
                      setEditingRouteForDetails({
                        ...editingRouteForDetails,
                        category: e.target.value as any
                      })
                    }
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2 text-[#ede3d1] focus:outline-none"
                  >
                    <option value="day_tour" className="bg-[#120e0a]">جولة يومية (Day Tour)</option>
                    <option value="overday" className="bg-[#120e0a]">رحلة أوفر داي (Overday)</option>
                    <option value="multiday" className="bg-[#120e0a]">سفاري ومبيت (Multi-Day)</option>
                    <option value="nile_cruise" className="bg-[#120e0a]">سهرة نيلية (Nile Cruise)</option>
                    <option value="airport" className="bg-[#120e0a]">توصيل مطار (Airport Transfer)</option>
                    <option value="intercity" className="bg-[#120e0a]">بين المحافظات (Intercity Transfer)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#ede3d1] font-bold mb-1">المدة المقررة:</label>
                  <input
                    type="text"
                    value={editingRouteForDetails.estimatedDuration.ar}
                    onChange={(e) =>
                      setEditingRouteForDetails({
                        ...editingRouteForDetails,
                        estimatedDuration: {
                          ar: e.target.value,
                          en: editingRouteForDetails.estimatedDuration.en || e.target.value
                        }
                      })
                    }
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2 text-[#ede3d1] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#ede3d1] font-bold mb-1">العنوان الفرعي / الشعار (عربي):</label>
                <input
                  type="text"
                  value={editingRouteForDetails.subtitle?.ar || ''}
                  onChange={(e) =>
                    setEditingRouteForDetails({
                      ...editingRouteForDetails,
                      subtitle: {
                        ar: e.target.value,
                        en: editingRouteForDetails.subtitle?.en || e.target.value
                      }
                    })
                  }
                  placeholder="مثال: رحلة أسطورية إلى قلب التاريخ المصري القديم"
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-[#ede3d1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#ede3d1] font-bold mb-1">وصف البرنامج (Overview):</label>
                <textarea
                  rows={2}
                  value={editingRouteForDetails.overview?.ar || ''}
                  onChange={(e) =>
                    setEditingRouteForDetails({
                      ...editingRouteForDetails,
                      overview: {
                        ar: e.target.value,
                        en: editingRouteForDetails.overview?.en || e.target.value
                      }
                    })
                  }
                  placeholder="نبذة تفصيلية عن مسار الرحلة والمزارات..."
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-[#ede3d1] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[#ede3d1] font-bold mb-1">أبرز المحطات والمميزات (مفصولة بفاصلة):</label>
                <input
                  type="text"
                  value={editingRouteForDetails.highlights?.ar?.join('، ') || ''}
                  onChange={(e) => {
                    const items = e.target.value.split(/[،,]/).map(s => s.trim()).filter(Boolean);
                    setEditingRouteForDetails({
                      ...editingRouteForDetails,
                      highlights: {
                        ar: items,
                        en: editingRouteForDetails.highlights?.en || items
                      }
                    });
                  }}
                  placeholder="مثال: أهرامات الجيزة، أبو الهول، مجمع سقارة، تمثال رمسيس"
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-[#ede3d1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#ede3d1] font-bold mb-1">مسار صورة البرنامج (Image URL):</label>
                <input
                  type="text"
                  dir="ltr"
                  value={editingRouteForDetails.imageUrl || '/hero-pyramids.jpg'}
                  onChange={(e) =>
                    setEditingRouteForDetails({
                      ...editingRouteForDetails,
                      imageUrl: e.target.value
                    })
                  }
                  placeholder="/hero-pyramids.jpg"
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-[#ede3d1] focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingRouteForDetails.showInCatalog !== false}
                    onChange={(e) =>
                      setEditingRouteForDetails({
                        ...editingRouteForDetails,
                        showInCatalog: e.target.checked
                      })
                    }
                    className="h-4 w-4 rounded border-[#d4af37] text-[#d4af37]"
                  />
                  <span className="font-bold text-[#fae48c]">
                    عرض هذا البرنامج في كتالوج الجولات المميزة بالصفحة الرئيسية
                  </span>
                </label>
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl gold-gradient-bg py-2.5 font-bold text-black hover:opacity-95 shadow-lg cursor-pointer"
                >
                  حفظ تفاصيل البرنامج
                </button>
                <button
                  type="button"
                  onClick={() => setEditingRouteForDetails(null)}
                  className="rounded-xl border border-[#d4af37]/40 px-4 py-2.5 font-semibold text-[#ede3d1] cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MANUAL BOOKING */}
      {isAddBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl border-2 border-[#d4af37] bg-[#120e0a] p-6 shadow-2xl text-start">
            <button
              onClick={() => setIsAddBookingOpen(false)}
              className="absolute top-4 left-4 text-[#a69883] hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-white mb-4">تسجيل حجز جديد يدوياً</h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const route = routesData.find(r => r.id === Number(newBookingForm.routeId)) || routesData[0];
                const vehicle = fleetCategories.find(v => v.slug === newBookingForm.vehicleSlug) || fleetCategories[0];
                const rawPrice = route.prices[vehicle.slug as keyof typeof route.prices] || 800;

                const newBooking: AdminBooking = {
                  id: String(Date.now()),
                  reference: `ANB-${new Date().getMonth() + 1}${new Date().getDate()}-${Math.floor(1000 + Math.random() * 9000)}`,
                  type: 'transfer',
                  title: route.title.ar,
                  customerName: newBookingForm.customerName,
                  customerPhone: newBookingForm.customerPhone,
                  pickupDate: newBookingForm.pickupDate,
                  pickupTime: newBookingForm.pickupTime,
                  pickupLocation: newBookingForm.pickupLocation || 'فندق العميل',
                  vehicleName: vehicle.name.ar,
                  amountEgp: rawPrice,
                  status: 'pending',
                  flightNumber: newBookingForm.flightNumber || undefined,
                  createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
                };

                setBookings([newBooking, ...bookings]);
                setIsAddBookingOpen(false);
                alert('تمت إضافة الحجز بنجاح!');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-[#fae48c] font-bold mb-1">اسم العميل: *</label>
                <input
                  type="text"
                  required
                  value={newBookingForm.customerName}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, customerName: e.target.value })}
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-[#ede3d1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#fae48c] font-bold mb-1">رقم الهاتف / الواتساب: *</label>
                <input
                  type="tel"
                  required
                  value={newBookingForm.customerPhone}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, customerPhone: e.target.value })}
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-[#ede3d1] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[#ede3d1] font-bold mb-1">المسار:</label>
                <select
                  value={newBookingForm.routeId}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, routeId: Number(e.target.value) })}
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2 text-[#ede3d1] focus:outline-none"
                >
                  {routesData.map(r => (
                    <option key={r.id} value={r.id} className="bg-[#120e0a]">
                      {r.id}. {r.title.ar}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#ede3d1] font-bold mb-1">المركبة:</label>
                <select
                  value={newBookingForm.vehicleSlug}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, vehicleSlug: e.target.value })}
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2 text-[#ede3d1] focus:outline-none"
                >
                  {fleetCategories.map(v => (
                    <option key={v.slug} value={v.slug} className="bg-[#120e0a]">
                      {v.name.ar}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#ede3d1] font-bold mb-1">التاريخ:</label>
                  <input
                    type="date"
                    value={newBookingForm.pickupDate}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, pickupDate: e.target.value })}
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2 text-[#ede3d1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#ede3d1] font-bold mb-1">الوقت:</label>
                  <input
                    type="time"
                    value={newBookingForm.pickupTime}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, pickupTime: e.target.value })}
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2 text-[#ede3d1] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl gold-gradient-bg py-2.5 font-bold text-black hover:opacity-95 shadow-lg"
                >
                  حفظ الحجز
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddBookingOpen(false)}
                  className="rounded-xl border border-[#d4af37]/40 px-4 py-2.5 font-semibold text-[#ede3d1]"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
