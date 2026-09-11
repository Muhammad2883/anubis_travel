-- ============================================================================
-- ANUBIS TRAVEL TOURS PLATFORM - DATABASE SCHEMA
-- Target Database: PostgreSQL 16+
-- Based on: Approved PRD v1.0.0
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. VEHICLES TABLE
-- Stores transfer fleet models (Sedan, HiAce, Coaster, Limousine / H1)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    name JSONB NOT NULL,                 -- {"en": "Sedan (Private Car)", "ar": "ملاكي (سيارة خاصة)"}
    slug VARCHAR(100) UNIQUE NOT NULL,
    passenger_capacity INT NOT NULL,     -- Sedan: 2, 7-Seater: 5, H1: 6, HiAce: 10
    luggage_capacity INT NOT NULL,       -- Max medium suitcases
    features JSONB NOT NULL DEFAULT '[]',-- ["Air Conditioning", "Wi-Fi", "Bottled Water", "Professional English Speaking Driver"]
    image_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. ROUTES TABLE
-- Standard origin-destination itineraries for transportation services
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS routes (
    id SERIAL PRIMARY KEY,
    origin_name JSONB NOT NULL,          -- {"en": "Cairo Airport", "ar": "مطار القاهرة"}
    destination_name JSONB NOT NULL,     -- {"en": "Giza / Pyramids / Cairo Hotels", "ar": "الجيزة / الأهرامات / فنادق القاهرة"}
    category VARCHAR(50) NOT NULL,       -- "airport", "day_tour", "overday", "intercity"
    distance_km NUMERIC(6, 2) DEFAULT NULL,
    estimated_duration_mins INT DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. ROUTE_VEHICLE_PRICES TABLE
-- Dynamic price matrix mapping routes to specific vehicle classes across currencies
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS route_vehicle_prices (
    id SERIAL PRIMARY KEY,
    route_id INT NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    price_egp NUMERIC(10, 2) NOT NULL,
    price_usd NUMERIC(10, 2) NOT NULL,
    price_eur NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_route_vehicle UNIQUE (route_id, vehicle_id)
);

-- ----------------------------------------------------------------------------
-- 4. TOURS TABLE
-- Full tour and holiday package catalog with rich localized content
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tours (
    id SERIAL PRIMARY KEY,
    title JSONB NOT NULL,                -- {"en": "Giza Pyramids, Sphinx & Saqqara Day Tour", "ar": "جولة أهرامات الجيزة وسقارة وممفيس"}
    slug VARCHAR(150) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,       -- "day_trip", "cultural", "adventure", "nile_cruise"
    overview JSONB NOT NULL,             -- Multi-language description
    itinerary JSONB NOT NULL DEFAULT '[]', -- Chronological steps with time, stop title, and description
    inclusions JSONB NOT NULL DEFAULT '[]',-- Included amenities (private AC car, guide, entrance fees, lunch)
    exclusions JSONB NOT NULL DEFAULT '[]',-- Excluded items (personal expenses, tips)
    base_price_usd NUMERIC(10, 2) NOT NULL,
    base_price_eur NUMERIC(10, 2) NOT NULL,
    base_price_egp NUMERIC(10, 2) NOT NULL,
    duration_hours INT NOT NULL,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 5. BOOKINGS TABLE
-- Central records for transfer/tour inquiries, orders, and operational dispatch
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    booking_reference VARCHAR(50) UNIQUE NOT NULL, -- e.g. ANB-2026-0911-01
    type VARCHAR(20) NOT NULL CHECK (type IN ('transfer', 'tour')),
    item_id INT NOT NULL,                -- references route_id or tour_id
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150),
    customer_phone VARCHAR(50) NOT NULL,
    flight_number VARCHAR(50),
    pickup_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    pickup_location VARCHAR(255),
    dropoff_location VARCHAR(255),
    passengers_count INT NOT NULL DEFAULT 1,
    luggage_count INT NOT NULL DEFAULT 0,
    vehicle_id INT REFERENCES vehicles(id) ON DELETE SET NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'EGP',
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-performance lookups
CREATE INDEX IF NOT EXISTS idx_routes_active ON routes(is_active);
CREATE INDEX IF NOT EXISTS idx_vehicles_active ON vehicles(is_active);
CREATE INDEX IF NOT EXISTS idx_tours_active_featured ON tours(is_active, is_featured);
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
