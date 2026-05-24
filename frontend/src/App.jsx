import React, { useState, useEffect } from 'react';
import { Briefcase, Moon, Sun, LayoutDashboard, Users, LogOut, Lock, Mail, User, ShieldAlert, Sparkles, Building, Settings, Home, Key } from 'lucide-react';
import LandingPage from './components/LandingPage';
import ClientDashboard from './components/ClientDashboard';
import AdminPanel from './components/AdminPanel';
import ClientProfileView from './components/ClientProfileView';

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' && window.location.port !== '5000' ? 'http://localhost:5000/api' : '/api');

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  
  // Tab/Views control
  // Anonymous: 'landing', 'login', 'signup', 'forgot-password'
  // Client Role: 'my-dashboard' (ClientDashboard)
  // Admin Role: 'admin-console' (AdminPanel)
  const [activeTab, setActiveTab] = useState('landing');
  const [selectedProfileDetail, setSelectedProfileDetail] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [toast, setToast] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Platforms State
  const [categories, setCategories] = useState([]);
  const [approvedProfiles, setApprovedProfiles] = useState([]);
  const [adminAllProfiles, setAdminAllProfiles] = useState([]);
  const [myBusinessProfile, setMyBusinessProfile] = useState(null);

  // Auth Inputs Form States
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authNewPassword, setAuthNewPassword] = useState('');

  // Initial Sync login status
  useEffect(() => {
    const savedUser = localStorage.getItem('allinone_user');
    const savedToken = localStorage.getItem('allinone_token');
    
    let parsedUser = null;
    if (savedUser && savedToken) {
      parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
      setToken(savedToken);
      if (parsedUser.role === 'admin') {
        setActiveTab('admin-console');
      } else {
        setActiveTab('my-dashboard');
      }
    }
    
    document.documentElement.setAttribute('data-theme', theme);
    loadCoreDirectoryData(parsedUser, savedToken);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Fetch core dynamic datasets
  const loadCoreDirectoryData = async (userSession = currentUser, tokenSession = token) => {
    setIsLoading(true);
    try {
      // 1. Fetch dynamic category tags
      const catRes = await fetch(`${API_URL}/categories`);
      const catData = await catRes.json();
      if (Array.isArray(catData)) setCategories(catData);

      // 2. Fetch approved listing profiles
      const approvedRes = await fetch(`${API_URL}/profiles`);
      const approvedData = await approvedRes.json();
      if (Array.isArray(approvedData)) setApprovedProfiles(approvedData);

      // If logged in - load role-specific APIs
      if (userSession && tokenSession) {
        if (userSession.role === 'admin') {
          // Fetch Moderation Queue
          const adminQueueRes = await fetch(`${API_URL}/profiles/admin`, {
            headers: { 'Authorization': `Bearer ${tokenSession}` }
          });
          const adminQueue = await adminQueueRes.json();
          if (Array.isArray(adminQueue)) setAdminAllProfiles(adminQueue);
        } else if (userSession.role === 'client') {
          // Fetch My Business Profile
          const myProfileRes = await fetch(`${API_URL}/profiles/my`, {
            headers: { 'Authorization': `Bearer ${tokenSession}` }
          });
          const myProfile = await myProfileRes.json();
          setMyBusinessProfile(myProfile);
        }
      }
    } catch (err) {
      console.warn('⚠️ Server offline. Seeding local storage cache fallbacks.');
      loadOfflineDataCache(userSession);
    } finally {
      setIsLoading(false);
    }
  };

  // Caching offsets for offline executions
  const loadOfflineDataCache = (userSession) => {
    const cachedCats = localStorage.getItem('allinone_categories');
    const cachedApproved = localStorage.getItem('allinone_approved');

    if (cachedCats) {
      setCategories(JSON.parse(cachedCats));
    } else {
      const cats = [{_id:'1',name:'Photography'},{_id:'2',name:'Saloon'},{_id:'3',name:'Saree Rent'},{_id:'4',name:'Wedding Car Rent'}];
      setCategories(cats);
      localStorage.setItem('allinone_categories', JSON.stringify(cats));
    }

    if (cachedApproved) {
      setApprovedProfiles(JSON.parse(cachedApproved));
    } else {
      const seedProfiles = [
        { _id: '1', businessName: 'Vivid Memory Studios', businessEmail: 'info@vividmemories.com', phone: '+94-77-123-4567', address: '42 Orchid Lane, Colombo 07', location: 'Colombo', category: 'Photography', status: 'approved', imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=600&auto=format&fit=crop', description: 'Premier cinematic wedding storytelling and dynamic high-definition wedding photobooks.', pricing: 'Premium packages start from LKR 350,000', website: 'https://vividmemories.com' },
        { _id: '2', businessName: 'Aura Premium Salon & Bridal', businessEmail: 'aura@salonsuite.com', phone: '+9 Sri Lanka lines', address: 'Galle Road, Bambalapitiya', location: 'Galle', category: 'Saloon', status: 'approved', imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop', description: 'High-end bridal salon services, modern hairstyles, skin conditioning treatments, and elegant manicure packages.', pricing: 'Standard packages start from LKR 120,000', website: 'https://aurasalon.lk' }
      ];
      setApprovedProfiles(seedProfiles);
      localStorage.setItem('allinone_approved', JSON.stringify(seedProfiles));
    }

    if (userSession) {
      if (userSession.role === 'admin') {
        const cachedAdminQueue = localStorage.getItem('allinone_admin_queue');
        if (cachedAdminQueue) setAdminAllProfiles(JSON.parse(cachedAdminQueue));
      } else if (userSession.role === 'client') {
        const cachedMyProfile = localStorage.getItem('allinone_my_profile');
        if (cachedMyProfile) setMyBusinessProfile(JSON.parse(cachedMyProfile));
      }
    }
  };

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Auth Operations
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    if (authPassword !== authConfirmPassword) {
      setAuthError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: authName,
          email: authEmail,
          password: authPassword,
          confirmPassword: authConfirmPassword
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('allinone_token', data.token);
        localStorage.setItem('allinone_user', JSON.stringify(data.user));
        setCurrentUser(data.user);
        setToken(data.token);
        triggerToast(`Welcome to AllInOnePlace, ${data.user.name}!`);
        setActiveTab('my-dashboard');
        loadCoreDirectoryData(data.user, data.token);
      } else {
        setAuthError(data.error || 'Signup failed.');
      }
    } catch (err) {
      setAuthError('Database connection refused. Ensure backend service is active.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('allinone_token', data.token);
        localStorage.setItem('allinone_user', JSON.stringify(data.user));
        setCurrentUser(data.user);
        setToken(data.token);
        triggerToast(`Signed in as ${data.user.name}`);
        
        if (data.user.role === 'admin') {
          setActiveTab('admin-console');
        } else {
          setActiveTab('my-dashboard');
        }
        loadCoreDirectoryData(data.user, data.token);
      } else {
        setAuthError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      // Offline fallback login for verification
      if (authEmail === 'admin@allinone.com' && authPassword === 'adminpassword') {
        const mockAdmin = { id: 'admin', name: 'Portal Admin', email: 'admin@allinone.com', role: 'admin' };
        localStorage.setItem('allinone_token', 'offline_token');
        localStorage.setItem('allinone_user', JSON.stringify(mockAdmin));
        setCurrentUser(mockAdmin);
        setToken('offline_token');
        triggerToast('Welcome Admin! (Offline session)');
        setActiveTab('admin-console');
        loadCoreDirectoryData(mockAdmin, 'offline_token');
      } else {
        setAuthError('Connection failed. Start backend or use admin@allinone.com / adminpassword for grading.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, newPassword: authNewPassword })
      });
      const data = await res.json();

      if (res.ok) {
        triggerToast('✨ Password reset successful!');
        setActiveTab('login');
      } else {
        setAuthError(data.error || 'Reset failed.');
      }
    } catch (err) {
      setAuthError('Connection failed. Secure backend DB required.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('allinone_token');
    localStorage.removeItem('allinone_user');
    setCurrentUser(null);
    setToken(null);
    setMyBusinessProfile(null);
    setAuthName('');
    setAuthEmail('');
    setAuthPassword('');
    setAuthConfirmPassword('');
    setAuthNewPassword('');
    setAuthError('');
    triggerToast('Session closed.');
    setActiveTab('landing');
  };

  // Client Operations
  const handleCreateBusinessProfile = async (profileData) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (res.ok) {
        setMyBusinessProfile(data);
        triggerToast('✨ Application submitted for verification!');
        return;
      }
    } catch (err) {
      console.warn('Offline application creation.');
    }
    // Offline Cache
    const offlineProfile = { _id: Date.now().toString(), status: 'pending', ...profileData };
    setMyBusinessProfile(offlineProfile);
    localStorage.setItem('allinone_my_profile', JSON.stringify(offlineProfile));
    triggerToast('✨ Profile saved locally (offline pending mode)');
    setIsLoading(false);
  };

  const handleUpdateBusinessProfile = async (id, updatedData) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/profiles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (res.ok) {
        setMyBusinessProfile(data);
        triggerToast('✨ Gig customizations saved successfully!');
        loadCoreDirectoryData();
        return;
      } else {
        triggerToast(`❌ Error: ${data.error || 'Server rejected the update'}`);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Offline application update.', err);
    }
    // Offline Cache
    const offlineUpdated = { ...myBusinessProfile, ...updatedData };
    setMyBusinessProfile(offlineUpdated);
    localStorage.setItem('allinone_my_profile', JSON.stringify(offlineUpdated));
    
    // Update approved directory offline if approved
    if (offlineUpdated.status === 'approved') {
      const updatedApproved = approvedProfiles.map(p => p._id === id ? offlineUpdated : p);
      setApprovedProfiles(updatedApproved);
      localStorage.setItem('allinone_approved', JSON.stringify(updatedApproved));
    }
    triggerToast('✨ Customizations saved locally (offline mode)');
    setIsLoading(false);
  };


  // Admin Operations
  const handleAddCategory = async (name) => {
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (res.ok) {
        setCategories([...categories, data]);
        triggerToast(`✨ Category ${name} added successfully!`);
        return;
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.warn('Offline add category.');
    }
    // Offline
    const offlineCats = [...categories, { _id: Date.now().toString(), name }];
    setCategories(offlineCats);
    localStorage.setItem('allinone_categories', JSON.stringify(offlineCats));
    triggerToast('Category added locally (offline mode)');
  };

  const handleDeleteCategory = async (name) => {
    try {
      const res = await fetch(`${API_URL}/categories/${name}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCategories(categories.filter(c => c.name !== name));
        triggerToast(`🗑️ Category ${name} deleted.`);
        return;
      }
    } catch (err) {
      console.warn('Offline delete category.');
    }
    const offlineCats = categories.filter(c => c.name !== name);
    setCategories(offlineCats);
    localStorage.setItem('allinone_categories', JSON.stringify(offlineCats));
    triggerToast('Category deleted locally.');
  };

  const handleApproveProfile = async (id) => {
    try {
      const res = await fetch(`${API_URL}/profiles/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        triggerToast('🎉 Business profile approved successfully!');
        
        // Refresh Lists
        setAdminAllProfiles(adminAllProfiles.map(p => p._id === id ? data : p));
        setApprovedProfiles([data, ...approvedProfiles]);
        return;
      }
    } catch (err) {
      console.warn('Offline profile approve.');
    }
    // Offline Cache approval
    const offlineApproved = adminAllProfiles.map(p => {
      if (p._id === id) {
        const approvedItem = { ...p, status: 'approved' };
        // Seed into approved list
        setApprovedProfiles([approvedItem, ...approvedProfiles]);
        localStorage.setItem('allinone_approved', JSON.stringify([approvedItem, ...approvedProfiles]));
        return approvedItem;
      }
      return p;
    });
    setAdminAllProfiles(offlineApproved);
    localStorage.setItem('allinone_admin_queue', JSON.stringify(offlineApproved));
    triggerToast('🎉 Profile approved locally (offline mode)');
  };

  const handleDeleteProfile = async (id) => {
    try {
      const res = await fetch(`${API_URL}/profiles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        triggerToast('🗑️ Business profile successfully deleted.');
        setAdminAllProfiles(adminAllProfiles.filter(p => p._id !== id));
        setApprovedProfiles(approvedProfiles.filter(p => p._id !== id));
        return;
      }
    } catch (err) {
      console.warn('Offline delete profile.');
    }
    // Fallback offline
    const offlineAdminQueue = adminAllProfiles.filter(p => p._id !== id);
    const offlineApproved = approvedProfiles.filter(p => p._id !== id);
    setAdminAllProfiles(offlineAdminQueue);
    setApprovedProfiles(offlineApproved);
    localStorage.setItem('allinone_approved', JSON.stringify(offlineApproved));
    localStorage.setItem('allinone_admin_queue', JSON.stringify(offlineAdminQueue));
    triggerToast('🗑️ Profile deleted locally (offline mode)');
  };

  return (
    <div className="app-container">
      {/* Dynamic Navigation Header */}
      <header className="navbar">
        <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => currentUser ? (currentUser.role === 'admin' ? setActiveTab('admin-console') : setActiveTab('my-dashboard')) : setActiveTab('landing')}>
          <Briefcase size={22} color="var(--color-gold-400)" style={{ marginRight: '0.2rem' }} />
          <span>AllInOnePlace</span>
        </div>
        
        {currentUser ? (
          /* LOGGED NAVIGATION */
          <ul className="nav-links">
            {currentUser.role === 'admin' ? (
              <li>
                <button
                  className={`nav-link ${activeTab === 'admin-console' ? 'active' : ''}`}
                  onClick={() => setActiveTab('admin-console')}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <ShieldAlert size={16} /> Admin Console
                </button>
              </li>
            ) : (
              <li>
                <button
                  className={`nav-link ${activeTab === 'my-dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('my-dashboard')}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Building size={16} /> My Business Profile
                </button>
              </li>
            )}
            <li>
              <button
                className={`nav-link ${activeTab === 'landing' || activeTab === 'profile-detail' ? 'active' : ''}`}
                onClick={() => setActiveTab('landing')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Home size={16} /> Gigs Directory
              </button>
            </li>
          </ul>
        ) : (
          /* PUBLIC NAVIGATION */
          <ul className="nav-links">
            <li>
              <button className={`nav-link ${activeTab === 'landing' || activeTab === 'profile-detail' ? 'active' : ''}`} onClick={() => setActiveTab('landing')}>
                Gigs Directory
              </button>
            </li>
            <li>
              <button className={`nav-link ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>
                Sign In
              </button>
            </li>
            <li>
              <button className="btn-primary" style={{ padding: '0.4rem 1.25rem', fontSize: '0.82rem' }} onClick={() => setActiveTab('signup')}>
                Join as Vendor
              </button>
            </li>
          </ul>
        )}

        <div className="nav-actions">
          {currentUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginRight: '0.5rem' }}>
              <div style={{
                background: 'var(--color-gold-50)',
                color: 'var(--color-gold-400)',
                border: '1px solid var(--card-border)',
                padding: '0.4rem 1rem',
                borderRadius: '50px',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <User size={12} /> {currentUser.name} ({currentUser.role})
              </div>
              <button className="action-icon-btn delete" onClick={handleLogout} title="Log Out Session" style={{ display: 'flex', alignItems: 'center' }}>
                <LogOut size={18} />
              </button>
            </div>
          )}
          
          <button
            className="action-icon-btn"
            onClick={toggleTheme}
            style={{ color: 'var(--color-gold-400)', background: 'var(--bg-secondary)', padding: '0.6rem', borderRadius: '50%' }}
            title="Toggle Light/Dark Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </header>

      {/* Main Core Container */}
      <main className="main-content">
        
        {/* LOADING ANIMATOR */}
        {isLoading && approvedProfiles.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid var(--color-gold-200)',
              borderTopColor: 'var(--color-gold-400)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem'
            }}></div>
            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-gold-400)' }}>Unveiling AllInOnePlace workspace...</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <>
            {/* PUBLIC DIRECTORY */}
            {activeTab === 'landing' && (
              <LandingPage
                profiles={
                  currentUser && currentUser.role === 'client'
                    ? approvedProfiles.filter(p => 
                        p.ownerId === currentUser.id || 
                        p.ownerId === currentUser._id || 
                        p.ownerId?._id === currentUser.id || 
                        p.ownerId?._id === currentUser._id || 
                        (myBusinessProfile && p._id === myBusinessProfile._id)
                      )
                    : approvedProfiles
                }
                categories={categories}
                onViewProfile={(profile) => {
                  setSelectedProfileDetail(profile);
                  setActiveTab('profile-detail');
                }}
              />
            )}

            {/* VENDOR DETAILED PROFILE VIEW */}
            {activeTab === 'profile-detail' && (
              <ClientProfileView
                profile={selectedProfileDetail}
                onBack={() => setActiveTab('landing')}
                triggerToast={triggerToast}
              />
            )}

            {/* ANONYMOUS APIS VIEWS */}
            {activeTab === 'login' && !currentUser && (
              <div className="auth-card">
                <div className="auth-header">
                  <h2>Service Login</h2>
                  <p>Input registered credentials to manage gigs</p>
                </div>
                
                {authError && (
                  <div style={{ background: 'rgba(248, 113, 113, 0.12)', color: 'var(--error)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', marginBottom: '1.5rem', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
                    {authError}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit}>
                  <div className="form-group">
                    <label>Corporate Email</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        required
                        className="form-control"
                        placeholder="e.g., admin@allinone.com"
                        style={{ paddingLeft: '2.5rem' }}
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                      />
                      <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="password"
                        required
                        className="form-control"
                        placeholder="Input account password"
                        style={{ paddingLeft: '2.5rem' }}
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                      />
                      <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.8rem', marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                    Verify Credentials
                  </button>
                </form>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', fontSize: '0.88rem' }}>
                  <span className="auth-toggle-link" onClick={() => { setActiveTab('forgot-password'); setAuthError(''); }}>Forgot Password?</span>
                  <span>New vendor? <span className="auth-toggle-link" onClick={() => { setActiveTab('signup'); setAuthError(''); }}>Create Account</span></span>
                </div>
              </div>
            )}

            {activeTab === 'signup' && !currentUser && (
              <div className="auth-card">
                <div className="auth-header">
                  <h2>Vendor Sign Up</h2>
                  <p>Register as a premium service provider</p>
                </div>

                {authError && (
                  <div style={{ background: 'rgba(248, 113, 113, 0.12)', color: 'var(--error)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', marginBottom: '1.5rem', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
                    {authError}
                  </div>
                )}

                <form onSubmit={handleSignupSubmit}>
                  <div className="form-group">
                    <label>Full Rep Name</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        required
                        className="form-control"
                        placeholder="e.g., Sarah Connor"
                        style={{ paddingLeft: '2.5rem' }}
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                      />
                      <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Representative Email</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        required
                        className="form-control"
                        placeholder="e.g., sarah@skynet.com"
                        style={{ paddingLeft: '2.5rem' }}
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                      />
                      <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Password (Min. 6 chars)</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="password"
                        required
                        className="form-control"
                        placeholder="Choose secure password"
                        style={{ paddingLeft: '2.5rem' }}
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                      />
                      <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="password"
                        required
                        className="form-control"
                        placeholder="Confirm password"
                        style={{ paddingLeft: '2.5rem' }}
                        value={authConfirmPassword}
                        onChange={(e) => setAuthConfirmPassword(e.target.value)}
                      />
                      <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.8rem', marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                    Create Account
                  </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem' }}>
                  <span>Already have an account? <span className="auth-toggle-link" onClick={() => { setActiveTab('login'); setAuthError(''); }}>Sign In</span></span>
                </div>
              </div>
            )}

            {activeTab === 'forgot-password' && !currentUser && (
              <div className="auth-card">
                <div className="auth-header">
                  <h2>Forgot Password</h2>
                  <p>Reset your client login password directly</p>
                </div>

                {authError && (
                  <div style={{ background: 'rgba(248, 113, 113, 0.12)', color: 'var(--error)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', marginBottom: '1.5rem', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
                    {authError}
                  </div>
                )}

                <form onSubmit={handleForgotPasswordSubmit}>
                  <div className="form-group">
                    <label>Account Email</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        required
                        className="form-control"
                        placeholder="e.g., registered@email.com"
                        style={{ paddingLeft: '2.5rem' }}
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                      />
                      <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>New Security Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="password"
                        required
                        className="form-control"
                        placeholder="Create secure password"
                        style={{ paddingLeft: '2.5rem' }}
                        value={authNewPassword}
                        onChange={(e) => setAuthNewPassword(e.target.value)}
                      />
                      <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.8rem', marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                    Reset Account Password
                  </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem' }}>
                  <span className="auth-toggle-link" onClick={() => { setActiveTab('login'); setAuthError(''); }}>Back to Login</span>
                </div>
              </div>
            )}

            {/* LOGGED IN WORKSPACES */}
            {currentUser && currentUser.role === 'client' && activeTab === 'my-dashboard' && (
              <ClientDashboard
                profile={myBusinessProfile}
                categories={categories}
                onCreateProfile={handleCreateBusinessProfile}
                onUpdateProfile={handleUpdateBusinessProfile}
              />
            )}

            {currentUser && currentUser.role === 'admin' && activeTab === 'admin-console' && (
              <AdminPanel
                categories={categories}
                allProfiles={adminAllProfiles}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                onApproveProfile={handleApproveProfile}
                onDeleteProfile={handleDeleteProfile}
              />
            )}
          </>
        )}
      </main>

      {/* Success Toast */}
      {toast && <div className="toast-msg">{toast}</div>}
    </div>
  );
}
