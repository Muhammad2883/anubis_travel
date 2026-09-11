import { Currency, Locale, BookingPayload } from './types';

export const EXCHANGE_RATES: Record<Currency, number> = {
  EGP: 1,
  USD: 48.5,
  EUR: 53.0
};

export function convertPrice(amountInEgp: number, targetCurrency: Currency): number {
  if (targetCurrency === 'EGP') return Math.round(amountInEgp);
  const converted = amountInEgp / EXCHANGE_RATES[targetCurrency];
  return Math.ceil(converted);
}

export function formatPrice(amount: number, currency: Currency, locale: Locale): string {
  const formatted = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    maximumFractionDigits: 0
  }).format(amount);

  if (locale === 'ar') {
    switch (currency) {
      case 'EGP': return `${formatted} ج.م`;
      case 'USD': return `$ ${formatted}`;
      case 'EUR': return `€ ${formatted}`;
    }
  } else {
    switch (currency) {
      case 'EGP': return `${formatted} EGP`;
      case 'USD': return `$${formatted} USD`;
      case 'EUR': return `€${formatted} EUR`;
    }
  }
}

export function calculateFarHotelSurcharge(vehicleSlug: string): number {
  if (vehicleSlug === 'h1' || vehicleSlug === 'hiace') {
    return 500;
  }
  return 200;
}

export function generateBookingReference(): string {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `ANB-${month}${day}-${randomPart}`;
}

export function buildWhatsAppLink(payload: BookingPayload, locale: Locale): string {
  const phone = '201091501160';
  let message = '';

  if (locale === 'ar') {
    message += `🏛️ *طلب حجز جديد - أنوبيس ترافيل (ANUBIS TRAVEL)*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🔖 *رقم الحجز المرجعي:* ${payload.bookingReference}\n`;
    message += `👤 *اسم العميل:* ${payload.customerName}\n`;
    message += `📞 *رقم الهاتف:* ${payload.customerPhone}\n`;
    if (payload.customerEmail) message += `📧 *البريد:* ${payload.customerEmail}\n`;
    message += `📌 *نوع الخدمة:* ${payload.type === 'transfer' ? 'نقل سياحي / توصيلة' : 'برنامج سياحي'}\n`;
    message += `📍 *الخدمة المطلوبة:* ${payload.itemName}\n`;
    if (payload.selectedVehicle) message += `🚗 *نوع المركبة:* ${payload.selectedVehicle}\n`;
    message += `📅 *تاريخ وتوقيت الرحلة:* ${payload.pickupDate} - ${payload.pickupTime}\n`;
    message += `🏨 *مكان الانطلاق:* ${payload.pickupLocation}\n`;
    if (payload.dropoffLocation) message += `🎯 *مكان الوصول:* ${payload.dropoffLocation}\n`;
    if (payload.flightNumber) message += `✈️ *رقم رحلة الطيران:* ${payload.flightNumber}\n`;
    message += `👥 *عدد الركاب:* ${payload.passengersCount} | 🧳 *الحقائب:* ${payload.luggageCount}\n`;
    if (payload.isFarHotel) message += `⚠️ *تنبيه:* تم تضمين رسوم الفنادق البعيدة (أكتوبر / التجمع / مصر الجديدة / مدينة نصر).\n`;
    message += `💰 *إجمالي التكلفة:* ${payload.totalAmount} ${payload.currency}\n`;
    if (payload.notes) message += `📝 *ملاحظات العميل:* ${payload.notes}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `_مرسل تلقائياً عبر منصة أنوبيس ترافيل الرسمية_`;
  } else {
    message += `🏛️ *NEW RESERVATION INQUIRY - ANUBIS TRAVEL*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🔖 *Booking Reference:* ${payload.bookingReference}\n`;
    message += `👤 *Client Name:* ${payload.customerName}\n`;
    message += `📞 *Phone / WhatsApp:* ${payload.customerPhone}\n`;
    if (payload.customerEmail) message += `📧 *Email:* ${payload.customerEmail}\n`;
    message += `📌 *Service Type:* ${payload.type === 'transfer' ? 'Private Transfer' : 'Tour Package'}\n`;
    message += `📍 *Selected Item:* ${payload.itemName}\n`;
    if (payload.selectedVehicle) message += `🚗 *Vehicle Class:* ${payload.selectedVehicle}\n`;
    message += `📅 *Date & Pickup Time:* ${payload.pickupDate} at ${payload.pickupTime}\n`;
    message += `🏨 *Pickup Location:* ${payload.pickupLocation}\n`;
    if (payload.dropoffLocation) message += `🎯 *Dropoff Location:* ${payload.dropoffLocation}\n`;
    if (payload.flightNumber) message += `✈️ *Flight Number:* ${payload.flightNumber}\n`;
    message += `👥 *Passengers:* ${payload.passengersCount} | 🧳 *Luggage:* ${payload.luggageCount}\n`;
    if (payload.isFarHotel) message += `⚠️ *Note:* Outer-zone hotel surcharge included (October / New Cairo / Heliopolis).\n`;
    message += `💰 *Total Estimated Price:* ${payload.totalAmount} ${payload.currency}\n`;
    if (payload.notes) message += `📝 *Client Notes:* ${payload.notes}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `_Sent via ANUBIS Travel Tours Web Platform_`;
  }

  const encoded = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;
}
