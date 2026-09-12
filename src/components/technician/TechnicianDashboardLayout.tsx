import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Briefcase, CheckCircle, LogOut, Bell, Menu, X, DollarSign, AlertTriangle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchApi } from '../../services/api';

export function TechnicianDashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const { user, token, logout, isLoading } = useAuth();

  useEffect(() => {
    if (user?.role === 'TECHNICIAN' && token) {
      loadProfile();
    } else {
      setLoadingProfile(false);
    }
  }, [user, token]);

  const loadProfile = async () => {
    try {
      const data = await fetchApi('/technicians/profile');
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  if (isLoading || loadingProfile) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><span className="dot-pulse">...</span></div>;
  }

  if (!token || !user || user.role !== 'TECHNICIAN') {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const navLinks = [
    { name: 'Overview', path: '/technician/dashboard/overview', icon: LayoutDashboard },
    { name: 'New Jobs', path: '/technician/dashboard/jobs/new', icon: Briefcase },
    { name: 'Active Jobs', path: '/technician/dashboard/jobs/active', icon: CheckCircle },
    { name: 'Earnings', path: '/technician/dashboard/earnings', icon: DollarSign },
  ];

  const verificationStatus = profile?.verificationStatus || 'PENDING';

  if (verificationStatus !== 'VERIFIED') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ background: 'var(--surface)', padding: '3rem', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          {verificationStatus === 'PENDING' ? (
            <>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                <Clock size={40} />
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Application Under Review</h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
                Your application to join HomePro as a professional technician is currently being reviewed by our admin team. We will notify you once your account is verified.
              </p>
            </>
          ) : (
            <>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                <AlertTriangle size={40} />
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Application Rejected</h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
                Unfortunately, your application to join HomePro has been rejected at this time. Please contact support for further information.
              </p>
            </>
          )}
          <button onClick={handleLogout} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex' }}>

      
      <aside className="tech-desktop-sidebar" style={{ width: '280px', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'none', flexDirection: 'column' } as React.CSSProperties}>
        <div style={{ padding: '2rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.25rem' }}>
              HP
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>TechPortal</span>
          </Link>
        </div>

        <nav style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link key={link.name} to={link.path} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-lg)', textDecoration: 'none', color: isActive ? 'var(--primary)' : 'var(--text-muted)', background: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent', fontWeight: isActive ? 600 : 500, transition: 'all 0.2s ease' }}>
                <Icon size={20} /> {link.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', padding: '2rem', borderTop: '1px solid var(--border)' }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '1rem' }}>
            <LogOut size={20} /> Log Out
          </button>
        </div>
      </aside>

      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        <header style={{ height: '80px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-menu-btn" style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'none' }} onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{navLinks.find(link => location.pathname.includes(link.path))?.name || 'Dashboard'}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={24} color="var(--text-muted)" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border)' }}>
              <div className="tech-user-info" style={{ textAlign: 'right', display: 'none' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Technician</div>
              </div>
              <img src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} alt={user?.name || 'User'} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
            </div>
          </div>
        </header>

        
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
      <style>{`
        @media (min-width: 1024px) { .tech-desktop-sidebar { display: flex !important; } }
        @media (min-width: 768px) { .tech-user-info { display: block !important; } }
      `}</style>
    </div>
  );
}
