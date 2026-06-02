'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Tag, Sparkles, Heart, Cake, Briefcase, ArrowLeft, Star } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port !== '5000' ? 'http://localhost:5000/api' : '/api');

const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode JWT:', e);
    return null;
  }
};

const MAIN_CAT_MAPPING = {
  'Wedding': ['Wedding Photographers', 'Saloon', 'Saree Rent', 'Wedding Car Rent', 'Photography'],
  'Birthday Events': ['Photography', 'Saloon'],
  'Corporate Events': ['Photography', 'Graduation Photographers']
};

const GOOGLE_HD_VIDEOS = {
  'General': "https://res.cloudinary.com/ddetlgxht/video/upload/q_auto,vc_auto,w_1280,so_0,eo_15/v1780410376/The_Most_Cinematic_Wedding_Trailer_You_ll_Ever_See_-_Runaway_Vows_1080p_h264_sue4ht.mp4",
  'Wedding': "https://res.cloudinary.com/ddetlgxht/video/upload/q_auto,vc_auto,w_1280,so_0,eo_15/v1780410376/The_Most_Cinematic_Wedding_Trailer_You_ll_Ever_See_-_Runaway_Vows_1080p_h264_sue4ht.mp4",
  'Birthday Events': "https://res.cloudinary.com/ddetlgxht/video/upload/q_auto,vc_auto,w_1280,so_0,eo_15/v1780410388/Illya_Samantha_Choachuy_s_1st_Birthday_Highlights_by_Nice_Print_Photography_-_NicePrintChannel_1080p_h264_if52es.mp4",
  'Corporate Events': "https://res.cloudinary.com/ddetlgxht/video/upload/q_auto,vc_auto,w_1280,so_0,eo_15/v1780410352/We_Are_Sales_Conference_2022_The_official_aftermovie_-_We_Are_Sales_1080p_h264_1_qpfbrj.mp4"
};

const CATEGORY_IMAGES = {
  'Wedding': 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop',
  'Birthday Events': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=600&auto=format&fit=crop',
  'Corporate Events': 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop',
  'General': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'
};

const isSubCategoryInMain = (subCatName, mainCat, categories = []) => {
  if (!subCatName) return false;

  // 1. Dynamic database category list lookup (resolving reference objects safely)
  const found = categories.find(cat => cat.name.toLowerCase() === subCatName.toLowerCase());
  if (found && found.mainCategory) {
    const mainName = found.mainCategory.name || (typeof found.mainCategory === 'string' ? found.mainCategory : '');
    if (mainName.toLowerCase() === mainCat.toLowerCase()) {
      return true;
    }
  }

  // 2. Hardcoded fallback dictionary (for pre-seeded static categories)
  const mapped = MAIN_CAT_MAPPING[mainCat];
  if (mapped && mapped.some(m => m.toLowerCase() === subCatName.toLowerCase())) {
    return true;
  }
  
  // 3. Dynamic keyword-matching fallback
  const subLower = subCatName.toLowerCase();
  if (mainCat === 'Wedding') {
    return subLower.includes('wedding') || subLower.includes('saree') || subLower.includes('bridal') || subLower.includes('marriage') || subLower.includes('saloon');
  }
  if (mainCat === 'Birthday Events') {
    return subLower.includes('birthday') || subLower.includes('cake') || subLower.includes('party') || subLower.includes('balloon') || subLower.includes('celebration');
  }
  if (mainCat === 'Corporate Events') {
    return subLower.includes('corporate') || subLower.includes('conference') || subLower.includes('business') || subLower.includes('graduation') || subLower.includes('seminar');
  }
  return false;
};

