import React, { useState, useEffect } from 'react';
import FacilityCard from '../components/FacilityCard';

const API = 'http://localhost:3001';

const COUNTIES = ['All Counties','Nairobi','Nakuru','Meru','Kisumu','Uasin Gishu','Machakos','Kiambu','Trans-Nzoia','Mombasa','Kakamega','Nyeri','Kirinyaga','Murang\'a','Nyandarua','Laikipia','Samburu','Isiolo','Marsabit','Mandera','Wajir','Garissa','Tana River','Kilifi','Kwale','Taita Taveta','Makueni','Kitui','Embu','Tharaka-Nithi','Nyamira','Kisii','Migori','Homa Bay','Siaya','Vihiga','Bungoma','Busia','Trans Nzoia','West Pokot','Elgeyo-Marakwet','Nandi','Baringo','Kericho','Bomet','Narok','Kajiado','Turkana'];
const PRODUCE_TYPES = ['All Types','Maize','Wheat','Rice','Potatoes','Beans','Coffee','Tea','Vegetables','Fruits','Sunflower','Barley','Fish','Other'];

export default function Search() {
  const [facilities, setFacilities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ county: '', produce_type: '', min_space: '', max_price: '' });
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/facilities`)
      .then(r => r.json())
      .then(data => { if (data.success) { setFacilities(data.data); setFiltered(data.data); } })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    setSearched(true);
    let results = [...facilities];
    if (filters.county && filters.county !== 'All Counties') {
      results = results.filter(f => f.county.toLowerCase() === filters.county.toLowerCase());
    }
    if (filters.produce_type && filters.produce_type !== 'All Types') {
      results = results.filter(f => {
        const types = Array.isArray(f.produce_types) ? f.produce_types : JSON.parse(f.produce_types || '[]');
        return types.some(t => t.toLowerCase() === filters.produce_type.toLowerCase());
      });
    }
    if (filters.min_space) {
      results = results.filter(f => f.available_space_tons >= parseFloat(filters.min_space));
    }
    if (filters.max_price) {
      results = results.filter(f => f.price_per_month <= parseFloat(filters.max_price));
    }
    setFiltered(results);
  }

  function handleReset() {
    setFilters({ county: '', produce_type: '', min_space: '', max_price: '' });
    setFiltered(facilities);
    setSearched(false);
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a0f 0%, #2D5016 60%, #3d6b20 100%)',
        padding: '48px 0 40px',
      }}>
        <div className="container">
          <h1 style={{ fontFamily: 'Merriweather, serif', color: '#fff', fontSize: '2rem', marginBottom: 8 }}>Find Storage Near You</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem' }}>Search for storage facilities across Kenya by county, produce type, and capacity needs.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '36px 20px' }}>
        {/* Search Form */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 16,
          padding: '28px',
          marginBottom: 32,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #E5E7EB',
        }}>
          <form onSubmit={handleSearch}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>County</label>
                <select
                  value={filters.county}
                  onChange={e => setFilters(p => ({ ...p, county: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #D1D5DB', borderRadius: 8, fontSize: '0.9rem', background: '#FAFAFA' }}
                >
                  {COUNTIES.map(c => <option key={c} value={c === 'All Counties' ? '' : c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Produce Type</label>
                <select
                  value={filters.produce_type}
                  onChange={e => setFilters(p => ({ ...p, produce_type: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #D1D5DB', borderRadius: 8, fontSize: '0.9rem', background: '#FAFAFA' }}
                >
                  {PRODUCE_TYPES.map(p => <option key={p} value={p === 'All Types' ? '' : p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Min Space Needed (tons)</label>
                <input
                  type="number" min="0" placeholder="e.g. 10"
                  value={filters.min_space}
                  onChange={e => setFilters(p => ({ ...p, min_space: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #D1D5DB', borderRadius: 8, fontSize: '0.9rem', background: '#FAFAFA' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Max Price/Month (KES)</label>
                <input
                  type="number" min="0" placeholder="e.g. 30000"
                  value={filters.max_price}
                  onChange={e => setFilters(p => ({ ...p, max_price: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #D1D5DB', borderRadius: 8, fontSize: '0.9rem', background: '#FAFAFA' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" style={{
                background: '#2D5016', color: '#fff', padding: '11px 28px', borderRadius: 8,
                fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', border: 'none',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                🔍 Search Facilities
              </button>
              {searched && (
                <button type="button" onClick={handleReset} style={{
                  background: 'transparent', color: '#6B7280', padding: '11px 20px', borderRadius: 8,
                  fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', border: '1.5px solid #D1D5DB',
                }}>
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Merriweather, serif', fontSize: '1.2rem', color: '#1A1A1A' }}>
            {loading ? 'Loading...' : `${filtered.length} ${filtered.length === 1 ? 'Facility' : 'Facilities'} Found`}
          </h2>
          {searched && filters.county && (
            <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>in {filters.county}</span>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height: 380, borderRadius: 16, background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: 'Merriweather, serif', fontSize: '1.2rem', color: '#374151', marginBottom: 8 }}>No facilities found</h3>
            <p>Try adjusting your filters or searching a different county.</p>
            <button onClick={handleReset} style={{
              marginTop: 20, background: '#2D5016', color: '#fff', padding: '10px 24px',
              borderRadius: 8, fontWeight: 600, cursor: 'pointer', border: 'none',
            }}>Show All Facilities</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {filtered.map(f => <FacilityCard key={f.id} facility={f} />)}
          </div>
        )}
      </div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}
