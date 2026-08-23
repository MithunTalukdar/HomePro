import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  MapPin, 
  User, 
  LogOut, 
  Bell, 
  Menu, 
  X,
  FileText,
  Star,
  LifeBuoy 
} from 'lucide-react';
import { notifications as defaultNotifications } from '../../data';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../context/AuthContext';

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, token, logout, isLoading } = useAuth();
  
  const { socket, isConnected } = useSocket(token);
  const [notifications, setNotifications] = useState(defaultNotifications);

  useEffect(() => {
    if (!socket || !isConnected) return;
    
    socket.on('new-notification', (notif: any) => {
      setNotifications(prev => [notif, ...prev]);
    });
    
    return () => {
      socket.off('new-notification');
    };
  }, [socket, isConnected]);

  if (isLoading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><span className="dot-pulse">...</span></div>;
  }

  if (!token || !user) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard/overview', icon: LayoutDashboard },
    { name: 'My Bookings', path: '/dashboard/bookings', icon: Calendar },
    { name: 'Invoices', path: '/dashboard/invoices', icon: FileText },
    { name: 'Reviews', path: '/dashboard/reviews', icon: Star },
    { name: 'Support', path: '/dashboard/support', icon: LifeBuoy },
    { name: 'Addresses', path: '/dashboard/addresses', icon: MapPin },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--background)' }}>
      
      {/* Desktop Sidebar */}
      <aside style={{ width: '280px', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', left: 0, top: 0, zIndex: 50 }} className="desktop-sidebar">
        <div style={{ padding: '2rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--text-main)', marginBottom: '3rem' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>H</span>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>HomePro</span>
          </Link>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', textDecoration: 'none',
                    background: isActive ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                    color: isActive ? 'var(--primary-light)' : 'var(--text-muted)',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all 0.2s'
                  }}
                >
                  <link.icon size={20} /> {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div style={{ marginTop: 'auto', padding: '2rem', borderTop: '1px solid var(--border)' }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '1rem' }}>
            <LogOut size={20} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-content" style={{ flex: 1, paddingLeft: '280px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Header */}
        <header style={{ height: '80px', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 40 }}>
          
          <div className="mobile-only" style={{ display: 'none' }}>
            <button onClick={() => setIsMobileMenuOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
              <Menu size={28} />
            </button>
          </div>
          
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '2rem' }}>
            
            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ background: 'var(--background)', border: '1px solid var(--border)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
              >
                <Bell size={20} color="var(--text-muted)" />
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%', border: '2px solid var(--surface)' }}></span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="glass"
                    style={{ position: 'absolute', top: '50px', right: 0, width: '320px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-glow)', zIndex: 100, overflow: 'hidden' }}
                  >
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Notifications</h3>
                      <button style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 }}>Mark all read</button>
                    </div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications.map(n => (
                        <div key={n.id} style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', background: n.read ? 'transparent' : 'rgba(109, 93, 251, 0.05)', transition: 'background var(--transition-smooth)' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseOut={e => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(109, 93, 251, 0.05)'}>
                          <div style={{ fontSize: '0.9rem', fontWeight: n.read ? 500 : 600, marginBottom: '0.25rem', color: 'var(--text-main)' }}>{n.title}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', lineHeight: 1.4 }}>{n.message}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--primary-light)' }}>{n.time}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="desktop-only" style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Customer</div>
              </div>
              <img src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} alt={user?.name || 'User'} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
            </div>
            
          </div>
        </header>

        {/* Dashboard Pages Outlet */}
        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', zIndex: 90 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: '280px', background: 'var(--surface)', zIndex: 100, display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>HomePro</div>
                <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}><X size={24} /></button>
              </div>
              <nav style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', textDecoration: 'none',
                        background: isActive ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                        color: isActive ? 'var(--primary-light)' : 'var(--text-muted)',
                        fontWeight: isActive ? 600 : 500,
                      }}
                    >
                      <link.icon size={20} /> {link.name}
                    </Link>
                  );
                })}
              </nav>
              <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '1rem' }}>
                  <LogOut size={20} /> Log Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .dashboard-content { padding-left: 0 !important; }
          .desktop-only { display: none !important; }
          .mobile-only { display: block !important; }
        }
      `}</style>
    </div>
  );
}
