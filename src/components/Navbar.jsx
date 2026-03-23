/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { TbCompass, TbMenu2, TbX, TbLogout, TbUserCircle, TbLayoutDashboard } from 'react-icons/tb'
import { FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Home',         href: '/' },
  { label: 'How it Works', href: '/#how-it-works' },
  { label: 'About',        href: '/#about' },
]

const hideOn = ['/login', '/quiz', '/results', '/colleges', '/dashboard']

export default function Navbar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, logOut } = useAuth()

  const [menuOpen,     setMenuOpen]     = useState(false)
  const [scrolled,     setScrolled]     = useState(false)
  const [loggingOut,   setLoggingOut]   = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const prevPath = useRef(location.pathname)

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    if (prevPath.current !== location.pathname) {
      prevPath.current = location.pathname
      setMenuOpen(false)
      setShowUserMenu(false)
    }
  }, [location.pathname])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.user-menu-wrap')) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Early return after ALL hooks
  if (hideOn.includes(location.pathname)) return null

  const handleNav = (href) => {
    setMenuOpen(false)
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '')
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        }, 150)
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(href)
    }
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    setShowUserMenu(false)
    setMenuOpen(false)
    await logOut()
    setLoggingOut(false)
    navigate('/')
  }

  // Get user's first name or email prefix
  const displayName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User'
  const avatarLetter = displayName[0]?.toUpperCase()

  return (
    <>
      <style>{`
        /* ── Navbar ── */
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 48px; font-family: 'Sora', sans-serif;
          transition: background 0.3s, border-color 0.3s;
        }
        .navbar.scrolled { background: rgba(10,10,15,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.07); }
        .navbar.top      { background: transparent; border-bottom: 1px solid transparent; }

        .nav-logo      { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .nav-logo-icon { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .nav-logo-text { font-weight: 700; font-size: 1.05rem; color: #f0efe8; letter-spacing: -0.02em; }

        .nav-links { display: flex; align-items: center; gap: 4px; }
        .nav-link  { background: none; border: none; cursor: pointer; font-family: 'Sora', sans-serif; font-size: 0.9rem; font-weight: 500; color: rgba(240,239,232,0.6); padding: 8px 14px; border-radius: 10px; transition: color 0.2s, background 0.2s; white-space: nowrap; }
        .nav-link:hover  { color: #f0efe8; background: rgba(255,255,255,0.06); }
        .nav-link.active { color: #f0efe8; }

        .nav-actions { display: flex; align-items: center; gap: 8px; }
        .btn-ghost   { background: transparent; color: #f0efe8; font-family: 'Sora', sans-serif; font-size: 0.88rem; font-weight: 500; padding: 9px 20px; border-radius: 100px; border: 1px solid rgba(240,239,232,0.18); cursor: pointer; transition: background 0.2s; white-space: nowrap; }
        .btn-ghost:hover { background: rgba(255,255,255,0.07); }
        .btn-cta     { display: flex; align-items: center; gap: 7px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; font-family: 'Sora', sans-serif; font-size: 0.88rem; font-weight: 600; padding: 9px 20px; border-radius: 100px; border: none; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 0 22px rgba(99,102,241,0.35); white-space: nowrap; }
        .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 6px 30px rgba(99,102,241,0.52); }
        .btn-logout  { display: flex; align-items: center; gap: 7px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #f87171; font-family: 'Sora', sans-serif; font-size: 0.88rem; font-weight: 500; padding: 9px 18px; border-radius: 100px; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
        .btn-logout:hover    { background: rgba(239,68,68,0.18); }
        .btn-logout:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Avatar & dropdown */
        .user-menu-wrap { position: relative; }
        .avatar-btn     { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 100px; padding: 6px 14px 6px 6px; cursor: pointer; transition: background 0.2s; color: #f0efe8; font-family: 'Sora', sans-serif; font-size: 0.85rem; font-weight: 500; }
        .avatar-btn:hover { background: rgba(255,255,255,0.1); }
        .avatar-circle  { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: #fff; flex-shrink: 0; }

        @keyframes dropIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        .user-dropdown  { position: absolute; top: calc(100% + 8px); right: 0; background: rgba(18,18,24,0.98); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 6px; min-width: 200px; box-shadow: 0 16px 48px rgba(0,0,0,0.5); backdrop-filter: blur(20px); animation: dropIn 0.18s cubic-bezier(.16,1,.3,1); z-index: 200; }
        .dropdown-user  { padding: 10px 12px 12px; border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: 6px; }
        .dropdown-name  { font-weight: 600; font-size: 0.88rem; color: #f0efe8; }
        .dropdown-email { font-size: 0.76rem; color: rgba(240,239,232,0.4); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 170px; }
        .dropdown-item  { display: flex; align-items: center; gap: 9px; width: 100%; padding: 9px 12px; border-radius: 8px; background: none; border: none; cursor: pointer; font-family: 'Sora', sans-serif; font-size: 0.86rem; color: rgba(240,239,232,0.65); transition: background 0.15s, color 0.15s; text-align: left; }
        .dropdown-item:hover        { background: rgba(255,255,255,0.07); color: #f0efe8; }
        .dropdown-item.danger:hover { background: rgba(239,68,68,0.12); color: #f87171; }

        /* Hamburger */
        .hamburger { display: none; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; width: 40px; height: 40px; align-items: center; justify-content: center; cursor: pointer; color: #f0efe8; transition: background 0.2s; flex-shrink: 0; }
        .hamburger:hover { background: rgba(255,255,255,0.1); }

        /* Mobile drawer */
        .mobile-drawer { position: fixed; top: 64px; left: 0; right: 0; bottom: 0; z-index: 99; background: rgba(10,10,15,0.98); backdrop-filter: blur(24px); display: flex; flex-direction: column; padding: 32px 24px; transform: translateX(100%); transition: transform 0.35s cubic-bezier(.16,1,.3,1); }
        .mobile-drawer.open { transform: translateX(0); }

        .mobile-user-info { display: flex; align-items: center; gap: 12px; padding: 16px 0 20px; border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: 8px; }
        .mobile-avatar    { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 700; color: #fff; flex-shrink: 0; }
        .mobile-link      { background: none; border: none; cursor: pointer; font-family: 'Sora', sans-serif; font-size: 1.4rem; font-weight: 600; color: rgba(240,239,232,0.55); padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.06); text-align: left; transition: color 0.2s; display: flex; align-items: center; justify-content: space-between; width: 100%; }
        .mobile-link:hover { color: #f0efe8; }
        .mobile-actions   { margin-top: auto; display: flex; flex-direction: column; gap: 10px; }

        .mobile-btn-ghost  { width: 100%; padding: 14px; border-radius: 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #f0efe8; font-family: 'Sora', sans-serif; font-size: 1rem; font-weight: 500; cursor: pointer; transition: background 0.2s; }
        .mobile-btn-ghost:hover { background: rgba(255,255,255,0.09); }
        .mobile-btn-cta    { width: 100%; padding: 15px; border-radius: 14px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; color: #fff; font-family: 'Sora', sans-serif; font-size: 1rem; font-weight: 600; cursor: pointer; }
        .mobile-btn-logout { width: 100%; padding: 14px; border-radius: 14px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #f87171; font-family: 'Sora', sans-serif; font-size: 1rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .mobile-btn-logout:hover { background: rgba(239,68,68,0.18); }



        @keyframes spin { to { transform: rotate(360deg); } }

        /* Responsive */
        @media (max-width: 768px) {
          .navbar      { padding: 14px 20px !important; }
          .nav-links   { display: none !important; }
          .nav-actions { display: none !important; }
          .hamburger   { display: flex !important; }
        }
      `}</style>

{/* ── Navbar ── */}
      <nav className={`navbar ${scrolled ? 'scrolled' : 'top'}`}>

        {/* Logo */}
        <div className="nav-logo" onClick={() => navigate('/')}>
          <div className="nav-logo-icon"><TbCompass size={20} color="#fff" /></div>
          <span className="nav-logo-text">Eduvora</span>
        </div>

        {/* Desktop links */}
        <div className="nav-links">
          {navLinks.map(link => (
            <button key={link.label} className={`nav-link ${location.pathname === link.href ? 'active' : ''}`} onClick={() => handleNav(link.href)}>
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop actions — changes based on auth state */}
        <div className="nav-actions">
          {user ? (
            // ── Logged in: dashboard link + avatar + dropdown ──
            <>
              <button className="nav-link" onClick={() => navigate('/dashboard')} style={{ color: 'rgba(240,239,232,0.7)', display:'flex', alignItems:'center', gap:6 }}>
                <TbLayoutDashboard size={15} /> Dashboard
              </button>
            <div className="user-menu-wrap">
              <button className="avatar-btn" onClick={() => setShowUserMenu(p => !p)}>
                <div className="avatar-circle">{avatarLetter}</div>
                {displayName}
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-user">
                    <div className="dropdown-name">{user.displayName || displayName}</div>
                    <div className="dropdown-email">{user.email}</div>
                  </div>
                  <button className="dropdown-item" onClick={() => { setShowUserMenu(false); navigate('/dashboard') }}>
                    <TbLayoutDashboard size={16} /> Dashboard
                  </button>
                  <button className="dropdown-item" onClick={() => { setShowUserMenu(false); navigate('/quiz') }}>
                    <TbUserCircle size={16} /> Take Quiz
                  </button>
                  <button className="dropdown-item danger" onClick={handleLogout} disabled={loggingOut}>
                    {loggingOut
                      ? <><div style={{ width:14, height:14, border:'2px solid rgba(248,113,113,0.3)', borderTopColor:'#f87171', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} /> Signing out...</>
                      : <><TbLogout size={16} /> Sign Out</>
                    }
                  </button>
                </div>
              )}
            </div>
            </>
          ) : (
            // ── Logged out: sign in + get started ──
            <>
              <button className="btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
              <button className="btn-cta"   onClick={() => navigate('/login')}>
                Get Started <FiArrowRight size={14} />
              </button>
            </>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(prev => !prev)}>
          {menuOpen ? <TbX size={20} /> : <TbMenu2 size={20} />}
        </button>
      </nav>

      {/* ── Mobile Drawer ── */}
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`} style={{ top:'64px', paddingTop:'32px' }}>

        {/* User info strip — shown when logged in */}
        {user && (
          <div className="mobile-user-info">
            <div className="mobile-avatar">{avatarLetter}</div>
            <div>
              <div style={{ fontWeight:600, fontSize:'0.95rem', color:'#f0efe8' }}>{user.displayName || displayName}</div>
              <div style={{ fontSize:'0.78rem', color:'rgba(240,239,232,0.4)', marginTop:2 }}>{user.email}</div>
            </div>
          </div>
        )}

        {/* Nav links */}
        {navLinks.map(link => (
          <button key={link.label} className="mobile-link" onClick={() => handleNav(link.href)}>
            {link.label}
            <FiArrowRight size={18} style={{ opacity:0.3 }} />
          </button>
        ))}

        {/* Bottom actions */}
        <div className="mobile-actions">
          {user ? (
            // Logged in mobile
            <>
              <button className="mobile-btn-ghost" onClick={() => { setMenuOpen(false); navigate('/dashboard') }}>
                Dashboard
              </button>
              <button className="mobile-btn-cta" onClick={() => { setMenuOpen(false); navigate('/quiz') }}>
                Take New Quiz
              </button>
              <button className="mobile-btn-logout" onClick={handleLogout} disabled={loggingOut}>
                {loggingOut
                  ? <><div style={{ width:16, height:16, border:'2px solid rgba(248,113,113,0.3)', borderTopColor:'#f87171', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} /> Signing out...</>
                  : <><TbLogout size={16} /> Sign Out</>
                }
              </button>
            </>
          ) : (
            // Logged out mobile
            <>
              <button className="mobile-btn-ghost" onClick={() => { setMenuOpen(false); navigate('/login') }}>
                Sign In
              </button>
              <button className="mobile-btn-cta" onClick={() => { setMenuOpen(false); navigate('/login') }}>
                Get Started — It's Free
              </button>
            </>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position:'fixed', inset:0, zIndex:98 }} />}
    </>
  )
}