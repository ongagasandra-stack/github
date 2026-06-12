import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = 'http://localhost:3001';

const STATUS_STYLES = {
  confirmed: { bg: '#DCFCE7', color: '#15803D', label: '✅ Confirmed' },
  pending: { bg: '#FEF9C3', color: '#A16207', label: '⏳ Pending' },
  cancelled: { bg: '#FEE2E2', color: '#B91C1C', label: '❌ Cancelled' },
};

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getDurationDays(start, end) {
  if (!start || !end) return 0;
  const diff = new Date(end) - new Date(start);
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [facilities, setFacilities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/bookings`).then(r => r.json()),
      fetch(`${API}/api/facilities`).then(r => r.json()),
    ])
      .then(([bData, fData]) => {
        if (bData.success) setBookings(bData.data);
        else setError('Failed to load bookings.');

        if (fData.success) {
          const map = {};
          fData.data.forEach(f => { map[f.id] = f; });
          setFacilities(map);
        }
      })
      .catch(() => setError('Network error. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#FDF8EF' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a0f 0%, #2D5016 60%, #3d6b20 100%)',
        padding: '48px 0 40px',
      }}>
        <div className="container" style={{ padding: '0 20px' }}>
          <h1 style={{ fontFamily: 'Merriweather, serif', color: '#fff', fontSize: '2rem', marginBottom: 8 }}>
            My Bookings
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem' }}>
            View all storage bookings made through FarmStore.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '36px 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🌿</div>
            <p style={{ color: '#6B7280', fontSize: '1rem' }}>Loading bookings...</p>
          </div>
        ) : error ? (
          <div style={{
            background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 12,
            padding: '20px 24px', color: '#B91C1C', textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>⚠️</div>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>{error}</p>
            <p style={{ fontSize: '0.85rem' }}>Make sure the backend server is running on port 3001.</p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#FFFFFF', borderRadius: 16, border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>📋</div>
            <h2 style={{ fontFamily: 'Merriweather, serif', color: '#2D5016', marginBottom: 10 }}>No Bookings Yet</h2>
            <p style={{ color: '#6B7280', marginBottom: 28 }}>No storage bookings have been made yet. Start by finding a facility!</p>
            <Link to="/search" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', background: '#2D5016', color: '#FFFFFF',
              borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: '1rem',
            }}>
              🔍 Find Storage Facilities
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Merriweather, serif', fontSize: '1.2rem', color: '#1A1A1A' }}>
                {bookings.length} Booking{bookings.length !== 1 ? 's' : ''} Total
              </h2>
              <Link to="/search" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '9px 18px', background: '#2D5016', color: '#FFFFFF',
                borderRadius: 8, fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none',
              }}>
                + New Booking
              </Link>
            </div>

            {/* Desktop Table */}
            <div style={{
              background: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB',
              display: 'none',
            }} className="bookings-table">
            </div>

            {/* Mobile/Responsive Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {bookings.map(booking => {
                const facility = facilities[booking.facility_id];
                const statusStyle = STATUS_STYLES[booking.status] || STATUS_STYLES.confirmed;
                const days = getDurationDays(booking.start_date, booking.end_date);

                return (
                  <div key={booking.id} style={{
                    background: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB',
                    transition: 'box-shadow 0.2s ease',
                  }}>
                    {/* Card Header */}
                    <div style={{
                      background: 'linear-gradient(135deg, #2D5016, #3d6b20)',
                      padding: '16px 20px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10,
                    }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', fontWeight: 600, letterSpacing: '0.5px', marginBottom: 4 }}>
                          BOOKING ID
                        </div>
                        <div style={{ color: '#F5C842', fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 700 }}>
                          {booking.id}
                        </div>
                      </div>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        padding: '5px 14px', borderRadius: 20,
                        fontSize: '0.78rem', fontWeight: 700,
                        background: statusStyle.bg, color: statusStyle.color,
                      }}>
                        {statusStyle.label}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '20px 22px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>

                        {/* Facility Info */}
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Facility</div>
                          {facility ? (
                            <>
                              <Link to={`/facilities/${facility.id}`} style={{
                                fontWeight: 700, color: '#2D5016', fontSize: '1rem',
                                textDecoration: 'none', display: 'block', marginBottom: 3,
                              }}>
                                {facility.facility_name}
                              </Link>
                              <div style={{ fontSize: '0.82rem', color: '#6B7280' }}>📍 {facility.location}</div>
                              <div style={{ fontSize: '0.82rem', color: '#6B7280' }}>👤 {facility.owner_name}</div>
                            </>
                          ) : (
                            <span style={{ color: '#9CA3AF', fontSize: '0.88rem' }}>Facility #{booking.facility_id}</span>
                          )}
                        </div>

                        {/* Farmer Info */}
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Farmer</div>
                          <div style={{ fontWeight: 700, color: '#1A1A1A', marginBottom: 3 }}>{booking.farmer_name}</div>
                          <div style={{ fontSize: '0.82rem', color: '#6B7280' }}>📞 {booking.farmer_phone}</div>
                        </div>

                        {/* Produce & Quantity */}
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Produce</div>
                          <div style={{ fontWeight: 700, color: '#1A1A1A', marginBottom: 3 }}>{booking.produce_type}</div>
                          <div style={{ fontSize: '0.82rem', color: '#6B7280' }}>🌾 {booking.quantity_tons} tons</div>
                        </div>

                        {/* Dates */}
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Storage Period</div>
                          <div style={{ fontWeight: 600, color: '#1A1A1A', fontSize: '0.9rem', marginBottom: 3 }}>
                            {formatDate(booking.start_date)} → {formatDate(booking.end_date)}
                          </div>
                          <div style={{
                            display: 'inline-flex', alignItems: 'center',
                            padding: '3px 10px', borderRadius: 20,
                            fontSize: '0.75rem', fontWeight: 600,
                            background: '#E8F5E2', color: '#2D5016',
                          }}>
                            📅 {days} day{days !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>

                      {/* Footer row */}
                      <div style={{
                        marginTop: 16, paddingTop: 14, borderTop: '1px solid #F3F4F6',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10,
                      }}>
                        <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
                          Booked on {formatDate(booking.created_at)}
                        </div>
                        {facility && (
                          <Link to={`/facilities/${facility.id}`} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '7px 16px', border: '1.5px solid #2D5016',
                            borderRadius: 8, color: '#2D5016', fontWeight: 600,
                            fontSize: '0.82rem', textDecoration: 'none',
                            transition: 'all 0.15s ease',
                          }}>
                            View Facility →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
