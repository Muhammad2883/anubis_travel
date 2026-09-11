export type Locale = 'ar' | 'en';
export type Currency = 'EGP' | 'USD' | 'EUR';

export interface CarModel {
  id: string;
  categorySlug: string; // 'sedan' | '7seater' | 'h1' | 'hiace'
  name: {
    ar: string;
    en: string;
  };
  year?: number;
  imageUrl?: string;
  features: {
    ar: string[];
    en: string[];
  };
  showOnHomepage: boolean;
}

export interface Vehicle {
  id: number;
  slug: string;
  name: {
    ar: string;
    en: string;
  };
  passenger_capacity: number;
  luggage_capacity: number;
  features: {
    ar: string[];
    en: string[];
  };
  image_url: string;
  badge?: {
    ar: string;
    en: string;
  };
  requiresAdvanceNoticeDays?: number;
  models?: CarModel[];
}

export interface Route {
  id: number;
  title: {
    ar: string;
    en: string;
  };
  category: 'airport' | 'day_tour' | 'overday' | 'intercity' | 'multiday';
  estimatedDuration: {
    ar: string;
    en: string;
  };
  prices: {
    sedan: number;      // in EGP
    '7seater': number;   // in EGP
    h1: number | null;  // in EGP (null if not available)
    hiace: number | null;
  };
  isPopular?: boolean;
}

export interface ClientTrip {
  id: string;
  date: string;
  routeTitle: string;
  vehicleName: string;
  amountEgp: number;
  paidAmountEgp: number;
  status: 'paid' | 'partial' | 'unpaid';
  driverName?: string;
  notes?: string;
}

export interface RegularClient {
  id: string;
  name: string;
  companyName?: string;
  phone: string;
  email?: string;
  clientType: 'vip' | 'corporate' | 'hotel' | 'agency';
  accountBalanceEgp: number; // positive = owes us, negative = credit
  tripsCount: number;
  trips: ClientTrip[];
  notes?: string;
  createdAt: string;
}

export interface BookingPayload {
  bookingReference: string;
  type: 'transfer';
  itemId: number;
  itemName: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  flightNumber?: string;
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  dropoffLocation?: string;
  selectedVehicle?: string;
  isFarHotel?: boolean;
  passengersCount: number;
  luggageCount: number;
  totalAmount: number;
  currency: Currency;
  notes?: string;
}
