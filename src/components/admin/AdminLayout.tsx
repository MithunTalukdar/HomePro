import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  Settings,
  LogOut,
  Calendar,
  Layers,
  History,
  Menu,
  X,
  Star,
  LifeBuoy,
  Tag
} from 'lucide-react';

export function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/auth/login');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      navigate('/dashboard/overview'); // Redirect if not admin
      return;
    }
    setAdmin(user);
  }, [navigate]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard/overview', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/dashboard/users', icon: Users },
    { name: 'Technicians', path: '/admin/dashboard/technicians', icon: Wrench },
    { name: 'Services', path: '/admin/dashboard/services', icon: Layers },
    { name: 'Bookings', path: '/admin/dashboard/bookings', icon: Calendar },
    { name: 'Reviews', path: '/admin/dashboard/reviews', icon: Star },
    { name: 'Support', path: '/admin/dashboard/support', icon: LifeBuoy },
    { name: 'Coupons', path: '/admin/dashboard/coupons', icon: Tag },
    { name: 'Audit Logs', path: '/admin/dashboard/audit-logs', icon: History },
    { name: 'Settings', path: '/admin/dashboard/settings', icon: Settings },
  ];

  if (!admin) return null; // Avoid flicker

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
        />
      )}

      {/* Sidebar */}
      <aside style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '280px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
      }} className="admin-sidebar">
        <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>S</span>
            </div>
            Admin<span style={{ color: 'var(--primary)' }}>Panel</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="mobile-close-btn"
            style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `dashboard-nav-link ${isActive ? 'active' : ''}`}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  textDecoration: 'none',
                  color: isActive ? 'white' : 'var(--text-muted)',
                  background: isActive ? 'var(--primary)' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s ease'
                })}
              >
                <Icon size={20} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', borderRadius: 'var(--radius-lg)', transition: 'background 0.2s ease' }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'none'}
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: 0, display: 'flex', flexDirection: 'column' }} className="admin-main">
        {/* Top Header */}
        <header style={{ height: '80px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'none' }}
            >
              <Menu size={24} />
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, display: 'none' }} className="desktop-page-title">Admin Dashboard</h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600 }}>{admin.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary-light)' }}>{admin.role.replace('_', ' ')}</div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {admin.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>

      <style>{`
        @media (min-width: 1024px) {
          .admin-sidebar {
            transform: translateX(0) !important;
          }
          .admin-main {
            margin-left: 280px !important;
          }
          .mobile-close-btn {
            display: none !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .desktop-page-title {
            display: block !important;
          }
        }
        @media (max-width: 1023px) {
          .mobile-menu-btn {
            display: block !important;
          }
        }
        .dashboard-nav-link:hover:not(.active) {
          background: rgba(255, 255, 255, 0.05) !important;
        }
      `}</style>
    </div>
  );
}
