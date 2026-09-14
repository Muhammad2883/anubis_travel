import Image from 'next/image';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-void)] relative overflow-hidden px-4">
      {/* Background ambient gold lighting */}
      <div className="absolute w-80 h-80 bg-[var(--gold-glow)] rounded-full blur-3xl animate-pulse pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Pure Clean Transparent Logo */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#d4af37]/25 to-[#fae48c]/15 blur-xl animate-pulse" />
          <Image
            src="/anubis-clean-logo.png"
            alt="ANUBIS TRAVEL"
            width={144}
            height={144}
            className="w-full h-full object-contain filter drop-shadow-[0_10px_28px_rgba(212,175,55,0.55)] animate-pulse"
            priority
          />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-black gold-gradient-text tracking-widest uppercase font-serif">
            ANUBIS TRAVEL
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold-primary)] animate-ping" />
            <span className="text-xs text-[var(--text-muted)] font-medium tracking-wide">
              جاري تحميل البوابة الفاخرة...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
