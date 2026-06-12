const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./db/schema');
const facilitiesRouter = require('./routes/facilities');
const bookingsRouter = require('./routes/bookings');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase();

// Mount routes
app.use('/api/facilities', facilitiesRouter);
app.use('/api/bookings', bookingsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FarmStore API is running' });
});

app.listen(PORT, () => {
  console.log(`FarmStore backend running on http://localhost:${PORT}`);
});

module.exports = app;
