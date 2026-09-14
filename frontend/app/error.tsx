'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error Boundary caught:', error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg-void)] px-4 py-16 text-center relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[var(--gold-glow)] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 bg-[var(--bg-card)] border border-red-500/30 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/10">
          <AlertTriangle className="w-10 h-10 animate-pulse" />
        </div>

        <span className="text-xs font-semibold tracking-widest uppercase text-red-400">
          Unexpected Error • حدث خطأ غير متوقع
        </span>
        <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-3 text-white">
          عذراً، حدث خطأ أثناء المعالجة
        </h1>
        <p className="text-[var(--text-muted)] text-xs md:text-sm mb-6 leading-relaxed">
          {error.message || 'حدث خطأ مؤقت في الاتصال أو تحميل البيانات. يرجى المحاولة مرة أخرى.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl gold-gradient-bg font-semibold text-xs tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-[var(--gold-glow)] hover:scale-[1.02] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة المحاولة • Try Again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-[var(--border-gold)] text-[var(--text-parchment)] hover:text-[var(--gold-light)] hover:bg-white/10 text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
