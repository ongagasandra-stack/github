import React from 'react';
import { Link } from 'react-router-dom';

const PRODUCE_COLORS = {
  'Maize':      { bg: '#FEF9C3', color: '#A16207' },
  'Wheat':      { bg: '#FEF3C7', color: '#92400E' },
  'Rice':       { bg: '#DBEAFE', color: '#1D4ED8' },
  'Potatoes':   { bg: '#F3F4F6', color: '#374151' },
  'Beans':      { bg: '#FCE7F3', color: '#9D174D' },
  'Coffee':     { bg: '#F5F3FF', color: '#6B21A8' },
  'Tea':        { bg: '#DCFCE7', color: '#15803D' },
  'Vegetables': { bg: '#D1FAE5', color: '#065F46' },
  'Fruits':     { bg: '#FFE4E6', color: '#BE123C' },
  'Other':      { bg: '#F3F4F6', color: '#374151' },
  'Barley':     { bg: '#FEF9C3', color: '#92400E' },
  'Sunflower':  { bg: '#FEF3C7', color: '#B45309' },
  'Fish':       { bg: '#DBEAFE', color: '#1E40AF' },
  'Dairy':      { bg: '#E0F2FE', color: '#0369A1' },
};

function getProduceStyle(type) {
  return PRODUCE_COLORS[type] || { bg: '#F3F4F6', color: '#374151' };
}

function SpaceIndicator({ available, capacity }) {
  const pct = capacity > 0 ? (available / capacity) * 100 : 0;
  let barColor = '#16A34A';
  if (pct < 20) barColor = '#DC2626';
  else if (pct < 50) barColor = '#D97706';

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: '0.76rem', color: '#6B7280', fontWeight: '500' }}>Available Space</span>
        <span style={{ fontSize: '0.76rem', fontWeight: '700', color: barColor }}>
          {available.toLocaleString()} / {capacity.toLocaleString()} tons
        </span>
      </div>
      <div style={{
        background: '#E5E7EB',
        borderRadius: '10px',
        height: '8px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${Math.max(pct, 2)}%`,
          height: '100%',
          background: barColor,
          borderRadius: '10px',
          transition: 'width 0.3s ease',
        }} />
      </div>
      <div style={{ fontSize: '0.71rem', color: '#9CA3AF', marginTop: 3 }}>
        {pct.toFixed(0)}% space available
      </div>
    </div>
  );
}

export default function FacilityCard({ facility }) {
  const {
    id,
    facility_name,
    owner_name,
    location,
    county,
    available_space_tons,
    capacity_tons,
    price_per_day,
    price_per_week,
    price_per_month,
    produce_types,
  } = facility;

  const types = Array.isArray(produce_types)
    ? produce_types
    : JSON.parse(produce_types || '[]');

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 14px 32px rgba(45,80,22,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
      }}
    >
      {/* Card Header with gradient */}
      <div style={{
        background: 'linear-gradient(135deg, #2D5016 0%, #3d6b1f 60%, #8B6914 100%)',
        padding: '20px 20px 18px',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <h3 style={{
              fontFamily: 'Merriweather, serif',
              fontSize: '1rem',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '5px',
              lineHeight: '1.3',
              wordBreak: 'break-word',
            }}>
              {facility_name}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.78)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>👤</span> {owner_name}
            </p>
          </div>
          {/* County badge */}
          <div style={{
            background: 'rgba(245,200,66,0.9)',
            color: '#1e3610',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.72rem',
            fontWeight: '700',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            📍 {county}
          </div>
        </div>
        <p style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.65)', marginTop: '7px', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>🏭</span> {location}
        </p>
      </div>

      {/* Card Body */}
      <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Space indicator */}
        <SpaceIndicator available={available_space_tons} capacity={capacity_tons} />

        {/* Pricing table */}
        <div style={{
          background: '#F9FAFB',
          borderRadius: '10px',
          padding: '12px',
          marginBottom: 14,
          border: '1px solid #F0F0F0',
        }}>
          <div style={{
            fontSize: '0.7rem',
            color: '#6B7280',
            fontWeight: '700',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
          }}>
            Pricing (KES)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', textAlign: 'center' }}>
            {[
              { label: 'Per Day', value: price_per_day },
              { label: 'Per Week', value: price_per_week },
              { label: 'Per Month', value: price_per_month },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: '0.68rem', color: '#9CA3AF', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#2D5016' }}>
                  {value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Produce type chips */}
        <div style={{ marginBottom: '16px', flex: 1 }}>
          <div style={{
            fontSize: '0.7rem',
            color: '#6B7280',
            fontWeight: '700',
            marginBottom: '7px',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
          }}>
            Accepted Produce
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {types.slice(0, 4).map(type => {
              const style = getProduceStyle(type);
              return (
                <span key={type} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '0.72rem',
                  fontWeight: '500',
                  background: style.bg,
                  color: style.color,
                }}>
                  {type}
                </span>
              );
            })}
            {types.length > 4 && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.72rem',
                fontWeight: '500',
                background: '#F3F4F6',
                color: '#6B7280',
              }}>
                +{types.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link
            to={`/facilities/${id}`}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '9px 12px',
              border: '1.5px solid #2D5016',
              borderRadius: '8px',
              color: '#2D5016',
              fontWeight: '600',
              fontSize: '0.84rem',
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
              padding: '9px 12px',
              background: '#2D5016',
              border: '1.5px solid #2D5016',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontWeight: '600',
              fontSize: '0.84rem',
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
