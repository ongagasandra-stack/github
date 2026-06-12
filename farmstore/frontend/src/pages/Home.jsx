import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FacilityCard from '../components/FacilityCard';

const STATS = [
  { icon: '🌾', number: '500+', label: 'Farmers Served' },
  { icon: '🏭', number: '50+', label: 'Storage Facilities' },
  { icon: '📍', number: '15', label: 'Counties Covered' },
  { icon: '📦', number: '10K+', label: 'Tons Stored' },
];

const HOW_FARMER = [
  {
    step: '01',
    icon: '🔍',
    title: 'Search for Storage',
    desc: 'Enter your produce type, quantity needed, and county to instantly find nearby facilities with available space.',
  },
  {
    step: '02',
    icon: '📋',
    title: 'Compare Options',
    desc: 'Compare prices, available space, location, accepted produce types, and owner contact details across facilities.',
  },
  {
    step: '03',
    icon: '✅',
    title: 'Book & Store Safely',
    desc: 'Book directly through FarmStore, receive a booking confirmation, and get your harvest stored safely.',
  },
];

const HOW_OWNER = [
  {
    step: '01',
    icon: '📝',
    title: 'List Your Facility',
    desc: 'Register your warehouse with location, total capacity, pricing in KES, and the produce types you can accept.',
  },
  {
    step: '02',
    icon: '📣',
    title: 'Reach Thousands of Farmers',
    desc: 'Get discovered by farmers across Kenya who are actively looking for reliable, affordable storage solutions.',
  },
  {
    step: '03',
    icon: '💰',
    title: 'Earn Consistent Revenue',
    desc: 'Fill your empty space and earn reliable income from your storage facility throughout the harvest seasons.',
  },
];

