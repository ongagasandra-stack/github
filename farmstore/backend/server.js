const express = require('express');
const cors = require('cors');
const { db, initializeDatabase } = require('./db/schema');
const facilitiesRouter = require('./routes/facilities');
const bookingsRouter = require('./routes/bookings');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database (creates tables and seeds data if empty)
initializeDatabase();

// Mount routes
app.use('/api/facilities', facilitiesRouter);
app.use('/api/bookings', bookingsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'FarmStore API is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`FarmStore backend running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
