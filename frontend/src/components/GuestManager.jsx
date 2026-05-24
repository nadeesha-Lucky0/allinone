import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit3, UserCheck, UserMinus, HelpCircle, Mail, Utensils, Award } from 'lucide-react';

export default function GuestManager({ guests, onAdd, onUpdate, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('all');

  // Form Fields State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState('pending');
  const [guestsCount, setGuestsCount] = useState(1);
  const [dietaryRequirements, setDietaryRequirements] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [plusOneName, setPlusOneName] = useState('');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingGuest(null);
    setName('');
    setEmail('');
    setRsvpStatus('pending');
    setGuestsCount(1);
    setDietaryRequirements('');
    setTableNumber('');
    setPlusOneName('');
    setNotes('');
    setShowModal(true);
  };

  const openEditModal = (guest) => {
    setEditingGuest(guest);
    setName(guest.name || '');
    setEmail(guest.email || '');
    setRsvpStatus(guest.rsvpStatus || 'pending');
    setGuestsCount(guest.guestsCount || 1);
    setDietaryRequirements(guest.dietaryRequirements || '');
    setTableNumber(guest.tableNumber || '');
    setPlusOneName(guest.plusOneName || '');
    setNotes(guest.notes || '');
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const guestData = { name, email, rsvpStatus, guestsCount: Number(guestsCount), dietaryRequirements, tableNumber, plusOneName, notes };
    
    if (editingGuest) {
      onUpdate(editingGuest._id, guestData);
    } else {
      onAdd(guestData);
    }
    setShowModal(false);
  };

  // RSVP Stats
  const totalInvited = guests.reduce((sum, g) => sum + (g.guestsCount || 1), 0);
  const attending = guests.filter(g => g.rsvpStatus === 'attending').reduce((sum, g) => sum + (g.guestsCount || 1), 0);
  const declined = guests.filter(g => g.rsvpStatus === 'declined').reduce((sum, g) => sum + (g.guestsCount || 1), 0);
  const pending = guests.filter(g => g.rsvpStatus === 'pending').reduce((sum, g) => sum + (g.guestsCount || 1), 0);

  // Search & Filter lists
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (guest.email && guest.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterTab === 'all') return matchesSearch;
    return matchesSearch && guest.rsvpStatus === filterTab;
  });

  return (
    <div className="guest-manager">
      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="luxury-card stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-gold-100)', color: 'var(--color-gold-600)' }}>
            <Search size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{totalInvited}</div>
            <div className="stat-lbl">Total Invited Guests</div>
          </div>
        </div>

        <div className="luxury-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(95, 125, 106, 0.12)', color: 'var(--success)' }}>
            <UserCheck size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{attending}</div>
            <div className="stat-lbl">Confirmed Attending</div>
          </div>
        </div>

        <div className="luxury-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(182, 152, 90, 0.12)', color: 'var(--pending)' }}>
            <HelpCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{pending}</div>
            <div className="stat-lbl">Awaiting Response</div>
          </div>
        </div>

        <div className="luxury-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168, 107, 107, 0.12)', color: 'var(--error)' }}>
            <UserMinus size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{declined}</div>
            <div className="stat-lbl">Unable to Attend</div>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="luxury-card" style={{ marginBottom: '2.5rem', padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {['all', 'attending', 'pending', 'declined'].map(tab => (
              <button
                key={tab}
                className="btn-secondary"
                style={{
                  padding: '0.45rem 1.25rem',
                  fontSize: '0.85rem',
                  background: filterTab === tab ? 'var(--color-gold-400)' : 'transparent',
                  color: filterTab === tab ? '#ffffff' : 'var(--text-secondary)',
                  borderColor: filterTab === tab ? 'var(--color-gold-400)' : 'var(--color-gold-200)',
                }}
                onClick={() => setFilterTab(tab)}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Search bar & Add Button */}
          <div style={{ display: 'flex', gap: '1rem', flex: 1, justifySelf: 'end', maxWidth: '500px', width: '100%' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Search by name or email..."
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }} onClick={openAddModal}>
              <Plus size={16} /> Add Guest
            </button>
          </div>

        </div>
      </div>

      {/* Guest Table Container */}
      <div className="luxury-card" style={{ padding: '0.5rem 1.5rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Guest Details</th>
                <th>RSVP Status</th>
                <th>Party Size</th>
                <th>Table</th>
                <th>Dietary Rules</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map(guest => (
                <tr key={guest._id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{guest.name}</div>
                    {guest.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        <Mail size={12} /> {guest.email}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${guest.rsvpStatus}`}>{guest.rsvpStatus}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{guest.guestsCount}</div>
                    {guest.plusOneName && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        + {guest.plusOneName}
                      </div>
                    )}
                  </td>
                  <td>
                    {guest.tableNumber ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-gold-600)', fontWeight: 600 }}>
                        <Award size={14} /> Table {guest.tableNumber}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Unassigned</span>
                    )}
                  </td>
                  <td>
                    {guest.dietaryRequirements ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-gold-700)', fontSize: '0.85rem' }}>
                        <Utensils size={12} /> {guest.dietaryRequirements}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Standard</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="action-icon-btn" title="Edit Guest" onClick={() => openEditModal(guest)}>
                      <Edit3 size={16} />
                    </button>
                    <button className="action-icon-btn delete" title="Delete Guest" onClick={() => onDelete(guest._id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredGuests.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No matching guests found. Add a new guest to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            <h3 className="section-title" style={{ marginBottom: '1.5rem' }}>
              {editingGuest ? 'Edit Wedding Guest' : 'Add New Wedding Guest'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g., Sarah Connor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="e.g., sarah@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>RSVP Status</label>
                  <select
                    className="form-control"
                    value={rsvpStatus}
                    onChange={(e) => setRsvpStatus(e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="attending">Attending</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Party Size (Number of Guests)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Plus One Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., John Doe"
                    value={plusOneName}
                    onChange={(e) => setPlusOneName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Table Assignment</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Table 4 or Bridal"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Dietary Requirements</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Gluten-Free, Vegan, Allergies"
                    value={dietaryRequirements}
                    onChange={(e) => setDietaryRequirements(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Private Notes</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Any private notes, relationship, gifts details..."
                    style={{ resize: 'none' }}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingGuest ? 'Save Changes' : 'Invite Guest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
