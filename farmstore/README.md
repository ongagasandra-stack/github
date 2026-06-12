# FarmStore — Kenya's Farm Storage Marketplace

FarmStore connects Kenyan farmers with reliable storage facility owners across the country. Built with React + Vite on the frontend and Node.js + Express + SQLite on the backend.

---

## Project Structure

```
farmstore/
├── backend/          Node.js + Express + SQLite API
│   ├── db/
│   │   └── schema.js       Database initialization & seed data
│   ├── routes/
│   │   ├── facilities.js   Facilities API routes
│   │   └── bookings.js     Bookings API routes
│   ├── server.js           Express app entry point
│   └── package.json
├── frontend/         React 18 + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── FacilityCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── FacilityDetail.jsx
│   │   │   ├── ListFacility.jsx
│   │   │   └── Bookings.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later

---

## Backend Setup

```bash
cd farmstore/backend
npm install
npm start
```

The backend runs on **http://localhost:3001**.

On first start, it automatically creates `farmstore.db` and seeds **8 realistic Kenyan storage facilities**.

### Available API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/facilities` | List facilities (supports `?county=`, `?produce_type=`, `?min_space=`) |
| GET | `/api/facilities/:id` | Single facility |
| POST | `/api/facilities` | Create new listing |
| PUT | `/api/facilities/:id/space` | Update available space |
| GET | `/api/bookings` | List all bookings |
| GET | `/api/bookings/:id` | Single booking |
| POST | `/api/bookings` | Create booking (auto-updates facility space) |

### Example: Create a Booking

```bash
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "farmer_name": "John Mwangi",
    "farmer_phone": "+254 712 345 678",
    "facility_id": "fac-001",
    "produce_type": "Maize",
    "quantity_tons": 50,
    "start_date": "2024-03-01",
    "end_date": "2024-03-31"
  }'
```

---

## Frontend Setup

```bash
cd farmstore/frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:5173** and proxies `/api` requests to the backend.

### Pages

| Route | Page |
|-------|------|
| `/` | Home / Landing page |
| `/search` | Search & filter storage facilities |
| `/facilities/:id` | Facility detail + booking form |
| `/list` | Register a new storage facility |
| `/bookings` | View all bookings |

---

## Running Both Together

Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd farmstore/backend && npm install && npm start
```

**Terminal 2 — Frontend:**
```bash
cd farmstore/frontend && npm install && npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Vite, Axios |
| Backend | Node.js, Express 4, better-sqlite3 |
| Database | SQLite (farmstore.db, auto-created) |
| Styling | Inline styles, CSS variables, Google Fonts |
| IDs | UUID v4 |

---

## Seed Data

The database is seeded with 8 facilities across Kenya:

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

---

## Design

- **Color palette:** Deep forest green `#2D5016`, golden brown `#8B6914`, harvest gold `#F5C842`, warm cream `#FDF8EF`
- **Typography:** Merriweather (headings), Inter (body) via Google Fonts
- **Theme:** Earthy Kenyan aesthetic — green savannahs, golden wheat fields
