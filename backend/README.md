# ANUBIS TRAVEL TOURS - LARAVEL 11 BACKEND & FILAMENT v3 ADMIN

This is the dedicated Enterprise Backend for **ANUBIS Travel Tours**, built with **Laravel 11**, **Filament v3**, and **PostgreSQL 16**.

---

## 🛠️ Technology Stack
- **Framework**: Laravel 11 (PHP 8.2+)
- **Admin Panel**: Filament v3 (Modern TALL Stack Admin)
- **Database**: PostgreSQL 16 (Managed via Root `docker-compose.yml`)
- **Cache & Queue**: Redis 7
- **Third-Party Integrations**:
  - Telegram Bot Notifications (Instant booking alerts)
  - Paymob / Stripe Payment Gateway integration ready

---

## 🚀 Quick Start Guide

### 1. Start Database (PostgreSQL & Redis)
In the root directory of the repository:
```bash
docker compose up -d
```
> **Services launched:**
> - PostgreSQL: `localhost:5432` (`user: anubis`, `pass: secret`, `db: anubis_travel`)
> - pgAdmin: `http://localhost:5050` (`admin@anubis.com` / `admin`)
> - Redis: `localhost:6379`

### 2. Configure Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

### 3. Run Migrations & Seeders
```bash
php artisan migrate
```

### 4. Create Filament Admin User
```bash
php artisan make:filament-user
```
Access the Filament admin dashboard at: `http://localhost:8000/admin`

### 5. Start Laravel Development Server
```bash
php artisan serve --port=8000
```

---

## 📡 API Endpoints Overview

Base URL: `http://localhost:8000/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Service health check |
| `GET` | `/tours` | List active tours & filters |
| `GET` | `/tours/featured` | Get featured luxury tours |
| `GET` | `/tours/{slug}` | Get single tour details |
| `GET` | `/routes` | List transfer & trip routes |
| `GET` | `/routes/{id}` | Single route details |
| `GET` | `/vehicles` | List fleet vehicles & specs |
| `GET` | `/bookings` | List bookings (Admin/Dashboard) |
| `POST` | `/bookings` | Create new booking |
| `PATCH` | `/bookings/{id}/status` | Update booking status |
| `POST` | `/pricing/calculate` | Calculate dynamic transfer fare |
