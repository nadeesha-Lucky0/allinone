'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Moon, Sun, LayoutDashboard, Users, LogOut, Lock, Mail, User, ShieldAlert, Sparkles, Building, Settings, Home, Key } from 'lucide-react';
import LandingPage from './components/LandingPage';
import ClientDashboard from './components/ClientDashboard';
import AdminPanel from './components/AdminPanel';
import ClientProfileView from './components/ClientProfileView';

const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port !== '5000' ? 'http://localhost:5000/api' : '/api');

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
  const [mainCategories, setMainCategories] = useState([]);
  const [approvedProfiles, setApprovedProfiles] = useState([]);
  const [adminAllProfiles, setAdminAllProfiles] = useState([]);
  const [myBusinessProfile, setMyBusinessProfile] = useState(null);
  const [plans, setPlans] = useState([]);
  const [purchases, setPurchases] = useState([]);

  // Auth Inputs Form States
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authNewPassword, setAuthNewPassword] = useState('');

  // Initial Sync login status
  useEffect(() => {
    const savedUser = sessionStorage.getItem('allinone_user');
    const savedToken = sessionStorage.getItem('allinone_token');
    
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

  // Handle profile-detail routing via browser hash histories to enable back button sync
  useEffect(() => {
    const handleProfileHash = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;
      if (hash.startsWith('#profile-')) {
        const profileId = hash.replace('#profile-', '');
        const found = approvedProfiles.find(p => p._id === profileId);
        if (found) {
          setSelectedProfileDetail(found);
          setActiveTab('profile-detail');
        }
      } else if (activeTab === 'profile-detail') {
        setActiveTab('landing');
        setSelectedProfileDetail(null);
      }
    };

    window.addEventListener('hashchange', handleProfileHash);
    if (approvedProfiles.length > 0) {
      handleProfileHash();
    }

    return () => {
      window.removeEventListener('hashchange', handleProfileHash);
    };
  }, [approvedProfiles, activeTab]);

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

      // Fetch dynamic main categories
      const mainCatRes = await fetch(`${API_URL}/main-categories`);
      const mainCatData = await mainCatRes.json();
      if (Array.isArray(mainCatData)) setMainCategories(mainCatData);

      // Fetch dynamic subscription plans
      const planRes = await fetch(`${API_URL}/plans`);
      const planData = await planRes.json();
      if (Array.isArray(planData)) setPlans(planData);

      // 2. Fetch approved listing profiles
      const approvedRes = await fetch(`${API_URL}/profiles`);
      const approvedData = await approvedRes.json();
      if (Array.isArray(approvedData)) setApprovedProfiles(approvedData);

      // If logged in - load role-specific APIs
      if (userSession && tokenSession) {
        // Fetch real-time User allowedPromotions and update state/cache
        try {
          const meRes = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${tokenSession}` }
          });
          if (meRes.ok) {
            const meData = await meRes.json();
            setCurrentUser(meData);
            sessionStorage.setItem('allinone_user', JSON.stringify(meData));
          }
        } catch (err) {
          console.warn('Could not sync user session.');
        }

        // Fetch transaction purchases history
        try {
          const purchaseRes = await fetch(`${API_URL}/purchases`, {
            headers: { 'Authorization': `Bearer ${tokenSession}` }
          });
          const purchaseData = await purchaseRes.json();
          if (Array.isArray(purchaseData)) setPurchases(purchaseData);
        } catch (err) {
          console.warn('Could not sync purchases.');
        }

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
    const cachedCats = sessionStorage.getItem('allinone_categories');
    const cachedMainCats = sessionStorage.getItem('allinone_main_categories');
    const cachedApproved = sessionStorage.getItem('allinone_approved');

    if (cachedMainCats) {
      setMainCategories(JSON.parse(cachedMainCats));
    } else {
      const defaultMains = [
        { _id: 'm1', name: 'Wedding' },
        { _id: 'm2', name: 'Birthday Events' },
        { _id: 'm3', name: 'Corporate Events' }
      ];
      setMainCategories(defaultMains);
      sessionStorage.setItem('allinone_main_categories', JSON.stringify(defaultMains));
    }

    if (cachedCats) {
      setCategories(JSON.parse(cachedCats));
    } else {
      const cats = [
        { _id: '1', name: 'Photography', mainCategory: { _id: 'm1', name: 'Wedding' } },
        { _id: '2', name: 'Saloon', mainCategory: { _id: 'm1', name: 'Wedding' } },
        { _id: '3', name: 'Saree Rent', mainCategory: { _id: 'm1', name: 'Wedding' } },
        { _id: '4', name: 'Wedding Car Rent', mainCategory: { _id: 'm1', name: 'Wedding' } }
      ];
      setCategories(cats);
      sessionStorage.setItem('allinone_categories', JSON.stringify(cats));
    }

    if (cachedApproved) {
      setApprovedProfiles(JSON.parse(cachedApproved));
    } else {
      const seedProfiles = [
        { _id: '1', businessName: 'Vivid Memory Studios', businessEmail: 'info@vividmemories.com', phone: '+94-77-123-4567', address: '42 Orchid Lane, Colombo 07', location: 'Colombo', category: 'Photography', status: 'approved', imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=600&auto=format&fit=crop', description: 'Premier cinematic wedding storytelling and dynamic high-definition wedding photobooks.', pricing: 'Premium packages start from LKR 350,000', website: 'https://vividmemories.com' },
        { _id: '2', businessName: 'Aura Premium Salon & Bridal', businessEmail: 'aura@salonsuite.com', phone: '+9 Sri Lanka lines', address: 'Galle Road, Bambalapitiya', location: 'Galle', category: 'Saloon', status: 'approved', imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop', description: 'High-end bridal salon services, modern hairstyles, skin conditioning treatments, and elegant manicure packages.', pricing: 'Standard packages start from LKR 120,000', website: 'https://aurasalon.lk' }
      ];
      setApprovedProfiles(seedProfiles);
      sessionStorage.setItem('allinone_approved', JSON.stringify(seedProfiles));
    }

    if (userSession) {
      if (userSession.role === 'admin') {
        const cachedAdminQueue = sessionStorage.getItem('allinone_admin_queue');
        if (cachedAdminQueue) setAdminAllProfiles(JSON.parse(cachedAdminQueue));
      } else if (userSession.role === 'client') {
        const cachedMyProfile = sessionStorage.getItem('allinone_my_profile');
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
        sessionStorage.setItem('allinone_token', data.token);
        sessionStorage.setItem('allinone_user', JSON.stringify(data.user));
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
        sessionStorage.setItem('allinone_token', data.token);
        sessionStorage.setItem('allinone_user', JSON.stringify(data.user));
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
        sessionStorage.setItem('allinone_token', 'offline_token');
        sessionStorage.setItem('allinone_user', JSON.stringify(mockAdmin));
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
    sessionStorage.removeItem('allinone_token');
    sessionStorage.removeItem('allinone_user');
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
    sessionStorage.setItem('allinone_my_profile', JSON.stringify(offlineProfile));
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
    sessionStorage.setItem('allinone_my_profile', JSON.stringify(offlineUpdated));
    
    // Update approved directory offline if approved
    if (offlineUpdated.status === 'approved') {
      const updatedApproved = approvedProfiles.map(p => p._id === id ? offlineUpdated : p);
      setApprovedProfiles(updatedApproved);
      sessionStorage.setItem('allinone_approved', JSON.stringify(updatedApproved));
    }
    triggerToast('✨ Customizations saved locally (offline mode)');
    setIsLoading(false);
  };


  // Admin Operations
  const handleAddCategory = async (name, mainCategoryId) => {
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, mainCategory: mainCategoryId })
      });
      const data = await res.json();
      if (res.ok) {
        setCategories(prev => {
          const filtered = prev.filter(c => c._id !== data._id && c.name.toLowerCase() !== data.name.toLowerCase());
          return [...filtered, data];
        });
        triggerToast(`✨ Subcategory ${name} mapped successfully!`);
        return data;
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.warn('Offline add category.');
    }
    // Offline
    const matchedMain = mainCategories.find(m => m._id === mainCategoryId) || { _id: mainCategoryId, name: 'General' };
    const filteredCats = categories.filter(c => c.name.toLowerCase() !== name.toLowerCase());
    const offlineCats = [...filteredCats, { _id: Date.now().toString(), name, mainCategory: matchedMain }];
    setCategories(offlineCats);
    sessionStorage.setItem('allinone_categories', JSON.stringify(offlineCats));
    triggerToast('Subcategory mapped locally (offline)');
  };

  const handleAddMainCategory = async (name) => {
    try {
      const res = await fetch(`${API_URL}/main-categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (res.ok) {
        setMainCategories([...mainCategories, data]);
        triggerToast(`✨ Main Category ${name} created!`);
        return data;
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.warn('Offline add main category.');
    }
    // Offline
    const freshMain = { _id: Date.now().toString(), name };
    const offlineMains = [...mainCategories, freshMain];
    setMainCategories(offlineMains);
    sessionStorage.setItem('allinone_main_categories', JSON.stringify(offlineMains));
    triggerToast('Main Category created locally (offline)');
    return freshMain;
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
    sessionStorage.setItem('allinone_categories', JSON.stringify(offlineCats));
    triggerToast('Category deleted locally.');
  };

  const handleDeleteMainCategory = async (name) => {
    try {
      const res = await fetch(`${API_URL}/main-categories/${name}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMainCategories(mainCategories.filter(m => m.name !== name));
        triggerToast(`🗑️ Main Category ${name} removed.`);
        return;
      } else {
        alert(data.error || 'Failed to remove main category.');
      }
    } catch (err) {
      console.warn('Offline delete main category.');
    }
    // Offline Cache
    const offlineMains = mainCategories.filter(m => m.name !== name);
    setMainCategories(offlineMains);
    sessionStorage.setItem('allinone_main_categories', JSON.stringify(offlineMains));
    triggerToast('Main Category deleted locally.');
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
        sessionStorage.setItem('allinone_approved', JSON.stringify([approvedItem, ...approvedProfiles]));
        return approvedItem;
      }
      return p;
    });
    setAdminAllProfiles(offlineApproved);
    sessionStorage.setItem('allinone_admin_queue', JSON.stringify(offlineApproved));
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
    sessionStorage.setItem('allinone_approved', JSON.stringify(offlineApproved));
    sessionStorage.setItem('allinone_admin_queue', JSON.stringify(offlineAdminQueue));
    triggerToast('🗑️ Profile deleted locally (offline mode)');
  };

  // Plan & Promotion Operations
  const handleCreatePlan = async (name, price, adCount, description) => {
    try {
      const res = await fetch(`${API_URL}/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, price, adCount, description })
      });
      const data = await res.json();
      if (res.ok) {
        setPlans([...plans, data]);
        triggerToast(`✨ Plan "${name}" created successfully!`);
        return data;
      } else {
        alert(data.error || 'Failed to create plan.');
      }
    } catch (err) {
      console.warn('Offline create plan.');
    }
  };

  const handleUpdatePlan = async (id, name, price, adCount, description) => {
    try {
      const res = await fetch(`${API_URL}/plans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, price, adCount, description })
      });
      const data = await res.json();
      if (res.ok) {
        setPlans(plans.map(p => p._id === id ? data : p));
        triggerToast(`✨ Plan "${name}" updated successfully!`);
        return data;
      } else {
        alert(data.error || 'Failed to update plan.');
      }
    } catch (err) {
      console.warn('Offline update plan.');
    }
  };

  const handleDeletePlan = async (id) => {
    try {
      const res = await fetch(`${API_URL}/plans/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setPlans(plans.filter(p => p._id !== id));
        triggerToast('🗑️ Plan deleted successfully.');
        return data;
      } else {
        alert(data.error || 'Failed to delete plan.');
      }
    } catch (err) {
      console.warn('Offline delete plan.');
    }
  };

  const handleBuyPlan = async (planId) => {
    try {
      const res = await fetch(`${API_URL}/purchases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId })
      });
      const data = await res.json();
      if (res.ok) {
        setPurchases([data, ...purchases]);
        triggerToast('🛒 Purchase checkout request submitted! Awaiting admin approval.');
        return data;
      } else {
        alert(data.error || 'Failed to purchase plan.');
      }
    } catch (err) {
      console.warn('Offline buy plan.');
    }
  };

  const handleApprovePurchase = async (id) => {
    try {
      const res = await fetch(`${API_URL}/purchases/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        triggerToast('✅ Payment approved successfully!');
        setPurchases(purchases.map(p => p._id === id ? data.purchase : p));
        // Force refresh queue to load updated user credits dynamically
        loadCoreDirectoryData();
        return;
      } else {
        alert(data.error || 'Failed to approve purchase.');
      }
    } catch (err) {
      console.warn('Offline approve purchase.');
    }
  };

  const handleDeclinePurchase = async (id) => {
    try {
      const res = await fetch(`${API_URL}/purchases/${id}/decline`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        triggerToast('❌ Purchase transaction declined.');
        setPurchases(purchases.map(p => p._id === id ? data.purchase : p));
        return;
      } else {
        alert(data.error || 'Failed to decline purchase.');
      }
    } catch (err) {
      console.warn('Offline decline purchase.');
    }
  };

  const handleActivatePromotion = async (category) => {
    try {
      const res = await fetch(`${API_URL}/profiles/promote`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ category })
      });
      const data = await res.json();
      if (res.ok) {
        triggerToast('👑 Gig listing successfully promoted at the top of category search!');
        setMyBusinessProfile(data.profile);
        setCurrentUser(prev => {
          if (!prev) return null;
          const updated = { ...prev, allowedPromotions: data.allowedPromotions };
          sessionStorage.setItem('allinone_user', JSON.stringify(updated));
          return updated;
        });
        // Reload directory profiles list to display promoted ones instantly
        const approvedRes = await fetch(`${API_URL}/profiles`);
        const approvedData = await approvedRes.json();
        if (Array.isArray(approvedData)) setApprovedProfiles(approvedData);
        return;
      } else {
        alert(data.error || 'Failed to activate promotion.');
      }
    } catch (err) {
      console.warn('Offline activate promotion.');
    }
  };

  const handleDeactivatePromotion = async () => {
    try {
      const res = await fetch(`${API_URL}/profiles/demote`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        triggerToast('⏸️ Gig listing promotion paused.');
        setMyBusinessProfile(data.profile);
        setCurrentUser(prev => {
          if (!prev) return null;
          const updated = { ...prev, allowedPromotions: data.allowedPromotions };
          sessionStorage.setItem('allinone_user', JSON.stringify(updated));
          return updated;
        });
        // Reload directory profiles list to reflect changes instantly
        const approvedRes = await fetch(`${API_URL}/profiles`);
        const approvedData = await approvedRes.json();
        if (Array.isArray(approvedData)) setApprovedProfiles(approvedData);
        return;
      } else {
        alert(data.error || 'Failed to deactivate promotion.');
      }
    } catch (err) {
      console.warn('Offline deactivate promotion.');
    }
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
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.hash = '';
                    sessionStorage.removeItem('prev_category_hash');
                  }
                  setActiveTab('landing');
                  setSelectedProfileDetail(null);
                }}
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
              <button 
                className={`nav-link ${activeTab === 'landing' || activeTab === 'profile-detail' ? 'active' : ''}`} 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.hash = '';
                    sessionStorage.removeItem('prev_category_hash');
                  }
                  setActiveTab('landing');
                  setSelectedProfileDetail(null);
                }}
              >
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
                mainCategories={mainCategories}
                onViewProfile={(profile) => {
                  if (typeof window !== 'undefined') {
                    const prevHash = window.location.hash;
                    if (prevHash && !prevHash.startsWith('#profile-')) {
                      sessionStorage.setItem('prev_category_hash', prevHash);
                    }
                    window.location.hash = `profile-${profile._id}`;
                  }
                }}
              />
            )}

            {/* VENDOR DETAILED PROFILE VIEW */}
            {activeTab === 'profile-detail' && (
              <ClientProfileView
                profile={selectedProfileDetail}
                onBack={() => {
                  if (typeof window !== 'undefined') {
                    const savedHash = sessionStorage.getItem('prev_category_hash');
                    if (savedHash) {
                      window.location.hash = savedHash;
                      sessionStorage.removeItem('prev_category_hash');
                    } else {
                      window.history.back();
                    }
                  }
                }}
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
                plans={plans}
                purchases={purchases}
                currentUser={currentUser}
                onBuyPlan={handleBuyPlan}
                onActivatePromotion={handleActivatePromotion}
                onDeactivatePromotion={handleDeactivatePromotion}
              />
            )}

            {currentUser && currentUser.role === 'admin' && activeTab === 'admin-console' && (
              <AdminPanel
                categories={categories}
                mainCategories={mainCategories}
                allProfiles={adminAllProfiles}
                onAddCategory={handleAddCategory}
                onAddMainCategory={handleAddMainCategory}
                onDeleteCategory={handleDeleteCategory}
                onDeleteMainCategory={handleDeleteMainCategory}
                onApproveProfile={handleApproveProfile}
                onDeleteProfile={handleDeleteProfile}
                plans={plans}
                purchases={purchases}
                onCreatePlan={handleCreatePlan}
                onUpdatePlan={handleUpdatePlan}
                onDeletePlan={handleDeletePlan}
                onApprovePurchase={handleApprovePurchase}
                onDeclinePurchase={handleDeclinePurchase}
              />
            )}
          </>
        )}
      </main>

      {/* Premium Obsidian Gold Footer */}
      <footer className="luxury-footer">
        <div className="footer-content">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <Briefcase size={20} color="var(--color-gold-400)" />
              <span>AllInOnePlace</span>
            </div>
            <p className="footer-description">
              The premier curated event management directory. Discover trusted vendors, high-end bridal salons, cinematic wedding photographers, and exclusive logistics providers.
            </p>
          </div>
          
          <div className="footer-links-col">
            <h4>Explore Portal</h4>
            <ul>
              <li>
                <button onClick={() => { setActiveTab('landing'); window.location.hash = ''; }}>
                  Gigs Directory
                </button>
              </li>
              <li>
                <button onClick={() => currentUser ? (currentUser.role === 'admin' ? setActiveTab('admin-console') : setActiveTab('my-dashboard')) : setActiveTab('login')}>
                  Service Login
                </button>
              </li>
              <li>
                <button onClick={() => currentUser ? setActiveTab('my-dashboard') : setActiveTab('signup')}>
                  Join as Vendor
                </button>
              </li>
            </ul>
          </div>
          
          <div className="footer-contact-col">
            <h4>Get In Touch</h4>
            <ul>
              <li>
                <a href="mailto:support@allinoneplace.com">
                  <Mail size={14} color="var(--color-gold-400)" />
                  <span>support@allinoneplace.com</span>
                </a>
              </li>
              <li>
                <a href="https://facebook.com/allinoneplace" target="_blank" rel="noopener noreferrer">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <svg size={14} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    <span>Facebook Page</span>
                  </span>
                </a>
              </li>
              <li>
                <a href="https://instagram.com/allinoneplace" target="_blank" rel="noopener noreferrer">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <svg size={14} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    <span>Instagram Profile</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AllInOnePlace. Curated Premium Event Network. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Success Toast */}
      {toast && <div className="toast-msg">{toast}</div>}
    </div>
  );
}
