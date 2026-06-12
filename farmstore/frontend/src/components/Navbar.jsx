import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
      boxShadow: scrolled ? '0 4px 16px rgba(0,0,0,0.12)' : '0 2px 6px rgba(0,0,0,0.06)',
      transition: 'box-shadow 0.2s ease',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '66px',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #2D5016 0%, #3d6b1f 60%, #8B6914 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {/* Leaf inline SVG icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 8C8 10 5.9 16.17 3.82 19.29C2.71 20.98 1 21 1 21C1 21 5.58 19.68 8.5 16.5C11.42 13.32 11.47 9.9 11 8C15.1 8.02 17 8 17 8Z" fill="#F5C842"/>
              <path d="M4 19C4 19 4 13 9 9C14 5 19 5 19 5C19 5 21 13 16 17C11 21 4 19 4 19Z" fill="rgba(255,255,255,0.9)"/>
              <path d="M4 19C5 17 7 12 11 9" stroke="#2D5016" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{
              fontFamily: 'Merriweather, serif',
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#2D5016',
              lineHeight: '1.1',
            }}>
              FarmStore
            </div>
            <div style={{ fontSize: '0.6rem', color: '#8B6914', fontWeight: '600', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              Kenya's Farm Storage Marketplace
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontWeight: '500',
                fontSize: '0.88rem',
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
          {/* Kenya flag stripes */}
          <div style={{
            marginLeft: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            padding: '4px',
          }}>
            <div style={{ width: '30px', height: '4px', background: '#000000', borderRadius: '2px' }} />
            <div style={{ width: '30px', height: '6px', background: '#BB0000', borderRadius: '2px' }} />
            <div style={{ width: '30px', height: '4px', background: '#006600', borderRadius: '2px' }} />
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
            color: '#2D5016',
          }}
          className="hamburger-btn"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div style={{
          background: '#FFFFFF',
          borderTop: '1px solid #E5E7EB',
          padding: '12px 20px 16px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          animation: 'slideDown 0.2s ease',
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
                fontSize: '0.95rem',
                textDecoration: 'none',
                color: isActive(link.to) ? '#2D5016' : '#374151',
                background: isActive(link.to) ? '#E8F5E2' : 'transparent',
                borderLeft: isActive(link.to) ? '3px solid #2D5016' : '3px solid transparent',
                marginBottom: '4px',
                transition: 'all 0.15s ease',
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
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
}
