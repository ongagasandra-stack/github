# 🌿 FarmStore — Kenya's Farm Storage Marketplace

FarmStore is an Airbnb-style marketplace connecting Kenyan farmers with trusted storage facilities for their produce.

## Features

**For Farmers**
- Search storage facilities by county, produce type, and space needed
- View capacity, pricing, and accepted produce for each facility
- Book storage directly with cost estimation
- Contact owners via phone or email

**For Storage Owners**
- List your warehouse with full details (location, capacity, pricing, produce types)
- Reach thousands of farmers across Kenya
- Manage bookings and available space automatically

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | SQLite (via better-sqlite3) |
| Styling | Custom CSS (earthy green/gold palette) |
| Routing | React Router v6 |

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Backend Setup

```bash
cd farmstore/backend
npm install
npm start
```

The API will run at `http://localhost:3001`. The SQLite database (`farmstore.db`) is created automatically and seeded with 8 real Kenyan storage facilities.

### Frontend Setup

```bash
cd farmstore/frontend
npm install
npm run dev
```

The app will open at `http://localhost:5173`.

## API Reference

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/facilities` | List all facilities (supports `?county=`, `?produce_type=`, `?min_space=`) |
| GET | `/api/facilities/:id` | Get single facility |
| POST | `/api/facilities` | Create new facility listing |
| GET | `/api/bookings` | List all bookings |
| GET | `/api/bookings/:id` | Get single booking |
| POST | `/api/bookings` | Create booking (auto-updates available space) |
| GET | `/api/health` | Health check |

## Seed Data

The database comes pre-seeded with 8 facilities across Kenya:

| Facility | County | Capacity |
|----------|--------|----------|
| Kamau Grain Warehouse | Nairobi | 500 tons |
| Nakuru Valley Storage | Nakuru | 800 tons |
| Meru Highland Cold Store | Meru | 300 tons |
| Lakeside Grain Store | Kisumu | 600 tons |
| Eldoret Farmers Cooperative | Uasin Gishu | 1,000 tons |
| Machakos Harvest Hub | Machakos | 400 tons |
| Thika Blue Nile Warehouse | Kiambu | 700 tons |
| Kitale Maize Depot | Trans-Nzoia | 1,200 tons |

## Color Palette

| Name | Hex |
|------|-----|
| Forest Green (Primary) | `#2D5016` |
| Golden Brown (Secondary) | `#8B6914` |
| Harvest Gold (Accent) | `#F5C842` |
| Warm Cream (Background) | `#FDF8EF` |
