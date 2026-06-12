import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FacilityCard from '../components/FacilityCard';

const COUNTIES = [
  'All Counties', 'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet',
  'Embu', 'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
  'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale',
  'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit', 'Meru',
  'Migori', 'Mombasa', "Murang'a", 'Nairobi', 'Nakuru', 'Nandi', 'Narok',
  'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta',
  'Tana River', 'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu',
  'Vihiga', 'Wajir', 'West Pokot',
];

const PRODUCE_TYPES = [
  'All Types', 'Maize', 'Wheat', 'Rice', 'Potatoes', 'Beans', 'Coffee',
  'Tea', 'Vegetables', 'Fruits', 'Barley', 'Sunflower', 'Other',
];

const selectStyle = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid #D1D5DB',
  borderRadius: '8px',
  fontSize: '0.9rem',
  background: '#FAFAFA',
  color: '#1A1A1A',
  outline: 'none',
  cursor: 'pointer',
  transition: 'border-color 0.2s ease',
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid #D1D5DB',
  borderRadius: '8px',
  fontSize: '0.9rem',
  background: '#FAFAFA',
  color: '#1A1A1A',
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

export default function Search() {
  const [allFacilities, setAllFacilities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    county: '',
    produce_type: '',
    min_space: '',
    max_price: '',
  });
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    axios.get('/api/facilities')
      .then(res => {
        if (res.data.success) {
          setAllFacilities(res.data.data);
          setFiltered(res.data.data);
        }
      })
      .catch(() => {
        setError('Could not connect to server. Make sure the backend is running on port 3001.');
      })
      .finally(() => setLoading(false));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    setHasSearched(true);
    let results = [...allFacilities];

    if (filters.county && filters.county !== 'All Counties') {
      results = results.filter(f =>
        f.county.toLowerCase() === filters.county.toLowerCase()
      );
    }

    if (filters.produce_type && filters.produce_type !== 'All Types') {
      results = results.filter(f => {
        const types = Array.isArray(f.produce_types)
          ? f.produce_types
          : JSON.parse(f.produce_types || '[]');
        return types.some(t => t.toLowerCase() === filters.produce_type.toLowerCase());
      });
    }

    if (filters.min_space) {
      results = results.filter(f =>
        f.available_space_tons >= parseFloat(filters.min_space)
      );
    }

    if (filters.max_price) {
      results = results.filter(f =>
        f.price_per_month <= parseFloat(filters.max_price)
      );
    }

    setFiltered(results);
  }

  function handleReset() {
    setFilters({ county: '', produce_type: '', min_space: '', max_price: '' });
    setFiltered(allFacilities);
    setHasSearched(false);
  }

  function handleFocus(e) {
    e.target.style.borderColor = '#2D5016';
    e.target.style.boxShadow = '0 0 0 3px rgba(45,80,22,0.1)';
  }

  function handleBlur(e) {
    e.target.style.borderColor = '#D1D5DB';
    e.target.style.boxShadow = 'none';
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a0f 0%, #2D5016 60%, #3d6b20 100%)',
        padding: '52px 0 44px',
      }}>
        <div className="container">
          <h1 style={{
            fontFamily: 'Merriweather, serif',
            color: '#fff',
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            marginBottom: 10,
          }}>
            Find Storage Near You
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', maxWidth: 560, lineHeight: 1.6 }}>
            Search for storage facilities across Kenya by county, produce type, and available capacity.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '36px 20px 60px' }}>
        {/* Search Form Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 16,
          padding: '28px',
          marginBottom: 32,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #E5E7EB',
        }}>
          <h2 style={{
            fontFamily: 'Merriweather, serif',
            fontSize: '1rem',
            color: '#2D5016',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            🔍 Search & Filter Facilities
          </h2>

          <form onSubmit={handleSearch}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              marginBottom: 18,
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  County
                </label>
                <select
                  value={filters.county}
                  onChange={e => setFilters(p => ({ ...p, county: e.target.value }))}
                  style={selectStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  {COUNTIES.map(c => (
                    <option key={c} value={c === 'All Counties' ? '' : c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Produce Type
                </label>
                <select
                  value={filters.produce_type}
                  onChange={e => setFilters(p => ({ ...p, produce_type: e.target.value }))}
                  style={selectStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  {PRODUCE_TYPES.map(p => (
                    <option key={p} value={p === 'All Types' ? '' : p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Min Space Needed (tons)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 10"
                  value={filters.min_space}
                  onChange={e => setFilters(p => ({ ...p, min_space: e.target.value }))}
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Max Price / Month (KES)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 40000"
                  value={filters.max_price}
                  onChange={e => setFilters(p => ({ ...p, max_price: e.target.value }))}
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                type="submit"
                style={{
                  background: '#2D5016',
                  color: '#fff',
                  padding: '12px 28px',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#1e3610'}
                onMouseLeave={e => e.currentTarget.style.background = '#2D5016'}
              >
                🔍 Search Facilities
              </button>

              {hasSearched && (
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    background: 'transparent',
                    color: '#6B7280',
                    padding: '12px 20px',
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    border: '1.5px solid #D1D5DB',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#9CA3AF'; e.currentTarget.style.color = '#374151'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.color = '#6B7280'; }}
                >
                  ✕ Reset Filters
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results Header */}
        {!loading && !error && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 22,
            flexWrap: 'wrap',
            gap: 8,
          }}>
            <h2 style={{ fontFamily: 'Merriweather, serif', fontSize: '1.15rem', color: '#1A1A1A' }}>
              {filtered.length} {filtered.length === 1 ? 'Facility' : 'Facilities'} Found
            </h2>
            {hasSearched && filters.county && (
              <span style={{
                fontSize: '0.85rem',
                color: '#6B7280',
                background: '#F3F4F6',
                padding: '4px 12px',
                borderRadius: 20,
              }}>
                in {filters.county} County
              </span>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #FECACA',
            borderRadius: 12,
            padding: '20px 24px',
            color: '#B91C1C',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>⚠️</div>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>Connection Error</p>
            <p style={{ fontSize: '0.9rem' }}>{error}</p>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{
                height: 390,
                borderRadius: 16,
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '70px 20px',
            background: '#FFFFFF',
            borderRadius: 16,
            border: '1px solid #E5E7EB',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: 20 }}>🔍</div>
            <h3 style={{
              fontFamily: 'Merriweather, serif',
              fontSize: '1.2rem',
              color: '#374151',
              marginBottom: 10,
            }}>
              No facilities found
            </h3>
            <p style={{ color: '#6B7280', marginBottom: 24, maxWidth: 380, margin: '0 auto 24px' }}>
              Try adjusting your filters — try a different county, remove the produce type filter, or increase the max price.
            </p>
            <button
              onClick={handleReset}
              style={{
                background: '#2D5016',
                color: '#fff',
                padding: '11px 28px',
                borderRadius: 8,
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                fontSize: '0.9rem',
              }}
            >
              Show All Facilities
            </button>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {filtered.map(f => (
              <FacilityCard key={f.id} facility={f} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
