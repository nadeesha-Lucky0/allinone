import React, { useState } from 'react';
import { MapPin, Phone, Mail, Globe, ArrowLeft, Sparkles, Tag, CheckCircle, Briefcase, Image } from 'lucide-react';

export default function ClientProfileView({ profile, onBack, triggerToast }) {
  const [activeProfileTab, setActiveProfileTab] = useState('gigs');
  const [activeLightboxItem, setActiveLightboxItem] = useState(null);

  if (!profile) return null;

  return (
    <div className="client-profile-view" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* 1. STICKY ACTION HEADER */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Vendor Profile
        </span>
      </div>

      {/* 2. PREMIUM HERO COVER BANNER */}
      <div style={{
        height: '420px',
        width: '100%',
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        marginBottom: '2.5rem',
        background: '#090d16',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Blurry Ambient Background */}
        <img
          src={profile.imageUrl || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop'}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(30px) brightness(0.35)',
            transform: 'scale(1.15)',
            zIndex: 1
          }}
        />

        {/* Foreground Uncropped High-Quality Image */}
        <img
          src={profile.imageUrl || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop'}
          alt={profile.businessName}
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}
        />

        {/* Text Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          background: 'linear-gradient(to top, rgba(11, 15, 25, 0.98), transparent)',
          padding: '4.5rem 3rem 2.25rem 3rem',
          zIndex: 3
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <span style={{
              background: 'var(--color-gold-400)',
              color: '#0b0f19',
              padding: '0.25rem 0.9rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              borderRadius: '50px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              <Tag size={10} /> {profile.category}
            </span>
          </div>
          <h1 style={{ fontSize: '3rem', fontStyle: 'italic', color: '#ffffff', margin: '0 0 0.5rem 0', fontFamily: 'var(--font-serif)', lineHeight: '1.2' }}>
            {profile.businessName}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <MapPin size={14} color="var(--color-gold-400)" />
            <span>{profile.location} • {profile.address}</span>
          </div>
        </div>
      </div>

      {/* 2.5 STYLISH TAB NAVIGATION */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        borderBottom: '1px solid var(--card-border)',
        marginBottom: '2.5rem',
        paddingBottom: '0.2rem'
      }}>
        <button
          onClick={() => setActiveProfileTab('gigs')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.75rem',
            fontSize: '1rem',
            fontWeight: 600,
            color: activeProfileTab === 'gigs' ? 'var(--color-gold-400)' : 'var(--text-secondary)',
            borderBottom: activeProfileTab === 'gigs' ? '3px solid var(--color-gold-400)' : '3px solid transparent',
            transition: 'var(--transition)',
            cursor: 'pointer',
            background: 'none',
            outline: 'none'
          }}
        >
          <Briefcase size={16} /> Gigs
        </button>
        <button
          onClick={() => setActiveProfileTab('portfolio')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.75rem',
            fontSize: '1rem',
            fontWeight: 600,
            color: activeProfileTab === 'portfolio' ? 'var(--color-gold-400)' : 'var(--text-secondary)',
            borderBottom: activeProfileTab === 'portfolio' ? '3px solid var(--color-gold-400)' : '3px solid transparent',
            transition: 'var(--transition)',
            cursor: 'pointer',
            background: 'none',
            outline: 'none'
          }}
        >
          <Image size={16} /> Portfolio Showcase
        </button>
      </div>

      {/* 3. PROFILE DETAILED WORKSPACE (GIGS TAB) */}
      {activeProfileTab === 'gigs' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem', marginBottom: '3.5rem', animation: 'fadeIn 0.4s ease-out' }}>
          
          {/* Left Column: Extensive Bio & Details */}
          <div className="luxury-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h3 style={{ fontStyle: 'italic', fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                About the Service Provider
              </h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {profile.description || 'No extensive description provided yet.'}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '2rem' }}>
              <h4 style={{ fontStyle: 'italic', fontSize: '1.2rem', marginBottom: '1.25rem' }}>Core Contact Credentials</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '0.6rem', borderRadius: '50%' }}>
                    <MapPin size={18} color="var(--color-gold-400)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Corporate HQ</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>{profile.address}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '0.6rem', borderRadius: '50%' }}>
                    <Phone size={18} color="var(--color-gold-400)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hotline</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>{profile.phone}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '0.6rem', borderRadius: '50%' }}>
                    <Mail size={18} color="var(--color-gold-400)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>{profile.businessEmail}</div>
                  </div>
                </div>

                {profile.website && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '0.6rem', borderRadius: '50%' }}>
                      <Globe size={18} color="var(--color-gold-400)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Website Redirect</div>
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-gold-400)', textDecoration: 'none' }}
                      >
                        {profile.website.replace('https://', '')}
                      </a>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Engagement Call-to-action */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="luxury-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', fontWeight: 600 }}>
                Pricing Details
              </h4>
              
              <div style={{ background: 'rgba(212, 175, 55, 0.05)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--card-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Estimated Service SLA Cost
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-gold-400)' }}>
                  {profile.pricing || 'Custom Packages Available'}
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', padding: '0.8rem 0' }}
                onClick={() => {
                  if (triggerToast) triggerToast('✨ Service booking inquiry dispatched successfully!');
                }}
              >
                Book Service Contract
              </button>
            </div>

            <div className="luxury-card" style={{ background: 'rgba(212, 175, 55, 0.02)', borderColor: 'rgba(212, 175, 55, 0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold-400)', marginBottom: '0.6rem' }}>
                <CheckCircle size={16} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Service</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                This corporate vendor profile is audited and approved by the AllInOnePlace Portal Administrative Board.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* 4. PREMIUM PORTFOLIO & GALLERY SHOWCASE (PORTFOLIO TAB) */}
      {activeProfileTab === 'portfolio' && (
        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
          {profile.gallery && profile.gallery.length > 0 ? (
            <div style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold-400)', marginBottom: '1.5rem' }}>
                <Sparkles size={20} />
                <h3 style={{ fontSize: '1.6rem', fontStyle: 'italic', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-serif)' }}>
                  Portfolio Gallery & Shoot Samples
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                gap: '2.5rem'
              }}>
                {profile.gallery.map((item, idx) => (
                  <div
                    key={idx}
                    className="luxury-card"
                    style={{
                      padding: '0',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setActiveLightboxItem(item);
                    }}
                    title="Click to view full uncropped image and description"
                  >
                    {/* Shoot Image */}
                    <div
                      style={{
                        height: '260px',
                        width: '100%',
                        overflow: 'hidden',
                        background: '#090d16',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.heading || item.caption || 'Sample shoot'}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>
                    {/* Shoot Details */}
                    <div style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--card-border)', textAlign: 'center' }}>
                      <h4 style={{
                        fontSize: '1.2rem',
                        fontStyle: 'italic',
                        color: 'var(--color-gold-400)',
                        margin: 0,
                        fontFamily: 'var(--font-serif)'
                      }}>
                        {item.heading || item.caption || 'Sample Shoot'}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="luxury-card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)', marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
              <Image size={48} style={{ color: 'var(--color-gold-400)', opacity: 0.8 }} />
              <h3 style={{ fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--text-primary)', margin: 0 }}>No Portfolio Shoots Listed</h3>
              <p style={{ maxWidth: '420px', margin: 0, fontSize: '0.92rem' }}>
                This service provider has not uploaded any shoots or samples to their portfolio gallery showcase yet.
              </p>
            </div>
          )}
        </div>
      )}

      {activeLightboxItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(11, 15, 25, 0.96)',
            backdropFilter: 'blur(12px)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setActiveLightboxItem(null)}
        >
          <button
            type="button"
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#ffffff',
              fontSize: '2rem',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setActiveLightboxItem(null)}
          >
            &times;
          </button>
          
          <img
            src={activeLightboxItem.imageUrl}
            alt={activeLightboxItem.heading || activeLightboxItem.caption || 'Shoot'}
            style={{
              maxWidth: '90%',
              maxHeight: '70%',
              objectFit: 'contain',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              border: '1px solid rgba(212,175,55,0.25)'
            }}
          />
          
          <div style={{ marginTop: '1.5rem', textAlign: 'center', maxWidth: '700px' }}>
            <h3 style={{
              color: 'var(--color-gold-400)',
              fontStyle: 'italic',
              fontSize: '1.5rem',
              margin: '0 0 0.5rem 0',
              fontFamily: 'var(--font-serif)',
              textShadow: '0 2px 4px rgba(0,0,0,0.6)'
            }}>
              {activeLightboxItem.heading || activeLightboxItem.caption || 'Sample Shoot'}
            </h3>
            
            {activeLightboxItem.description && (
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                margin: 0,
                lineHeight: '1.6',
                textShadow: '0 1px 3px rgba(0,0,0,0.6)',
                whiteSpace: 'pre-line'
              }}>
                {activeLightboxItem.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* CSS KEYFRAME FOR FADE-IN */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

    </div>
  );
}