function VideoHeroHeader({ title, subtitle, videoKey }) {
  const videoSrc = GOOGLE_HD_VIDEOS[videoKey] || GOOGLE_HD_VIDEOS['General'];
  const videoRef = React.useRef(null);

  // Force direct load and instant play on source change (bypassing browser cache / autoplay restrictions)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true; // Ensure native DOM property is muted for autoplay clearance
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        console.log("Autoplay was prevented or video is still loading:", err);
      });
    }
  }, [videoSrc]);

  // Breathtaking dual-font phrases: Cinzel/Cormorant + Alex Brush Signature Script
  const getPhrases = () => {
    if (videoKey === 'Wedding') {
      return [
        { prefix: "Plan Your Eternal", highlight: "Fairytale" },
        { prefix: "Connect With Premium", highlight: "Bridal Salons" },
        { prefix: "Discover Award-Winning", highlight: "Cinematic Photographers" },
        { prefix: "Acquire Elegant Vintage", highlight: "Wedding Chauffeurs" },
        { prefix: "Sought-After Designers &", highlight: "Saree Boutiques" }
      ];
    }
    if (videoKey === 'Birthday Events') {
      return [
        { prefix: "Plan Your Perfect", highlight: "Birthday Celebration" },
        { prefix: "Discover Outstanding", highlight: "Party Entertainers" },
        { prefix: "Connect With Premium", highlight: "Cake Designers" },
        { prefix: "Decorate With Exquisite", highlight: "Balloons & Themes" },
        { prefix: "Cinematic Birthday", highlight: "Memories" }
      ];
    }
    if (videoKey === 'Corporate Events') {
      return [
        { prefix: "Host a Successful", highlight: "Corporate Conference" },
        { prefix: "Connect With Professional", highlight: "Event Managers" },
        { prefix: "Discover Widescreen", highlight: "Cinematic Crews" },
        { prefix: "Premium Venues &", highlight: "Catering Services" },
        { prefix: "Plan High-End Seminars &", highlight: "Celebrations" }
      ];
    }
    // General Landing View
    return [
      { prefix: "Select Your Grand", highlight: "Event Category" },
      { prefix: "Discover Verified Premium", highlight: "Gigs & Venues" },
      { prefix: "Connect Directly With", highlight: "Professional Services" }
    ];
  };

  const [phraseIndex, setPhraseIndex] = useState(0);

  // Auto-advance phrase index every 8.0 seconds for fluid, relaxed animations
  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => prev + 1);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Reset index when categories are changed
  useEffect(() => {
    setPhraseIndex(0);
  }, [videoKey]);

  // Static stardust configuration array to run continuous CSS float drifts
  const stardustParticles = [
    { id: 1, left: '12%', top: '55%', size: '6px', delay: '0s', duration: '9s' },
    { id: 2, left: '28%', top: '70%', size: '4px', delay: '2.5s', duration: '12s' },
    { id: 3, left: '42%', top: '45%', size: '8px', delay: '1.2s', duration: '8s' },
    { id: 4, left: '60%', top: '75%', size: '5px', delay: '4s', duration: '11s' },
    { id: 5, left: '78%', top: '50%', size: '7px', delay: '0.5s', duration: '10s' },
    { id: 6, left: '88%', top: '65%', size: '5px', delay: '3.2s', duration: '13s' },
    { id: 7, left: '20%', top: '40%', size: '7px', delay: '1.8s', duration: '9.5s' },
    { id: 8, left: '50%', top: '60%', size: '6px', delay: '0.1s', duration: '11.5s' },
    { id: 9, left: '70%', top: '42%', size: '9px', delay: '2.8s', duration: '7.5s' },
    { id: 10, left: '82%', top: '80%', size: '4px', delay: '5.2s', duration: '14s' }
  ];

  const currentPhrases = getPhrases();
  const currentPhrase = currentPhrases[phraseIndex % currentPhrases.length];

  return (
    <div className="video-hero-header">
      {/* Background Video */}
      <video
        ref={videoRef}
        src={videoSrc} // Set src directly on video element for reliable dynamic React updates
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 1.0
        }}
      />

      {/* Premium Cinematic Dark Vignette Overlay Mask */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.45) 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* Background Floating Magical Stardust Particles */}
      {stardustParticles.map((p) => (
        <div 
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--color-gold-300) 0%, rgba(255,255,255,0) 70%)',
            boxShadow: '0 0 10px var(--color-gold-200), 0 0 20px var(--color-rose-200)',
            pointerEvents: 'none',
            zIndex: 2,
            animation: `stardustDrift ${p.duration} linear infinite`,
            animationDelay: p.delay
          }}
        />
      ))}

      {/* Cinematic Hero Content with Elegant Shifting Revelations */}
      <div style={{ position: 'relative', zIndex: 3, maxWidth: '980px', width: '100%' }}>
        <div 
          key={`${videoKey}_${phraseIndex}`} // Ensures animation replays cleanly upon change
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '220px'
          }}
        >
          {/* Unified Majestic Single-Line Title */}
          <h1 
            style={{ 
              fontSize: '3.4rem', 
              color: '#ffffff',
              fontFamily: 'var(--font-cinzel)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              textShadow: '0 4px 20px rgba(26, 19, 16, 0.85), 0 2px 5px rgba(26, 19, 16, 0.95)',
              fontWeight: 600,
              margin: 0,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.1rem',
              lineHeight: '1.2'
            }}
          >
            <span style={{ 
              animation: 'luxuryTextReveal 2.4s cubic-bezier(0.16, 1, 0.3, 1) both',
              display: 'inline-block'
            }}>
              {currentPhrase?.prefix}
            </span>
            <span style={{ 
              fontFamily: 'var(--font-script)', 
              textTransform: 'none', 
              color: 'var(--color-gold-300)',
              fontSize: '4.6rem',
              fontWeight: 400,
              letterSpacing: 'normal',
              textShadow: '0 0 25px rgba(197, 160, 89, 0.5), 0 2px 10px rgba(0,0,0,0.6)',
              animation: 'scriptReveal 2.8s cubic-bezier(0.16, 1, 0.3, 1) both 0.3s',
              display: 'inline-block',
              marginLeft: '0.2rem',
              lineHeight: '1'
            }}>
              {currentPhrase?.highlight}
            </span>
          </h1>

          {/* Glowing Golden Horizontal Expander Bar */}
          <div style={{
            width: '140px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--color-rose-300), var(--color-gold-300), transparent)',
            margin: '1.4rem auto 1.4rem auto',
            animation: 'borderExpansion 2.6s cubic-bezier(0.16, 1, 0.3, 1) both 0.6s'
          }} />

          {/* High-Contrast Dynamic Subtitle */}
          <p 
            style={{ 
              fontSize: '1.2rem', 
              color: 'rgba(255, 255, 255, 0.95)', 
              maxWidth: '740px',
              margin: '0 auto', 
              lineHeight: 1.65, 
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.8)',
              fontWeight: 300,
              animation: 'cinematicFadeSlide 2.8s cubic-bezier(0.16, 1, 0.3, 1) both 0.8s'
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage({ profiles = [], categories = [], mainCategories = [], onViewProfile }) {
  const [selectedMainCat, setSelectedMainCat] = useState(null);
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchLoc, setSearchLoc] = useState('');
  const [searchKey, setSearchKey] = useState('');

  // Customer Reviews States
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [reviewerUser, setReviewerUser] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const u = sessionStorage.getItem('reviewer_user');
        return u ? JSON.parse(u) : null;
      }
    } catch {
      return null;
    }
    return null;
  });

  // Review Creation Form States
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Email Fallback Form States
  const [emailName, setEmailName] = useState('');
  const [emailAddr, setEmailAddr] = useState('');
  const [emailError, setEmailError] = useState('');



  // Real Google Sign-In Configuration States
  const [googleClientId, setGoogleClientId] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || localStorage.getItem('google_client_id') || '';
      }
    } catch {}
    return '';
  });
  const [showClientIdConfig, setShowClientIdConfig] = useState(false);
  const [clientIdInput, setClientIdInput] = useState(googleClientId);

  // Load official Google GIS SDK script dynamically on mount
  useEffect(() => {
    const scriptId = 'google-gis-sdk';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  // Initialize and render real Google Identity Services button
  useEffect(() => {
    if (showReviewModal && !reviewerUser && googleClientId && window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response) => {
            const decoded = decodeJwt(response.credential);
            if (decoded) {
              const user = {
                name: decoded.name,
                email: decoded.email,
                avatarUrl: decoded.picture || ''
              };
              sessionStorage.setItem('reviewer_user', JSON.stringify(user));
              setReviewerUser(user);
            }
          }
        });

        // Let the DOM mount container before rendering
        setTimeout(() => {
          const btnElement = document.getElementById("google-signin-btn-container");
          if (btnElement) {
            btnElement.innerHTML = ''; // Clear previous content
            window.google.accounts.id.renderButton(
              btnElement,
              { theme: "outline", size: "large", width: 440 }
            );
          }
        }, 150);
      } catch (err) {
        console.error("Failed to render Google Sign-In button:", err);
      }
    }
  }, [showReviewModal, reviewerUser, googleClientId]);

  // Save custom client ID locally
  const handleSaveClientId = (cid) => {
    const trimmed = cid.trim();
    localStorage.setItem('google_client_id', trimmed);
    setGoogleClientId(trimmed);
    setShowClientIdConfig(false);
  };

  // Fetch customer reviews on mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/reviews`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, []);



  // Handle Email manual Sign-In fallback
  const handleEmailSignIn = () => {
    setEmailError('');
    if (!emailName.trim() || !emailAddr.trim()) {
      setEmailError('Please enter both your name and email address.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailAddr)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    const user = { name: emailName, email: emailAddr, avatarUrl: '' };
    sessionStorage.setItem('reviewer_user', JSON.stringify(user));
    setReviewerUser(user);
  };

  // Handle Sign-Out
  const handleSignOut = () => {
    sessionStorage.removeItem('reviewer_user');
    setReviewerUser(null);
  };

  // Handle Review Submission
  const handleSubmitReview = async () => {
    if (!newComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reviewerUser.name,
          email: reviewerUser.email,
          rating: newRating,
          comment: newComment
        })
      });
      if (res.ok) {
        const addedReview = await res.json();
        setReviews([addedReview, ...reviews]);
        setReviewSuccess(true);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to submit review.');
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Failed to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Synchronize category selection state with browser URL Hash & History (Browser Back Button)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').replace(/_/g, ' ');
      
      const defaultMainCats = ['Wedding', 'Birthday Events', 'Corporate Events'];
      const dbMainCats = mainCategories.map(m => m.name);
      const validCategories = Array.from(new Set([...defaultMainCats, ...dbMainCats]));

      const exactMatch = validCategories.find(c => c.toLowerCase() === hash.toLowerCase());
      if (exactMatch) {
        setSelectedMainCat(exactMatch);
      } else {
        setSelectedMainCat(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run check on mount in case the page is loaded with a hash

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [categories, mainCategories]);

  // 1. Filter approved profiles by selected main category
  const mainCatFilteredProfiles = profiles.filter(gig => {
    if (!selectedMainCat) return true;
    return isSubCategoryInMain(gig.category, selectedMainCat, categories);
  });

  // 2. Filter listings by search criteria within the main category
  const filteredGigs = mainCatFilteredProfiles.filter(gig => {
    const matchesCat = selectedCat === 'All' || gig.category === selectedCat || (gig.isPromoted && gig.promotedCategory === selectedCat);
    const matchesLoc = !searchLoc || gig.location.toLowerCase().includes(searchLoc.toLowerCase());
    const matchesKey = !searchKey || 
      gig.businessName.toLowerCase().includes(searchKey.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchKey.toLowerCase());
    return matchesCat && matchesLoc && matchesKey;
  });

  // Sort listings so promoted ads are at the absolute top of category/subcategory listings
  const sortedFilteredGigs = [...filteredGigs].sort((a, b) => {
    const aPromoted = a.isPromoted ? 1 : 0;
    const bPromoted = b.isPromoted ? 1 : 0;
    return bPromoted - aPromoted;
  });

  // 3. Filter relevant categories for pills based on selected main category
  const relevantCategories = categories.filter(cat => {
    if (!selectedMainCat) return true;
    return isSubCategoryInMain(cat.name, selectedMainCat, categories);
  });

  const handleSelectCategory = (catName) => {
    window.location.hash = catName.replace(/\s+/g, '_');
  };

  // Selection view (initial landing)
  if (!selectedMainCat) {
    return (
      <div className="directory-landing" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        {/* Dynamic Cinematic Video Hero */}
        <VideoHeroHeader 
          title="Select Event Category" 
          subtitle="Explore verified premium service providers, specialized freelance networks, and exclusive venue listings tailored for your celebrations." 
          tag="Premium Event Network" 
          videoKey="General" 
        />

        {/* Dynamic Main Category Boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', padding: '0 1rem', maxWidth: '1200px', margin: '0 auto 4rem auto' }}>
          {(() => {
            const defaultMainCats = ['Wedding', 'Birthday Events', 'Corporate Events'];
            const dbMainCats = mainCategories.map(m => m.name);
            const uniqueMainCats = Array.from(new Set([...defaultMainCats, ...dbMainCats]));

            return uniqueMainCats.map(mainCat => {
              let IconComponent = Sparkles;
              let description = `Discover top-tier approved freelancers, registers, and service vendors specializing in premium ${mainCat.toLowerCase()} requirements.`;

              if (mainCat === 'Wedding') {
                IconComponent = Heart;
                description = "Plan your perfect fairytale day. Browse luxury bridal makeup, vintage vehicle rentals, elegant saree boutiques, and award-winning cinematography teams.";
              } else if (mainCat === 'Birthday Events') {
                IconComponent = Cake;
                description = "Host unforgettable birthday celebrations. Source specialized theme designers, portrait photography studios, elegant salons, and custom entertainment coordinators.";
              } else if (mainCat === 'Corporate Events') {
                IconComponent = Briefcase;
                description = "Deliver premium business experiences. Source corporate conference media teams, executive vehicle rentals, professional organizers, and seminar services.";
              }

              return (
                <div 
                  key={mainCat}
                  className="category-card" 
                  onClick={() => handleSelectCategory(mainCat)}
                  style={{ minHeight: '400px', padding: '0', position: 'relative', overflow: 'hidden' }}
                >
                  {/* Full-Box Event Cover Image Background */}
                  <img 
                    src={CATEGORY_IMAGES[mainCat] || CATEGORY_IMAGES['General']} 
                    alt={mainCat} 
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      objectPosition: 'center 15%', // Perfectly frames couple faces/heads at the top
                      zIndex: 1, 
                      transition: 'var(--transition)' 
                    }}
                    className="category-card-img"
                  />

                   {/* Dark-to-Light Gradient overlay to guarantee perfect text contrast */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(180deg, rgba(26, 19, 16, 0.15) 0%, rgba(26, 19, 16, 0.55) 50%, rgba(26, 19, 16, 0.92) 100%)', // Subtle dimming at top, rich contrast in middle, solid backing at bottom
                    zIndex: 2,
                    pointerEvents: 'none'
                  }} />

                  {/* High-Contrast Typographic Overlay */}
                  <div style={{ 
                    position: 'relative', 
                    zIndex: 3, 
                    padding: '2.5rem 2rem 2.2rem 2rem', 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    textAlign: 'center',
                    flex: 1
                  }}>
                    <h2 style={{ color: '#ffffff', fontSize: '1.9rem', fontStyle: 'italic', marginBottom: '0.6rem', textShadow: '0 2px 10px rgba(0, 0, 0, 0.65), 0 1px 3px rgba(0, 0, 0, 0.8)' }}>{mainCat}</h2>
                    <p style={{ color: 'rgba(255, 255, 255, 0.92)', fontSize: '0.88rem', lineHeight: '1.5', margin: 0, textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)' }}>
                      {description}
                    </p>
                    <button className="btn-primary" style={{ marginTop: '1.75rem', padding: '0.6rem 2rem', width: '100%', fontSize: '0.85rem', background: 'linear-gradient(135deg, var(--color-rose-300) 0%, var(--color-gold-300) 100%)', color: '#ffffff', boxShadow: '0 4px 15px rgba(229, 169, 158, 0.25)' }}>
                      Explore {mainCat}
                    </button>
                  </div>
                </div>
              );
            });
          })()}
        </div>

        {/* ======================================================== */}
        {/* CUSTOMER REVIEWS FEED WALL */}
        {/* ======================================================== */}
        <div style={{ marginTop: '5.5rem', borderTop: '1px solid var(--card-border)', paddingTop: '4.5rem', paddingBottom: '3rem', width: '100%', animation: 'fadeIn 0.6s ease-out' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--color-gold-300)', marginBottom: '0.8rem' }}>
              <Sparkles size={16} />
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>Client Testimonials</span>
            </div>
            <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: '0.8rem' }}>Words of Love & Celebration</h2>
            <p style={{ fontSize: '1.02rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              See how our couples and event planners craft absolute perfection and coordinate memorable milestones using the AllInOnePlace directory.
            </p>
          </div>

          {reviewsLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading luxury reviews feed...
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', padding: '0 1rem', maxWidth: '1200px', margin: '0 auto 3rem auto' }}>
              {reviews.map((rev) => {
                const initials = rev.name ? rev.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'C';
                return (
                  <div 
                    key={rev._id} 
                    className="luxury-card" 
                    style={{ 
                      padding: '2.25rem', 
                      borderRadius: 'var(--radius-md)', 
                      background: 'var(--card-bg)', 
                      border: '1px solid var(--card-border)', 
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '260px',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div>
                      {/* Star rating display */}
                      <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1.25rem' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            fill={i < rev.rating ? 'var(--color-gold-300)' : 'none'} 
                            color={i < rev.rating ? 'var(--color-gold-300)' : 'var(--color-gold-200)'} 
                            style={{ opacity: i < rev.rating ? 1 : 0.25 }}
                          />
                        ))}
                      </div>
                      
                      {/* Review Comment in Playfair Display italics */}
                      <p style={{ 
                        fontFamily: 'var(--font-serif)', 
                        fontStyle: 'italic', 
                        fontSize: '1.05rem', 
                        lineHeight: 1.6, 
                        color: 'var(--text-primary)', 
                        marginBottom: '1.5rem', 
                        lineBreak: 'anywhere',
                        position: 'relative'
                      }}>
                        "{rev.comment}"
                      </p>
                    </div>

                    {/* Review Author Metadata */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', borderTop: '1px solid rgba(197, 160, 89, 0.08)', paddingTop: '1.1rem' }}>
                      <div style={{ 
                        width: '42px', 
                        height: '42px', 
                        borderRadius: '50px', 
                        background: 'linear-gradient(135deg, var(--color-rose-100) 0%, var(--color-rose-200) 100%)', 
                        border: '1px solid var(--color-rose-300)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'var(--color-rose-400)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.8)'
                      }}>
                        {initials.slice(0, 2)}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{rev.name}</h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>{rev.email}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Share Experience Action Bar */}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button 
              className="btn-primary" 
              style={{ 
                padding: '0.85rem 2.5rem', 
                fontSize: '0.92rem', 
                fontWeight: 600,
                background: 'linear-gradient(135deg, var(--color-rose-300) 0%, var(--color-gold-300) 100%)', 
                color: '#ffffff', 
                borderRadius: '50px',
                boxShadow: '0 8px 24px rgba(229, 169, 158, 0.25)',
                transition: 'var(--transition)'
              }}
              onClick={() => {
                setShowReviewModal(true);
                setReviewSuccess(false);
                setNewComment('');
                setNewRating(5);
              }}
            >
              Share Your Experience
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* LUXURY INTERACTIVE REVIEW & Google Authentication Modal */}
        {/* ======================================================== */}
        {showReviewModal && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            background: 'rgba(26, 19, 16, 0.45)', 
            backdropFilter: 'blur(8px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000,
            animation: 'fadeIn 0.25s ease-out'
          }}>
            <div style={{ 
              background: 'var(--bg-primary)', 
              border: '1px solid var(--card-border)', 
              borderRadius: 'var(--radius-md)', 
              width: '100%', 
              maxWidth: '520px', 
              padding: '2.5rem', 
              boxShadow: 'var(--shadow-lg)',
              position: 'relative',
              animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              {/* Close Button */}
              <button 
                style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--text-muted)', fontSize: '1.5rem', transition: 'var(--transition)', border: 'none', background: 'none', cursor: 'pointer' }}
                onClick={() => setShowReviewModal(false)}
                className="hover-opacity"
              >
                ✕
              </button>

              {reviewSuccess ? (
                /* SUCCESS VIEW */
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ 
                    width: '72px', 
                    height: '72px', 
                    borderRadius: '50px', 
                    background: 'var(--color-rose-100)', 
                    color: 'var(--color-rose-400)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 1.5rem auto',
                    fontSize: '2rem'
                  }}>
                    ✨
                  </div>
                  <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: '0.8rem' }}>Review Published</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                    Thank you so much! Your celebration testimonial has been published successfully and is now featured on our community feed wall.
                  </p>
                  <button 
                    className="btn-primary" 
                    style={{ padding: '0.75rem 2.5rem', fontSize: '0.9rem', background: 'linear-gradient(135deg, var(--color-rose-300) 0%, var(--color-gold-300) 100%)', color: '#ffffff' }}
                    onClick={() => setShowReviewModal(false)}
                  >
                    Close Window
                  </button>
                </div>
              ) : !reviewerUser ? (
                /* AUTHENTICATION PROMPT VIEW */
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: 'var(--color-gold-300)', marginBottom: '0.5rem' }}>
                      <Sparkles size={16} />
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>Identity Verification</span>
                    </div>
                    <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Join the Celebration</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                      Please verify your email or sign in with your Google account to submit an authentic rating.
                    </p>
                  </div>

                  {/* Real Google Auth Button Container or Client ID Settings */}
                  {googleClientId ? (
                    /* REAL GOOGLE IDENTITY SERVICES BUTTON CONTAINER */
                    <div style={{ marginBottom: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                      <div id="google-signin-btn-container" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}></div>
                      
                      <button 
                        style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                        onClick={() => {
                          setGoogleClientId('');
                          localStorage.removeItem('google_client_id');
                        }}
                      >
                        Change/Remove Google Client ID
                      </button>
                    </div>
                  ) : (
                    /* DUAL CHOICE: CONNECT REAL GOOGLE OR USE DEMO SANDBOX */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem', width: '100%' }}>
                      {showClientIdConfig ? (
                        /* CLIENT ID PASTE PANEL */
                        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '1.25rem', animation: 'fadeIn 0.2s ease-out' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Configure Real Google Sign-In</h4>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                            To retrieve real Google emails, create an OAuth Client ID in your <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--color-rose-400)', fontWeight: 600, textDecoration: 'underline' }}>Google Cloud Console</a>, authorize <code>http://localhost:5173</code> under Authorized JavaScript Origins, and paste the Client ID below:
                          </p>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="your-id.apps.googleusercontent.com"
                            style={{ fontSize: '0.82rem', marginBottom: '0.85rem' }}
                            value={clientIdInput}
                            onChange={(e) => setClientIdInput(e.target.value)}
                          />
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              className="btn-secondary" 
                              style={{ flex: 1, padding: '0.5rem 0', fontSize: '0.8rem' }}
                              onClick={() => setShowClientIdConfig(false)}
                            >
                              Cancel
                            </button>
                            <button 
                              className="btn-primary" 
                              style={{ flex: 1, padding: '0.5rem 0', fontSize: '0.8rem', background: 'linear-gradient(135deg, var(--color-rose-300) 0%, var(--color-gold-300) 100%)', color: '#ffffff' }}
                              onClick={() => handleSaveClientId(clientIdInput)}
                            >
                              Save Client ID
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* INITIAL PROMPT */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%' }}>
                          <button 
                            className="btn-secondary"
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              gap: '0.65rem', 
                              padding: '0.75rem 1rem', 
                              fontSize: '0.88rem',
                              border: '1px solid var(--color-rose-300)',
                              borderRadius: '8px',
                              background: 'var(--card-bg)',
                              width: '100%'
                            }}
                            onClick={() => setShowClientIdConfig(true)}
                          >
                            <svg width="16" height="16" viewBox="0 0 18 18">
                              <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7l2.78 2.16c1.63-1.5 2.57-3.71 2.57-6.49z"/>
                              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.78-2.16c-.77.52-1.76.83-3.18.83-2.44 0-4.51-1.65-5.25-3.87H1.05v2.24C2.53 15.82 5.51 18 9 18z"/>
                              <path fill="#FBBC05" d="M3.75 10.62C3.56 10 .46 9.38.46 8.5s.1-1.5.29-2.12V4.14H1.05C.38 5.48 0 6.95 0 8.5s.38 3.02 1.05 4.36l2.7-2.24z"/>
                              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.8 11.43 0 9 0 5.51 0 2.53 2.18 1.05 5.14l2.7 2.24c.74-2.22 2.81-3.87 5.25-3.87z"/>
                            </svg>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Sign In with Real Google Account</span>
                          </button>


                        </div>
                      )}
                    </div>
                  )}

                  {/* Elegant Divider */}
                  <div style={{ display: 'flex', alignItems: 'center', textTransform: 'uppercase', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.1em', margin: '1.5rem 0', width: '100%' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
                    <span style={{ padding: '0 0.85rem' }}>or continue with email</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
                  </div>

                  {/* Email Manual Form */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Your Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter your full name"
                        value={emailName}
                        onChange={(e) => setEmailName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Email Address</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="yourname@domain.com"
                        value={emailAddr}
                        onChange={(e) => setEmailAddr(e.target.value)}
                      />
                    </div>
                    {emailError && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--error)', display: 'block' }}>⚠️ {emailError}</span>
                    )}
                    <button 
                      className="btn-primary" 
                      style={{ padding: '0.75rem 0', width: '100%', marginTop: '0.5rem', background: 'linear-gradient(135deg, var(--color-rose-300) 0%, var(--color-gold-300) 100%)', color: '#ffffff' }}
                      onClick={handleEmailSignIn}
                    >
                      Verify Email & Continue
                    </button>
                  </div>
                </div>
              ) : (
                /* WRITE YOUR REVIEW FORM */
                <div>
                  <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Verified Reviewer</span>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{reviewerUser.name}</strong>
                    </div>
                    <button 
                      style={{ fontSize: '0.75rem', color: 'var(--color-rose-400)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                      onClick={handleSignOut}
                    >
                      Switch Account
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: '1.5rem', textAlign: 'center' }}>Write Your Testimonial</h3>

                  {/* Interactive Star Selector */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.75rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Overall Star Rating</span>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {[1, 2, 3, 4, 5].map((starValue) => {
                        const isLit = hoverRating ? starValue <= hoverRating : starValue <= newRating;
                        return (
                          <Star 
                            key={starValue}
                            size={32}
                            fill={isLit ? 'var(--color-gold-300)' : 'none'}
                            color={isLit ? 'var(--color-gold-300)' : 'var(--color-gold-200)'}
                            style={{ cursor: 'pointer', transition: 'transform 0.15s, color 0.15s', transform: isLit ? 'scale(1.08)' : 'none' }}
                            onMouseEnter={() => setHoverRating(starValue)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setNewRating(starValue)}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Review Textarea */}
                  <div style={{ marginBottom: '1.75rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Your Experience</label>
                    <textarea 
                      rows={4}
                      className="form-control" 
                      placeholder="Describe your celebratory experience using our portal. What did you enjoy the most?"
                      style={{ resize: 'none', padding: '0.85rem' }}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                  </div>

                  <button 
                    className="btn-primary" 
                    style={{ 
                      padding: '0.8rem 0', 
                      width: '100%', 
                      background: 'linear-gradient(135deg, var(--color-rose-300) 0%, var(--color-gold-300) 100%)',
                      color: '#ffffff',
                      boxShadow: '0 4px 15px rgba(229, 169, 158, 0.2)' 
                    }}
                    disabled={isSubmittingReview}
                    onClick={handleSubmitReview}
                  >
                    {isSubmittingReview ? 'Publishing Testimonial...' : 'Publish Testimonial'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    );
  }

  // Detailed Gigs Directory View for Selected Main Category
  return (
    <div className="directory-landing" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      
      {/* Dynamic Video Hero Banner */}
      <VideoHeroHeader 
        title={`${selectedMainCat} Services`} 
        subtitle={`Explore approved premium freelancers and event service providers specializing in ${selectedMainCat.toLowerCase()} requirements.`} 
        tag={`${selectedMainCat} Portal`} 
        videoKey={selectedMainCat} 
      />

      {/* Dynamic Search Box */}
      <div className="search-container">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 2, minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Search business names or keywords..."
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
            <input
              type="text"
              placeholder="Filter by city/location..."
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              value={searchLoc}
              onChange={(e) => setSearchLoc(e.target.value)}
            />
            <MapPin size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <button className="btn-primary" style={{ flex: '0 0 auto', padding: '0.75rem 2rem' }}>
            Find Services
          </button>
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
        <button
          className="btn-secondary"
          style={{
            padding: '0.5rem 1.4rem',
            fontSize: '0.85rem',
            background: selectedCat === 'All' ? 'var(--color-gold-400)' : 'transparent',
            color: selectedCat === 'All' ? '#0b0f19' : 'var(--text-secondary)',
            borderColor: selectedCat === 'All' ? 'var(--color-gold-400)' : 'var(--card-border)',
            borderRadius: '50px'
          }}
          onClick={() => setSelectedCat('All')}
        >
          ALL CATEGORIES
        </button>
        {relevantCategories.map(cat => (
          <button
            key={cat._id}
            className="btn-secondary"
            style={{
              padding: '0.5rem 1.4rem',
              fontSize: '0.85rem',
              background: selectedCat === cat.name ? 'var(--color-gold-400)' : 'transparent',
              color: selectedCat === cat.name ? '#0b0f19' : 'var(--text-secondary)',
              borderColor: selectedCat === cat.name ? 'var(--color-gold-400)' : 'var(--card-border)',
              borderRadius: '50px'
            }}
            onClick={() => setSelectedCat(cat.name)}
          >
            {cat.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Directory Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
        {sortedFilteredGigs.map(gig => (
          <div 
            key={gig._id} 
            className={`gig-card ${gig.isPromoted ? 'promoted' : ''}`}
          >
            {/* Header Cover Image */}
            <div className="img-wrapper">
              <img
                src={gig.imageUrl || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'}
                alt={gig.businessName}
              />
              
              {/* Promoted / Featured badge */}
              {gig.isPromoted && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'linear-gradient(135deg, var(--color-rose-300), var(--color-gold-300))',
                  color: '#ffffff',
                  padding: '0.35rem 0.9rem',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  borderRadius: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  boxShadow: '0 4px 10px rgba(229, 169, 158, 0.3)',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  zIndex: 10
                }}>
                  👑 Featured Partner
                </div>
              )}

              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--color-rose-300)',
                color: 'var(--color-rose-400)',
                padding: '0.3rem 0.8rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '50px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <Tag size={10} /> {gig.category}
              </div>
            </div>

            {/* Core Card Info */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '1.4rem', fontStyle: 'italic', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{gig.businessName}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                <MapPin size={12} color="var(--color-rose-300)" />
                <span>{gig.location} • {gig.address}</span>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', flex: 1, lineBreak: 'anywhere' }}>
                {gig.description ? gig.description.slice(0, 110) + '...' : 'No business description provided yet.'}
              </p>

              {gig.pricing && (
                <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>SLA Pricing</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-gold-300)', fontSize: '0.95rem' }}>{gig.pricing}</span>
                </div>
              )}

              <button
                className="btn-secondary"
                style={{ width: '100%', marginTop: '1.5rem', padding: '0.6rem 0' }}
                onClick={() => onViewProfile(gig)}
              >
                View Service Details
              </button>
            </div>
          </div>
        ))}

        {filteredGigs.length === 0 && (
          <div style={{ gridColumn: '1/ -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }} className="luxury-card">
            No approved service providers registered under the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
