'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { VEHICLES, ROUTES, TOURS, GENERAL_TERMS } from '@/lib/data';
import { Route, Vehicle, Tour, BookingPayload, Currency } from '@/lib/types';
import { formatPrice, convertPrice, EXCHANGE_RATES } from '@/lib/pricing-engine';
import {
  LayoutDashboard,
  CalendarCheck,
  MapPin,
  Car,
  Compass,
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
  Sparkles,
  Users,
  Briefcase
} from 'lucide-react';

interface AdminBooking {
  id: string;
  reference: string;
  type: 'transfer' | 'tour';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'pricing' | 'routes' | 'fleet' | 'tours'>('overview');
  const [currency, setCurrency] = useState<Currency>('EGP');

  // Bookings State (Initial Mock/Persisted Data)
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
      amountEgp: 3700, // 3500 + 200 far hotel
      status: 'pending',
      createdAt: '2026-09-11 11:30'
    },
    {
      id: '3',
      reference: 'ANB-0911-3912',
      type: 'tour',
      title: 'أهرامات الجيزة وسقارة وممفيس',
      customerName: 'Mr. Johnathan Smith',
      customerPhone: '+44 7911 123456',
      pickupDate: '2026-09-14',
      pickupTime: '08:30',
      pickupLocation: 'Four Seasons Hotel Cairo',
      vehicleName: 'هيونداي إتش وان (H1)',
      amountEgp: 2300,
      status: 'confirmed',
      createdAt: '2026-09-11 12:45'
    },
    {
      id: '4',
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

  // Pricing Matrix State
  const [routesData, setRoutesData] = useState<Route[]>(ROUTES);
  const [usdRate, setUsdRate] = useState<number>(48.5);
  const [eurRate, setEurRate] = useState<number>(53.0);
  const [farHotelSedanSurcharge, setFarHotelSedanSurcharge] = useState<number>(200);
  const [farHotelVanSurcharge, setFarHotelVanSurcharge] = useState<number>(500);

  // Filters & Search for Bookings
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [bookingViewMode, setBookingViewMode] = useState<'table' | 'kanban'>('table');

  // New Booking Modal
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

  // KPI Calculations
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const totalRevenueEgp = bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((acc, b) => acc + b.amountEgp, 0);

    return {
      total,
      pending,
      confirmed,
      completed,
      totalRevenueEgp,
      totalRevenueUsd: Math.round(totalRevenueEgp / usdRate),
      totalRevenueEur: Math.round(totalRevenueEgp / eurRate)
    };
  }, [bookings, usdRate, eurRate]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch =
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerPhone.includes(searchQuery) ||
        b.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  // Update Booking Status
  const handleUpdateStatus = (id: string, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  // Add Booking
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookingForm.customerName || !newBookingForm.customerPhone) {
      alert('يرجى ملء جميع البيانات الأساسية');
      return;
    }

    const route = ROUTES.find(r => r.id === Number(newBookingForm.routeId)) || ROUTES[0];
    const vehicle = VEHICLES.find(v => v.slug === newBookingForm.vehicleSlug) || VEHICLES[0];
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
    setNewBookingForm({
      customerName: '',
      customerPhone: '',
      routeId: ROUTES[0].id,
      vehicleSlug: 'sedan',
      pickupDate: new Date().toISOString().split('T')[0],
      pickupTime: '10:00',
      pickupLocation: '',
      flightNumber: ''
    });
    alert('تمت إضافة الحجز بنجاح إلى جدول العمليات!');
  };

  // Price Change in Matrix
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

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['رقم الحجز', 'العميل', 'رقم الهاتف', 'الخدمة / المسار', 'المركبة', 'التاريخ', 'الوقت', 'السعر (ج.م)', 'الحالة'];
    const rows = bookings.map(b => [
      b.reference,
      `"${b.customerName}"`,
      `"${b.customerPhone}"`,
      `"${b.title}"`,
      `"${b.vehicleName}"`,
      b.pickupDate,
      b.pickupTime,
      b.amountEgp,
      b.status
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ANUBIS_Bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                    ANUBIS OPS v1.0
                  </span>
                </div>
                <p className="text-[11px] text-[#a69883]">
                  إشراف الإدارة: جهاد حسين (Gihad Hussien)
                </p>
              </div>
            </Link>
          </div>

          {/* Quick Nav to Public Site */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-xl border border-[#d4af37]/40 bg-[#16110b] px-3.5 py-1.5 text-xs font-semibold text-[#ede3d1] hover:bg-[#20180f] hover:text-[#fae48c] transition-all"
            >
              <span>عرض الموقع للجمهور</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#d4af37]" />
            </Link>
          </div>
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
            <span>إدارة الحجوزات والـ CRM</span>
            {stats.pending > 0 && (
              <span className="rounded-full bg-[#ff4757] px-2 py-0.2 text-[10px] font-black text-white">
                {stats.pending}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'pricing'
                ? 'gold-gradient-bg shadow-md shadow-[#d4af37]/20 text-black'
                : 'border border-[#d4af37]/25 bg-[#120e0a] text-[#ede3d1] hover:border-[#d4af37] hover:text-[#fae48c]'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            <span>مصفوفة الأسعار والعملات</span>
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
            <span>المسارات الـ 19</span>
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
            <span>أسطول المركبات (4)</span>
          </button>

          <button
            onClick={() => setActiveTab('tours')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'tours'
                ? 'gold-gradient-bg shadow-md shadow-[#d4af37]/20 text-black'
                : 'border border-[#d4af37]/25 bg-[#120e0a] text-[#ede3d1] hover:border-[#d4af37] hover:text-[#fae48c]'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>كتالوج الجولات (6)</span>
          </button>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Metric 1 */}
              <div className="rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-5 shadow-xl">
                <div className="flex items-center justify-between text-[#a69883] text-xs">
                  <span>إجمالي الحجوزات</span>
                  <CalendarCheck className="h-4 w-4 text-[#d4af37]" />
                </div>
                <div className="mt-3 text-3xl font-black text-white">{stats.total}</div>
                <p className="mt-1 text-[11px] text-[#38ef7d]">سجلات تشغيل نشطة</p>
              </div>

              {/* Metric 2 */}
              <div className="rounded-2xl border border-[#f5d34c]/40 bg-[#1a140b] p-5 shadow-xl">
                <div className="flex items-center justify-between text-[#a69883] text-xs">
                  <span>قيد الانتظار / جديد</span>
                  <Clock className="h-4 w-4 text-[#f5d34c]" />
                </div>
                <div className="mt-3 text-3xl font-black text-[#f5d34c]">{stats.pending}</div>
                <p className="mt-1 text-[11px] text-[#f5d34c]">تحتاج تأكيد وتعيين سائق</p>
              </div>

              {/* Metric 3 */}
              <div className="rounded-2xl border border-[#38ef7d]/30 bg-[#0d160f] p-5 shadow-xl">
                <div className="flex items-center justify-between text-[#a69883] text-xs">
                  <span>حجوزات مؤكدة</span>
                  <CheckCircle2 className="h-4 w-4 text-[#38ef7d]" />
                </div>
                <div className="mt-3 text-3xl font-black text-[#38ef7d]">{stats.confirmed}</div>
                <p className="mt-1 text-[11px] text-[#38ef7d]">جاهزة للتنفيذ والاستقبال</p>
              </div>

              {/* Metric 4 */}
              <div className="rounded-2xl border-2 border-[#d4af37] bg-gradient-to-br from-[#1c160e] to-[#120e0a] p-5 shadow-2xl">
                <div className="flex items-center justify-between text-[#a69883] text-xs">
                  <span>الإيرادات التقديرية</span>
                  <TrendingUp className="h-4 w-4 text-[#d4af37]" />
                </div>
                <div className="mt-3 text-2xl sm:text-3xl font-black text-[#fae48c]">
                  {stats.totalRevenueEgp.toLocaleString()} ج.م
                </div>
                <p className="mt-1 text-[11px] text-[#a69883]">
                  ≈ ${stats.totalRevenueUsd.toLocaleString()} USD | €{stats.totalRevenueEur.toLocaleString()} EUR
                </p>
              </div>
            </div>

            {/* Quick Operations & Recent Inquiries */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Urgent Action Feed */}
              <div className="lg:col-span-8 rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/15">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-[#d4af37]" />
                    <span>أحدث الحجوزات والطلبات الواردة</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-semibold text-[#fae48c] hover:underline cursor-pointer"
                  >
                    عرض الكل ({bookings.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {bookings.slice(0, 3).map((b) => (
                    <div
                      key={b.id}
                      className="rounded-xl border border-[#d4af37]/20 bg-[#17120c] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#fae48c]">{b.reference}</span>
                          <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            b.status === 'confirmed' ? 'bg-[#38ef7d]/20 text-[#38ef7d]' :
                            b.status === 'pending' ? 'bg-[#f5d34c]/20 text-[#f5d34c]' :
                            b.status === 'completed' ? 'bg-[#209cee]/20 text-[#209cee]' : 'bg-[#ff4757]/20 text-[#ff4757]'
                          }`}>
                            {b.status === 'confirmed' ? 'مؤكد' : b.status === 'pending' ? 'جديد / معلق' : b.status === 'completed' ? 'مكتمل' : 'ملغي'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{b.customerName} - {b.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-[#a69883] mt-1">
                          <span>📅 {b.pickupDate} ({b.pickupTime})</span>
                          <span>•</span>
                          <span>🚗 {b.vehicleName}</span>
                          <span>•</span>
                          <span className="text-[#fae48c] font-bold">{b.amountEgp} ج.م</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`https://api.whatsapp.com/send?phone=${b.customerPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white hover:opacity-90"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>واتساب</span>
                        </a>

                        {b.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                            className="rounded-lg bg-[#38ef7d]/20 border border-[#38ef7d]/40 px-3 py-1.5 text-xs font-bold text-[#38ef7d] hover:bg-[#38ef7d]/30 cursor-pointer"
                          >
                            تأكيد الآن
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Config & System Rules */}
              <div className="lg:col-span-4 rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-6 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-[#fae48c] flex items-center gap-2 pb-3 border-b border-[#d4af37]/15">
                  <Settings className="h-4 w-4 text-[#d4af37]" />
                  <span>ثوابت التسعير والتشغيل</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b border-[#d4af37]/10 pb-2">
                    <span className="text-[#a69883]">سعر تحويل الدولار (USD):</span>
                    <strong className="text-white font-mono">{usdRate} ج.م</strong>
                  </div>

                  <div className="flex justify-between border-b border-[#d4af37]/10 pb-2">
                    <span className="text-[#a69883]">سعر تحويل اليورو (EUR):</span>
                    <strong className="text-white font-mono">{eurRate} ج.م</strong>
                  </div>

                  <div className="flex justify-between border-b border-[#d4af37]/10 pb-2">
                    <span className="text-[#a69883]">رسوم الفنادق البعيدة (سيدان / 7 راكب):</span>
                    <strong className="text-[#fae48c]">+{farHotelSedanSurcharge} ج.م</strong>
                  </div>

                  <div className="flex justify-between border-b border-[#d4af37]/10 pb-2">
                    <span className="text-[#a69883]">رسوم الفنادق البعيدة (H1 / هاي إس):</span>
                    <strong className="text-[#fae48c]">+{farHotelVanSurcharge} ج.م</strong>
                  </div>

                  <div className="flex justify-between border-b border-[#d4af37]/10 pb-2">
                    <span className="text-[#a69883]">ساعات اليومية المعتمدة:</span>
                    <strong className="text-white">9 ساعات (8 ص - 5 م)</strong>
                  </div>

                  <div className="rounded-xl border border-[#f5d34c]/30 bg-[#241c09] p-3 text-[11px] text-[#f5d34c] leading-relaxed">
                    ⚠️ شرط معتمد: حجز مركبات H1 وهاي إس يتطلب إشعاراً مسبقاً قبل الموعد بيومين.
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('pricing')}
                  className="w-full rounded-xl gold-gradient-bg py-2.5 text-xs font-bold text-black hover:opacity-95 transition-all cursor-pointer"
                >
                  تعديل مصفوفة الأسعار والعملات
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. BOOKINGS & CRM TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Action & Filter Bar */}
            <div className="rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
                {/* Search */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a69883]" />
                  <input
                    type="text"
                    placeholder="بحث باسم العميل، الهاتف، أو الرقم المرجعي..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] pr-9 pl-4 py-2 text-xs text-[#ede3d1] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="h-4 w-4 text-[#d4af37]" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2 text-xs text-[#fae48c] focus:outline-none cursor-pointer"
                  >
                    <option value="all">جميع الحالات ({bookings.length})</option>
                    <option value="pending">جديد / معلق ({stats.pending})</option>
                    <option value="confirmed">مؤكد ({stats.confirmed})</option>
                    <option value="completed">مكتمل ({stats.completed})</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportCsv}
                  className="flex items-center gap-1.5 rounded-xl border border-[#d4af37]/40 bg-[#1a140e] px-3.5 py-2 text-xs font-semibold text-[#ede3d1] hover:bg-[#281e13] hover:text-[#fae48c] transition-all cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-[#d4af37]" />
                  <span>تصدير Excel / CSV</span>
                </button>

                <button
                  onClick={() => setIsAddBookingOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl gold-gradient-bg px-4 py-2 text-xs font-bold text-black hover:opacity-95 transition-all cursor-pointer shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  <span>إضافة حجز جديد</span>
                </button>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead className="border-b border-[#d4af37]/20 bg-[#17120c] text-[#fae48c] uppercase font-bold tracking-wider">
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
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-sm text-[#a69883]">
                          لا توجد حجوزات مطابقة لمعايير البحث.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-[#18130d] transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-[#fae48c] whitespace-nowrap">
                            {b.reference}
                          </td>
                          <td className="px-4 py-3">
                            <strong className="block text-white font-bold">{b.customerName}</strong>
                            <a
                              href={`tel:${b.customerPhone}`}
                              className="text-[11px] text-[#a69883] hover:text-[#d4af37] block font-mono mt-0.5"
                            >
                              📞 {b.customerPhone}
                            </a>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-white block">{b.title}</span>
                            {b.flightNumber && (
                              <span className="text-[10px] text-[#d4af37] font-mono">✈️ رحلة: {b.flightNumber}</span>
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
                            {b.amountEgp.toLocaleString()} ج.م
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <select
                              value={b.status}
                              onChange={(e) => handleUpdateStatus(b.id, e.target.value as any)}
                              className={`rounded-lg px-2 py-1 text-xs font-bold border cursor-pointer ${
                                b.status === 'confirmed' ? 'border-[#38ef7d]/40 bg-[#38ef7d]/15 text-[#38ef7d]' :
                                b.status === 'pending' ? 'border-[#f5d34c]/40 bg-[#f5d34c]/15 text-[#f5d34c]' :
                                b.status === 'completed' ? 'border-[#209cee]/40 bg-[#209cee]/15 text-[#209cee]' : 'border-[#ff4757]/40 bg-[#ff4757]/15 text-[#ff4757]'
                              }`}
                            >
                              <option value="pending" className="bg-[#120e0a] text-[#f5d34c]">جديد / معلق</option>
                              <option value="confirmed" className="bg-[#120e0a] text-[#38ef7d]">مؤكد</option>
                              <option value="completed" className="bg-[#120e0a] text-[#209cee]">مكتمل</option>
                              <option value="cancelled" className="bg-[#120e0a] text-[#ff4757]">ملغي</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <a
                                href={`https://api.whatsapp.com/send?phone=${b.customerPhone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="محادثة واتساب"
                                className="rounded-lg bg-[#25D366] p-1.5 text-white hover:opacity-90"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </a>

                              <button
                                onClick={() => {
                                  if (confirm(`هل أنت متأكد من حذف الحجز ${b.reference}؟`)) {
                                    setBookings(prev => prev.filter(x => x.id !== b.id));
                                  }
                                }}
                                title="حذف الحجز"
                                className="rounded-lg border border-[#ff4757]/40 p-1.5 text-[#ff4757] hover:bg-[#ff4757]/20 cursor-pointer"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. PRICING MATRIX TAB */}
        {activeTab === 'pricing' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Currency & Rules Controls */}
            <div className="rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-5 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/15 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[#d4af37]" />
                    <span>مصفوفة أسعار المسارات الرسمية (المعتمدة من الإكسيل)</span>
                  </h3>
                  <p className="text-xs text-[#a69883] mt-1">
                    يمكنك تعديل أي سعر مباشرة في الجدول وحفظ التغييرات اللحظية.
                  </p>
                </div>

                <div className="flex items-center gap-3">
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
                    onClick={() => alert('تم تحديث أسعار الصرف ومصفوفة الأسعار بنجاح في المنظومة!')}
                    className="flex items-center gap-1.5 rounded-xl gold-gradient-bg px-4 py-2 text-xs font-bold text-black hover:opacity-95 cursor-pointer shadow-md"
                  >
                    <Save className="h-4 w-4" />
                    <span>حفظ التعديلات</span>
                  </button>
                </div>
              </div>

              {/* Surcharges strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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

            {/* Matrix Table */}
            <div className="rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead className="border-b border-[#d4af37]/20 bg-[#17120c] text-[#fae48c] font-bold">
                    <tr>
                      <th className="px-4 py-3.5 text-start w-12">#</th>
                      <th className="px-4 py-3.5 text-start">البيان / خط السير</th>
                      <th className="px-4 py-3.5 text-start">المدة التقديرية</th>
                      <th className="px-4 py-3.5 text-center">ملاكي سيدان (ج.م)</th>
                      <th className="px-4 py-3.5 text-center">7 راكب عائلي (ج.م)</th>
                      <th className="px-4 py-3.5 text-center">إتش وان H1 (ج.م)</th>
                      <th className="px-4 py-3.5 text-center">هاي إس HiAce (ج.م)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d4af37]/10 text-[#ede3d1]">
                    {routesData.map((route) => (
                      <tr key={route.id} className="hover:bg-[#18130d] transition-colors">
                        <td className="px-4 py-3 font-mono text-[#a69883] font-bold">
                          {route.id}
                        </td>
                        <td className="px-4 py-3 font-semibold text-white">
                          {route.title.ar}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#a69883]">
                          {route.estimatedDuration.ar}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <input
                            type="number"
                            value={route.prices.sedan ?? ''}
                            onChange={(e) => handlePriceChange(route.id, 'sedan', e.target.value)}
                            className="w-24 rounded-lg border border-[#d4af37]/30 bg-[#1a140e] px-2 py-1 text-center font-mono font-bold text-[#fae48c] focus:border-[#d4af37] focus:outline-none"
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <input
                            type="number"
                            value={route.prices['7seater'] ?? ''}
                            onChange={(e) => handlePriceChange(route.id, '7seater', e.target.value)}
                            className="w-24 rounded-lg border border-[#d4af37]/30 bg-[#1a140e] px-2 py-1 text-center font-mono font-bold text-[#fae48c] focus:border-[#d4af37] focus:outline-none"
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <input
                            type="number"
                            placeholder="غير متاح"
                            value={route.prices.h1 ?? ''}
                            onChange={(e) => handlePriceChange(route.id, 'h1', e.target.value)}
                            className="w-24 rounded-lg border border-[#d4af37]/30 bg-[#1a140e] px-2 py-1 text-center font-mono font-bold text-[#fae48c] focus:border-[#d4af37] focus:outline-none placeholder-[#555]"
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <input
                            type="number"
                            placeholder="غير متاح"
                            value={route.prices.hiace ?? ''}
                            onChange={(e) => handlePriceChange(route.id, 'hiace', e.target.value)}
                            className="w-24 rounded-lg border border-[#d4af37]/30 bg-[#1a140e] px-2 py-1 text-center font-mono font-bold text-[#fae48c] focus:border-[#d4af37] focus:outline-none placeholder-[#555]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. ROUTES TAB */}
        {activeTab === 'routes' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-5 shadow-xl flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#d4af37]" />
                  <span>دليل مسارات أنوبيس ترافيل (إجمالي 19 مساراً معتمداً)</span>
                </h3>
                <p className="text-xs text-[#a69883] mt-1">
                  المسارات مقسمة حسب الفئات: مطارات، جولات يومية، أوفر داي، وسفر محافظات.
                </p>
              </div>

              <button
                onClick={() => alert('تم تفعيل واجهة إنشاء مسار جديد في جدول التشغيل.')}
                className="flex items-center gap-1.5 rounded-xl gold-gradient-bg px-4 py-2 text-xs font-bold text-black hover:opacity-95 cursor-pointer shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>إضافة مسار جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {ROUTES.map((route) => (
                <div
                  key={route.id}
                  className="rounded-xl border border-[#d4af37]/25 bg-[#120e0a] p-4 flex flex-col justify-between hover:border-[#d4af37] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[#d4af37] font-bold">مسار #{route.id}</span>
                      <span className="rounded-full bg-[#d4af37]/15 px-2 py-0.5 text-[10px] font-semibold text-[#fae48c]">
                        {route.category === 'airport' ? 'استقبال وتوديع مطار' :
                         route.category === 'day_tour' ? 'جولة يومية' :
                         route.category === 'overday' ? 'أوفر داي خارجي' :
                         route.category === 'intercity' ? 'سفر محافظات' : 'برنامج ممتد'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-2">{route.title.ar}</h4>
                    <p className="text-xs text-[#a69883] mt-0.5 font-sans" dir="ltr">{route.title.en}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#d4af37]/15 flex items-center justify-between text-xs">
                    <span className="text-[#a69883]">المدة: <strong className="text-[#ede3d1]">{route.estimatedDuration.ar}</strong></span>
                    <span className="text-[#38ef7d] font-semibold">✓ نشط ومعتمد</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. FLEET TAB */}
        {activeTab === 'fleet' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-5 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Car className="h-4 w-4 text-[#d4af37]" />
                <span>إدارة أسطول المركبات والاشتراطات اللوجستية</span>
              </h3>
              <p className="text-xs text-[#a69883] mt-1">
                التحكم في سعة الركاب والحقائب والمميزات وشرط الحجز المسبق لكل فئة مركبة.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {VEHICLES.map((vehicle) => (
                <div
                  key={vehicle.slug}
                  className="rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-6 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="text-4xl mb-3">{vehicle.image_url}</div>
                    <h4 className="text-base font-bold text-white">{vehicle.name.ar}</h4>
                    <p className="text-xs text-[#a69883] mt-0.5" dir="ltr">{vehicle.name.en}</p>

                    <div className="mt-4 space-y-2 border-t border-[#d4af37]/15 pt-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#a69883]">سعة الركاب:</span>
                        <strong className="text-white font-bold">{vehicle.passenger_capacity} ركاب</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#a69883]">سعة الحقائب:</span>
                        <strong className="text-white font-bold">{vehicle.luggage_capacity} حقائب</strong>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="text-[11px] text-[#a69883] block mb-1">المميزات والراحة:</span>
                      <ul className="space-y-1 text-xs text-[#ede3d1]">
                        {vehicle.features.ar.map((f, i) => (
                          <li key={i}>• {f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {vehicle.requiresAdvanceNoticeDays ? (
                    <div className="mt-5 rounded-lg border border-[#f5d34c]/30 bg-[#241c09] p-2 text-[11px] text-[#f5d34c]">
                      ⚠️ يتطلب حجز مسبق بيومين
                    </div>
                  ) : (
                    <div className="mt-5 rounded-lg border border-[#38ef7d]/30 bg-[#0d160f] p-2 text-[11px] text-[#38ef7d]">
                      ✓ جاهز للحجز الفوري
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TOURS TAB */}
        {activeTab === 'tours' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="rounded-2xl border border-[#d4af37]/30 bg-[#120e0a] p-5 shadow-xl flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Compass className="h-4 w-4 text-[#d4af37]" />
                  <span>كتالوج الجولات والبرامج السياحية (CMS)</span>
                </h3>
                <p className="text-xs text-[#a69883] mt-1">
                  البرامج السياحية الفاخرة، مواعيد الجولات، خط السير، والمشمول في الباقات.
                </p>
              </div>

              <button
                onClick={() => alert('تم تفعيل نموذج إضافة برنامج سياحي جديد.')}
                className="flex items-center gap-1.5 rounded-xl gold-gradient-bg px-4 py-2 text-xs font-bold text-black hover:opacity-95 cursor-pointer shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>إضافة برنامج سياحي</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TOURS.map((tour) => (
                <div
                  key={tour.id}
                  className="rounded-2xl border border-[#d4af37]/25 bg-[#120e0a] p-5 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <span className="rounded bg-[#d4af37]/20 px-2 py-0.5 text-[10px] font-bold text-[#fae48c]">
                      {tour.category === 'cultural' ? 'تاريخي وثقافي' :
                       tour.category === 'day_trip' ? 'يوم واحد' :
                       tour.category === 'adventure' ? 'مغامرات وسفاري' : 'نايل كروز'}
                    </span>

                    <h4 className="text-base font-bold text-white mt-2">{tour.title.ar}</h4>
                    <p className="text-xs text-[#a69883] mt-1 line-clamp-2">{tour.subtitle.ar}</p>

                    <div className="mt-4 pt-3 border-t border-[#d4af37]/15 flex items-center justify-between text-xs">
                      <span className="text-[#a69883]">المدة: <strong className="text-white">{tour.duration.ar}</strong></span>
                      <span className="text-[#fae48c] font-black text-sm">يبدأ من {tour.basePriceEgp} ج.م</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#d4af37]/10 flex items-center justify-between">
                    <span className="text-xs text-[#38ef7d]">★ {tour.rating} ({tour.reviewsCount} تقييم)</span>
                    <button
                      onClick={() => alert(`تعديل باقة: ${tour.title.ar}`)}
                      className="text-xs text-[#fae48c] hover:underline cursor-pointer"
                    >
                      تعديل البرنامج
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Manual Booking Modal */}
      {isAddBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl border-2 border-[#d4af37] bg-[#120e0a] p-6 shadow-2xl text-start">
            <button
              onClick={() => setIsAddBookingOpen(false)}
              className="absolute top-4 left-4 text-[#a69883] hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4 text-[#d4af37]" />
              <span>تسجيل حجز جديد يدوياً في جدول العمليات</span>
            </h3>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#fae48c] font-bold mb-1">اسم العميل:</label>
                <input
                  type="text"
                  required
                  value={newBookingForm.customerName}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, customerName: e.target.value })}
                  placeholder="مثال: د. محمد الشريف"
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-[#ede3d1] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#fae48c] font-bold mb-1">رقم الهاتف / الواتساب:</label>
                <input
                  type="tel"
                  required
                  value={newBookingForm.customerPhone}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, customerPhone: e.target.value })}
                  placeholder="010XXXXXXXX"
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-[#ede3d1] focus:border-[#d4af37] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[#ede3d1] font-bold mb-1">خط السير / الخدمة:</label>
                <select
                  value={newBookingForm.routeId}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, routeId: Number(e.target.value) })}
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-[#ede3d1] focus:outline-none"
                >
                  {ROUTES.map((r) => (
                    <option key={r.id} value={r.id} className="bg-[#120e0a]">
                      {r.id}. {r.title.ar}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#ede3d1] font-bold mb-1">نوع المركبة:</label>
                <select
                  value={newBookingForm.vehicleSlug}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, vehicleSlug: e.target.value })}
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-[#ede3d1] focus:outline-none"
                >
                  {VEHICLES.map((v) => (
                    <option key={v.slug} value={v.slug} className="bg-[#120e0a]">
                      {v.name.ar}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#ede3d1] font-bold mb-1">تاريخ الرحلة:</label>
                  <input
                    type="date"
                    value={newBookingForm.pickupDate}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, pickupDate: e.target.value })}
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2 text-[#ede3d1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#ede3d1] font-bold mb-1">وقت الانطلاق:</label>
                  <input
                    type="time"
                    value={newBookingForm.pickupTime}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, pickupTime: e.target.value })}
                    className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3 py-2 text-[#ede3d1] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#ede3d1] font-bold mb-1">مكان الانطلاق / الفندق:</label>
                <input
                  type="text"
                  value={newBookingForm.pickupLocation}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, pickupLocation: e.target.value })}
                  placeholder="اسم الفندق أو المطار..."
                  className="w-full rounded-xl border border-[#d4af37]/30 bg-[#1a140e] px-3.5 py-2 text-[#ede3d1] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl gold-gradient-bg py-2.5 font-bold text-black hover:opacity-95 cursor-pointer shadow-lg"
                >
                  حفظ الحجز في السجلات
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddBookingOpen(false)}
                  className="rounded-xl border border-[#d4af37]/40 px-4 py-2.5 font-semibold text-[#ede3d1] hover:bg-[#1f1810] cursor-pointer"
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
