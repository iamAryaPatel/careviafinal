import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './MotionSystem';
import { useAuth } from '../context/AuthContext';

export default function PlatformNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuth();
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    ['/', 'Discover'], 
    ['/jobs', 'Jobs'], 
    ['/dashboard', 'My Space'], 
    ['/recruiter', 'Recruiters'], 
    ['/admin', 'Admin']
  ];

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'User';

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <header className={`platform-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="shell nav-inner">
        <Link className="wordmark" to="/">
          <b>cv</b> 
          Carvia
        </Link>
        
        <button 
          className="menu-button" 
          onClick={() => setOpen(!open)} 
          aria-expanded={open}
          aria-label="Toggle Menu"
        >
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          )}
        </button>
        
        <AnimatePresence>
          {open && (
            <motion.nav 
              className="nav-links mobile-open" 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
            >
              {links.map(([to, label]) => (
                <NavLink key={to} to={to} onClick={() => setOpen(false)}>
                  {label}
                </NavLink>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
        
        <nav className="nav-links desktop-links">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
        </nav>
        
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="theme-button" 
            onClick={toggle} 
            aria-label="Toggle color theme"
          >
            <motion.span 
              animate={{ rotate: theme === 'light' ? 180 : 0 }} 
              transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
            >
              {theme === 'light' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 0 1 1-9-9Z"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              )}
            </motion.span>
          </button>

          {user ? (
            <div className="user-profile-nav" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--line)' }}
                  />
                ) : (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayName.split(' ')[0]}
                </span>
              </div>
              <button
                className="nav-cta"
                onClick={handleSignOut}
                style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--soft)', color: 'var(--text)', border: '1px solid var(--line)' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button className="nav-cta" onClick={() => navigate('/auth')}>
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

