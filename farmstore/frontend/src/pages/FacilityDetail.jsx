import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const PRODUCE_COLORS = {
  Maize: '#A16207', Wheat: '#92400E', Rice: '#1D4ED8', Potatoes: '#374151',
  Beans: '#9D174D', Coffee: '#6B21A8', Tea: '#065F46', Vegetables: '#15803D',
  Fruits: '#BE123C', Sunflower: '#B45309', Barley: '#92400E', Fish: '#1E40AF',
  Dairy: '#0369A1', Other: '#374151',
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

  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [booking, setBooking] = useState({
    farmer_name: '',
    farmer_phone: '',
    produce_type: '',
    quantity_tons: '',
    start_date: '',
    end_date: '',
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get(`/api/facilities/${id}`)
      .then(res => {
        if (res.data.success) setFacility(res.data.data);
        else setFetchError('Facility not found');
      })
      .catch(() => setFetchError('Failed to load facility. Please check your connection.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Scroll to booking form if #book hash
  useEffect(() => {
    if (window.location.hash === '#book') {
      setTimeout(() => {
        const el = document.getElementById('book');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }
  }, [facility]);

  async function handleBook(e) {
    e.preventDefault();
    setBookingError('');

    const { farmer_name, farmer_phone, produce_type, quantity_tons, start_date, end_date } = booking;

    if (!farmer_name || !farmer_phone || !produce_type || !quantity_tons || !start_date || !end_date) {
      setBookingError('Please fill in all required fields.');
      return;
    }

    const qty = parseFloat(quantity_tons);
    if (isNaN(qty) || qty <= 0) {
      setBookingError('Quantity must be a positive number.');
      return;
    }
    if (qty > facility.available_space_tons) {
      setBookingError(`Quantity (${qty} tons) exceeds available space (${facility.available_space_tons} tons).`);
      return;
    }
    if (new Date(end_date) <= new Date(start_date)) {
      setBookingError('End date must be after start date.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post('/api/bookings', {
        ...booking,
        facility_id: id,
        quantity_tons: qty,
      });
      if (res.data.success) {
        setBookingSuccess(res.data.data);
        setShowModal(true);
        // Update local available space
        setFacility(prev => ({
          ...prev,
          available_space_tons: prev.available_space_tons - qty,
        }));
      }
    } catch (err) {
      setBookingError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Booking failed. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ===== Loading State =====
  if (loading) return (
    <div style={{ textAlign: 'center', padding: '100px 20px', color: '#6B7280' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 16, animation: 'pulse 1.5s ease infinite' }}>⏳</div>
      <p style={{ fontSize: '1rem' }}>Loading facility details...</p>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );

  // ===== Error State =====
  if (fetchError) return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>❌</div>
      <h2 style={{ fontFamily: 'Merriweather, serif', marginBottom: 10, color: '#374151' }}>{fetchError}</h2>
      <Link to="/search" style={{ color: '#2D5016', fontWeight: 600, fontSize: '0.95rem' }}>
        ← Back to Search
      </Link>
    </div>
  );

  const types = Array.isArray(facility.produce_types)
    ? facility.produce_types
    : JSON.parse(facility.produce_types || '[]');

  const spacePct = facility.capacity_tons > 0
    ? (facility.available_space_tons / facility.capacity_tons) * 100
    : 0;
  const spaceColor = spacePct > 50 ? '#16A34A' : spacePct > 20 ? '#D97706' : '#DC2626';

  const days = getDays(booking.start_date, booking.end_date);
  const estimatedCost = calcCost(facility, days, booking.quantity_tons);

  return (
    <div style={{ background: '#FDF8EF', minHeight: '100vh' }}>
      {/* ===== Hero Header ===== */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a0f 0%, #2D5016 50%, #8B6914 100%)',
        padding: '48px 0 44px',
      }}>
        <div className="container">
          <Link to="/search" style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.85rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 20,
            textDecoration: 'none',
            transition: 'color 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#F5C842'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          >
            ← Back to Search
          </Link>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 20,
          }}>
            <div>
              <h1 style={{
                fontFamily: 'Merriweather, serif',
                color: '#fff',
                fontSize: 'clamp(1.5rem, 4vw, 2.1rem)',
                marginBottom: 8,
                lineHeight: 1.2,
              }}>
                {facility.facility_name}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                👤 {facility.owner_name} &nbsp;·&nbsp; 📍 {facility.location}, {facility.county}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                color: '#F5C842',
                fontFamily: 'Merriweather, serif',
                fontSize: '1.7rem',
                fontWeight: 700,
                lineHeight: 1,
              }}>
                KES {facility.price_per_month.toLocaleString()}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', marginTop: 4 }}>
                per month
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Content Grid ===== */}
      <div className="container" style={{ padding: '36px 20px 60px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: 32,
          alignItems: 'start',
        }}
          className="detail-grid"
        >
          {/* ===== Left Column: Facility Info ===== */}
          <div>
            {/* About */}
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 28,
              marginBottom: 24,
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <h2 style={{
                fontFamily: 'Merriweather, serif',
                fontSize: '1.05rem',
                color: '#2D5016',
                marginBottom: 14,
              }}>
                About This Facility
              </h2>
              <p style={{ color: '#4B5563', lineHeight: 1.75, fontSize: '0.94rem' }}>
                {facility.description || 'No description provided by the owner.'}
              </p>
            </div>

            {/* Capacity */}
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 28,
              marginBottom: 24,
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <h2 style={{
                fontFamily: 'Merriweather, serif',
                fontSize: '1.05rem',
                color: '#2D5016',
                marginBottom: 18,
              }}>
                Storage Capacity
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                marginBottom: 20,
              }}>
                <div style={{
                  background: '#F9FAFB',
                  borderRadius: 12,
                  padding: '18px 16px',
                  textAlign: 'center',
                  border: '1px solid #F0F0F0',
                }}>
                  <div style={{
                    fontSize: '1.7rem',
                    fontWeight: 800,
                    color: '#2D5016',
                    fontFamily: 'Merriweather, serif',
                  }}>
                    {facility.capacity_tons.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: 4 }}>
                    Total Capacity (tons)
                  </div>
                </div>
                <div style={{
                  background: '#F9FAFB',
                  borderRadius: 12,
                  padding: '18px 16px',
                  textAlign: 'center',
                  border: '1px solid #F0F0F0',
                }}>
                  <div style={{
                    fontSize: '1.7rem',
                    fontWeight: 800,
                    color: spaceColor,
                    fontFamily: 'Merriweather, serif',
                  }}>
                    {facility.available_space_tons.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: 4 }}>
                    Available Now (tons)
                  </div>
                </div>
              </div>
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: '#6B7280',
                  marginBottom: 7,
                }}>
                  <span>Space Availability</span>
                  <span style={{ fontWeight: 700, color: spaceColor }}>{spacePct.toFixed(0)}% free</span>
                </div>
                <div style={{ background: '#E5E7EB', borderRadius: 10, height: 10, overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.max(spacePct, 1)}%`,
                    height: '100%',
                    background: spaceColor,
                    borderRadius: 10,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 28,
              marginBottom: 24,
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <h2 style={{
                fontFamily: 'Merriweather, serif',
                fontSize: '1.05rem',
                color: '#2D5016',
                marginBottom: 18,
              }}>
                Pricing (KES)
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {[
                  { label: 'Per Day', value: facility.price_per_day, icon: '📅', note: 'Minimum 1 day' },
                  { label: 'Per Week', value: facility.price_per_week, icon: '📆', note: '7-29 days' },
                  { label: 'Per Month', value: facility.price_per_month, icon: '🗓️', note: '30+ days' },
                ].map(({ label, value, icon, note }) => (
                  <div key={label} style={{
                    background: '#F9FAFB',
                    borderRadius: 12,
                    padding: '18px 12px',
                    textAlign: 'center',
                    border: '1px solid #F0F0F0',
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{icon}</div>
                    <div style={{ fontSize: '0.7rem', color: '#6B7280', marginBottom: 4 }}>{label}</div>
                    <div style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#2D5016',
                      fontFamily: 'Merriweather, serif',
                    }}>
                      {value.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#9CA3AF', marginTop: 3 }}>{note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accepted Produce */}
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 28,
              marginBottom: 24,
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <h2 style={{
                fontFamily: 'Merriweather, serif',
                fontSize: '1.05rem',
                color: '#2D5016',
                marginBottom: 16,
              }}>
                Accepted Produce Types
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {types.map(t => (
                  <span key={t} style={{
                    padding: '7px 18px',
                    borderRadius: 24,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: ((PRODUCE_COLORS[t] || '#6B7280') + '18'),
                    color: PRODUCE_COLORS[t] || '#6B7280',
                    border: `1.5px solid ${(PRODUCE_COLORS[t] || '#6B7280')}30`,
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Owner */}
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 28,
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <h2 style={{
                fontFamily: 'Merriweather, serif',
                fontSize: '1.05rem',
                color: '#2D5016',
                marginBottom: 16,
              }}>
                Contact Owner
              </h2>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {facility.phone && (
                  <a href={`tel:${facility.phone}`} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#DCFCE7',
                    color: '#15803D',
                    padding: '11px 20px',
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#BBF7D0'}
                    onMouseLeave={e => e.currentTarget.style.background = '#DCFCE7'}
                  >
                    📞 {facility.phone}
                  </a>
                )}
                {facility.email && (
                  <a href={`mailto:${facility.email}`} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#DBEAFE',
                    color: '#1D4ED8',
                    padding: '11px 20px',
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#BFDBFE'}
                    onMouseLeave={e => e.currentTarget.style.background = '#DBEAFE'}
                  >
                    ✉️ {facility.email}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ===== Right Column: Booking Form ===== */}
          <div id="book" style={{ position: 'sticky', top: 82 }}>
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 28,
              border: '2px solid #2D5016',
              boxShadow: '0 6px 24px rgba(45,80,22,0.13)',
            }}>
              <h2 style={{
                fontFamily: 'Merriweather, serif',
                fontSize: '1.2rem',
                color: '#2D5016',
                marginBottom: 5,
              }}>
                Book Storage Space
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: 22, lineHeight: 1.5 }}>
                Fill in your details to reserve storage at this facility.
              </p>

              {/* Booking Error */}
              {bookingError && (
                <div style={{
                  background: '#FEE2E2',
                  color: '#B91C1C',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  marginBottom: 16,
                  border: '1px solid #FECACA',
                }}>
                  ⚠️ {bookingError}
                </div>
              )}

              {/* Booking Form */}
              {!bookingSuccess && (
                <form onSubmit={handleBook}>
                  {/* Farmer Name */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Mwangi"
                      value={booking.farmer_name}
                      onChange={e => setBooking(p => ({ ...p, farmer_name: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #D1D5DB', borderRadius: 8, fontSize: '0.9rem', outline: 'none' }}
                      onFocus={e => { e.target.style.borderColor = '#2D5016'; e.target.style.boxShadow = '0 0 0 3px rgba(45,80,22,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {/* Phone */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +254 700 000 000"
                      value={booking.farmer_phone}
                      onChange={e => setBooking(p => ({ ...p, farmer_phone: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #D1D5DB', borderRadius: 8, fontSize: '0.9rem', outline: 'none' }}
                      onFocus={e => { e.target.style.borderColor = '#2D5016'; e.target.style.boxShadow = '0 0 0 3px rgba(45,80,22,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {/* Produce Type */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>
                      Produce Type *
                    </label>
                    <select
                      value={booking.produce_type}
                      onChange={e => setBooking(p => ({ ...p, produce_type: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #D1D5DB', borderRadius: 8, fontSize: '0.9rem', background: '#fff', outline: 'none', cursor: 'pointer' }}
                      onFocus={e => { e.target.style.borderColor = '#2D5016'; e.target.style.boxShadow = '0 0 0 3px rgba(45,80,22,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                    >
                      <option value="">Select produce type...</option>
                      {types.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>
                      Quantity (tons) * <span style={{ fontWeight: 400, color: '#9CA3AF' }}>max: {facility.available_space_tons}</span>
                    </label>
                    <input
                      type="number"
                      placeholder={`e.g. ${Math.min(10, facility.available_space_tons)}`}
                      value={booking.quantity_tons}
                      onChange={e => setBooking(p => ({ ...p, quantity_tons: e.target.value }))}
                      min="0.1"
                      max={facility.available_space_tons}
                      step="0.1"
                      required
                      style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #D1D5DB', borderRadius: 8, fontSize: '0.9rem', outline: 'none' }}
                      onFocus={e => { e.target.style.borderColor = '#2D5016'; e.target.style.boxShadow = '0 0 0 3px rgba(45,80,22,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {/* Start Date */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={booking.start_date}
                      onChange={e => setBooking(p => ({ ...p, start_date: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #D1D5DB', borderRadius: 8, fontSize: '0.9rem', outline: 'none' }}
                      onFocus={e => { e.target.style.borderColor = '#2D5016'; e.target.style.boxShadow = '0 0 0 3px rgba(45,80,22,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {/* End Date */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={booking.end_date}
                      onChange={e => setBooking(p => ({ ...p, end_date: e.target.value }))}
                      min={booking.start_date || new Date().toISOString().split('T')[0]}
                      required
                      style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #D1D5DB', borderRadius: 8, fontSize: '0.9rem', outline: 'none' }}
                      onFocus={e => { e.target.style.borderColor = '#2D5016'; e.target.style.boxShadow = '0 0 0 3px rgba(45,80,22,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#D1D5DB'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {/* Cost Estimate */}
                  {days > 0 && booking.quantity_tons > 0 && (
                    <div style={{
                      background: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      borderRadius: 8,
                      padding: '12px 16px',
                      marginBottom: 16,
                    }}>
                      <div style={{ fontSize: '0.76rem', color: '#15803D', marginBottom: 4, fontWeight: 600 }}>
                        Estimated Cost ({days} day{days !== 1 ? 's' : ''})
                      </div>
                      <div style={{
                        fontSize: '1.35rem',
                        fontWeight: 800,
                        color: '#2D5016',
                        fontFamily: 'Merriweather, serif',
                      }}>
                        KES {estimatedCost.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: 2 }}>
                        Based on {days >= 30 ? 'monthly' : days >= 7 ? 'weekly' : 'daily'} rate
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: '100%',
                      background: submitting ? '#6B7280' : '#2D5016',
                      color: '#fff',
                      padding: '13px',
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: '1rem',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      border: 'none',
                      transition: 'background 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                    onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#1e3610'; }}
                    onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = '#2D5016'; }}
                  >
                    {submitting ? '⏳ Processing...' : '✅ Confirm Booking'}
                  </button>
                </form>
              )}

              {/* Inline success state in form area */}
              {bookingSuccess && !showModal && (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
                  <h3 style={{ fontFamily: 'Merriweather, serif', color: '#15803D', marginBottom: 8 }}>Booking Confirmed!</h3>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: 16 }}>
                    Booking ID: <strong>{bookingSuccess.id}</strong>
                  </p>
                  <Link to="/bookings" style={{
                    display: 'block',
                    background: '#2D5016',
                    color: '#fff',
                    padding: '11px',
                    borderRadius: 8,
                    fontWeight: 600,
                    textAlign: 'center',
                    textDecoration: 'none',
                  }}>
                    View My Bookings
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Success Modal ===== */}
      {showModal && bookingSuccess && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20,
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: '40px 36px',
            maxWidth: 500,
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            animation: 'slideUp 0.3s ease',
            textAlign: 'center',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #16A34A, #2D5016)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: '2.2rem',
            }}>
              ✅
            </div>
            <h2 style={{
              fontFamily: 'Merriweather, serif',
              fontSize: '1.6rem',
              color: '#2D5016',
              marginBottom: 10,
            }}>
              Booking Confirmed!
            </h2>
            <p style={{ color: '#6B7280', marginBottom: 6, fontSize: '0.9rem' }}>
              Your storage has been reserved successfully.
            </p>

            <div style={{
              background: '#F9FAFB',
              borderRadius: 12,
              padding: '16px',
              margin: '20px 0',
              textAlign: 'left',
              border: '1px solid #F0F0F0',
            }}>
              {[
                { label: 'Booking ID', value: bookingSuccess.id },
                { label: 'Farmer', value: bookingSuccess.farmer_name },
                { label: 'Produce', value: `${bookingSuccess.produce_type} · ${bookingSuccess.quantity_tons} tons` },
                { label: 'Period', value: `${bookingSuccess.start_date} → ${bookingSuccess.end_date}` },
                { label: 'Facility', value: facility.facility_name },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.83rem',
                  marginBottom: 8,
                  gap: 12,
                }}>
                  <span style={{ color: '#9CA3AF', flexShrink: 0 }}>{label}:</span>
                  <span style={{ color: '#374151', fontWeight: 600, textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: '#DCFCE7',
              color: '#15803D',
              padding: '10px 16px',
              borderRadius: 8,
              fontSize: '0.84rem',
              marginBottom: 22,
            }}>
              Contact the owner to confirm your arrival: <strong>{facility.phone}</strong>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: '11px',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  background: 'transparent',
                  color: '#6B7280',
                }}
              >
                Close
              </button>
              <Link to="/bookings" style={{
                flex: 1,
                padding: '11px',
                background: '#2D5016',
                color: '#fff',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                View Bookings
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
          }
          #book {
            position: static !important;
          }
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
