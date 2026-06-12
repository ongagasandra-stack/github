const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db/schema');

function parseBookingWithFacility(booking) {
  if (!booking) return null;
  return booking;
}

// GET /api/bookings
router.get('/', (req, res) => {
  try {
    const bookings = db.prepare(`
      SELECT b.*, sf.facility_name, sf.county, sf.location
      FROM bookings b
      LEFT JOIN storage_facilities sf ON b.facility_id = sf.id
      ORDER BY b.created_at DESC
    `).all();
    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
  }
});

// POST /api/bookings
router.post('/', (req, res) => {
  try {
    const {
      farmer_name,
      farmer_phone,
      facility_id,
      produce_type,
      quantity_tons,
      start_date,
      end_date
    } = req.body;

    if (!farmer_name || !farmer_phone || !facility_id || !produce_type || !quantity_tons || !start_date || !end_date) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const facility = db.prepare('SELECT * FROM storage_facilities WHERE id = ?').get(facility_id);
    if (!facility) {
      return res.status(404).json({ success: false, error: 'Facility not found' });
    }

    if (facility.available_space_tons < parseFloat(quantity_tons)) {
      return res.status(400).json({
        success: false,
        error: `Insufficient space. Available: ${facility.available_space_tons} tons, Requested: ${quantity_tons} tons`
      });
    }

    const id = uuidv4();
    const created_at = new Date().toISOString();

    const createBookingAndUpdateSpace = db.transaction(() => {
      db.prepare(`
        INSERT INTO bookings
          (id, farmer_name, farmer_phone, facility_id, produce_type, quantity_tons, start_date, end_date, status, created_at)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?)
      `).run(id, farmer_name, farmer_phone, facility_id, produce_type, parseFloat(quantity_tons), start_date, end_date, created_at);

      const newAvailableSpace = facility.available_space_tons - parseFloat(quantity_tons);
      db.prepare('UPDATE storage_facilities SET available_space_tons = ? WHERE id = ?')
        .run(newAvailableSpace, facility_id);
    });

    createBookingAndUpdateSpace();

    const newBooking = db.prepare(`
      SELECT b.*, sf.facility_name, sf.county, sf.location
      FROM bookings b
      LEFT JOIN storage_facilities sf ON b.facility_id = sf.id
      WHERE b.id = ?
    `).get(id);

    res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, error: 'Failed to create booking' });
  }
});

// GET /api/bookings/:id
router.get('/:id', (req, res) => {
  try {
    const booking = db.prepare(`
      SELECT b.*, sf.facility_name, sf.county, sf.location
      FROM bookings b
      LEFT JOIN storage_facilities sf ON b.facility_id = sf.id
      WHERE b.id = ?
    `).get(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch booking' });
  }
});

module.exports = router;
