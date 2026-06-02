import React, { useState } from 'react';
import { Plus, Trash2, Check, X, ShieldAlert, Award, FileText, Tag, Users, CreditCard, DollarSign, Pencil } from 'lucide-react';

export default function AdminPanel({ 
  categories, 
  mainCategories = [], 
  allProfiles, 
  onAddCategory, 
  onAddMainCategory, 
  onDeleteCategory, 
  onDeleteMainCategory, 
  onApproveProfile, 
  onDeleteProfile,
  plans = [],
  purchases = [],
  onCreatePlan,
  onUpdatePlan,
  onDeletePlan,
  onApprovePurchase,
  onDeclinePurchase
}) {
  const [newMainName, setNewMainName] = useState('');
  const [subInputs, setSubInputs] = useState({});
  const [lastAddedMainCategory, setLastAddedMainCategory] = useState(null);

  // Admin Sub-Tab control: 'profiles' (default), 'packages', 'categories'
  const [activeSubTab, setActiveSubTab] = useState('profiles');

  // New Plan Creation States
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [planAdCount, setPlanAdCount] = useState('1');
  const [planDesc, setPlanDesc] = useState('');

  // Editing Plan States
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editAdCount, setEditAdCount] = useState('1');
  const [editDesc, setEditDesc] = useState('');

  const handleStartEdit = (plan) => {
    setEditingPlanId(plan._id);
    setEditName(plan.name || '');
    setEditPrice(plan.price !== undefined ? plan.price.toString() : '');
    setEditAdCount(plan.adCount !== undefined ? plan.adCount.toString() : '1');
    setEditDesc(plan.description || '');
  };

  const handleCancelPlanEdit = () => {
    setEditingPlanId(null);
    setEditName('');
    setEditPrice('');
    setEditAdCount('1');
    setEditDesc('');
  };

  const handleSavePlanEdit = async (id) => {
    if (!editName.trim() || !editPrice || !editAdCount) return;
    await onUpdatePlan(id, editName.trim(), Number(editPrice), Number(editAdCount), editDesc.trim());
    handleCancelPlanEdit();
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    if (!planName.trim() || !planPrice || !planAdCount) return;
    await onCreatePlan(planName.trim(), Number(planPrice), Number(planAdCount), planDesc.trim());
    setPlanName('');
    setPlanPrice('');
    setPlanAdCount('1');
    setPlanDesc('');
  };

  const handleMainCatSubmit = async (e) => {
    e.preventDefault();
    if (!newMainName.trim()) return;
    const newMain = await onAddMainCategory(newMainName.trim());
    if (newMain) {
      setLastAddedMainCategory(newMain);
    }
    setNewMainName('');
  };

  const handleSubInputChange = (mainCatId, value) => {
    setSubInputs(prev => ({
      ...prev,
      [mainCatId]: value
    }));
  };

  const handleAddSubCategory = async (e, mainCatId) => {
    e.preventDefault();
    const name = subInputs[mainCatId];
    if (!name || !name.trim()) return;

    await onAddCategory(name.trim(), mainCatId);
    setSubInputs(prev => ({
      ...prev,
      [mainCatId]: ''
    }));
  };

  const handleQuickLink = async (name) => {
    if (!lastAddedMainCategory) return;
    await onAddCategory(name, lastAddedMainCategory._id);
  };

  const pendingList = allProfiles.filter(p => p.status === 'pending');
  const approvedList = allProfiles.filter(p => p.status === 'approved');

  // Generate unique subcategory names in DB for autocomplete datalist
  const uniqueSubNames = Array.from(new Set(categories.map(c => c.name))).sort();

  // Find subcategories linked to the newly created main category
  const activeLinkedSubs = lastAddedMainCategory 
    ? categories.filter(cat => cat.mainCategory?._id === lastAddedMainCategory._id || cat.mainCategory === lastAddedMainCategory._id || cat.mainCategory?.name === lastAddedMainCategory.name)
    : [];

  const activeLinkedNames = new Set(activeLinkedSubs.map(c => c.name.toLowerCase()));

  // Available existing subcategories to quick-link
  const quickLinkCandidates = lastAddedMainCategory
    ? categories.filter(c => !activeLinkedNames.has(c.name.toLowerCase()))
    : [];

  // Filter candidate list to be unique by name
  const uniqueCandidates = [];
  const candidateNamesSeen = new Set();
  for (const c of quickLinkCandidates) {
    const lower = c.name.toLowerCase();
    if (!candidateNamesSeen.has(lower)) {
      candidateNamesSeen.add(lower);
      uniqueCandidates.push(c);
    }
  }

  return (
    <div className="admin-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', animation: 'fadeIn 0.5s ease-out' }}>
      <style>{`
        .admin-dashboard,
        .admin-dashboard h1,
        .admin-dashboard h2,
        .admin-dashboard h3,
        .admin-dashboard h4,
        .admin-dashboard h5,
        .admin-dashboard h6,
        .admin-dashboard p,
        .admin-dashboard span,
        .admin-dashboard strong,
        .admin-dashboard button,
        .admin-dashboard input,
        .admin-dashboard select,
        .admin-dashboard textarea,
        .admin-dashboard table,
        .admin-dashboard th,
        .admin-dashboard td,
        .admin-dashboard div {
          font-family: var(--font-sans) !important;
          font-style: normal !important;
        }
      `}</style>
      
      {/* Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-gold-400)' }}>
        <ShieldAlert size={28} />
        <h2 className="section-title" style={{ margin: '0', fontSize: '2rem' }}>Administrative Governance Console</h2>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        borderBottom: '1px solid var(--card-border)',
        marginBottom: '1rem',
        paddingBottom: '0.2rem',
        flexWrap: 'wrap'
      }}>
        <button
          type="button"
          onClick={() => setActiveSubTab('profiles')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            color: activeSubTab === 'profiles' ? 'var(--color-gold-400)' : 'var(--text-secondary)',
            borderBottom: activeSubTab === 'profiles' ? '3px solid var(--color-gold-400)' : '3px solid transparent',
            transition: 'var(--transition)',
            cursor: 'pointer',
            background: 'none',
            outline: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none'
          }}
        >
          <Users size={16} /> Profile Activation & Governance
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('packages')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            color: activeSubTab === 'packages' ? 'var(--color-gold-400)' : 'var(--text-secondary)',
            borderBottom: activeSubTab === 'packages' ? '3px solid var(--color-gold-400)' : '3px solid transparent',
            transition: 'var(--transition)',
            cursor: 'pointer',
            background: 'none',
            outline: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none'
          }}
        >
          <CreditCard size={16} /> Packages & Payment Plans
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('categories')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            color: activeSubTab === 'categories' ? 'var(--color-gold-400)' : 'var(--text-secondary)',
            borderBottom: activeSubTab === 'categories' ? '3px solid var(--color-gold-400)' : '3px solid transparent',
            transition: 'var(--transition)',
            cursor: 'pointer',
            background: 'none',
            outline: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none'
          }}
        >
          <Tag size={16} /> Categories & Mappings
        </button>
      </div>

      {/* ==================== SECTION 1: Curated Categories Mapping Console ==================== */}
      {activeSubTab === 'categories' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
          <Tag size={20} color="var(--color-gold-400)" />
          <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Curated Categories Mapping Console</h3>
        </div>

        {/* Create Main Category Form (Inline) */}
        <div className="luxury-card" style={{ padding: '1.5rem 2rem' }}>
          <form onSubmit={handleMainCatSubmit} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold-400)' }}>
              <Plus size={18} />
              <span style={{ fontWeight: 600, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Main Category:</span>
            </div>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <input
                type="text"
                placeholder="Type new category name (e.g., Festival Events, Sports)..."
                className="form-control"
                required
                value={newMainName}
                onChange={(e) => setNewMainName(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> Create Main Category
            </button>
          </form>
        </div>

        {/* Quick Setup Console (Dynamically displayed for the newly added Main Category) */}
        {lastAddedMainCategory && (
          <div className="luxury-card" style={{ 
            padding: '2rem', 
            border: '2px solid var(--color-gold-400)', 
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.25)', 
            background: 'var(--bg-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            animation: 'fadeIn 0.4s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-gold-400)' }}>
                <Award size={22} />
                <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
                  ✨ Quick Setup: Subcategories for "{lastAddedMainCategory.name}"
                </h4>
              </div>
              <button 
                onClick={() => setLastAddedMainCategory(null)} 
                style={{ color: 'var(--text-muted)', cursor: 'pointer', transition: 'var(--transition)' }}
                title="Dismiss Console"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              
              {/* Left side: Add form & dynamic autocomplete suggestion tag-cloud */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <form onSubmit={(e) => handleAddSubCategory(e, lastAddedMainCategory._id)} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    list="existing-subs"
                    placeholder="Type subcategory name (e.g. Photography)..."
                    className="form-control"
                    style={{ padding: '0.65rem 0.95rem', fontSize: '0.88rem', flex: 1 }}
                    required
                    autoFocus
                    value={subInputs[lastAddedMainCategory._id] || ''}
                    onChange={(e) => handleSubInputChange(lastAddedMainCategory._id, e.target.value)}
                  />
                  <datalist id="existing-subs">
                    {uniqueSubNames.map(name => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                  <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Plus size={15} /> Add
                  </button>
                </form>

                {/* Existing Database Subcategories Suggestions tag list */}
                {uniqueCandidates.length > 0 && (
                  <div style={{ borderTop: '1px solid rgba(212,175,55,0.08)', paddingTop: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.6rem', fontWeight: 600 }}>
                      🔗 Quick-Link Existing Database Subcategories:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '120px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                      {uniqueCandidates.map(c => (
                        <button
                          key={c._id}
                          onClick={() => handleQuickLink(c.name)}
                          className="badge pending"
                          style={{
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '30px',
                            border: '1px solid rgba(212, 175, 55, 0.25)',
                            background: 'rgba(212, 175, 55, 0.04)',
                            color: 'var(--color-gold-400)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            transition: 'var(--transition)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.04)';
                            e.currentTarget.style.transform = 'none';
                          }}
                        >
                          <Plus size={11} /> {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right side: Mapped subcategories list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Mapped Subcategories ({activeLinkedSubs.length}):
                </strong>
                <div style={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  maxHeight: '180px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.5rem', 
                  background: 'rgba(0, 0, 0, 0.2)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '0.75rem' 
                }}>
                  {activeLinkedSubs.map(cat => (
                    <div 
                      key={cat._id} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '0.5rem 0.75rem', 
                        background: 'var(--bg-secondary)', 
                        borderRadius: 'var(--radius-sm)', 
                        borderLeft: '3px solid var(--color-gold-400)',
                        fontSize: '0.85rem'
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{cat.name}</span>
                      <button
                        className="action-icon-btn delete"
                        title={`Delete subcategory ${cat.name}`}
                        onClick={() => onDeleteCategory(cat.name)}
                        style={{ padding: '0.1rem' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {activeLinkedSubs.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '2rem 0' }}>
                      No subcategories mapped yet.
                    </div>
                  )}
                </div>
              </div>
              
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--card-border)', paddingTop: '0.75rem' }}>
              <button 
                onClick={() => setLastAddedMainCategory(null)} 
                className="btn-secondary" 
                style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }}
              >
                Done & Continue
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Grid of Main Category Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {mainCategories.map(m => {
            const linkedSubs = categories.filter(cat => cat.mainCategory?._id === m._id || cat.mainCategory === m._id || cat.mainCategory?.name === m.name);

            return (
              <div 
                key={m._id} 
                className="luxury-card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%', 
                  minHeight: '380px', 
                  padding: '1.75rem',
                  transition: 'var(--transition)'
                }}
              >
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={18} color="var(--color-gold-400)" />
                    <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{m.name}</strong>
                  </div>
                  <button
                    className="action-icon-btn delete"
                    title={`Remove Main Category: ${m.name}`}
                    onClick={() => onDeleteMainCategory(m.name)}
                    style={{ opacity: 0.7, padding: '0.25rem' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Inline Add Subcategory input field */}
                <form onSubmit={(e) => handleAddSubCategory(e, m._id)} style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
                  <input
                    type="text"
                    placeholder={`Add subcategory...`}
                    className="form-control"
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', flex: 1 }}
                    required
                    value={subInputs[m._id] || ''}
                    onChange={(e) => handleSubInputChange(m._id, e.target.value)}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={14} />
                  </button>
                </form>

                {/* Linked Subcategories List */}
                <div style={{ flex: 1, overflowY: 'auto', maxHeight: '220px', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.15rem' }}>
                  {linkedSubs.map(cat => (
                    <div 
                      key={cat._id} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '0.6rem 0.85rem', 
                        background: 'var(--bg-secondary)', 
                        borderRadius: 'var(--radius-sm)', 
                        borderLeft: '3px solid var(--color-gold-400)',
                        fontSize: '0.88rem'
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{cat.name}</span>
                      <button
                        className="action-icon-btn delete"
                        title={`Delete subcategory ${cat.name}`}
                        onClick={() => onDeleteCategory(cat.name)}
                        style={{ padding: '0.1rem' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {linkedSubs.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '2.5rem 0' }}>
                      No subcategories mapped yet.
                    </div>
                  )}
                </div>
              </div>
            );
        })}
      </div>
    </div>
      )}

        {/* ==================== SECTION 1.5: Payment Plans & Promotion Governance ==================== */}
      {activeSubTab === 'packages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
          <CreditCard size={20} color="var(--color-gold-400)" />
          <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Payment Plans & Promotion Governance</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Create Plan Card */}
          <div className="luxury-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
              <Plus size={18} color="var(--color-gold-400)" />
              <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Create Subscription Plan</strong>
            </div>
            <form onSubmit={handlePlanSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Plan Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Plan A (Bronze)"
                  className="form-control"
                  style={{ padding: '0.6rem 0.85rem', fontSize: '0.88rem' }}
                  required
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Price (LKR):</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    className="form-control"
                    style={{ padding: '0.6rem 0.85rem', fontSize: '0.88rem' }}
                    required
                    value={planPrice}
                    onChange={(e) => setPlanPrice(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Ad Count (Slots):</label>
                  <select
                    className="form-control"
                    style={{ padding: '0.6rem 0.85rem', fontSize: '0.88rem', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    required
                    value={planAdCount}
                    onChange={(e) => setPlanAdCount(e.target.value)}
                  >
                    <option value="1">1 Ad Slot</option>
                    <option value="2">2 Ad Slots</option>
                    <option value="3">3 Ad Slots</option>
                    <option value="5">5 Ad Slots</option>
                    <option value="10">10 Ad Slots</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Description:</label>
                <textarea
                  placeholder="Describe plan features..."
                  className="form-control"
                  style={{ padding: '0.6rem 0.85rem', fontSize: '0.88rem', height: '60px', resize: 'none' }}
                  value={planDesc}
                  onChange={(e) => setPlanDesc(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1.5rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <Plus size={16} /> Create Package
              </button>
            </form>
          </div>

          {/* Pending Purchases Checkout Queue */}
          <div className="luxury-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
              <CreditCard size={18} color="var(--color-gold-400)" />
              <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Pending Plan Approvals ({purchases.filter(p => p.status === 'pending').length})</strong>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', maxHeight: '310px', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.25rem' }}>
              {purchases.filter(p => p.status === 'pending').map(purchase => (
                <div 
                  key={purchase._id}
                  style={{
                    padding: '1rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--card-border)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {purchase.userId?.name || 'Anonymous User'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {purchase.userId?.email || 'No Email'}
                      </div>
                    </div>
                    <span className="badge pending" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                      {purchase.planId?.name || 'Unknown Plan'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(212, 175, 55, 0.08)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-gold-400)', fontWeight: 600 }}>
                      Price: LKR {purchase.planId?.price?.toLocaleString() || '0'}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => onApprovePurchase(purchase._id)}
                        className="btn-primary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#0b0f19' }}
                        title="Approve Order"
                      >
                        <Check size={12} /> Approve
                      </button>
                      <button
                        onClick={() => onDeclinePurchase(purchase._id)}
                        className="action-icon-btn delete"
                        style={{
                          background: 'rgba(248, 113, 113, 0.1)',
                          border: '1px solid rgba(248, 113, 113, 0.2)',
                          padding: '0.35rem 0.5rem',
                          borderRadius: 'var(--radius-sm)'
                        }}
                        title="Decline Order"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {purchases.filter(p => p.status === 'pending').length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', padding: '3.5rem 0' }}>
                  No pending checkout requests to approve.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Manage Subscription Plans Card (Full Width) */}
        <div className="luxury-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
            <CreditCard size={18} color="var(--color-gold-400)" />
            <strong style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Manage Subscription Plans ({plans.length})</strong>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="luxury-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Plan Name</th>
                  <th style={{ width: '18%' }}>Price (LKR)</th>
                  <th style={{ width: '15%' }}>Ad Allowance</th>
                  <th style={{ width: '30%' }}>Description</th>
                  <th style={{ width: '15%', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => {
                  const isEditing = editingPlanId === plan._id;
                  
                  return (
                    <tr key={plan._id} style={{ transition: 'background-color 0.2s' }}>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            style={{ padding: '0.4rem 0.65rem', fontSize: '0.88rem' }}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                          />
                        ) : (
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{plan.name}</span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            className="form-control"
                            style={{ padding: '0.4rem 0.65rem', fontSize: '0.88rem' }}
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            required
                          />
                        ) : (
                          <span>LKR {plan.price?.toLocaleString() || '0'}</span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <select
                            className="form-control"
                            style={{ padding: '0.4rem 0.65rem', fontSize: '0.88rem', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                            value={editAdCount}
                            onChange={(e) => setEditAdCount(e.target.value)}
                            required
                          >
                            <option value="1">1 Ad Slot</option>
                            <option value="2">2 Ad Slots</option>
                            <option value="3">3 Ad Slots</option>
                            <option value="5">5 Ad Slots</option>
                            <option value="10">10 Ad Slots</option>
                          </select>
                        ) : (
                          <span className="badge pending" style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}>
                            {plan.adCount} Ad Slot{plan.adCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <textarea
                            className="form-control"
                            style={{ padding: '0.4rem 0.65rem', fontSize: '0.85rem', height: '40px', resize: 'none' }}
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                          />
                        ) : (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{plan.description || 'No description provided.'}</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSavePlanEdit(plan._id)}
                                className="btn-primary"
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#0b0f19' }}
                                title="Save Plan Changes"
                              >
                                <Check size={12} /> Save
                              </button>
                              <button
                                onClick={handleCancelPlanEdit}
                                className="action-icon-btn delete"
                                style={{
                                  background: 'rgba(248, 113, 113, 0.1)',
                                  border: '1px solid rgba(248, 113, 113, 0.2)',
                                  padding: '0.35rem 0.5rem',
                                  borderRadius: 'var(--radius-sm)'
                                }}
                                title="Cancel Edit"
                              >
                                <X size={12} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEdit(plan)}
                                className="btn-secondary"
                                style={{
                                  padding: '0.35rem 0.75rem',
                                  fontSize: '0.78rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  border: '1px solid var(--card-border)'
                                }}
                                title="Edit Subscription Plan"
                              >
                                <Pencil size={11} /> Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete the plan "${plan.name}"?`)) {
                                    onDeletePlan(plan._id);
                                  }
                                }}
                                className="action-icon-btn delete"
                                style={{
                                  padding: '0.35rem 0.5rem',
                                  borderRadius: 'var(--radius-sm)'
                                }}
                                title="Delete Plan"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {plans.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No subscription plans found. Use the creation console to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      )}

      {/* ==================== SECTION 2: Vendor Moderation & Directory Governance ==================== */}
      {activeSubTab === 'profiles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
          <Users size={20} color="var(--color-gold-400)" />
          <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Vendor Registrations & Moderation Governance</h3>
        </div>

        {/* Moderation Pending Queue */}
        <div className="luxury-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
            <Users size={18} color="var(--color-gold-400)" />
            <h3 style={{ fontSize: '1.4rem' }}>Pending Profile Approvals ({pendingList.length})</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {pendingList.map(profile => (
              <div key={profile._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(21, 28, 45, 0.4)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '1.25rem 1.5rem' }}>
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{profile.businessName}</strong>
                    <span className="badge pending" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>{profile.category}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    📍 Location: <strong>{profile.location}</strong> | Address: {profile.address}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    📧 Email: {profile.businessEmail} | 📞 Phone: {profile.phone}
                  </div>
                  {profile.description && (
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.6rem', borderTop: '1px solid rgba(212,175,55,0.08)', paddingTop: '0.5rem' }}>
                      {profile.description.slice(0, 150)}...
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button
                    className="btn-primary"
                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: '#0b0f19' }}
                    onClick={() => onApproveProfile(profile._id)}
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button
                    className="action-icon-btn delete"
                    style={{ background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}
                    title="Decline/Delete Application"
                    onClick={() => onDeleteProfile(profile._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {pendingList.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                🎉 Review queue is empty. No pending applications to moderate.
              </div>
            )}
          </div>
        </div>

        {/* Approved Vendor Registry */}
        <div className="luxury-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
            <Award size={18} color="var(--color-gold-400)" />
            <h3 style={{ fontSize: '1.4rem' }}>Approved Vendor Registry ({approvedList.length})</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Business Details</th>
                  <th>Category</th>
                  <th>HQ Location</th>
                  <th>SLA Pricing</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvedList.map(profile => (
                  <tr key={profile._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{profile.businessName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{profile.businessEmail}</div>
                    </td>
                    <td>
                      <span className="badge VIP" style={{ fontSize: '0.7rem' }}>{profile.category}</span>
                    </td>
                    <td>{profile.location}</td>
                    <td>{profile.pricing || 'Custom Rates'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
                        <span className="badge active" style={{ background: 'rgba(52, 211, 153, 0.12)', color: 'var(--success)' }}>Active gig</span>
                        <button
                          className="action-icon-btn delete"
                          title="Delete approved Gig"
                          onClick={() => onDeleteProfile(profile._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {approvedList.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No approved vendors registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

    </div>
  );
}
