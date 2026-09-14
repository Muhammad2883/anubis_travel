import Link from 'next/link';
import { Home, Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg-void)] px-4 py-16 text-center relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[var(--gold-glow)] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[var(--gold-glow)] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 bg-[var(--bg-card)] border border-[var(--border-gold)] rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#fae48c]/20 via-[#d4af37]/10 to-transparent border border-[var(--border-gold)] flex items-center justify-center text-[var(--gold-light)] shadow-lg shadow-[var(--gold-glow)]">
          <Compass className="w-10 h-10 animate-spin-slow text-[var(--gold-light)]" />
        </div>

        <span className="text-sm font-semibold tracking-widest uppercase text-[var(--gold-light)]">
          Error 404 • خطأ ٤٠٤
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-3 gold-gradient-text">
          الصفحة غير موجودة
        </h1>
        <p className="text-[var(--text-muted)] text-sm md:text-base mb-2">
          Page Not Found
        </p>
        <p className="text-[var(--text-muted)] text-xs md:text-sm mb-8 leading-relaxed">
          يبدو أنك سلكت مساراً غير مسجل في خرائط رحلات أنوبيس. يمكنك العودة إلى الصفحة الرئيسية واستكشاف رحلاتنا وخدمات التوصيل الفاخرة.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl gold-gradient-bg font-semibold text-xs tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-[var(--gold-glow)] hover:scale-[1.02] cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>الرئيسية • Home</span>
          </Link>
          <Link
            href="/#tours"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-[var(--border-gold)] text-[var(--text-parchment)] hover:text-[var(--gold-light)] hover:bg-white/10 text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>استكشف الرحلات</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
