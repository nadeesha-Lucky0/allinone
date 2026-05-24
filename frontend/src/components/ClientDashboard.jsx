import React, { useState, useEffect } from 'react';
import { Tag, Building, Phone, Mail, MapPin, Globe, CheckCircle, Sparkles, Image, ShieldAlert, DollarSign, FileText, Upload, Pencil } from 'lucide-react';

export default function ClientDashboard({ profile, categories, onCreateProfile, onUpdateProfile }) {
  // Registration Form States
  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  // approved customisations states
  const [imageUrl, setImageUrl] = useState('');
  const [pricing, setPricing] = useState('');
  const [website, setWebsite] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [newGalleryImage, setNewGalleryImage] = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');
  const [newGalleryHeading, setNewGalleryHeading] = useState('');
  const [newGalleryDescription, setNewGalleryDescription] = useState('');
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);
  const [activeDashboardTab, setActiveDashboardTab] = useState('gigs');
  const [editingGalleryIndex, setEditingGalleryIndex] = useState(null);

  // Populate edits state when profile exists
  useEffect(() => {
    if (profile) {
      setBusinessName(profile.businessName || '');
      setBusinessEmail(profile.businessEmail || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setLocation(profile.location || '');
      setCategory(profile.category || '');
      setDescription(profile.description || '');
      setImageUrl(profile.imageUrl || '');
      setPricing(profile.pricing || '');
      setWebsite(profile.website || '');
      setGallery(profile.gallery || []);
    }
  }, [profile]);

  const handleAutofillRegistration = () => {
    setBusinessName('Royal Lens Capture');
    setBusinessEmail('info@royallens.com');
    setPhone('+94-77-111-2222');
    setLocation('Colombo');
    setAddress('42 Flower Road, Colombo 03');
    setDescription('Elite cinematic wedding storytelling, high-definition wedding photobooks, and premium pre-shoot capture services in Sri Lanka.');
    if (categories && categories.length > 0) {
      // Prefer Category corresponding to seeded Wedding Photographers if present, otherwise first available
      const photographerCat = categories.find(c => c.name.toLowerCase().includes('wedding'));
      setCategory(photographerCat ? photographerCat.name : categories[0].name);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!category) {
      alert('Please select a business category.');
      return;
    }
    onCreateProfile({
      businessName,
      businessEmail,
      phone,
      address,
      location,
      category,
      description
    });
  };

  const handleCustomizationSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(profile._id, {
      businessName,
      businessEmail,
      phone,
      address,
      location,
      category,
      imageUrl,
      description,
      pricing,
      website,
      gallery
    });
    setIsEditing(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDragOverGallery = (e) => {
    e.preventDefault();
    setIsDraggingGallery(true);
  };

  const handleDragLeaveGallery = () => {
    setIsDraggingGallery(false);
  };

  const processGalleryFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewGalleryImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDropGallery = (e) => {
    e.preventDefault();
    setIsDraggingGallery(false);
    const file = e.dataTransfer.files[0];
    processGalleryFile(file);
  };

  const handleGalleryFileChange = (e) => {
    const file = e.target.files[0];
    processGalleryFile(file);
  };

  const handleAddGalleryItem = () => {
    if (!newGalleryImage) {
      alert('Please upload or select an image for your gallery item.');
      return;
    }
    const newItem = {
      imageUrl: newGalleryImage,
      heading: newGalleryHeading,
      description: newGalleryDescription,
      caption: newGalleryHeading
    };
    
    let updatedGallery;
    if (editingGalleryIndex !== null) {
      updatedGallery = gallery.map((item, idx) => idx === editingGalleryIndex ? newItem : item);
      setEditingGalleryIndex(null);
    } else {
      updatedGallery = [...gallery, newItem];
    }
    
    setGallery(updatedGallery);
    setNewGalleryImage('');
    setNewGalleryHeading('');
    setNewGalleryDescription('');
    setNewGalleryCaption('');
    
    // Auto-save immediately to database
    onUpdateProfile(profile._id, {
      businessName,
      businessEmail,
      phone,
      address,
      location,
      category,
      imageUrl,
      description,
      pricing,
      website,
      gallery: updatedGallery
    });
  };

  const handleCancelEdit = () => {
    setEditingGalleryIndex(null);
    setNewGalleryImage('');
    setNewGalleryHeading('');
    setNewGalleryDescription('');
    setNewGalleryCaption('');
  };

  const handleRemoveGalleryItem = (index) => {
    const updatedGallery = gallery.filter((_, idx) => idx !== index);
    setGallery(updatedGallery);
    setEditingGalleryIndex(null);
    setNewGalleryImage('');
    setNewGalleryHeading('');
    setNewGalleryDescription('');
    setNewGalleryCaption('');
    
    // Auto-save immediately to database
    onUpdateProfile(profile._id, {
      businessName,
      businessEmail,
      phone,
      address,
      location,
      category,
      imageUrl,
      description,
      pricing,
      website,
      gallery: updatedGallery
    });
  };



  return (
    <div className="client-dashboard">
      
      {/* 1. NOT ONBOARDED YET -> REGISTRATION FORM */}
      {!profile && (
        <div className="luxury-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold-400)', marginBottom: '0.8rem' }}>
            <Sparkles size={20} />
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600 }}>Vendor Application Suite</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', gap: '1rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '2.2rem', margin: 0 }}>Create Business Profile</h2>
            <button
              type="button"
              onClick={handleAutofillRegistration}
              style={{
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                color: 'var(--color-gold-400)',
                padding: '0.4rem 1.1rem',
                borderRadius: '50px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="Click to instantly pre-populate all form fields with beautiful photography studio mock data!"
            >
              <Sparkles size={12} /> Auto-Fill Mock Data
            </button>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
            Establish your business presence. Fill in the organizational metadata below to register your active gig in the AllInOnePlace directory.
          </p>

          <form onSubmit={handleRegisterSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Registered Business Name *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g., Royal Lens Capture"
                    style={{ paddingLeft: '2.5rem' }}
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                  <Building size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div className="form-group">
                <label>Corporate Contact Email *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="e.g., info@royallens.com"
                    style={{ paddingLeft: '2.5rem' }}
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                  />
                  <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div className="form-group">
                <label>Direct Phone Hotline *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g., +94-77-111-2222"
                    style={{ paddingLeft: '2.5rem' }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div className="form-group">
                <label>Headquarters City / Location *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g., Colombo"
                    style={{ paddingLeft: '2.5rem' }}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <MapPin size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div className="form-group">
                <label>Business Category *</label>
                <div style={{ position: 'relative' }}>
                  <select
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">-- Choose Category --</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <Tag size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Business HQ Full Address *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g., 42 Royal Arcade, Flower Road, Colombo 03"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Introductory Pitch / Bio *</label>
                <textarea
                  rows="4"
                  className="form-control"
                  required
                  placeholder="Provide an overview of your services, certifications, years in operation, and client SLA support levels..."
                  style={{ resize: 'none' }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '0.8rem 0' }}>
              Submit Profile for Admin Verification
            </button>
          </form>
        </div>
      )}

      {/* 2. VERIFICATION PENDING SCREEN */}
      {profile && profile.status === 'pending' && (
        <div className="luxury-card" style={{ maxWidth: '750px', margin: '0 auto', textAlign: 'center', padding: '4rem 3rem' }}>
          <div style={{ display: 'inline-flex', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--pending)', width: '80px', height: '80px', borderRadius: '50%', justifyContent: 'center', alignEvent: 'center', alignItems: 'center', marginBottom: '2rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <ShieldAlert size={36} />
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Application Verification Pending</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '550px', margin: '0 auto 3rem auto' }}>
            We have securely registered your corporate profile application. An AllInOnePlace administrator is auditing your business parameters. Once verified, your customization suite will unlock.
          </p>

          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', padding: '2rem', borderRadius: 'var(--radius-sm)', textAlign: 'left' }}>
            <h4 style={{ fontStyle: 'italic', marginBottom: '1.25rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', color: 'var(--color-gold-400)' }}>Submitted Credentials Preview</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
              <div>🏢 Business: <strong>{profile.businessName}</strong></div>
              <div>🏷️ Category: <strong>{profile.category}</strong></div>
              <div>📍 Location: <strong>{profile.location}</strong></div>
              <div>📧 Email: {profile.businessEmail}</div>
              <div style={{ gridColumn: 'span 2' }}>📖 Pitch: <span style={{ color: 'var(--text-secondary)' }}>{profile.description}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* 3. APPROVED SERVICE PROFILE PANEL */}
      {profile && profile.status === 'approved' && (
        <div style={{ width: '100%' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold-400)' }}>
              <Sparkles size={22} />
              <h3 style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-primary)' }}>Gig Editor Suite</h3>
            </div>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--card-border)',
              padding: '0.2rem 0.6rem',
              borderRadius: '50px'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle size={12} /> Active & Verified
              </span>
            </div>
          </div>

          {/* Editor Tab Navigation */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            borderBottom: '1px solid var(--card-border)',
            marginBottom: '2.5rem',
            paddingBottom: '0.2rem'
          }}>
            <button
              type="button"
              onClick={() => setActiveDashboardTab('gigs')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                color: activeDashboardTab === 'gigs' ? 'var(--color-gold-400)' : 'var(--text-secondary)',
                borderBottom: activeDashboardTab === 'gigs' ? '3px solid var(--color-gold-400)' : '3px solid transparent',
                transition: 'var(--transition)',
                cursor: 'pointer',
                background: 'none',
                outline: 'none'
              }}
            >
              <Building size={16} /> Gigs
            </button>
            <button
              type="button"
              onClick={() => setActiveDashboardTab('portfolio')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                color: activeDashboardTab === 'portfolio' ? 'var(--color-gold-400)' : 'var(--text-secondary)',
                borderBottom: activeDashboardTab === 'portfolio' ? '3px solid var(--color-gold-400)' : '3px solid transparent',
                transition: 'var(--transition)',
                cursor: 'pointer',
                background: 'none',
                outline: 'none'
              }}
            >
              <Image size={16} /> Portfolio Showcase
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }}>
            
            {/* Left Column: Form Customization Suite */}
            <div className="luxury-card">
              <form onSubmit={handleCustomizationSubmit}>
                {activeDashboardTab === 'gigs' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold-400)', marginBottom: '0.5rem' }}>
                      <Building size={18} />
                      <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>Gig Parameters</span>
                    </div>

                    {/* Cover Upload */}
                    <div className="form-group" style={{ margin: '0' }}>
                      <label>Gig Cover Image (Drag & Drop or Choose)</label>
                      <div
                        style={{
                          border: `2px dashed ${isDragging ? 'var(--color-gold-400)' : 'var(--card-border)'}`,
                          background: isDragging ? 'rgba(212,175,55,0.06)' : 'var(--bg-secondary)',
                          transition: 'all 0.3s ease',
                          padding: '1.5rem',
                          textAlign: 'center',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          marginBottom: '1rem'
                        }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('gig-image-input').click()}
                      >
                        <input
                          type="file"
                          id="gig-image-input"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                        />
                        <Upload size={24} color={isDragging ? 'var(--color-gold-400)' : 'var(--text-muted)'} />
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                          Drag & drop cover here, or <span style={{ color: 'var(--color-gold-400)', textDecoration: 'underline' }}>browse</span>
                        </div>
                      </div>

                      {/* Paste URL directly */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Or Paste Image URL</span>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="https://example.com/image.jpg"
                            style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                          />
                          <Image size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        </div>
                      </div>
                    </div>

                    <div className="form-group" style={{ margin: '0' }}>
                      <label>SLA Package Pricing (LKR)</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., Packages start at LKR 150,000"
                          style={{ paddingLeft: '3.2rem' }}
                          value={pricing}
                          onChange={(e) => setPricing(e.target.value)}
                        />
                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gold-400)', fontSize: '0.8rem', fontWeight: 700 }}>LKR</span>
                      </div>
                    </div>

                    <div className="form-group" style={{ margin: '0' }}>
                      <label>Corporate Redirect Website</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="https://yoursite.com"
                          style={{ paddingLeft: '2.5rem' }}
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                        />
                        <Globe size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      </div>
                    </div>

                    <div className="form-group" style={{ margin: '0' }}>
                      <label>Service Description & Bio Details</label>
                      <textarea
                        rows="5"
                        className="form-control"
                        placeholder="Provide details about your service, packages, SLA details..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem 0' }}>
                      Save Customizations
                    </button>
                  </div>
                )}

                {activeDashboardTab === 'portfolio' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold-400)', marginBottom: '0.5rem' }}>
                      <Sparkles size={18} />
                      <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
                        {editingGalleryIndex !== null ? 'Edit Portfolio Shoot' : 'Portfolio Builder'}
                      </span>
                    </div>

                    <div className="form-group" style={{ margin: '0' }}>
                      <label style={{ fontWeight: 600 }}>Upload New Shoot / Sample Work</label>
                      
                      <div
                        style={{
                          border: `2px dashed ${isDraggingGallery ? 'var(--color-gold-400)' : 'var(--card-border)'}`,
                          background: isDraggingGallery ? 'rgba(212,175,55,0.06)' : 'var(--bg-secondary)',
                          transition: 'all 0.3s ease',
                          padding: '1.5rem',
                          textAlign: 'center',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.8rem'
                        }}
                        onDragOver={handleDragOverGallery}
                        onDragLeave={handleDragLeaveGallery}
                        onDrop={handleDropGallery}
                        onClick={() => document.getElementById('gallery-image-input').click()}
                      >
                        <input
                          type="file"
                          id="gallery-image-input"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleGalleryFileChange}
                        />
                        <Upload size={20} color={isDraggingGallery ? 'var(--color-gold-400)' : 'var(--text-muted)'} />
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                          {newGalleryImage ? '✅ Shoot Image Selected' : 'Drag & drop image here, or click to browse'}
                        </div>
                      </div>

                      {newGalleryImage && (
                        <div style={{ position: 'relative', height: '180px', width: '100%', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '0.8rem', background: '#090d16', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img src={newGalleryImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                          <button
                            type="button"
                            className="close-btn"
                            style={{ position: 'absolute', right: '0.5rem', top: '0.5rem', background: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.4rem', borderRadius: '50%', fontSize: '0.8rem' }}
                            onClick={(e) => { e.stopPropagation(); setNewGalleryImage(''); }}
                          >
                            &times;
                          </button>
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.8rem' }}>
                        <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Shoot Heading / Title</span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., Autumn Cinematic Bridal"
                          style={{ fontSize: '0.85rem' }}
                          value={newGalleryHeading}
                          onChange={(e) => setNewGalleryHeading(e.target.value)}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.8rem' }}>
                        <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Shoot Description / Details</span>
                        <textarea
                          rows="3"
                          className="form-control"
                          placeholder="Describe the styling, location, key shots, and custom shoot parameters..."
                          style={{ fontSize: '0.85rem', resize: 'none' }}
                          value={newGalleryDescription}
                          onChange={(e) => setNewGalleryDescription(e.target.value)}
                        ></textarea>
                      </div>

                      <button
                        type="button"
                        className="btn-primary"
                        style={{ width: '100%', padding: '0.5rem 0', fontSize: '0.85rem' }}
                        onClick={handleAddGalleryItem}
                      >
                        {editingGalleryIndex !== null ? 'Update Shoot in Portfolio' : 'Add Shoot to Portfolio'}
                      </button>

                      {editingGalleryIndex !== null && (
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ width: '100%', padding: '0.5rem 0', fontSize: '0.85rem', marginTop: '0.5rem' }}
                          onClick={handleCancelEdit}
                        >
                          Cancel Editing
                        </button>
                      )}
                    </div>
                  </div>
                )}

              </form>
            </div>

            {/* Right Column: Live mock preview & shoots preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {activeDashboardTab === 'gigs' ? (
                <div>
                  <h3 style={{ fontStyle: 'italic', fontSize: '1.4rem', marginBottom: '1rem' }}>Live Directory Card Preview</h3>
                  <div className="luxury-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                      <img
                        src={imageUrl || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'}
                        alt="Business Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(11,15,25,0.85)', border: '1px solid var(--color-gold-400)', color: 'var(--color-gold-400)', padding: '0.2rem 0.8rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {category}
                      </div>
                    </div>

                    <div style={{ padding: '2rem' }}>
                      <h4 style={{ fontSize: '1.6rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>{businessName}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>
                        <MapPin size={12} color="var(--color-gold-400)" />
                        <span>{location} • {address}</span>
                      </div>

                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineBreak: 'anywhere', marginBottom: '1rem' }}>
                        {description || 'Provide a service description to inform searching users.'}
                      </p>

                      {pricing && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--card-border)', paddingTop: '1rem', fontSize: '0.88rem' }}>
                          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>SLA Cost</span>
                          <span style={{ color: 'var(--color-gold-400)', fontWeight: 600 }}>{pricing}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 style={{ fontStyle: 'italic', fontSize: '1.4rem', marginBottom: '1rem' }}>Active Portfolio Shoots ({gallery.length})</h3>
                  {gallery.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', overflowY: 'auto', maxHeight: '450px', paddingRight: '0.5rem' }}>
                      {gallery.map((item, idx) => (
                        <div key={idx} className="luxury-card" style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
                          <div style={{ height: '100px', width: '100%', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#090d16', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={item.imageUrl} alt="Shoot" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                          </div>
                          <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', padding: '0 0.2rem 0.5rem 0.2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.3rem' }}>
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, fontWeight: 700, color: 'var(--color-gold-400)' }} title={item.heading || item.caption}>
                                {item.heading || item.caption || 'Sample Shoot'}
                              </span>
                              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                <button
                                  type="button"
                                  className="action-icon-btn edit"
                                  style={{ padding: '0 0.2rem', display: 'inline-flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.2s ease' }}
                                  onClick={() => {
                                    setEditingGalleryIndex(idx);
                                    setNewGalleryImage(item.imageUrl);
                                    setNewGalleryHeading(item.heading || item.caption || '');
                                    setNewGalleryDescription(item.description || '');
                                  }}
                                  title="Edit Shoot"
                                >
                                  <Pencil size={11} />
                                </button>
                                <button
                                  type="button"
                                  className="action-icon-btn delete"
                                  style={{ padding: '0', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
                                  onClick={() => handleRemoveGalleryItem(idx)}
                                  title="Delete Shoot"
                                >
                                  &times;
                                </button>
                              </div>
                            </div>
                            
                            {item.description && (
                              <p style={{
                                fontSize: '0.72rem',
                                color: 'var(--text-muted)',
                                margin: 0,
                                lineHeight: '1.4',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}>
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="luxury-card" style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <Image size={32} style={{ color: 'var(--color-gold-400)', opacity: 0.6, marginBottom: '0.5rem' }} />
                      <div style={{ fontSize: '0.88rem' }}>No portfolio samples uploaded yet.</div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
