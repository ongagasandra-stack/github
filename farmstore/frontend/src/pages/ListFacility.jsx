import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const COUNTIES = [
  'Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Kisii','Kakamega',
  'Meru','Machakos','Kiambu','Nyeri','Kirinyaga','Murang\'a','Nyandarua',
  'Laikipia','Samburu','Isiolo','Marsabit','Mandera','Wajir','Garissa',
  'Tana River','Kilifi','Kwale','Taita Taveta','Makueni','Kitui','Embu',
  'Tharaka-Nithi','Nyamira','Migori','Homa Bay','Siaya','Vihiga','Bungoma',
  'Busia','Trans Nzoia','West Pokot','Elgeyo-Marakwet','Nandi','Baringo',
  'Kericho','Bomet','Narok','Kajiado','Turkana','Uasin Gishu',
];

const ALL_PRODUCE = ['Maize','Wheat','Rice','Potatoes','Beans','Coffee','Tea','Vegetables','Fruits','Other'];

const INITIAL_FORM = {
  facility_name: '',
  owner_name: '',
  phone: '',
  email: '',
  location: '',
  county: '',
  latitude: '',
  longitude: '',
  capacity_tons: '',
  available_space_tons: '',
  price_per_day: '',
  price_per_week: '',
  price_per_month: '',
  description: '',
};

