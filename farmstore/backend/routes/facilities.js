const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db/schema');

function parseFacility(facility) {
  if (!facility) return null;
  return { ...facility, produce_types: JSON.parse(facility.produce_types || '[]') };
}

// GET /api/facilities
router.get('/', (req, res) => {
  try {
    const { county, produce_type, min_space } = req.query;
    let query = 'SELECT * FROM storage_facilities WHERE 1=1';
    const params = [];

    if (county) { query += ' AND LOWER(county) = LOWER(?)'; params.push(county); }
    if (min_space) { query += ' AND available_space_tons >= ?'; params.push(parseFloat(min_space)); }
    query += ' ORDER BY created_at DESC';

    let facilities = db.all(query, params).map(parseFacility);

    if (produce_type) {
      const pt = produce_type.toLowerCase();
      facilities = facilities.filter(f => f.produce_types.some(p => p.toLowerCase().includes(pt)));
    }

    res.json({ success: true, data: facilities, count: facilities.length });
  } catch (err) {
    console.error('GET /api/facilities error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch facilities' });
  }
});

// GET /api/facilities/:id
router.get('/:id', (req, res) => {
  try {
    const facility = db.get('SELECT * FROM storage_facilities WHERE id = ?', [req.params.id]);
    if (!facility) return res.status(404).json({ success: false, error: 'Facility not found' });
    res.json({ success: true, data: parseFacility(facility) });
  } catch (err) {
    console.error('GET /api/facilities/:id error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch facility' });
  }
});

// POST /api/facilities
router.post('/', (req, res) => {
  try {
    const {
      owner_name, facility_name, location, county, latitude, longitude,
      capacity_tons, available_space_tons, price_per_day, price_per_week,
      price_per_month, produce_types, description, phone, email
    } = req.body;

    if (!owner_name || !facility_name || !location || !county)
      return res.status(400).json({ success: false, error: 'Missing required fields: owner_name, facility_name, location, county' });
    if (!capacity_tons || isNaN(parseFloat(capacity_tons)))
      return res.status(400).json({ success: false, error: 'capacity_tons must be a valid number' });
    if (!price_per_day || !price_per_week || !price_per_month)
      return res.status(400).json({ success: false, error: 'All price fields are required' });

    const id = uuidv4();
    const created_at = new Date().toISOString();
    const cap = parseFloat(capacity_tons);
    const availSpace = available_space_tons !== undefined && available_space_tons !== '' ? parseFloat(available_space_tons) : cap;
    const produceTypesJson = JSON.stringify(Array.isArray(produce_types) ? produce_types : []);

    db.run(`
      INSERT INTO storage_facilities
        (id, owner_name, facility_name, location, county, latitude, longitude,
         capacity_tons, available_space_tons, price_per_day, price_per_week,
         price_per_month, produce_types, description, phone, email, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, owner_name.trim(), facility_name.trim(), location.trim(), county.trim(),
        latitude ? parseFloat(latitude) : null, longitude ? parseFloat(longitude) : null,
        cap, availSpace, parseFloat(price_per_day), parseFloat(price_per_week), parseFloat(price_per_month),
        produceTypesJson, description ? description.trim() : '', phone ? phone.trim() : '', email ? email.trim() : '', created_at]);

    const newFacility = db.get('SELECT * FROM storage_facilities WHERE id = ?', [id]);
    res.status(201).json({ success: true, data: parseFacility(newFacility) });
  } catch (err) {
    console.error('POST /api/facilities error:', err);
    res.status(500).json({ success: false, error: 'Failed to create facility listing' });
  }
});

// PUT /api/facilities/:id/space
router.put('/:id/space', (req, res) => {
  try {
    const { available_space_tons } = req.body;
    if (available_space_tons === undefined || available_space_tons === null)
      return res.status(400).json({ success: false, error: 'available_space_tons is required' });

    const newSpace = parseFloat(available_space_tons);
    if (isNaN(newSpace) || newSpace < 0)
      return res.status(400).json({ success: false, error: 'available_space_tons must be a non-negative number' });

    const facility = db.get('SELECT * FROM storage_facilities WHERE id = ?', [req.params.id]);
    if (!facility) return res.status(404).json({ success: false, error: 'Facility not found' });
    if (newSpace > facility.capacity_tons)
      return res.status(400).json({ success: false, error: `available_space_tons cannot exceed capacity_tons (${facility.capacity_tons})` });

    db.run('UPDATE storage_facilities SET available_space_tons = ? WHERE id = ?', [newSpace, req.params.id]);
    const updated = db.get('SELECT * FROM storage_facilities WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: parseFacility(updated) });
  } catch (err) {
    console.error('PUT /api/facilities/:id/space error:', err);
    res.status(500).json({ success: false, error: 'Failed to update available space' });
  }
});

module.exports = router;
