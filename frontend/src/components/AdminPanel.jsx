import React, { useState } from 'react';
import { Plus, Trash2, Check, X, ShieldAlert, Award, FileText, Tag, Users } from 'lucide-react';

export default function AdminPanel({ categories, allProfiles, onAddCategory, onDeleteCategory, onApproveProfile, onDeleteProfile }) {
  const [newCatName, setNewCatName] = useState('');

  const handleCatSubmit = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim());
    setNewCatName('');
  };

  const pendingList = allProfiles.filter(p => p.status === 'pending');
  const approvedList = allProfiles.filter(p => p.status === 'approved');

  return (
    <div className="admin-dashboard">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold-400)', marginBottom: '2rem' }}>
        <ShieldAlert size={24} />
        <h2 className="section-title" style={{ margin: '0' }}>Administrative Governance Console</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.5rem' }}>
        
        {/* Category Manager */}
        <div className="luxury-card" style={{ height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
            <Tag size={18} color="var(--color-gold-400)" />
            <h3 style={{ fontStyle: 'italic', fontSize: '1.4rem' }}>Category Manager</h3>
          </div>

          <form onSubmit={handleCatSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="e.g., Car Rental"
              className="form-control"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center' }}>
              <Plus size={16} />
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {categories.map(cat => (
              <div key={cat._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1.2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-gold-400)' }}>
                <span style={{ fontWeight: 500 }}>{cat.name}</span>
                <button
                  className="action-icon-btn delete"
                  title="Remove Category"
                  onClick={() => onDeleteCategory(cat.name)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No categories created.</div>
            )}
          </div>
        </div>

        {/* Business Moderation Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Moderation Pending Queue */}
          <div className="luxury-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
              <Users size={18} color="var(--color-gold-400)" />
              <h3 style={{ fontStyle: 'italic', fontSize: '1.4rem' }}>Pending Profile Approvals ({pendingList.length})</h3>
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

          {/* Approved registry */}
          <div className="luxury-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
              <Award size={18} color="var(--color-gold-400)" />
              <h3 style={{ fontStyle: 'italic', fontSize: '1.4rem' }}>Approved Vendor Registry ({approvedList.length})</h3>
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

      </div>

    </div>
  );
}
