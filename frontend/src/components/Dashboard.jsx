import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, Users, DollarSign, CheckSquare, Clock, TrendingUp, Sparkles } from 'lucide-react';

export default function Dashboard({ guests, budgetItems, setTab }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    // Set Q4 Enterprise target date to September 18, 2026
    const targetDate = new Date('2026-09-18T16:00:00');
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Summary Metrics
  const activeClients = guests.filter(g => g.status === 'active').length;
  const leadClients = guests.filter(g => g.status === 'lead').length;

  const totalEstimated = budgetItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actualCost, 0);
  const totalPaid = budgetItems.reduce((sum, item) => sum + item.paidAmount, 0);

  // Paid percentage of actual budget
  const budgetProgress = totalActual > 0 ? Math.round((totalPaid / totalActual) * 100) : 0;

  // Professional checklists
  const checklists = [
    { id: 1, text: 'Finalize Cloud Server Infrastructure', done: totalActual > 0 },
    { id: 2, text: 'Approve Senior Architecture Audit Deposit', done: totalPaid > 4000 },
    { id: 3, text: 'Confirm Key Stakeholders Register', done: guests.length > 0 },
    { id: 4, text: 'Hire Dev Sprint Contractor team', done: budgetItems.some(i => i.itemName.includes('Sprint') && i.actualCost > 0) }
  ];
  const completedChecklists = checklists.filter(c => c.done).length;

  return (
    <div className="dashboard-content">
      {/* Hero Section */}
      <div className="hero-section" style={{ background: 'radial-gradient(circle at top right, rgba(212, 175, 55, 0.1), transparent 50%)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-md)', marginBottom: '3.5rem' }}>
        <div className="hero-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold-400)', marginBottom: '0.5rem' }}>
            <Sparkles size={16} />
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>Enterprise Operations</span>
          </div>
          <h1>System Command Center</h1>
          <p className="hero-subtitle">Q4 Milestone Release Target • September 18, 2026</p>
          
          <div className="countdown-container">
            <div className="countdown-box">
              <div className="countdown-num">{timeLeft.days}</div>
              <div className="countdown-lbl">Days</div>
            </div>
            <div className="countdown-box">
              <div className="countdown-num">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="countdown-lbl">Hrs</div>
            </div>
            <div className="countdown-box">
              <div className="countdown-num">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="countdown-lbl">Min</div>
            </div>
            <div className="countdown-box">
              <div className="countdown-num">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="countdown-lbl">Sec</div>
            </div>
          </div>
        </div>
        <div className="hero-logo-art" style={{ opacity: 0.08 }}>
          <Briefcase size={200} strokeWidth={1} color="var(--color-gold-400)" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="luxury-card stat-card" onClick={() => setTab('clients')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{guests.length}</div>
            <div className="stat-lbl">Registered Clients</div>
          </div>
        </div>

        <div className="luxury-card stat-card" onClick={() => setTab('finance')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">${totalPaid.toLocaleString()}</div>
            <div className="stat-lbl">Settled Expenses</div>
          </div>
        </div>

        <div className="luxury-card stat-card" onClick={() => setTab('finance')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">${(totalActual - totalPaid).toLocaleString()}</div>
            <div className="stat-lbl">Outstanding Balance</div>
          </div>
        </div>

        <div className="luxury-card stat-card">
          <div className="stat-icon">
            <CheckSquare size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{completedChecklists}/{checklists.length}</div>
            <div className="stat-lbl">Milestones Reached</div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Panels */}
      <div className="dashboard-grid">
        {/* Budget Health */}
        <div className="luxury-card">
          <div className="section-header">
            <h3 className="section-title">Transactional Capital Health</h3>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-gold-400)', fontWeight: 600 }}>{budgetProgress}% Settled</span>
          </div>
          
          <div style={{ margin: '1.5rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              <span>Estimates Scope: <strong>${totalEstimated.toLocaleString()}</strong></span>
              <span>Incurred Expenditures: <strong style={{ color: 'var(--color-gold-400)' }}>${totalActual.toLocaleString()}</strong></span>
            </div>
            <div className="progress-container">
              <div className="progress-fill" style={{ width: `${budgetProgress}%` }}></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Disbursed</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--success)' }}>${totalPaid.toLocaleString()}</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Accrued Unpaid</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--error)' }}>${(totalActual - totalPaid).toLocaleString()}</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Accumulated Capital</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)' }}>${totalActual.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Milestone Tracker Checklist */}
        <div className="luxury-card">
          <div className="section-header">
            <h3 className="section-title">Critical Sprint Goals</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            {checklists.map(checklist => (
              <div key={checklist.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: checklist.done ? 0.7 : 1 }}>
                <input
                  type="checkbox"
                  checked={checklist.done}
                  readOnly
                  style={{
                    accentColor: 'var(--color-gold-400)',
                    width: '18px',
                    height: '18px',
                    cursor: 'default'
                  }}
                />
                <span style={{
                  textDecoration: checklist.done ? 'line-through' : 'none',
                  fontSize: '0.95rem',
                  color: checklist.done ? 'var(--text-muted)' : 'var(--text-primary)',
                  fontWeight: checklist.done ? '400' : '500'
                }}>
                  {checklist.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row of Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
        {/* Recent Client Leads */}
        <div className="luxury-card">
          <div className="section-header">
            <h3 className="section-title">Recent CRM Accounts</h3>
            <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => setTab('clients')}>View CRM</button>
          </div>
          <div className="list-container" style={{ marginTop: '1.5rem' }}>
            {guests.slice(0, 3).map(client => (
              <div key={client._id} className="list-item">
                <div>
                  <div style={{ fontWeight: 600 }}>{client.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{client.company || 'Private Lead'}</div>
                </div>
                <span className={`badge ${client.tier}`}>{client.tier}</span>
              </div>
            ))}
            {guests.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No clients cataloged yet.</div>
            )}
          </div>
        </div>

        {/* Priority Deliveries / Deadlines */}
        <div className="luxury-card">
          <div className="section-header">
            <h3 className="section-title">Upcoming Invoices Due</h3>
            <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => setTab('finance')}>Open Ledger</button>
          </div>
          <div className="list-container" style={{ marginTop: '1.5rem' }}>
            {budgetItems
              .filter(item => item.paymentStatus !== 'paid')
              .slice(0, 3)
              .map(item => (
                <div key={item._id} className="list-item">
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.itemName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600, color: 'var(--error)' }}>${(item.actualCost - item.paidAmount).toLocaleString()}</div>
                    <span className={`badge ${item.paymentStatus}`}>{item.paymentStatus}</span>
                  </div>
                </div>
              ))}
            {budgetItems.filter(item => item.paymentStatus !== 'paid').length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>All accounts settled! 🎉</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
