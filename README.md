# FarmStore - Farm Produce Storage Marketplace

An Airbnb-style marketplace connecting farmers with storage facility owners in Kenya.

## Features

### For Farmers
- Search for nearby storage facilities
- View available capacity, pricing, and facility details
- Book storage and manage reservations
- Track produce location

### For Storage Owners
- List warehouses with location, capacity, and pricing
- Manage facility availability
- View bookings and earnings
- Set pricing tiers (daily, weekly, monthly)

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite3
- **Styling**: Tailwind CSS with custom earthy green/gold palette

## Project Structure

```
farmstore/
├── frontend/          # React + Vite app
├── backend/           # Express.js API
├── database/          # SQLite database and migrations
└── docs/              # Documentation
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Database migrations run automatically on server startup.

## API Endpoints

See `docs/API.md` for complete API documentation.

## Development

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Visit `http://localhost:5173` for the frontend.

## License

MIT
