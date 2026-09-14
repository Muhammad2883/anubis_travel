// ========================================================
// ANUBIS TRAVEL - LARAVEL 11 API CLIENT
// ========================================================

import { ApiResponse, Booking, BookingPayload, Route, Tour, Vehicle } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Base HTTP client configured for the Laravel 11 Backend
 */
export async function fetchApi<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...restOptions } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const response = await fetch(url, {
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...restOptions,
  });

  let responseData: unknown = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      (typeof responseData === 'object' && responseData && 'message' in responseData)
        ? String((responseData as { message: unknown }).message)
        : `Request failed with status ${response.status}: ${response.statusText}`;

    throw new ApiError(errorMessage, response.status, responseData);
  }

  return responseData as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};

// ========================================================
// DOMAIN-SPECIFIC SERVICES FOR LARAVEL 11 ENDPOINTS
// ========================================================

export const toursApi = {
  getAll: (params?: { category?: string; featured?: boolean }) =>
    apiClient.get<ApiResponse<Tour[]>>('/tours', { params }),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Tour>>(`/tours/${slug}`),

  getFeatured: () =>
    apiClient.get<ApiResponse<Tour[]>>('/tours/featured'),
};

export const routesApi = {
  getAll: (params?: { category?: string }) =>
    apiClient.get<ApiResponse<Route[]>>('/routes', { params }),

  getById: (id: number | string) =>
    apiClient.get<ApiResponse<Route>>(`/routes/${id}`),
};

export const vehiclesApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Vehicle[]>>('/vehicles'),
};

export const bookingsApi = {
  getAll: (params?: { status?: string; search?: string }) =>
    apiClient.get<ApiResponse<Booking[]>>('/bookings', { params }),

  getById: (id: string | number) =>
    apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`),

  create: (payload: BookingPayload) =>
    apiClient.post<ApiResponse<Booking>>('/bookings', payload),

  updateStatus: (id: string | number, status: string) =>
    apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, { status }),
};

export const pricingApi = {
  calculate: (data: { routeId: number; vehicleSlug: string; isFarHotel?: boolean; passengers: number }) =>
    apiClient.post<ApiResponse<{ totalEgp: number; totalUsd: number; breakdown: unknown }>>('/pricing/calculate', data),
};

export default apiClient;
