import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { fetchApi } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Briefcase, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('type') === 'technician' ? 'technician' : 'customer';
  const [role, setRole] = useState<'customer' | 'technician'>(initialRole);
  
  const { login } = useAuth();
  
  const from = location.state?.from?.pathname 
    ? (location.state.from.pathname + (location.state.from.search || ''))
    : (typeof location.state?.from === 'string' ? location.state.from : null);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    navigate(`/auth/login?type=${role}`, { replace: true, state: location.state });
  }, [role, navigate, location.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      login(data, data.token);
      
      if (from) {
        navigate(from, { replace: true });
        return;
      }
      
      // Role-based redirection
      if (data.role === 'ADMIN' || data.role === 'SUPER_ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (data.role === 'TECHNICIAN') {
        navigate('/technician/dashboard', { replace: true });
      } else {
        // Customer default redirect
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', position: 'relative', overflow: 'hidden', padding: '2rem 1rem' }}>
      
      {/* Premium Background Elements */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', zIndex: 0 }} />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: '480px', zIndex: 10, position: 'relative' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Sign in to continue to HomePro
          </p>
        </div>

        <div style={{ 
          background: 'rgba(15, 23, 42, 0.6)', 
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '1.5rem', 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          overflow: 'hidden'
        }}>
          
          {/* Top Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderBottom: '2px solid var(--primary)', color: '#fff', fontWeight: 600, cursor: 'default' }}>
              Sign In
            </div>
            <button 
              onClick={() => navigate(`/auth/signup?type=${role}`)}
              style={{ flex: 1, textAlign: 'center', padding: '1.25rem', background: 'transparent', border: 'none', borderBottom: '2px solid transparent', color: 'var(--text-muted)', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.color = '#fff'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Sign Up
            </button>
          </div>

          <div style={{ padding: '2.5rem' }}>
            
            {/* Role Selector */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 500 }}>Continue as</p>
              <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.35rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  style={{ 
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
                    padding: '0.75rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
                    background: role === 'customer' ? 'rgba(79, 70, 229, 0.2)' : 'transparent',
                    color: role === 'customer' ? '#fff' : 'var(--text-muted)',
                    border: role === 'customer' ? '1px solid rgba(79, 70, 229, 0.5)' : '1px solid transparent',
                    transition: 'all 0.2s', fontWeight: 500
                  }}
                >
                  <User size={18} /> Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('technician')}
                  style={{ 
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
                    padding: '0.75rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
                    background: role === 'technician' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                    color: role === 'technician' ? '#fff' : 'var(--text-muted)',
                    border: role === 'technician' ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid transparent',
                    transition: 'all 0.2s', fontWeight: 500
                  }}
                >
                  <Briefcase size={18} /> Technician
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin}>
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center' }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    style={{ 
                      background: 'rgba(0, 0, 0, 0.2)', paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.875rem', paddingBottom: '0.875rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.75rem', width: '100%', color: '#fff',
                      outline: 'none', transition: 'all 0.2s', fontSize: '1rem'
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(79, 70, 229, 0.05)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    style={{ 
                      background: 'rgba(0, 0, 0, 0.2)', paddingLeft: '2.75rem', paddingRight: '2.75rem', paddingTop: '0.875rem', paddingBottom: '0.875rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.75rem', width: '100%', color: '#fff',
                      outline: 'none', transition: 'all 0.2s', fontSize: '1rem'
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(79, 70, 229, 0.05)'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2.5rem' }}>
                <Link to="/auth/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--primary-light)'}>
                  Forgot Password?
                </Link>
              </div>

              <motion.button 
                type="submit" 
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                  width: '100%', height: '52px', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: '#fff', fontSize: '1.05rem', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.4)', transition: 'box-shadow 0.2s'
                }} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span style={{ display: 'inline-block', width: '22px', height: '22px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                ) : (
                  <>Sign In <ArrowRight size={18} /></>
                )}
              </motion.button>
              
            </form>
          </div>
        </div>
      </motion.div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
