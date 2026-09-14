// ========================================================
// ANUBIS TRAVEL - CORE TYPES & DOMAIN INTERFACES
// ========================================================

export type Locale = 'ar' | 'en';
export type Currency = 'EGP' | 'USD' | 'EUR';

export type TourCategorySlug = 'day_trip' | 'cultural' | 'adventure' | 'nile_cruise' | 'multiday';
export type RouteCategorySlug = 'airport' | 'day_tour' | 'overday' | 'intercity' | 'multiday' | 'nile_cruise';
export type VehicleCategorySlug = 'sedan' | '7seater' | 'h1' | 'hiace';

export interface LocalizedString {
  ar: string;
  en: string;
}

export interface Category {
  id: number | string;
  slug: string;
  name: LocalizedString;
  description?: LocalizedString;
  icon?: string;
}

export interface TourItineraryItem {
  time: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface Tour {
  id: number;
  slug: string;
  category: TourCategorySlug;
  title: LocalizedString;
  subtitle: LocalizedString;
  overview: LocalizedString;
  duration: LocalizedString;
  basePriceEgp: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  highlights: {
    ar: string[];
    en: string[];
  };
  itinerary: TourItineraryItem[];
  inclusions: {
    ar: string[];
    en: string[];
  };
  exclusions: {
    ar: string[];
    en: string[];
  };
  isFeatured?: boolean;
}

export interface CarModel {
  id: string;
  categorySlug: string;
  name: LocalizedString;
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
  name: LocalizedString;
  passenger_capacity: number;
  luggage_capacity: number;
  features: {
    ar: string[];
    en: string[];
  };
  image_url: string;
  badge?: LocalizedString;
  requiresAdvanceNoticeDays?: number;
  models?: CarModel[];
}

export interface RoutePricing {
  sedan: number;
  '7seater': number;
  h1: number | null;
  hiace: number | null;
}

export interface Route {
  id: number;
  slug?: string;
  title: LocalizedString;
  subtitle?: LocalizedString;
  overview?: LocalizedString;
  category: RouteCategorySlug;
  estimatedDuration: LocalizedString;
  prices: RoutePricing;
  imageUrl?: string;
  rating?: number;
  reviewsCount?: number;
  highlights?: {
    ar: string[];
    en: string[];
  };
  itinerary?: TourItineraryItem[];
  inclusions?: {
    ar: string[];
    en: string[];
  };
  exclusions?: {
    ar: string[];
    en: string[];
  };
  isPopular?: boolean;
  showInCatalog?: boolean;
}

export interface PricingBreakdown {
  basePriceEgp: number;
  selectedVehicle: string;
  passengersCount: number;
  currency: Currency;
  exchangeRate: number;
  farHotelSurchargeEgp: number;
  totalPriceEgp: number;
  totalPriceConverted: number;
  discountPercentage?: number;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type BookingPaymentStatus = 'unpaid' | 'deposit_paid' | 'paid' | 'refunded';

export interface BookingPayload {
  bookingReference?: string;
  type: 'transfer' | 'tour';
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
  bookingMethod?: 'website' | 'whatsapp' | 'manual';
  source?: string;
}

export interface Booking extends BookingPayload {
  id: string | number;
  bookingReference: string;
  status: BookingStatus;
  paymentStatus?: BookingPaymentStatus;
  createdAt: string;
  updatedAt?: string;
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
  accountBalanceEgp: number;
  tripsCount: number;
  trips: ClientTrip[];
  notes?: string;
  createdAt: string;
}

// API Communication Interfaces for Laravel 11 Backend
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}
