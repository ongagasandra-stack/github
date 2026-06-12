import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Find Storage' },
    { to: '/list', label: 'List Your Storage' },
    { to: '/bookings', label: 'My Bookings' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: '#FFFFFF',
      borderBottom: '3px solid #2D5016',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            background: 'linear-gradient(135deg, #2D5016, #3d6b1f)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          }}>
            🌿
          </div>
          <div>
            <div style={{
              fontFamily: 'Merriweather, serif',
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#2D5016',
              lineHeight: '1.1',
            }}>
              FarmStore
            </div>
            <div style={{ fontSize: '0.65rem', color: '#8B6914', fontWeight: '500', letterSpacing: '0.5px' }}>
              KENYA'S FARM STORAGE MARKETPLACE
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                color: isActive(link.to) ? '#2D5016' : '#4B5563',
                background: isActive(link.to) ? '#E8F5E2' : 'transparent',
                borderBottom: isActive(link.to) ? '2px solid #2D5016' : '2px solid transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
          {/* Kenya flag accent */}
          <div style={{
            marginLeft: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            padding: '4px',
          }}>
            <div style={{ width: '28px', height: '4px', background: '#000000', borderRadius: '2px' }} />
            <div style={{ width: '28px', height: '4px', background: '#BB0000', borderRadius: '2px' }} />
            <div style={{ width: '28px', height: '4px', background: '#006600', borderRadius: '2px' }} />
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            fontSize: '1.5rem',
          }}
          className="hamburger-btn"
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: '#FFFFFF',
          borderTop: '1px solid #E5E7EB',
          padding: '12px 20px',
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '12px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                textDecoration: 'none',
                color: isActive(link.to) ? '#2D5016' : '#4B5563',
                background: isActive(link.to) ? '#E8F5E2' : 'transparent',
                marginBottom: '4px',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
