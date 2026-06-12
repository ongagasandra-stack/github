import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function StatusBadge({ status }) {
  const styles = {
    confirmed: { background: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0' },
    pending:   { background: '#FEF9C3', color: '#A16207', border: '1px solid #FDE68A' },
    cancelled: { background: '#FEE2E2', color: '#B91C1C', border: '1px solid #FECACA' },
  };
  const icons = { confirmed: '✅', pending: '⏳', cancelled: '❌' };
  const s = styles[status] || styles.pending;
  return (
    <span style={{
      ...s,
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700,
      textTransform: 'capitalize',
    }}>
      {icons[status] || '•'} {status}
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getDays(start, end) {
  if (!start || !end) return '—';
  const diff = new Date(end) - new Date(start);
  const days = Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
  return `${days} day${days !== 1 ? 's' : ''}`;
}

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get('/api/bookings')
      .then(({ data }) => {
        if (data.success) setBookings(data.data);
        else setError('Failed to load bookings');
      })
      .catch(() => setError('Network error. Could not load bookings.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const counts = {
    all: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1e3a0f,#2D5016,#3d6b20)', padding: '48px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontFamily: 'Merriweather, serif', color: '#fff', fontSize: '2rem', marginBottom: 6 }}>
            📋 Storage Bookings
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem' }}>
            Track all storage reservations made through FarmStore.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 20px 60px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Bookings', value: counts.all, color: '#2D5016', bg: '#E8F5E2', icon: '📋' },
            { label: 'Confirmed', value: counts.confirmed, color: '#15803D', bg: '#DCFCE7', icon: '✅' },
            { label: 'Pending', value: counts.pending, color: '#A16207', bg: '#FEF9C3', icon: '⏳' },
            { label: 'Cancelled', value: counts.cancelled, color: '#B91C1C', bg: '#FEE2E2', icon: '❌' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: stat.bg, borderRadius: 12, padding: '18px 20px',
              border: `1px solid ${stat.color}22`,
            }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{stat.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {['all', 'confirmed', 'pending', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 18px', borderRadius: 20, fontWeight: 600, fontSize: '0.85rem',
                cursor: 'pointer', transition: 'all 0.15s', border: 'none',
                background: filter === f ? '#2D5016' : '#F3F4F6',
                color: filter === f ? '#fff' : '#4B5563',
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gap: 16 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{
                height: 120, borderRadius: 12,
                background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)',
                backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
              }} />
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>⚠️</div>
            <p style={{ color: '#B91C1C', fontWeight: 600 }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{ marginTop: 16, background: '#2D5016', color: '#fff', padding: '10px 24px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', border: 'none' }}
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#6B7280' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>📭</div>
            <h3 style={{ fontFamily: 'Merriweather, serif', color: '#374151', marginBottom: 8 }}>
              {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
            </h3>
            <p style={{ marginBottom: 24 }}>
              {filter === 'all'
                ? 'Farmers will see their storage bookings here after reserving a facility.'
                : 'Try switching to a different filter tab.'}
            </p>
            <Link to="/search" style={{
              background: '#2D5016', color: '#fff', padding: '11px 28px', borderRadius: 8,
              fontWeight: 700, textDecoration: 'none', display: 'inline-block',
            }}>
              🔍 Find Storage Facilities
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {filtered.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @media(max-width:640px){
          .booking-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function BookingCard({ booking }) {
  const [facility, setFacility] = useState(null);

  useEffect(() => {
    if (booking.facility_id) {
      axios.get(`/api/facilities/${booking.facility_id}`)
        .then(({ data }) => { if (data.success) setFacility(data.data); })
        .catch(() => {});
    }
  }, [booking.facility_id]);

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 14,
      border: '1px solid #E5E7EB',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(45,80,22,0.12)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '3fr 1.5fr 1.5fr 1.5fr auto',
        gap: 0,
        alignItems: 'stretch',
      }}
        className="booking-grid"
      >
        {/* Farmer + Facility Info */}
        <div style={{ padding: '20px 24px', borderRight: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#2D5016,#3d6b20)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
              👤
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#1A1A1A', fontSize: '0.95rem' }}>{booking.farmer_name}</div>
              <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>📞 {booking.farmer_phone}</div>
            </div>
          </div>
          {facility && (
            <Link to={`/facilities/${booking.facility_id}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: '0.82rem', color: '#2D5016', fontWeight: 600,
              background: '#E8F5E2', padding: '4px 10px', borderRadius: 6, textDecoration: 'none',
            }}>
              🏭 {facility.facility_name}
              {facility.county && <span style={{ color: '#8B6914', fontWeight: 400 }}>· {facility.county}</span>}
            </Link>
          )}
          <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: 6 }}>
            Booking ID: {booking.id.substring(0, 8)}...
          </div>
        </div>

        {/* Produce */}
        <div style={{ padding: '20px 16px', borderRight: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Produce</div>
          <div style={{ fontWeight: 700, color: '#1A1A1A', fontSize: '0.92rem' }}>{booking.produce_type}</div>
          <div style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: 2 }}>{booking.quantity_tons} tons</div>
        </div>

        {/* Dates */}
        <div style={{ padding: '20px 16px', borderRight: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Storage Period</div>
          <div style={{ fontSize: '0.85rem', color: '#1A1A1A', fontWeight: 600 }}>{formatDate(booking.start_date)}</div>
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>to</div>
          <div style={{ fontSize: '0.85rem', color: '#1A1A1A', fontWeight: 600 }}>{formatDate(booking.end_date)}</div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 3 }}>{getDays(booking.start_date, booking.end_date)}</div>
        </div>

        {/* Booked on */}
        <div style={{ padding: '20px 16px', borderRight: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Booked On</div>
          <div style={{ fontSize: '0.85rem', color: '#4B5563' }}>{formatDate(booking.created_at)}</div>
        </div>

        {/* Status */}
        <div style={{ padding: '20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <StatusBadge status={booking.status} />
        </div>
      </div>
    </div>
  );
}
