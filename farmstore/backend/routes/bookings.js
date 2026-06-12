const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db/schema');

// GET /api/bookings
router.get('/', (req, res) => {
  try {
    const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
    res.json({ success: true, data: bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
  }
});

// GET /api/bookings/:id
router.get('/:id', (req, res) => {
  try {
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (err) {
    console.error(err);
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

    if (!farmer_name || !farmer_phone || !facility_id || !produce_type || !quantity_tons || !start_date || !end_date) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const facility = db.prepare('SELECT * FROM storage_facilities WHERE id = ?').get(facility_id);
    if (!facility) {
      return res.status(404).json({ success: false, error: 'Facility not found' });
    }

    const qty = parseFloat(quantity_tons);
    if (qty > facility.available_space_tons) {
      return res.status(400).json({
        success: false,
        error: `Requested quantity (${qty}t) exceeds available space (${facility.available_space_tons}t)`
      });
    }

    const id = uuidv4();
    const created_at = new Date().toISOString();

    const createBooking = db.transaction(() => {
      db.prepare(`
        INSERT INTO bookings
          (id, farmer_name, farmer_phone, facility_id, produce_type,
           quantity_tons, start_date, end_date, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?)
      `).run(id, farmer_name, farmer_phone, facility_id, produce_type, qty, start_date, end_date, created_at);

      db.prepare('UPDATE storage_facilities SET available_space_tons = available_space_tons - ? WHERE id = ?')
        .run(qty, facility_id);
    });

    createBooking();

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to create booking' });
  }
});

module.exports = router;
