import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FacilityCard from '../components/FacilityCard';

const API = 'http://localhost:3001';

const STATS = [
  { icon: '🌾', number: '500+', label: 'Farmers Served' },
  { icon: '🏭', number: '50+', label: 'Storage Facilities' },
  { icon: '📍', number: '15', label: 'Counties Covered' },
  { icon: '📦', number: '10K+', label: 'Tons Stored' },
];

const HOW_FARMER = [
  { step: '01', icon: '🔍', title: 'Search for Storage', desc: 'Enter your produce type, quantity, and county to find nearby facilities with available space.' },
  { step: '02', icon: '📋', title: 'Compare Options', desc: 'Compare prices, space availability, location, and accepted produce types across facilities.' },
  { step: '03', icon: '✅', title: 'Book & Store', desc: 'Book directly through FarmStore, contact the owner, and get your produce stored safely.' },
];

const HOW_OWNER = [
  { step: '01', icon: '📝', title: 'List Your Facility', desc: 'Register your warehouse with location, capacity, pricing, and the produce types you accept.' },
  { step: '02', icon: '📣', title: 'Reach Farmers', desc: 'Get discovered by thousands of farmers across Kenya looking for reliable storage.' },
  { step: '03', icon: '💰', title: 'Earn Revenue', desc: 'Fill your empty space and earn consistent income from your storage facility.' },
];

export default function Home() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/facilities`)
      .then(r => r.json())
      .then(data => { if (data.success) setFacilities(data.data.slice(0, 6)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #1e3a0f 0%, #2D5016 45%, #3d6b20 75%, #8B6914 100%)',
        minHeight: '580px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(245,200,66,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '80px 20px' }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(245,200,66,0.15)', border: '1px solid rgba(245,200,66,0.3)',
              padding: '6px 16px', borderRadius: 20, marginBottom: 20,
              fontSize: '0.82rem', color: '#F5C842', fontWeight: 600,
            }}>
              🇰🇪 Kenya's #1 Farm Storage Marketplace
            </div>

            <h1 style={{
              fontFamily: 'Merriweather, serif',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 20,
              lineHeight: 1.2,
            }}>
              Store Your Harvest,<br />
              <span style={{ color: '#F5C842' }}>Secure Your Future</span>
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.82)', marginBottom: 36, lineHeight: 1.7, maxWidth: 520 }}>
              Connect with trusted storage facilities across Kenya. Find affordable cold stores, grain silos, and warehouses near you — or list your facility and earn more.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/search" style={{
                background: '#F5C842', color: '#1e3a0f',
                padding: '15px 32px', borderRadius: 10, fontWeight: 700, fontSize: '1rem',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                transition: 'all 0.2s', textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(245,200,66,0.4)',
              }}>
                🔍 Find Storage Near Me
              </Link>
              <Link to="/list" style={{
                background: 'rgba(255,255,255,0.12)', color: '#FFFFFF',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '13px 28px', borderRadius: 10, fontWeight: 600, fontSize: '1rem',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                transition: 'all 0.2s', textDecoration: 'none',
              }}>
                🏭 List Your Warehouse
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding: '28px 20px', textAlign: 'center',
                borderRight: i < 3 ? '1px solid #E5E7EB' : 'none',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2D5016', fontFamily: 'Merriweather, serif' }}>{s.number}</div>
                <div style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '72px 0', background: '#FDF8EF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontFamily: 'Merriweather, serif', fontSize: '2rem', color: '#2D5016', marginBottom: 12 }}>How FarmStore Works</h2>
            <p style={{ color: '#6B7280', maxWidth: 520, margin: '0 auto' }}>Whether you're a farmer looking for storage or an owner with space to rent, we make it simple.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            {/* Farmers */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#E8F5E2', color: '#2D5016',
                padding: '6px 16px', borderRadius: 20, marginBottom: 24,
                fontSize: '0.85rem', fontWeight: 700,
              }}>🌾 For Farmers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {HOW_FARMER.map(item => (
                  <div key={item.step} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{
                      minWidth: 48, height: 48, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2D5016, #3d6b20)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(45,80,22,0.25)',
                    }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#8B6914', fontWeight: 700, letterSpacing: '1px', marginBottom: 3 }}>STEP {item.step}</div>
                      <h4 style={{ fontFamily: 'Merriweather, serif', fontSize: '0.95rem', color: '#1A1A1A', marginBottom: 4 }}>{item.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Owners */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#FEF9C3', color: '#8B6914',
                padding: '6px 16px', borderRadius: 20, marginBottom: 24,
                fontSize: '0.85rem', fontWeight: 700,
              }}>🏭 For Storage Owners</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {HOW_OWNER.map(item => (
                  <div key={item.step} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{
                      minWidth: 48, height: 48, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #8B6914, #b8860b)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(139,105,20,0.25)',
                    }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#8B6914', fontWeight: 700, letterSpacing: '1px', marginBottom: 3 }}>STEP {item.step}</div>
                      <h4 style={{ fontFamily: 'Merriweather, serif', fontSize: '0.95rem', color: '#1A1A1A', marginBottom: 4 }}>{item.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Facilities */}
      <section style={{ padding: '72px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontFamily: 'Merriweather, serif', fontSize: '1.8rem', color: '#2D5016', marginBottom: 6 }}>Featured Storage Facilities</h2>
              <p style={{ color: '#6B7280' }}>Trusted facilities across Kenya's key farming regions</p>
            </div>
            <Link to="/search" style={{
              color: '#2D5016', fontWeight: 600, fontSize: '0.9rem',
              display: 'flex', alignItems: 'center', gap: 4,
              border: '1.5px solid #2D5016', padding: '8px 18px', borderRadius: 8,
              textDecoration: 'none',
            }}>
              View All →
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ background: '#F3F4F6', borderRadius: 16, height: 340, animation: 'shimmer 1.5s infinite', backgroundSize: '200% 100%',
                  backgroundImage: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {facilities.map(f => <FacilityCard key={f.id} facility={f} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #F5C842 0%, #e6b235 50%, #d4a017 100%)',
        padding: '60px 0',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Merriweather, serif', fontSize: '1.8rem', color: '#1e3a0f', marginBottom: 12 }}>
            Have storage space? Start earning today.
          </h2>
          <p style={{ color: '#3d4f1a', marginBottom: 28, fontSize: '1.05rem' }}>
            Join 50+ storage owners already earning from their facilities on FarmStore.
          </p>
          <Link to="/list" style={{
            background: '#2D5016', color: '#FFFFFF',
            padding: '14px 36px', borderRadius: 10, fontWeight: 700, fontSize: '1rem',
            display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(45,80,22,0.3)',
          }}>
            🏭 List Your Storage Facility
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1e3a0f', color: 'rgba(255,255,255,0.7)', padding: '40px 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ fontFamily: 'Merriweather, serif', fontSize: '1.2rem', color: '#F5C842', fontWeight: 700, marginBottom: 8 }}>🌿 FarmStore</div>
          <p style={{ fontSize: '0.85rem', marginBottom: 4 }}>Kenya's Farm Produce Storage Marketplace</p>
          <p style={{ fontSize: '0.78rem', opacity: 0.5 }}>© 2024 FarmStore. Connecting Kenyan farmers with trusted storage solutions.</p>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          section div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          section div[style*="repeat(4,1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
          section div[style*="repeat(3,1fr)"] { grid-template-columns: 1fr !important; }
        }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>
    </div>
  );
}
