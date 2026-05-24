import React, { useState } from 'react';
import { Plus, Trash2, Edit3, DollarSign, Calendar, TrendingDown, PiggyBank, Briefcase } from 'lucide-react';

export default function FinanceTracker({ budgetItems, onAdd, onUpdate, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  // Form Fields State
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Other');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [actualCost, setActualCost] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [dueDate, setDueDate] = useState('');

  const openAddModal = () => {
    setEditingItem(null);
    setItemName('');
    setCategory('Other');
    setEstimatedCost(0);
    setActualCost(0);
    setPaidAmount(0);
    setDueDate('');
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setItemName(item.itemName || '');
    setCategory(item.category || 'Other');
    setEstimatedCost(item.estimatedCost || 0);
    setActualCost(item.actualCost || 0);
    setPaidAmount(item.paidAmount || 0);
    setDueDate(item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : '');
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const est = Number(estimatedCost);
    const act = Number(actualCost);
    const paid = Number(paidAmount);
    
    // Auto calculate payment status
    let paymentStatus = 'unpaid';
    if (paid >= act && act > 0) {
      paymentStatus = 'paid';
    } else if (paid > 0) {
      paymentStatus = 'partial';
    }

    const itemData = {
      itemName,
      category,
      estimatedCost: est,
      actualCost: act,
      paidAmount: paid,
      paymentStatus,
      dueDate: dueDate ? new Date(dueDate) : null
    };

    if (editingItem) {
      onUpdate(editingItem._id, itemData);
    } else {
      onAdd(itemData);
    }
    setShowModal(false);
  };

  // Calculations
  const totalEstimated = budgetItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actualCost, 0);
  const totalPaid = budgetItems.reduce((sum, item) => sum + item.paidAmount, 0);
  const totalPending = totalActual - totalPaid;

  const filteredItems = filterCategory === 'all' 
    ? budgetItems 
    : budgetItems.filter(item => item.category === filterCategory);

  const categories = ['all', 'Consulting', 'SaaS', 'Marketing', 'Development', 'Hosting', 'Legal', 'Other'];

  return (
    <div className="finance-tracker">
      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="luxury-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-gold-400)' }}>
            <Briefcase size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">${totalEstimated.toLocaleString()}</div>
            <div className="stat-lbl">Project Estimates</div>
          </div>
        </div>

        <div className="luxury-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--warning)' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">${totalActual.toLocaleString()}</div>
            <div className="stat-lbl">Incurred Cost</div>
          </div>
        </div>

        <div className="luxury-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(52, 211, 153, 0.12)', color: 'var(--success)' }}>
            <PiggyBank size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">${totalPaid.toLocaleString()}</div>
            <div className="stat-lbl">Settled Ledger</div>
          </div>
        </div>

        <div className="luxury-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(248, 113, 113, 0.12)', color: 'var(--error)' }}>
            <TrendingDown size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">${totalPending.toLocaleString()}</div>
            <div className="stat-lbl">Remaining Balance</div>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="luxury-card" style={{ marginBottom: '2.5rem', padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                className="btn-secondary"
                style={{
                  padding: '0.4rem 1rem',
                  fontSize: '0.82rem',
                  background: filterCategory === cat ? 'var(--color-gold-400)' : 'transparent',
                  color: filterCategory === cat ? '#0b0f19' : 'var(--text-secondary)',
                  borderColor: filterCategory === cat ? 'var(--color-gold-400)' : 'var(--color-gold-200)',
                }}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={openAddModal}>
            <Plus size={16} /> Record Transaction
          </button>
        </div>
      </div>

      {/* Budget Table Container */}
      <div className="luxury-card" style={{ padding: '0.5rem 1.5rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Expense Item</th>
                <th>Category</th>
                <th>Estimated Cost</th>
                <th>Actual Cost</th>
                <th>Paid Amount</th>
                <th>Remaining</th>
                <th>Payment Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => {
                const remaining = item.actualCost - item.paidAmount;
                return (
                  <tr key={item._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.itemName}</div>
                      {item.dueDate && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                          <Calendar size={12} /> Due: {new Date(item.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.category}</span>
                    </td>
                    <td>${item.estimatedCost.toLocaleString()}</td>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>${item.actualCost.toLocaleString()}</strong>
                    </td>
                    <td style={{ color: 'var(--success)', fontWeight: 500 }}>
                      ${item.paidAmount.toLocaleString()}
                    </td>
                    <td style={{ color: remaining > 0 ? 'var(--error)' : 'var(--text-muted)', fontWeight: remaining > 0 ? '600' : '400' }}>
                      ${remaining.toLocaleString()}
                    </td>
                    <td>
                      <span className={`badge ${item.paymentStatus}`}>{item.paymentStatus}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="action-icon-btn" title="Edit Budget" onClick={() => openEditModal(item)}>
                        <Edit3 size={16} />
                      </button>
                      <button className="action-icon-btn delete" title="Delete Budget" onClick={() => onDelete(item._id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No corporate transactions recorded. Enter a new ledger item to log!
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
              {editingItem ? 'Edit Transaction Ledger' : 'Record Transaction'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Item Name / Service *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g., AWS Hosting Fees, Contractor Sprints"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Consulting">Consulting</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Development">Development</option>
                    <option value="Hosting">Hosting</option>
                    <option value="Legal">Legal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Payment Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Estimated Allocation ($)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Actual Incurred Invoice ($)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={actualCost}
                    onChange={(e) => setActualCost(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Settled Disbursed Amount ($)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingItem ? 'Save Changes' : 'Record Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