export default function ListFacility() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [produceTypes, setProduceTypes] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function toggleProduce(type) {
    setProduceTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const required = ['facility_name','owner_name','phone','location','county','capacity_tons','price_per_day','price_per_week','price_per_month'];
    for (const field of required) {
      if (!form[field] || String(form[field]).trim() === '') {
        setError(`Please fill in: ${field.replace(/_/g, ' ')}`);
        return;
      }
    }
    if (produceTypes.length === 0) {
      setError('Please select at least one produce type.');
      return;
    }
    const availSpace = form.available_space_tons || form.capacity_tons;
    if (parseFloat(availSpace) > parseFloat(form.capacity_tons)) {
      setError('Available space cannot exceed total capacity.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        available_space_tons: availSpace,
        produce_types: produceTypes,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        capacity_tons: parseFloat(form.capacity_tons),
        price_per_day: parseFloat(form.price_per_day),
        price_per_week: parseFloat(form.price_per_week),
        price_per_month: parseFloat(form.price_per_month),
      };
      const { data } = await axios.post('/api/facilities', payload);
      if (data.success) {
        setSuccess(data.data);
        setForm(INITIAL_FORM);
        setProduceTypes([]);
      } else {
        setError(data.error || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #D1D5DB',
    borderRadius: '8px',
    fontSize: '0.92rem',
    background: '#FAFAFA',
    color: '#1A1A1A',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };
  const labelStyle = {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: 6,
  };
  const sectionStyle = {
    background: '#FFFFFF',
    borderRadius: 16,
    padding: '28px 28px 20px',
    marginBottom: 24,
    border: '1px solid #E5E7EB',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  };
  const sectionHeadStyle = {
    fontFamily: 'Merriweather, serif',
    fontSize: '1.05rem',
    color: '#2D5016',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: '2px solid #E8F5E2',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  if (success) {
    return (
      <div>
        <div style={{ background: 'linear-gradient(135deg,#1e3a0f,#2D5016,#3d6b20)', padding: '48px 0' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
            <h1 style={{ fontFamily: 'Merriweather, serif', color: '#fff', fontSize: '2rem', marginBottom: 6 }}>List Your Storage</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)' }}>Register your facility on FarmStore</p>
          </div>
        </div>
        <div style={{ maxWidth: 640, margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '48px 36px', border: '2px solid #BBF7D0', boxShadow: '0 8px 30px rgba(45,80,22,0.12)' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontFamily: 'Merriweather, serif', color: '#15803D', fontSize: '1.6rem', marginBottom: 12 }}>Facility Listed Successfully!</h2>
            <p style={{ color: '#4B5563', marginBottom: 8, lineHeight: 1.6 }}>
              <strong>{success.facility_name}</strong> has been added to FarmStore. Farmers across Kenya can now find and book your storage facility.
            </p>
            <div style={{ background: '#F0FDF4', borderRadius: 10, padding: '16px 20px', margin: '20px 0', textAlign: 'left' }}>
              <div style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Listing Summary</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', fontSize: '0.88rem' }}>
                <div><span style={{ color: '#6B7280' }}>Facility: </span><strong>{success.facility_name}</strong></div>
                <div><span style={{ color: '#6B7280' }}>County: </span><strong>{success.county}</strong></div>
                <div><span style={{ color: '#6B7280' }}>Capacity: </span><strong>{parseFloat(success.capacity_tons).toLocaleString()} tons</strong></div>
                <div><span style={{ color: '#6B7280' }}>Price/Month: </span><strong>KES {parseFloat(success.price_per_month).toLocaleString()}</strong></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
              <Link to={`/facilities/${success.id}`} style={{
                background: '#2D5016', color: '#fff', padding: '12px 24px', borderRadius: 8,
                fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                👁️ View My Listing
              </Link>
              <button onClick={() => setSuccess(null)} style={{
                background: 'transparent', color: '#2D5016', padding: '12px 24px', borderRadius: 8,
                fontWeight: 600, cursor: 'pointer', border: '2px solid #2D5016',
              }}>
                + List Another Facility
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1e3a0f,#2D5016,#3d6b20)', padding: '48px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontFamily: 'Merriweather, serif', color: '#fff', fontSize: '2rem', marginBottom: 8 }}>
            🏭 List Your Storage Facility
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', maxWidth: 560 }}>
            Register your warehouse or storage facility on FarmStore and reach thousands of farmers across Kenya looking for reliable storage solutions.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px 60px' }}>
        {/* Benefits banner */}
        <div style={{ background: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', borderRadius: 12, padding: '16px 20px', marginBottom: 28, border: '1px solid #BBF7D0', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {['📣 Reach 500+ active farmers','💰 Earn consistent storage revenue','🔒 Secure bookings & tracking','📍 Featured in county search results'].map(b => (
            <div key={b} style={{ fontSize: '0.85rem', color: '#15803D', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>{b}</div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: '0.9rem', border: '1px solid #FECACA' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Basic Info */}
          <div style={sectionStyle}>
            <h2 style={sectionHeadStyle}>📋 Basic Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
              <div>
                <label style={labelStyle}>Facility Name *</label>
                <input name="facility_name" value={form.facility_name} onChange={handleChange} placeholder="e.g. Westlands Cold Storage" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Owner / Contact Name *</label>
                <input name="owner_name" value={form.owner_name} onChange={handleChange} placeholder="e.g. James Mwangi" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone Number *</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+254 700 000 000" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={labelStyle}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your facility — features, security, access roads, special equipment..."
                rows={4}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }}
              />
            </div>
          </div>

          {/* Location */}
          <div style={sectionStyle}>
            <h2 style={sectionHeadStyle}>📍 Location Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Full Address / Location *</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Westlands Industrial Area, Nairobi" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>County *</label>
                <select name="county" value={form.county} onChange={handleChange} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                  <option value="">Select county...</option>
                  {COUNTIES.sort().map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>GPS Latitude <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(optional)</span></label>
                <input name="latitude" value={form.latitude} onChange={handleChange} placeholder="e.g. -1.2921" type="number" step="any" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>GPS Longitude <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(optional)</span></label>
                <input name="longitude" value={form.longitude} onChange={handleChange} placeholder="e.g. 36.8219" type="number" step="any" style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Capacity & Pricing */}
          <div style={sectionStyle}>
            <h2 style={sectionHeadStyle}>📦 Capacity & Pricing</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
              <div>
                <label style={labelStyle}>Total Capacity (tons) *</label>
                <input name="capacity_tons" value={form.capacity_tons} onChange={handleChange} placeholder="e.g. 500" type="number" min="1" step="any" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Available Space Now (tons)</label>
                <input name="available_space_tons" value={form.available_space_tons} onChange={handleChange} placeholder={form.capacity_tons || 'Same as capacity'} type="number" min="0" step="any" style={inputStyle} />
                <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: 4 }}>Leave blank to set equal to total capacity</div>
              </div>
              <div>
                <label style={labelStyle}>Price Per Day (KES) *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6B7280', fontSize: '0.85rem', fontWeight: 600 }}>KES</span>
                  <input name="price_per_day" value={form.price_per_day} onChange={handleChange} placeholder="0" type="number" min="0" step="any" style={{ ...inputStyle, paddingLeft: 46 }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Price Per Week (KES) *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6B7280', fontSize: '0.85rem', fontWeight: 600 }}>KES</span>
                  <input name="price_per_week" value={form.price_per_week} onChange={handleChange} placeholder="0" type="number" min="0" step="any" style={{ ...inputStyle, paddingLeft: 46 }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Price Per Month (KES) *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6B7280', fontSize: '0.85rem', fontWeight: 600 }}>KES</span>
                  <input name="price_per_month" value={form.price_per_month} onChange={handleChange} placeholder="0" type="number" min="0" step="any" style={{ ...inputStyle, paddingLeft: 46 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Produce Types */}
          <div style={sectionStyle}>
            <h2 style={sectionHeadStyle}>🌾 Accepted Produce Types *</h2>
            <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: 16 }}>Select all produce types your facility can accommodate.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
              {ALL_PRODUCE.map(type => {
                const selected = produceTypes.includes(type);
                return (
                  <label key={type} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                    border: `2px solid ${selected ? '#2D5016' : '#E5E7EB'}`,
                    background: selected ? '#E8F5E2' : '#FAFAFA',
                    transition: 'all 0.15s',
                    userSelect: 'none',
                  }}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleProduce(type)}
                      style={{ width: 16, height: 16, accentColor: '#2D5016', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.88rem', fontWeight: selected ? 600 : 400, color: selected ? '#2D5016' : '#374151' }}>{type}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: submitting ? '#9CA3AF' : '#2D5016',
                color: '#fff',
                padding: '14px 36px',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: '1rem',
                cursor: submitting ? 'not-allowed' : 'pointer',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'background 0.2s',
              }}
            >
              {submitting ? '⏳ Submitting...' : '🏭 List My Facility'}
            </button>
            <Link to="/search" style={{ color: '#6B7280', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none' }}>
              Cancel
            </Link>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: 16 }}>
            * Required fields. By listing your facility you agree to respond to booking enquiries promptly and keep your availability up to date.
          </p>
        </form>
      </div>

      <style>{`
        input:focus, select:focus, textarea:focus {
          border-color: #2D5016 !important;
          box-shadow: 0 0 0 3px rgba(45,80,22,0.1);
        }
        @media (max-width: 640px) {
          form > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
