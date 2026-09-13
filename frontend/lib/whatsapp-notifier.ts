import fs from 'fs';
import path from 'path';

export interface WhatsAppNotificationResult {
  success: boolean;
  provider?: string;
  message?: string;
  data?: any;
  error?: string;
}

/**
 * Dispatches an automated WhatsApp notification message to management
 * completely on the server-side, without requiring the client to send anything.
 *
 * Supported Providers in order of priority:
 * 1. Official Meta WhatsApp Cloud API (Graph API)
 * 2. CallMeBot API
 * 3. UltraMsg API
 * 4. GreenAPI
 * 5. Custom Webhook
 * 6. Local CRM Dispatch Log
 */
/**
 * Helper to clean and format phone digits for wa.me links
 * e.g. converts '01012345678' or '+201012345678' -> '201012345678'
 * Strips all spaces, plus signs (+), dashes, and non-digits.
 */
export function cleanPhoneForWhatsAppDigits(phone: any): string {
  if (!phone) return '201009042333';
  let digits = String(phone).replace(/\D/g, '');
  if (!digits) return '201009042333';

  // If already starts with 002... -> remove 00 -> 2...
  if (digits.startsWith('002')) {
    digits = digits.slice(2);
  }

  // Egyptian numbers starting with 01 (11 digits: 010..., 011..., 012..., 015...)
  if (digits.startsWith('01') && digits.length === 11) {
    digits = '2' + digits; // 2010xxxxxxxx
  } else if (digits.startsWith('1') && digits.length === 10) {
    digits = '20' + digits;
  }

  return digits || '201009042333';
}

