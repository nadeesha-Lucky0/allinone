import React, { useState } from 'react';
import { Search, MapPin, Tag, Sparkles } from 'lucide-react';

export default function LandingPage({ profiles = [], categories = [], onViewProfile }) {
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchLoc, setSearchLoc] = useState('');
  const [searchKey, setSearchKey] = useState('');

  // Filter listings
  const filteredGigs = profiles.filter(gig => {
    const matchesCat = selectedCat === 'All' || gig.category === selectedCat;
    const matchesLoc = !searchLoc || gig.location.toLowerCase().includes(searchLoc.toLowerCase());
    const matchesKey = !searchKey || 
      gig.businessName.toLowerCase().includes(searchKey.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchKey.toLowerCase());
    return matchesCat && matchesLoc && matchesKey;
  });

  return (
    <div className="directory-landing">
      {/* Visual Accent Header */}
      <div className="landing-hero" style={{ padding: '4rem 1rem 3rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-gold-400)', marginBottom: '0.8rem' }}>
          <Sparkles size={18} />
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 600 }}>Dynamic Services Ecosystem</span>
        </div>
        <h1 className="landing-title" style={{ fontSize: '3.6rem' }}>AllInOnePlace</h1>
        <p className="landing-tagline" style={{ marginBottom: '2.5rem' }}>
          Explore approved premium freelancers and corporate services. Filter by specialization, search regional networks, and acquire top-tier service providers instantly.
        </p>

        {/* Dynamic Search Box */}
        <div className="luxury-card" style={{ maxWidth: '850px', margin: '0 auto', padding: '1.25rem 2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 2, minWidth: '220px' }}>
              <input
                type="text"
                placeholder="Search business names or keywords..."
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
              <input
                type="text"
                placeholder="Filter by city/location..."
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                value={searchLoc}
                onChange={(e) => setSearchLoc(e.target.value)}
              />
              <MapPin size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            <button className="btn-primary" style={{ flex: '0 0 auto', padding: '0.75rem 2rem' }}>
              Find Services
            </button>
          </div>
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
        <button
          className="btn-secondary"
          style={{
            padding: '0.5rem 1.4rem',
            fontSize: '0.85rem',
            background: selectedCat === 'All' ? 'var(--color-gold-400)' : 'transparent',
            color: selectedCat === 'All' ? '#0b0f19' : 'var(--text-secondary)',
            borderColor: selectedCat === 'All' ? 'var(--color-gold-400)' : 'var(--card-border)',
            borderRadius: '50px'
          }}
          onClick={() => setSelectedCat('All')}
        >
          ALL CATEGORIES
        </button>
        {categories.map(cat => (
          <button
            key={cat._id}
            className="btn-secondary"
            style={{
              padding: '0.5rem 1.4rem',
              fontSize: '0.85rem',
              background: selectedCat === cat.name ? 'var(--color-gold-400)' : 'transparent',
              color: selectedCat === cat.name ? '#0b0f19' : 'var(--text-secondary)',
              borderColor: selectedCat === cat.name ? 'var(--color-gold-400)' : 'var(--card-border)',
              borderRadius: '50px'
            }}
            onClick={() => setSelectedCat(cat.name)}
          >
            {cat.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Directory Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
        {filteredGigs.map(gig => (
          <div key={gig._id} className="luxury-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header Cover Image */}
            <div style={{ height: '180px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <img
                src={gig.imageUrl || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'}
                alt={gig.businessName}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition)' }}
              />
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                background: 'rgba(11, 15, 25, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--color-gold-400)',
                color: 'var(--color-gold-400)',
                padding: '0.3rem 0.8rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '50px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <Tag size={10} /> {gig.category}
              </div>
            </div>

            {/* Core Card Info */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '1.4rem', fontStyle: 'italic', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{gig.businessName}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                <MapPin size={12} color="var(--color-gold-400)" />
                <span>{gig.location} • {gig.address}</span>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', flex: 1, lineBreak: 'anywhere' }}>
                {gig.description ? gig.description.slice(0, 110) + '...' : 'No business description provided yet.'}
              </p>

              {gig.pricing && (
                <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>SLA Pricing</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-gold-400)', fontSize: '0.95rem' }}>{gig.pricing}</span>
                </div>
              )}

              <button
                className="btn-secondary"
                style={{ width: '100%', marginTop: '1.5rem', padding: '0.6rem 0' }}
                onClick={() => onViewProfile(gig)}
              >
                View Service Details
              </button>
            </div>
          </div>
        ))}

        {filteredGigs.length === 0 && (
          <div style={{ gridColumn: '1/ -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }} className="luxury-card">
            No approved service providers registered under the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
