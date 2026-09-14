import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://anubistravel.com'),
  title: 'أنوبيس ترافيل | ANUBIS TRAVEL TOURS - ليموزين ونقل سياحي وجولات فاخرة بمصر',
  description: 'منصة أنوبيس ترافيل الرسمية لحجز النقل السياحي، استقبال وتوديع المطارات، وجولات الأهرامات والإسكندرية والسفاري بأحدث أسطول سيارات وأسعار معتمدة ومثبتة. إشراف الإدارة / جهاد حسين (Gihad Hussien).',
  icons: {
    icon: '/anubis-clean-logo.png',
    apple: '/anubis-clean-logo.png'
  },
  openGraph: {
    title: 'أنوبيس ترافيل | ANUBIS TRAVEL TOURS - VIP Transfers & Tours',
    description: 'أرقى تجربة نقل سياحي واستقبال مطارات وجولات يومية في مصر بأسعار ثابتة وأسطول فاره.',
    images: ['/anubis-clean-logo.png']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" data-theme="dark" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-[var(--bg-void)] text-[var(--text-parchment)]">
        {children}
      </body>
    </html>
  );
}
