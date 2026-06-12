import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const API = 'http://localhost:3001';

const PRODUCE_COLORS = {
  Maize:'#A16207',Wheat:'#92400E',Rice:'#1D4ED8',Potatoes:'#374151',
  Beans:'#9D174D',Coffee:'#6B21A8',Tea:'#065F46',Vegetables:'#15803D',
  Fruits:'#BE123C',Sunflower:'#B45309',Barley:'#92400E',Fish:'#1E40AF',Other:'#374151',
};

function getDays(start, end) {
  if (!start || !end) return 0;
  const diff = new Date(end) - new Date(start);
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function calcCost(facility, days, qty) {
  if (!facility || !days || !qty) return 0;
  let rate;
  if (days >= 30) rate = (facility.price_per_month / 30) * days;
  else if (days >= 7) rate = (facility.price_per_week / 7) * days;
  else rate = facility.price_per_day * days;
  return Math.round(rate);
}

export default function FacilityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState({ farmer_name: '', farmer_phone: '', produce_type: '', quantity_tons: '', start_date: '', end_date: '' });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/facilities/${id}`)
      .then(r => r.json())
      .then(data => { if (data.success) setFacility(data.data); else setError('Facility not found'); })
      .catch(() => setError('Failed to load facility'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleBook(e) {
    e.preventDefault();
    setBookingError('');
    if (!booking.farmer_name || !booking.farmer_phone || !booking.produce_type || !booking.quantity_tons || !booking.start_date || !booking.end_date) {
      setBookingError('Please fill in all fields.');
      return;
    }
    if (new Date(booking.end_date) <= new Date(booking.start_date)) {
      setBookingError('End date must be after start date.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...booking, facility_id: id, quantity_tons: parseFloat(booking.quantity_tons) }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingSuccess(data.data);
        setFacility(prev => ({ ...prev, available_space_tons: prev.available_space_tons - parseFloat(booking.quantity_tons) }));
      } else {
        setBookingError(data.message || 'Booking failed. Please try again.');
      }
    } catch {
      setBookingError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px 20px', color: '#6B7280' }}>
      <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
      <p>Loading facility details...</p>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>❌</div>
      <h2 style={{ marginBottom: 8, color: '#374151' }}>{error}</h2>
      <Link to="/search" style={{ color: '#2D5016', fontWeight: 600 }}>← Back to Search</Link>
    </div>
  );

  const types = Array.isArray(facility.produce_types) ? facility.produce_types : JSON.parse(facility.produce_types || '[]');
  const spacePct = facility.capacity_tons > 0 ? (facility.available_space_tons / facility.capacity_tons) * 100 : 0;
  const spaceColor = spacePct > 50 ? '#16A34A' : spacePct > 20 ? '#D97706' : '#DC2626';
  const days = getDays(booking.start_date, booking.end_date);
  const estimatedCost = calcCost(facility, days, booking.quantity_tons);

  return (
    <div>
      {/* Hero header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a0f 0%, #2D5016 50%, #8B6914 100%)',
        padding: '48px 0',
      }}>
        <div className="container">
          <Link to="/search" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16, textDecoration: 'none' }}>
            ← Back to Search
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: 'Merriweather, serif', color: '#fff', fontSize: '2rem', marginBottom: 6 }}>{facility.facility_name}</h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem' }}>👤 {facility.owner_name} · 📍 {facility.location}, {facility.county}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#F5C842', fontFamily: 'Merriweather, serif', fontSize: '1.6rem', fontWeight: 700 }}>
                KES {facility.price_per_month.toLocaleString()}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>per month</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 32, alignItems: 'start' }}>
          {/* Left: Details */}
          <div>
            {/* About */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, marginBottom: 24, border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontFamily: 'Merriweather, serif', fontSize: '1.1rem', color: '#2D5016', marginBottom: 14 }}>About This Facility</h2>
              <p style={{ color: '#4B5563', lineHeight: 1.7, fontSize: '0.95rem' }}>{facility.description || 'No description provided.'}</p>
            </div>

            {/* Capacity */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, marginBottom: 24, border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontFamily: 'Merriweather, serif', fontSize: '1.1rem', color: '#2D5016', marginBottom: 16 }}>Storage Capacity</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div style={{ background: '#F9FAFB', borderRadius: 10, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2D5016' }}>{facility.capacity_tons.toLocaleString()}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: 2 }}>Total Capacity (tons)</div>
                </div>
                <div style={{ background: '#F9FAFB', borderRadius: 10, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: spaceColor }}>{facility.available_space_tons.toLocaleString()}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: 2 }}>Available Now (tons)</div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6B7280', marginBottom: 6 }}>
                  <span>Space Availability</span>
                  <span style={{ fontWeight: 700, color: spaceColor }}>{spacePct.toFixed(0)}% free</span>
                </div>
                <div style={{ background: '#E5E7EB', borderRadius: 10, height: 10, overflow: 'hidden' }}>
                  <div style={{ width: `${spacePct}%`, height: '100%', background: spaceColor, borderRadius: 10 }} />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, marginBottom: 24, border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontFamily: 'Merriweather, serif', fontSize: '1.1rem', color: '#2D5016', marginBottom: 16 }}>Pricing (KES)</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {[
                  { label: 'Per Day', value: facility.price_per_day, icon: '📅' },
                  { label: 'Per Week', value: facility.price_per_week, icon: '📆' },
                  { label: 'Per Month', value: facility.price_per_month, icon: '🗓️' },
                ].map(({ label, value, icon }) => (
                  <div key={label} style={{ background: '#F9FAFB', borderRadius: 10, padding: '16px 12px', textAlign: 'center', border: '1px solid #F3F4F6' }}>
                    <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{icon}</div>
                    <div style={{ fontSize: '0.72rem', color: '#6B7280', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2D5016' }}>{value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accepted produce */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, marginBottom: 24, border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontFamily: 'Merriweather, serif', fontSize: '1.1rem', color: '#2D5016', marginBottom: 14 }}>Accepted Produce Types</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {types.map(t => (
                  <span key={t} style={{
                    padding: '6px 16px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600,
                    background: (PRODUCE_COLORS[t] || '#6B7280') + '18',
                    color: PRODUCE_COLORS[t] || '#6B7280',
                    border: `1.5px solid ${(PRODUCE_COLORS[t] || '#6B7280')}33`,
                  }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontFamily: 'Merriweather, serif', fontSize: '1.1rem', color: '#2D5016', marginBottom: 16 }}>Contact Owner</h2>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {facility.phone && (
                  <a href={`tel:${facility.phone}`} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: '#DCFCE7', color: '#15803D',
                    padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
                  }}>
                    📞 {facility.phone}
                  </a>
                )}
                {facility.email && (
                  <a href={`mailto:${facility.email}`} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: '#DBEAFE', color: '#1D4ED8',
                    padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
                  }}>
                    ✉️ {facility.email}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div id="book" style={{ position: 'sticky', top: 80 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '2px solid #2D5016', boxShadow: '0 4px 20px rgba(45,80,22,0.12)' }}>
              <h2 style={{ fontFamily: 'Merriweather, serif', fontSize: '1.2rem', color: '#2D5016', marginBottom: 4 }}>Book Storage</h2>
              <p style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: 20 }}>Fill in your details to reserve space at this facility.</p>

              {bookingSuccess ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
                  <h3 style={{ fontFamily: 'Merriweather, serif', color: '#15803D', marginBottom: 8 }}>Booking Confirmed!</h3>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: 4 }}>
                    <strong>Booking ID:</strong> {bookingSuccess.id}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: 4 }}>
                    <strong>Produce:</strong> {bookingSuccess.produce_type} · {bookingSuccess.quantity_tons} tons
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: 16 }}>
                    <strong>Dates:</strong> {bookingSuccess.start_date} → {bookingSuccess.end_date}
                  </p>
                  <p style={{ fontSize: '0.82rem', background: '#DCFCE7', color: '#15803D', padding: '10px 14px', borderRadius: 8, marginBottom: 20 }}>
                    Contact the owner to confirm arrival: <strong>{facility.phone}</strong>
                  </p>
                  <Link to="/bookings" style={{
                    display: 'block', background: '#2D5016', color: '#fff',
                    padding: '11px', borderRadius: 8, fontWeight: 600, textAlign: 'center', textDecoration: 'none',
                  }}>
                    View My Bookings
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleBook}>
                  {bookingError && (
                    <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 16 }}>
                      {bookingError}
                    </div>
                  )}
                  {[
                    { label: 'Your Name', key: 'farmer_name', type: 'text', placeholder: 'e.g. John Kamau' },
                    { label: 'Phone Number', key: 'farmer_phone', type: 'tel', placeholder: 'e.g. +254 700 000 000' },
                    { label: 'Quantity (tons)', key: 'quantity_tons', type: 'number', placeholder: `Max: ${facility.available_space_tons}` },
                    { label: 'Start Date', key: 'start_date', type: 'date' },
                    { label: 'End Date', key: 'end_date', type: 'date' },
                  ].map(f => (
                    <div key={f.key} style={{ marginBottom: 14 }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>{f.label}</label>
                      <input
                        type={f.type} placeholder={f.placeholder}
                        value={booking[f.key]}
                        onChange={e => setBooking(p => ({ ...p, [f.key]: e.target.value }))}
                        min={f.type === 'number' ? 0 : f.key === 'end_date' ? booking.start_date : undefined}
                        max={f.type === 'number' ? facility.available_space_tons : undefined}
                        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #D1D5DB', borderRadius: 8, fontSize: '0.9rem' }}
                      />
                    </div>
                  ))}

                  {/* Produce type select */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>Produce Type</label>
                    <select
                      value={booking.produce_type}
                      onChange={e => setBooking(p => ({ ...p, produce_type: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #D1D5DB', borderRadius: 8, fontSize: '0.9rem', background: '#fff' }}
                    >
                      <option value="">Select produce type...</option>
                      {types.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Cost estimate */}
                  {days > 0 && booking.quantity_tons && (
                    <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '12px 14px', marginBottom: 16 }}>
                      <div style={{ fontSize: '0.78rem', color: '#15803D', marginBottom: 4 }}>Estimated Cost ({days} days)</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2D5016' }}>KES {estimatedCost.toLocaleString()}</div>
                    </div>
                  )}

                  <button type="submit" disabled={submitting} style={{
                    width: '100%', background: submitting ? '#6B7280' : '#2D5016', color: '#fff',
                    padding: '13px', borderRadius: 8, fontWeight: 700, fontSize: '1rem',
                    cursor: submitting ? 'not-allowed' : 'pointer', border: 'none',
                  }}>
                    {submitting ? 'Processing...' : '✅ Confirm Booking'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){
        .container > div[style*="grid-template-columns: 1fr 400px"] {
          grid-template-columns: 1fr !important;
        }
      }`}</style>
    </div>
  );
}
