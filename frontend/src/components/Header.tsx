import { useState, useEffect } from 'react';
import { Home, Menu, X, User, LogOut, Briefcase, MapPin, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LoginSelectionModal } from './auth/LoginSelectionModal';
import { useAuth } from '../context/AuthContext';
import { useLocationContext } from '../context/LocationContext';
import { useToast } from '../context/ToastContext';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { city, area, openLocationModal } = useLocationContext();
  
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Technicians', path: '/#technicians' },
    { name: 'How It Works', path: '/#how-it-works' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.startsWith('/#')) {
      e.preventDefault();
      const id = path.substring(2);
      if (location.pathname === '/') {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
    setIsMobileMenuOpen(false);
  };

  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast.info('You have signed out successfully.', 'Signed Out');
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`header ${scrolled ? 'glass' : ''}`} 
        style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 50,
          transition: 'all var(--transition-smooth)',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          padding: '1rem 0'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, var(--primary), var(--accent-electric))', 
                padding: '0.5rem', 
                borderRadius: '0.75rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white',
                boxShadow: 'var(--shadow-glow)'
              }}>
                <Home size={22} strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.5px', color: '#fff', whiteSpace: 'nowrap' }}>
                Home<span style={{ color: 'var(--primary-light)' }}>Pro</span>
              </span>
            </Link>

            {/* Desktop Location Selector */}
            <button
              type="button"
              onClick={openLocationModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.85rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-full)',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                backdropFilter: 'blur(8px)'
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary-light)'; e.currentTarget.style.background = 'rgba(79, 70, 229, 0.15)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
              title="Click to change location"
            >
              <MapPin size={15} color="var(--accent-electric)" />
              <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {area}, {city}
              </span>
              <ChevronDown size={13} color="var(--text-muted)" />
            </button>
          </div>
          
          <nav className="nav-links" style={{ alignItems: 'center' }}>
            {links.map((link) => {
              const isActive = location.pathname === link.path || (location.pathname === '/' && link.path === '/');

              
              return (
                <a 
                  key={link.name} 
                  href={link.path}
                  onClick={(e) => handleNavClick(e as any, link.path)}
                  style={{
                    position: 'relative',
                    color: isActive ? 'var(--primary-light)' : 'var(--text-main)',
                    fontWeight: isActive ? 600 : 500,
                    textDecoration: 'none',
                    padding: '0.5rem 0',
                    transition: 'color var(--transition-smooth)',
                    fontSize: '0.95rem'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--text-main)';
                  }}
                >
                  {link.name}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-indicator"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'var(--primary-light)',
                        borderRadius: '2px',
                        boxShadow: '0 0 10px rgba(139, 124, 255, 0.5)'
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>
          
          <div className="auth-buttons" style={{ alignItems: 'center' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link 
                  to={user.role === 'TECHNICIAN' ? '/technician/dashboard/overview' : user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? '/admin/dashboard/overview' : '/dashboard/overview'} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.65rem', 
                    padding: '0.35rem 0.75rem 0.35rem 0.45rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--text-main)', 
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = 'var(--primary-light)';
                    e.currentTarget.style.background = 'rgba(109, 93, 251, 0.12)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  title="View Dashboard"
                >
                  <div style={{ position: 'relative' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      background: user.role === 'TECHNICIAN' ? 'linear-gradient(135deg, #10B981, #059669)' : user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : 'linear-gradient(135deg, var(--primary), var(--primary-dark))', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'white', 
                      boxShadow: 'var(--shadow-sm)' 
                    }}>
                      {user.role === 'TECHNICIAN' ? <Briefcase size={16} /> : <User size={16} />}
                    </div>
                    {/* Active session pulse dot */}
                    <span 
                      style={{
                        position: 'absolute',
                        bottom: '-1px',
                        right: '-1px',
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        background: '#10B981',
                        border: '2px solid var(--bg-primary)',
                        boxShadow: '0 0 6px #10B981'
                      }}
                      title="Session Active"
                    />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name?.split(' ')[0] || 'Dashboard'}
                  </span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-secondary" 
                  style={{ padding: '0.55rem', borderRadius: '50%', border: '1px solid var(--border)', color: 'var(--text-muted)' }} 
                  title="Logout"
                  onMouseOver={e => e.currentTarget.style.color = '#EF4444'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => setIsLoginModalOpen(true)} className="btn btn-secondary">Login</button>
                <Link to="/services" className="btn btn-primary">Book a Service</Link>
              </>
            )}
          </div>
          
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} color="white" /> : <Menu size={28} color="white" />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="mobile-menu glass"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ 
                position: 'absolute', top: '100%', left: 0, right: 0, 
                padding: '1.5rem', borderBottom: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column', gap: '1rem'
              }}
            >
              {/* Mobile Location Selector */}
              <button
                type="button"
                onClick={() => { setIsMobileMenuOpen(false); openLocationModal(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(79, 70, 229, 0.15)',
                  border: '1px solid rgba(79, 70, 229, 0.3)',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <MapPin size={18} color="var(--accent-electric)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Service Location</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{area}, {city}</div>
                </div>
                <ChevronDown size={16} color="var(--text-muted)" />
              </button>

              {links.map((link) => (
                <a 
                  key={link.name} 
                  href={link.path}
                  onClick={(e) => handleNavClick(e as any, link.path)}
                  style={{ display: 'block', padding: '0.75rem', color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.03)' }}
                >
                  {link.name}
                </a>
              ))}
              
              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {user ? (
                  <>
                    <Link 
                      to={user.role === 'TECHNICIAN' ? '/technician/dashboard/overview' : '/dashboard/overview'} 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="btn btn-primary w-full" 
                    >
                      {user.role === 'TECHNICIAN' ? 'Technician Dashboard' : 'My Dashboard'}
                    </Link>
                    <button onClick={handleLogout} className="btn btn-danger w-full">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setIsMobileMenuOpen(false); setIsLoginModalOpen(true); }} className="btn btn-secondary w-full">
                      Login
                    </button>
                    <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary w-full">Book a Service</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <LoginSelectionModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}