export default function Home() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/facilities')
      .then(res => {
        if (res.data.success) {
          setFacilities(res.data.data.slice(0, 6));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ===== Hero Section ===== */}
      <section style={{
        background: 'linear-gradient(135deg, #1e3a0f 0%, #2D5016 45%, #3d6b20 75%, #8B6914 100%)',
        minHeight: '580px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative background circles */}
        <div style={{
          position: 'absolute', top: -100, right: -100,
          width: 450, height: 450, borderRadius: '50%',
          background: 'rgba(245,200,66,0.07)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: -80,
          width: 350, height: 350, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '30%', right: '15%',
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(245,200,66,0.04)', pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '80px 20px' }}>
          <div style={{ maxWidth: 640 }}>
            {/* Top badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(245,200,66,0.15)',
              border: '1px solid rgba(245,200,66,0.35)',
              padding: '7px 18px', borderRadius: 24, marginBottom: 24,
              fontSize: '0.82rem', color: '#F5C842', fontWeight: 600,
            }}>
              🇰🇪 Kenya's #1 Farm Storage Marketplace
            </div>

            <h1 style={{
              fontFamily: 'Merriweather, serif',
              fontSize: 'clamp(1.9rem, 5vw, 3.2rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: 22,
              lineHeight: 1.2,
            }}>
              Store Your Harvest,{' '}
              <span style={{ color: '#F5C842' }}>Secure Your Future</span>
            </h1>

            <p style={{
              fontSize: '1.08rem',
              color: 'rgba(255,255,255,0.83)',
              marginBottom: 38,
              lineHeight: 1.75,
              maxWidth: 530,
            }}>
              Connect with trusted storage facilities across Kenya. Find affordable cold stores, grain silos, and warehouses near you — or list your own facility and start earning today.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/search" style={{
                background: '#F5C842',
                color: '#1e3a0f',
                padding: '15px 32px',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s ease',
                textDecoration: 'none',
                boxShadow: '0 4px 18px rgba(245,200,66,0.4)',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e6b52a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F5C842'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                🔍 Find Storage Near Me
              </Link>
              <Link to="/list" style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#FFFFFF',
                border: '2px solid rgba(255,255,255,0.35)',
                padding: '13px 28px',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s ease',
                textDecoration: 'none',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                🏭 List Your Warehouse
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Stats Strip ===== */}
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding: '30px 20px',
                textAlign: 'center',
                borderRight: i < 3 ? '1px solid #E5E7EB' : 'none',
              }}>
                <div style={{ fontSize: '2.2rem', marginBottom: 6 }}>{s.icon}</div>
                <div style={{
                  fontSize: '1.9rem',
                  fontWeight: 800,
                  color: '#2D5016',
                  fontFamily: 'Merriweather, serif',
                  lineHeight: 1.1,
                }}>
                  {s.number}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section style={{ padding: '76px 0', background: '#FDF8EF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{
              fontFamily: 'Merriweather, serif',
              fontSize: '2rem',
              color: '#2D5016',
              marginBottom: 12,
            }}>
              How FarmStore Works
            </h2>
            <p style={{ color: '#6B7280', maxWidth: 520, margin: '0 auto', fontSize: '1rem', lineHeight: 1.7 }}>
              Whether you're a farmer looking for storage or an owner with space to rent, we make it simple and straightforward.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 52 }}>
            {/* For Farmers */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#E8F5E2', color: '#2D5016',
                padding: '7px 18px', borderRadius: 24, marginBottom: 28,
                fontSize: '0.85rem', fontWeight: 700,
              }}>
                🌾 For Farmers
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {HOW_FARMER.map(item => (
                  <div key={item.step} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                    <div style={{
                      minWidth: 50, height: 50, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2D5016, #3d6b20)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.3rem',
                      boxShadow: '0 4px 14px rgba(45,80,22,0.28)',
                      flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '0.68rem', color: '#8B6914', fontWeight: 700,
                        letterSpacing: '1.2px', marginBottom: 4, textTransform: 'uppercase',
                      }}>
                        Step {item.step}
                      </div>
                      <h4 style={{
                        fontFamily: 'Merriweather, serif',
                        fontSize: '0.95rem', color: '#1A1A1A', marginBottom: 5,
                      }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.65 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Storage Owners */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#FEF9C3', color: '#8B6914',
                padding: '7px 18px', borderRadius: 24, marginBottom: 28,
                fontSize: '0.85rem', fontWeight: 700,
              }}>
                🏭 For Storage Owners
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {HOW_OWNER.map(item => (
                  <div key={item.step} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                    <div style={{
                      minWidth: 50, height: 50, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #8B6914, #b8860b)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.3rem',
                      boxShadow: '0 4px 14px rgba(139,105,20,0.28)',
                      flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '0.68rem', color: '#8B6914', fontWeight: 700,
                        letterSpacing: '1.2px', marginBottom: 4, textTransform: 'uppercase',
                      }}>
                        Step {item.step}
                      </div>
                      <h4 style={{
                        fontFamily: 'Merriweather, serif',
                        fontSize: '0.95rem', color: '#1A1A1A', marginBottom: 5,
                      }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.65 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Featured Facilities ===== */}
      <section style={{ padding: '76px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 38,
            flexWrap: 'wrap',
            gap: 14,
          }}>
            <div>
              <h2 style={{
                fontFamily: 'Merriweather, serif',
                fontSize: '1.8rem',
                color: '#2D5016',
                marginBottom: 6,
              }}>
                Featured Storage Facilities
              </h2>
              <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
                Trusted facilities across Kenya's key farming regions
              </p>
            </div>
            <Link to="/search" style={{
              color: '#2D5016',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              border: '1.5px solid #2D5016',
              padding: '9px 20px',
              borderRadius: 8,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E8F5E2'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              View All Facilities →
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: 16,
                  height: 360,
                }} />
              ))}
            </div>
          ) : facilities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏭</div>
              <p>No facilities available yet. Be the first to <Link to="/list" style={{ color: '#2D5016', fontWeight: 600 }}>list your storage</Link>.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {facilities.map(f => (
                <FacilityCard key={f.id} facility={f} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA Banner ===== */}
      <section style={{
        background: 'linear-gradient(135deg, #F5C842 0%, #e6b235 50%, #d4a017 100%)',
        padding: '64px 0',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'Merriweather, serif',
            fontSize: '1.9rem',
            color: '#1e3a0f',
            marginBottom: 14,
          }}>
            Have storage space? Start earning today.
          </h2>
          <p style={{ color: '#3d4f1a', marginBottom: 32, fontSize: '1.05rem', maxWidth: 500, margin: '0 auto 32px' }}>
            Join 50+ storage owners already earning from their facilities on FarmStore. Setup takes less than 5 minutes.
          </p>
          <Link to="/list" style={{
            background: '#2D5016',
            color: '#FFFFFF',
            padding: '15px 40px',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
            boxShadow: '0 4px 18px rgba(45,80,22,0.35)',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1e3610'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#2D5016'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            🏭 List Your Storage Facility
          </Link>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer style={{
        background: '#1e3a0f',
        color: 'rgba(255,255,255,0.7)',
        padding: '48px 0 32px',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40, marginBottom: 36 }}>
            <div>
              <div style={{
                fontFamily: 'Merriweather, serif',
                fontSize: '1.25rem',
                color: '#F5C842',
                fontWeight: 700,
                marginBottom: 10,
              }}>
                🌿 FarmStore
              </div>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}>
                Kenya's trusted marketplace connecting farmers with reliable storage facilities across all 47 counties.
              </p>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#F5C842', marginBottom: 12, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                For Farmers
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { to: '/search', label: 'Find Storage' },
                  { to: '/bookings', label: 'My Bookings' },
                ].map(l => (
                  <Link key={l.to} to={l.to} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#F5C842'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#F5C842', marginBottom: 12, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                For Owners
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link to="/list" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#F5C842'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
                >
                  List Your Storage
                </Link>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, textAlign: 'center' }}>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
              © 2024 FarmStore Kenya. Connecting Kenyan farmers with trusted storage solutions nationwide.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          footer > div > div:first-of-type {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          section > div > div[style*="repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          section > div > div[style*="1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
