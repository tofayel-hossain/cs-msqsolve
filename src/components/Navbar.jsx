import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogIn, LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-box">
            <BookOpen size={20} color="white" />
          </div>
          MCQ<span>Solve</span>
        </Link>

        {/* Desktop Links */}
        {!isMobile && (
          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              Home
            </NavLink>
            <NavLink to="/blogs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Blogs
            </NavLink>
            
            {user ? (
              <div className="nav-user">
                <span className="user-email-badge">{user.email}</span>
                <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <LayoutDashboard size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  Practice Dashboard
                </NavLink>
                <button onClick={handleLogout} className="nav-link" style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="nav-user">
                <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <LogIn size={16} />
                  Practice Login
                </NavLink>
              </div>
            )}
          </div>
        )}

        {/* Mobile menu toggle */}
        {isMobile && (
          <button className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: 'var(--text-white)' }}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Mobile Links */}
      {mobileMenuOpen && (
        <div className="nav-links mobile-menu" style={{
          display: 'flex',
          position: 'fixed',
          top: '72px',
          left: 0,
          right: 0,
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border)',
          flexDirection: 'column',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-lg)',
          gap: '16px',
          zIndex: 99
        }}>
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)} end>
            Home
          </NavLink>
          <NavLink to="/blogs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            Blogs
          </NavLink>
          
          {user ? (
            <>
              <span className="user-email-badge" style={{ textAlign: 'center', display: 'block' }}>{user.email}</span>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <LayoutDashboard size={16} />
                Practice Dashboard
              </NavLink>
              <button onClick={handleLogout} className="nav-link" style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <LogIn size={16} />
              Practice Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}
