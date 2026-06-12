const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db/schema');

// GET /api/bookings
router.get('/', (req, res) => {
  try {
    const bookings = db.prepare(`
      SELECT b.*, sf.facility_name, sf.county, sf.phone as facility_phone
      FROM bookings b
      LEFT JOIN storage_facilities sf ON b.facility_id = sf.id
      ORDER BY b.created_at DESC
    `).all();
    res.json({ success: true, data: bookings, count: bookings.length });
  } catch (err) {
    console.error('GET /api/bookings error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
  }
});

// GET /api/bookings/:id
router.get('/:id', (req, res) => {
  try {
    const booking = db.prepare(`
      SELECT b.*, sf.facility_name, sf.county, sf.phone as facility_phone
      FROM bookings b
      LEFT JOIN storage_facilities sf ON b.facility_id = sf.id
      WHERE b.id = ?
    `).get(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (err) {
    console.error('GET /api/bookings/:id error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch booking' });
  }
});

// POST /api/bookings
router.post('/', (req, res) => {
  try {
    const {
      farmer_name, farmer_phone, facility_id,
      produce_type, quantity_tons, start_date, end_date
    } = req.body;

    // Validate required fields
    if (!farmer_name || !farmer_phone || !facility_id || !produce_type || !quantity_tons || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required: farmer_name, farmer_phone, facility_id, produce_type, quantity_tons, start_date, end_date'
      });
    }

    // Validate dates
    const startD = new Date(start_date);
    const endD = new Date(end_date);
    if (isNaN(startD.getTime()) || isNaN(endD.getTime())) {
      return res.status(400).json({ success: false, error: 'Invalid date format. Use YYYY-MM-DD.' });
    }
    if (endD <= startD) {
      return res.status(400).json({ success: false, error: 'end_date must be after start_date.' });
    }

    // Check facility exists
    const facility = db.prepare('SELECT * FROM storage_facilities WHERE id = ?').get(facility_id);
    if (!facility) {
      return res.status(404).json({ success: false, error: 'Facility not found' });
    }

    // Validate quantity
    const qty = parseFloat(quantity_tons);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ success: false, error: 'quantity_tons must be a positive number' });
    }
    if (qty > facility.available_space_tons) {
      return res.status(400).json({
        success: false,
        error: `Requested quantity (${qty} tons) exceeds available space (${facility.available_space_tons} tons) at this facility.`
      });
    }

    // Create booking and update space atomically
    const id = uuidv4();
    const created_at = new Date().toISOString();

    const createBooking = db.transaction(() => {
      db.prepare(`
        INSERT INTO bookings
          (id, farmer_name, farmer_phone, facility_id, produce_type,
           quantity_tons, start_date, end_date, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
      `).run(
        id,
        farmer_name.trim(),
        farmer_phone.trim(),
        facility_id,
        produce_type.trim(),
        qty,
        start_date,
        end_date,
        created_at
      );

      db.prepare('UPDATE storage_facilities SET available_space_tons = available_space_tons - ? WHERE id = ?')
        .run(qty, facility_id);
    });

    createBooking();

    const booking = db.prepare(`
      SELECT b.*, sf.facility_name, sf.county, sf.phone as facility_phone
      FROM bookings b
      LEFT JOIN storage_facilities sf ON b.facility_id = sf.id
      WHERE b.id = ?
    `).get(id);

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    console.error('POST /api/bookings error:', err);
    res.status(500).json({ success: false, error: 'Failed to create booking. Please try again.' });
  }
});

module.exports = router;
