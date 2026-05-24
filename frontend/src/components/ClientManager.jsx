import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit3, UserCheck, UserMinus, HelpCircle, Mail, Phone, Briefcase } from 'lucide-react';

export default function ClientManager({ guests, onAdd, onUpdate, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('all');

  // Form Fields State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [tier, setTier] = useState('Standard');
  const [status, setStatus] = useState('lead');
  const [phone, setPhone] = useState('');
  const [projectNotes, setProjectNotes] = useState('');

  const openAddModal = () => {
    setEditingClient(null);
    setName('');
    setEmail('');
    setCompany('');
    setTier('Standard');
    setStatus('lead');
    setPhone('');
    setProjectNotes('');
    setShowModal(true);
  };

  const openEditModal = (client) => {
    setEditingClient(client);
    setName(client.name || '');
    setEmail(client.email || '');
    setCompany(client.company || '');
    setTier(client.tier || 'Standard');
    setStatus(client.status || 'lead');
    setPhone(client.phone || '');
    setProjectNotes(client.projectNotes || '');
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const clientData = { name, email, company, tier, status, phone, projectNotes };
    
    if (editingClient) {
      onUpdate(editingClient._id, clientData);
    } else {
      onAdd(clientData);
    }
    setShowModal(false);
  };

  // Pipeline Counts
  const totalCount = guests.length;
  const activeCount = guests.filter(c => c.status === 'active').length;
  const leadCount = guests.filter(c => c.status === 'lead').length;
  const inactiveCount = guests.filter(c => c.status === 'inactive').length;

  // Filters
  const filteredClients = guests.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterTab === 'all') return matchesSearch;
    return matchesSearch && client.status === filterTab;
  });

  return (
    <div className="client-manager">
      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="luxury-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-gold-400)' }}>
            <Briefcase size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{totalCount}</div>
            <div className="stat-lbl">CRM Accounts</div>
          </div>
        </div>

        <div className="luxury-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(52, 211, 153, 0.12)', color: 'var(--success)' }}>
            <UserCheck size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{activeCount}</div>
            <div className="stat-lbl">Active Service Contracts</div>
          </div>
        </div>

        <div className="luxury-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--pending)' }}>
            <HelpCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{leadCount}</div>
            <div className="stat-lbl">Sales Pipeline Leads</div>
          </div>
        </div>

        <div className="luxury-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(248, 113, 113, 0.12)', color: 'var(--error)' }}>
            <UserMinus size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{inactiveCount}</div>
            <div className="stat-lbl">Inactive / Archived</div>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="luxury-card" style={{ marginBottom: '2.5rem', padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {['all', 'active', 'lead', 'inactive'].map(tab => (
              <button
                key={tab}
                className="btn-secondary"
                style={{
                  padding: '0.45rem 1.25rem',
                  fontSize: '0.85rem',
                  background: filterTab === tab ? 'var(--color-gold-400)' : 'transparent',
                  color: filterTab === tab ? '#0b0f19' : 'var(--text-secondary)',
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
                placeholder="Search name, email, or company..."
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }} onClick={openAddModal}>
              <Plus size={16} /> Add Client
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
                <th>Account Representative</th>
                <th>Company</th>
                <th>Contract Tier</th>
                <th>Status</th>
                <th>Phone Number</th>
                <th>Project Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client._id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{client.name}</div>
                    {client.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        <Mail size={12} /> {client.email}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{client.company || 'N/A'}</div>
                  </td>
                  <td>
                    <span className={`badge ${client.tier}`}>{client.tier}</span>
                  </td>
                  <td>
                    <span className={`badge ${client.status}`}>{client.status}</span>
                  </td>
                  <td>
                    {client.phone ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-gold-400)' }}>
                        <Phone size={12} /> {client.phone}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>N/A</span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {client.projectNotes ? client.projectNotes.slice(0, 30) + '...' : 'No notes'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="action-icon-btn" title="Edit Client" onClick={() => openEditModal(client)}>
                      <Edit3 size={16} />
                    </button>
                    <button className="action-icon-btn delete" title="Delete Client" onClick={() => onDelete(client._id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No corporate client accounts cataloged. Register one above to initiate!
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
              {editingClient ? 'Edit CRM Account' : 'Register Corporate Client'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Representative Name *</label>
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
                    required
                    className="form-control"
                    placeholder="e.g., representative@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Organization / Company</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Cyberdyne Systems"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Phone Line</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., +1-555-0100"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Service Tier</label>
                  <select
                    className="form-control"
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                  >
                    <option value="Standard">Standard Support</option>
                    <option value="Premium">Premium SLA</option>
                    <option value="VIP">VIP Executive Tier</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Pipeline Status</label>
                  <select
                    className="form-control"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="lead">Sales Lead</option>
                    <option value="active">Active Client</option>
                    <option value="inactive">Archived / Past Client</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Project Scope & Private Notes</label>
                  <textarea
                    rows="4"
                    className="form-control"
                    placeholder="Describe enterprise demands, support requirements, custom SLA terms..."
                    style={{ resize: 'none' }}
                    value={projectNotes}
                    onChange={(e) => setProjectNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingClient ? 'Save Changes' : 'Register Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
