// ========================================================
// ANUBIS TRAVEL - TELEGRAM BOT NOTIFICATION SERVICE
// ========================================================

export interface TelegramNotificationResult {
  success: boolean;
  messageId?: number;
  error?: string;
}

/**
 * Clean phone number to ensure a valid wa.me link:
 * - Strips all non-digit characters (+, spaces, dashes)
 * - Ensures international Egyptian country code (20) if given locally (010, 011, 012, 015)
 */
export function cleanPhoneForWhatsApp(phone: unknown): string {
  if (!phone) return '';
  let digits = String(phone).replace(/\D/g, '');

  if (digits.startsWith('00')) {
    digits = digits.substring(2);
  }

  // Egyptian mobile numbers: e.g. 01012345678 -> 201012345678
  if (digits.startsWith('01') && digits.length === 11) {
    digits = '20' + digits.substring(1);
  } else if (digits.startsWith('1') && digits.length === 10) {
    digits = '20' + digits;
  }

  return digits;
}

/**
 * Escape special Markdown characters to prevent Telegram parse errors
 */
function escapeMarkdown(text: unknown): string {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/[*_`\[\]]/g, ' ')
    .trim();
}

/**
 * Send new booking alert to Management Telegram channel / group / chat
 */
export async function sendBookingTelegramAlert(booking: any): Promise<TelegramNotificationResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('[TelegramBot] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in environment variables. Skipping alert.');
    return {
      success: false,
      error: 'Telegram environment credentials missing',
    };
  }

  try {
    const customerName = escapeMarkdown(booking.customerName || booking.name || 'غير محدد');
    const customerPhone = escapeMarkdown(booking.customerPhone || booking.phone || 'غير محدد');
    const tourName = escapeMarkdown(booking.itemName || booking.routeTitle || booking.tourName || booking.service || 'رحلة سياحية');
    const bookingDate = escapeMarkdown(
      booking.pickupDate
        ? `${booking.pickupDate} ${booking.pickupTime || ''}`.trim()
        : booking.date || 'حسب الاتفاق'
    );
    const guestsCount = escapeMarkdown(booking.passengersCount || booking.guests || booking.seats || 1);
    const totalPrice = escapeMarkdown(booking.totalAmount || booking.amountEgp || booking.price || '0');
    const currency = escapeMarkdown(booking.currency || 'جنيه');
    const reference = escapeMarkdown(booking.bookingReference || booking.reference || '');
    const vehicle = escapeMarkdown(booking.vehicleName || booking.selectedVehicle || '');
    const pickupLocation = escapeMarkdown(booking.pickupLocation || '');
    const notes = escapeMarkdown(booking.notes || '');

    const cleanPhone = cleanPhoneForWhatsApp(booking.customerPhone || booking.phone);
    const whatsappLink = cleanPhone ? `https://wa.me/${cleanPhone}` : '';

    // Build professional Markdown message
    let messageText =
      `🚨 *إشعار حجز جديد - Anubis Travel* 🚨\n\n` +
      (reference ? `🔖 *رقم الحجز:* \`${reference}\`\n` : '') +
      `👤 *الاسم:* ${customerName}\n` +
      `📞 *الهاتف:* ${customerPhone}\n` +
      `🏛️ *الرحلة / الخدمة:* ${tourName}\n` +
      (vehicle ? `🚗 *المركبة:* ${vehicle}\n` : '') +
      `📅 *التاريخ:* ${bookingDate}\n` +
      (pickupLocation ? `🏨 *مكان الانطلاق:* ${pickupLocation}\n` : '') +
      `👥 *عدد الأفراد:* ${guestsCount}\n` +
      `💰 *الإجمالي:* ${totalPrice} ${currency}\n` +
      (notes ? `📝 *ملاحظات:* ${notes}\n` : '');

    if (whatsappLink) {
      messageText +=
        `\n💬 *محادثة العميل واتساب مباشرة:*\n` +
        `${whatsappLink}\n`;
    }

    messageText += `\n📊 *لوحة الإدارة:* http://localhost:3000/admin`;

    const telegramApiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      const errorMsg = data?.description || `Telegram API responded with HTTP status ${response.status}`;
      console.error('[TelegramBot] Failed to send message:', errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }

    console.log(`[TelegramBot] Alert sent successfully! Message ID: ${data?.result?.message_id}`);
    return {
      success: true,
      messageId: data?.result?.message_id,
    };
  } catch (error: any) {
    console.error('[TelegramBot] Exception while sending alert:', error?.message || error);
    return {
      success: false,
      error: error?.message || 'Unknown exception',
    };
  }
}
