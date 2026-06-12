import React from 'react';
import { Link } from 'react-router-dom';

const PRODUCE_COLORS = {
  'Maize': { bg: '#FEF9C3', color: '#A16207' },
  'Wheat': { bg: '#FEF3C7', color: '#92400E' },
  'Rice': { bg: '#DBEAFE', color: '#1D4ED8' },
  'Potatoes': { bg: '#F3F4F6', color: '#374151' },
  'Beans': { bg: '#FCE7F3', color: '#9D174D' },
  'Coffee': { bg: '#FDF2F8', color: '#6B21A8' },
  'Tea': { bg: '#DCFCE7', color: '#15803D' },
  'Vegetables': { bg: '#D1FAE5', color: '#065F46' },
  'Fruits': { bg: '#FFE4E6', color: '#BE123C' },
  'Other': { bg: '#F3F4F6', color: '#374151' },
  'Barley': { bg: '#FEF9C3', color: '#92400E' },
  'Sunflower': { bg: '#FEF3C7', color: '#B45309' },
  'Fish': { bg: '#DBEAFE', color: '#1E40AF' },
};

function getProduceStyle(type) {
  return PRODUCE_COLORS[type] || { bg: '#F3F4F6', color: '#374151' };
}

function SpaceIndicator({ available, capacity }) {
  const pct = capacity > 0 ? (available / capacity) * 100 : 0;
  let color = '#16A34A';
  if (pct < 20) color = '#DC2626';
  else if (pct < 50) color = '#D97706';

  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: '500' }}>Available Space</span>
        <span style={{ fontSize: '0.78rem', fontWeight: '700', color }}>
          {available.toLocaleString()} / {capacity.toLocaleString()} tons
        </span>
      </div>
      <div style={{ background: '#E5E7EB', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: color,
          borderRadius: '10px',
          transition: 'width 0.3s ease',
        }} />
      </div>
      <div style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: '3px' }}>
        {pct.toFixed(0)}% space available
      </div>
    </div>
  );
}

export default function FacilityCard({ facility }) {
  const {
    id, facility_name, owner_name, location, county,
    available_space_tons, capacity_tons,
    price_per_day, price_per_week, price_per_month,
    produce_types,
  } = facility;

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #E5E7EB',
      overflow: 'hidden',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(45,80,22,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      }}
    >
      {/* Card Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2D5016 0%, #3d6b1f 60%, #8B6914 100%)',
        padding: '20px',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{
              fontFamily: 'Merriweather, serif',
              fontSize: '1rem',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '4px',
              lineHeight: '1.3',
            }}>
              {facility_name}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>
              👤 {owner_name}
            </p>
          </div>
          <div style={{
            background: 'rgba(245,200,66,0.9)',
            color: '#1e3610',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '700',
            whiteSpace: 'nowrap',
          }}>
            📍 {county}
          </div>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginTop: '6px' }}>
          🏭 {location}
        </p>
      </div>

      {/* Card Body */}
      <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <SpaceIndicator available={available_space_tons} capacity={capacity_tons} />

        {/* Pricing */}
        <div style={{
          background: '#F9FAFB',
          borderRadius: '10px',
          padding: '12px',
          marginBottom: '12px',
          border: '1px solid #F3F4F6',
        }}>
          <div style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Pricing (KES)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
            {[
              { label: 'Per Day', value: price_per_day },
              { label: 'Per Week', value: price_per_week },
              { label: 'Per Month', value: price_per_month },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{label}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#2D5016' }}>
                  {value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Produce Types */}
        <div style={{ marginBottom: '14px', flex: 1 }}>
          <div style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Accepted Produce
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {(Array.isArray(produce_types) ? produce_types : JSON.parse(produce_types || '[]')).slice(0, 4).map((type) => {
              const style = getProduceStyle(type);
              return (
                <span key={type} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '0.73rem',
                  fontWeight: '500',
                  background: style.bg,
                  color: style.color,
                }}>
                  {type}
                </span>
              );
            })}
            {(Array.isArray(produce_types) ? produce_types : []).length > 4 && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.73rem',
                fontWeight: '500',
                background: '#F3F4F6',
                color: '#6B7280',
              }}>
                +{produce_types.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link
            to={`/facilities/${id}`}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '9px 14px',
              border: '1.5px solid #2D5016',
              borderRadius: '8px',
              color: '#2D5016',
              fontWeight: '600',
              fontSize: '0.85rem',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              background: 'transparent',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E8F5E2'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            View Details
          </Link>
          <Link
            to={`/facilities/${id}#book`}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '9px 14px',
              background: '#2D5016',
              border: '1.5px solid #2D5016',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontWeight: '600',
              fontSize: '0.85rem',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1e3610'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#2D5016'; }}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
