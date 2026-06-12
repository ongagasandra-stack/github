# FarmStore - Kenya's Farm Storage Marketplace

A full-stack web application connecting Kenyan farmers with storage facility owners. Farmers can search for and book storage space; facility owners can list their warehouses.

## Tech Stack

- **Frontend:** React 18, Vite, React Router v6, Axios
- **Backend:** Node.js, Express 4, better-sqlite3, UUID, CORS

---

## Setup & Running

### Backend

```bash
cd backend
npm install
npm start
```

The backend API runs on **http://localhost:3001**.

On first start, the SQLite database (`farmstore.db`) is created automatically and seeded with 8 realistic Kenyan storage facilities.

For development with auto-reload:
```bash
npm install -g nodemon
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs on **http://localhost:5173**.

API calls are proxied through Vite to `http://localhost:3001`, so both servers must be running.

---

## API Endpoints

### Facilities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/facilities` | List all facilities (supports `?county=`, `?produce_type=`, `?min_space=`) |
| GET | `/api/facilities/:id` | Get a single facility |
| POST | `/api/facilities` | Create a new facility listing |
| PUT | `/api/facilities/:id/space` | Update available space |

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | List all bookings |
| GET | `/api/bookings/:id` | Get a single booking |
| POST | `/api/bookings` | Create a booking (auto-updates facility space) |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home/Landing page with hero, stats, and featured facilities |
| `/search` | Search and filter storage facilities |
| `/facilities/:id` | Facility detail page with booking form |
| `/list` | Register a new storage facility |
| `/bookings` | View all storage bookings |

---

## Project Structure

```
farmstore/
├── backend/
│   ├── db/
│   │   └── schema.js        # SQLite init + seed data
│   ├── routes/
│   │   ├── facilities.js    # Facility CRUD routes
│   │   └── bookings.js      # Booking routes
│   ├── server.js            # Express app entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── FacilityCard.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Search.jsx
    │   │   ├── FacilityDetail.jsx
    │   │   ├── ListFacility.jsx
    │   │   └── Bookings.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```