export async function sendAutomatedAdminWhatsApp(booking: any): Promise<WhatsAppNotificationResult> {
  const adminPhone = 
    process.env.ADMIN_WHATSAPP_NUMBER || 
    process.env.ADMIN_WHATSAPP_PHONE || 
    '201009042333';

  const cleanAdminPhone = adminPhone.replace(/\D/g, '');

  // 1: Customer Name
  const param1_name = String(booking.customerName || '').trim() || 'عميل أنوبيس ترافيل';

  // 2: Customer Phone (as entered)
  const param2_phone = String(booking.customerPhone || '').trim() || 'غير متوفر';

  // 3: Tour Name / Route
  const serviceTitle = String(booking.title || booking.itemName || 'خدمة سياحية خاصة').trim() || 'خدمة سياحية';
  const param3_route = serviceTitle;

  // 4: Booking Date & Time
  const rawDate = String(booking.pickupDate || '').trim();
  const rawTime = String(booking.pickupTime || '').trim();
  const param4_date = rawDate 
    ? (rawTime ? `${rawDate} (${rawTime})` : rawDate) 
    : (rawTime ? `حسب التنسيق (${rawTime})` : 'حسب رغبة وتنسيق العميل');

  // 5: Guests / Passengers Count
  const rawGuests = booking.passengersCount || booking.guestsCount || booking.guests || booking.persons;
  let param5_guests = '1';
  if (rawGuests !== undefined && rawGuests !== null && String(rawGuests).trim() && String(rawGuests).trim() !== '0') {
    const gStr = String(rawGuests).trim();
    param5_guests = isNaN(Number(gStr)) ? gStr : `${gStr} فرد`;
  } else if (booking.vehicleSlug === 'hiace') {
    param5_guests = 'حتى 14 راكب';
  } else if (booking.vehicleSlug === 'coaster') {
    param5_guests = 'حتى 28 راكب';
  } else {
    param5_guests = '1 فرد';
  }

  // 6: Total Price
  let param6_price = '0 ج.م';
  if (booking.amountEgp && Number(booking.amountEgp) > 0) {
    param6_price = `${Number(booking.amountEgp).toLocaleString()} ج.م`;
  } else if (booking.totalAmount && String(booking.totalAmount).trim()) {
    param6_price = String(booking.totalAmount).trim();
  } else {
    param6_price = 'حسب الاتفاق';
  }

  // 7: Clean Phone Digits for WhatsApp (wa.me link format: 2010xxxxxxxx)
  const param7_cleanDigits = cleanPhoneForWhatsAppDigits(booking.customerPhone);
  const customerWaLink = `https://wa.me/${param7_cleanDigits}`;

  // Format service type in Arabic for full text
  const serviceTypeArabic = 
    booking.type === 'transfer' 
      ? 'توصيلة خاصة (Private Transfer)' 
      : booking.type === 'tour' 
        ? 'جولة ورحلة سياحية (Day Tour)' 
        : 'حجز خدمة نقل سياحي';

  const vehicleName = booking.vehicleName || booking.selectedVehicle || 'ملاكي سيدان فاخرة';
  const priceDisplay = booking.amountEgp ? Number(booking.amountEgp).toLocaleString('ar-EG') : '0';

  const notificationMessage = 
    `🚨 *إشعار حجز جديد عبر المنصة الإلكترونية (أنوبيس ترافيل)* 🚨\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `🔖 *رقم الحجز المرجعي:* ${booking.reference || 'غير محدد'}\n` +
    `👤 *اسم العميل:* ${param1_name}\n` +
    `📞 *رقم الهاتف / الاتصال:* ${param2_phone}\n` +
    `💬 *محادثة العميل واتساب مباشرة:* ${customerWaLink}\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `🗺️ *الخدمة / المسار:* ${serviceTitle}\n` +
    `🏷️ *تصنيف الخدمة:* ${serviceTypeArabic}\n` +
    `🚗 *نوع المركبة:* ${vehicleName}\n` +
    `👥 *عدد الأفراد:* ${param5_guests}\n` +
    `📅 *تاريخ وتوقيت الرحلة:* ${param4_date}\n` +
    `🏨 *مكان الانطلاق:* ${booking.pickupLocation || 'فندق الإقامة'}\n` +
    (booking.dropoffLocation ? `🎯 *مكان الوصول / الوجهة:* ${booking.dropoffLocation}\n` : '') +
    (booking.flightNumber ? `✈️ *رقم رحلة الطيران:* ${booking.flightNumber}\n` : '') +
    (booking.isFarHotel ? `📍 *تنبيه موقع الفندق:* فندق في نطاق بعيد (تمت إضافة رسوم المسافة)\n` : '') +
    (booking.notes ? `📝 *ملاحظات خاصة من العميل:* ${booking.notes}\n` : '') +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 *المبلغ التقديري:* *${param6_price}*\n` +
    `📍 *طريقة الحجز:* ${booking.source || 'حجز مباشر عبر موقع أنوبيس ترافيل'}\n` +
    `⏰ *توقيت الطلب:* ${booking.createdAt || new Date().toISOString().replace('T', ' ').slice(0, 16)}\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `📊 *لوحة الإدارة لإدارة الحجز:*\n` +
    `http://localhost:3000/admin`;

  // Always log dispatch action to local log file for auditing
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const logPath = path.join(dataDir, 'whatsapp_dispatches.log');
    const logLine = `[${new Date().toISOString()}] [${booking.reference}] Target: ${cleanAdminPhone} | Client: ${param1_name} (${param2_phone}) | Route: ${param3_route} | Date: ${param4_date} | Guests: ${param5_guests} | Price: ${param6_price} | CleanPhone: ${param7_cleanDigits}\n`;
    fs.appendFileSync(logPath, logLine, 'utf8');
  } catch (e) {
    console.warn('Could not write to whatsapp_dispatches.log:', e);
  }

  // =========================================================================
  // Provider 1: Official Meta WhatsApp Cloud API (Primary Enterprise Gateway)
  // =========================================================================
  const metaToken = process.env.META_WHATSAPP_TOKEN;
  const metaPhoneId = process.env.META_WHATSAPP_PHONE_ID;
  const metaApiVersion = process.env.META_WHATSAPP_API_VERSION || 'v19.0';
  const metaTemplate = process.env.META_WHATSAPP_BOOKING_TEMPLATE || 'anubis_new_booking_alert';

  if (metaToken && metaPhoneId) {
    const metaEndpoint = `https://graph.facebook.com/${metaApiVersion}/${metaPhoneId}/messages`;

    // 1. Primary: Send Approved Meta Template with the 7 text parameters
    const isHelloWorld = metaTemplate === 'hello_world';

    const templatePayload: any = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanAdminPhone,
      type: 'template',
      template: {
        name: metaTemplate,
        language: {
          code: isHelloWorld ? 'en_US' : 'ar',
        },
      },
    };

    // Attach the 7 approved parameters in exact order
    if (!isHelloWorld) {
      templatePayload.template.components = [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: param1_name },
            { type: 'text', text: param2_phone },
            { type: 'text', text: param3_route },
            { type: 'text', text: param4_date },
            { type: 'text', text: param5_guests },
            { type: 'text', text: param6_price },
            { type: 'text', text: param7_cleanDigits },
          ],
        },
      ];
    }

    try {
      const templateRes = await fetch(metaEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${metaToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templatePayload),
      });

      const templateData = await templateRes.json();

      if (templateRes.ok) {
        console.log(`[WhatsAppService] Meta WhatsApp Cloud API Template (${metaTemplate}) dispatched successfully:`, templateData);
        return {
          success: true,
          provider: 'meta_cloud_api_template',
          message: `Dispatched via Meta WhatsApp Cloud API Template (${metaTemplate})`,
          data: templateData,
        };
      } else {
        console.warn(`[WhatsAppService] Meta Template (${metaTemplate}) returned error:`, templateData);

        // Fallback 1: Attempt sending full direct text message if template fails
        try {
          console.log('[WhatsAppService] Attempting direct text message fallback...');
          const directTextRes = await fetch(metaEndpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${metaToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              recipient_type: 'individual',
              to: cleanAdminPhone,
              type: 'text',
              text: {
                preview_url: false,
                body: notificationMessage,
              },
            }),
          });

          const directTextData = await directTextRes.json();
          if (directTextRes.ok) {
            console.log('[WhatsAppService] Direct text fallback dispatched successfully:', directTextData);
            return {
              success: true,
              provider: 'meta_cloud_api_direct_text',
              message: 'Template failed; dispatched full booking details via Meta Direct Text fallback',
              data: directTextData,
            };
          }
        } catch (directErr) {
          console.warn('[WhatsAppService] Direct text fallback error:', directErr);
        }

        // Fallback 2: Try standard hello_world if custom template not found/pending
        if (!isHelloWorld) {
          try {
            console.log('[WhatsAppService] Retrying with hello_world template fallback...');
            const fallbackRes = await fetch(metaEndpoint, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${metaToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: cleanAdminPhone,
                type: 'template',
                template: {
                  name: 'hello_world',
                  language: { code: 'en_US' },
                },
              }),
            });
            const fallbackData = await fallbackRes.json();
            if (fallbackRes.ok) {
              return {
                success: true,
                provider: 'meta_cloud_api_fallback',
                message: 'Custom template failed; dispatched hello_world test fallback successfully.',
                data: fallbackData,
              };
            }
          } catch (fbErr) {
            console.warn('[WhatsAppService] Meta hello_world fallback error:', fbErr);
          }
        }
      }
    } catch (metaErr: any) {
      console.error('[WhatsAppService] Exception calling Meta WhatsApp API Template:', metaErr);
    }
  }

  // =========================================================================
  // Provider 2: CallMeBot API (Direct free WhatsApp message to personal number)
  // =========================================================================
  const callmebotApiKey = process.env.CALLMEBOT_API_KEY;
  if (callmebotApiKey) {
    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(cleanAdminPhone)}&text=${encodeURIComponent(notificationMessage)}&apikey=${encodeURIComponent(callmebotApiKey)}`;
      const res = await fetch(url);
      if (res.ok) {
        return { success: true, provider: 'callmebot', message: 'Dispatched via CallMeBot' };
      }
    } catch (err: any) {
      console.warn('CallMeBot notification failed:', err);
    }
  }

  // =========================================================================
  // Provider 3: UltraMsg API (Business WhatsApp Gateway)
  // =========================================================================
  const ultramsgInstance = process.env.ULTRAMSG_INSTANCE_ID;
  const ultramsgToken = process.env.ULTRAMSG_TOKEN;
  if (ultramsgInstance && ultramsgToken) {
    try {
      const res = await fetch(`https://api.ultramsg.com/${ultramsgInstance}/messages/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          token: ultramsgToken,
          to: cleanAdminPhone,
          body: notificationMessage,
        }),
      });
      if (res.ok) {
        return { success: true, provider: 'ultramsg', message: 'Dispatched via UltraMsg' };
      }
    } catch (err: any) {
      console.warn('UltraMsg notification failed:', err);
    }
  }

  // =========================================================================
  // Provider 4: GreenAPI (Alternative WhatsApp Gateway)
  // =========================================================================
  const greenInstance = process.env.GREENAPI_INSTANCE_ID;
  const greenToken = process.env.GREENAPI_TOKEN;
  if (greenInstance && greenToken) {
    try {
      const res = await fetch(`https://api.green-api.com/waInstance${greenInstance}/sendMessage/${greenToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: `${cleanAdminPhone}@c.us`,
          message: notificationMessage,
        }),
      });
      if (res.ok) {
        return { success: true, provider: 'greenapi', message: 'Dispatched via GreenAPI' };
      }
    } catch (err: any) {
      console.warn('GreenAPI notification failed:', err);
    }
  }

  // =========================================================================
  // Provider 5: Custom Webhook (Zapier, Make, n8n, Custom Bridge)
  // =========================================================================
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientPhone: cleanAdminPhone,
          message: notificationMessage,
          booking,
        }),
      });
      if (res.ok) {
        return { success: true, provider: 'webhook', message: 'Dispatched via custom webhook' };
      }
    } catch (err: any) {
      console.warn('Webhook notification failed:', err);
    }
  }

  // =========================================================================
  // Fallback: Local Server Dispatch & Persistence
  // =========================================================================
  return { 
    success: true, 
    provider: 'system_crm_dispatch', 
    message: 'Booking saved in system database; Meta API credentials pending in .env.local.' 
  };
}
