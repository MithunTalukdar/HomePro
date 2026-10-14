import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { fetchApi } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Briefcase, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('type') === 'technician' ? 'technician' : 'customer';
  const [role, setRole] = useState<'customer' | 'technician'>(initialRole);
  
  const { login } = useAuth();
  const { toast } = useToast();
  
  const from = location.state?.from?.pathname 
    ? (location.state.from.pathname + (location.state.from.search || ''))
    : (typeof location.state?.from === 'string' ? location.state.from : null);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Specific error states for explicit manual feedback
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    const currentType = searchParams.get('type') === 'technician' ? 'technician' : 'customer';
    if (currentType !== role) {
      navigate(`/auth/login?type=${role}`, { replace: true, state: location.state });
    }
  }, [role, searchParams, navigate, location.state]);

  const validateForm = (): boolean => {
    const errs: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errs.email = 'Please enter your email address.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        errs.email = 'Please enter a valid email address (e.g. name@example.com).';
      }
    }

    if (!password) {
      errs.password = 'Please enter your password.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setError('Please resolve the errors highlighted below.');
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions
    setError('');
    setFieldErrors({});
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });
      
      login(data, data.token);
      toast.success(`Welcome back, ${data.name || 'there'}!`, 'Signed In');
      
      if (from) {
        navigate(from, { replace: true });
        return;
      }
      
      if (data.role === 'ADMIN' || data.role === 'SUPER_ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (data.role === 'TECHNICIAN') {
        navigate('/technician/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      const errMsg = err.message || '';
      const errField = err.field || '';

      // Specific explicit error mapping
      if (errField === 'password' || errMsg.toLowerCase().includes('password') || errMsg.toLowerCase().includes('incorrect') || errMsg.toLowerCase().includes('invalid password')) {
        setFieldErrors({ password: 'Invalid password. Please double check and try again.' });
        setError('Login failed: Invalid password. Please verify your credentials or click Forgot Password.');
        toast.error('Invalid password. Please double check and try again.', 'Authentication Failed');
      } else if (errField === 'email' || errMsg.toLowerCase().includes('no account') || errMsg.toLowerCase().includes('not found') || errMsg.toLowerCase().includes('unregistered')) {
        setFieldErrors({ email: 'No account found with this email. Please verify or create an account.' });
        setError('Login failed: No account registered with this email address. Please sign up first.');
        toast.error('No account registered with this email address.', 'User Not Found');
      } else {
        const fallbackMsg = errMsg || 'Failed to sign in. Please verify your email and password.';
        setError(fallbackMsg);
        toast.error(fallbackMsg, 'Sign In Failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', position: 'relative', overflow: 'hidden', padding: '2rem 1rem' }}>
      
      {/* Background Ambient Glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.18) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(70px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(34, 211, 238, 0.12) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(70px)', zIndex: 0 }} />
      
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: '480px', zIndex: 10, position: 'relative' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #c7d2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.5 }}>
            Sign in to manage bookings and services on HomePro
          </p>
        </div>

        <div style={{ 
          background: 'rgba(15, 23, 42, 0.72)', 
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '1.5rem', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          overflow: 'hidden'
        }}>
          
          {/* Top Auth Navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '1.15rem', background: 'rgba(255,255,255,0.04)', borderBottom: '2px solid var(--primary)', color: '#fff', fontWeight: 600, cursor: 'default' }}>
              Sign In
            </div>
            <button 
              type="button"
              onClick={() => navigate(`/auth/signup?type=${role}`)}
              style={{ flex: 1, textAlign: 'center', padding: '1.15rem', background: 'transparent', border: 'none', borderBottom: '2px solid transparent', color: 'var(--text-muted)', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.color = '#fff'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Sign Up
            </button>
          </div>

          <div style={{ padding: '2.25rem' }}>
            
            {/* Account Role Selector */}
            <div style={{ marginBottom: '1.75rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Continue as</p>
              <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.35rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  style={{ 
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
                    padding: '0.75rem', borderRadius: '0.75rem', cursor: 'pointer',
                    background: role === 'customer' ? 'rgba(79, 70, 229, 0.25)' : 'transparent',
                    color: role === 'customer' ? '#fff' : 'var(--text-muted)',
                    border: role === 'customer' ? '1px solid rgba(109, 93, 251, 0.6)' : '1px solid transparent',
                    boxShadow: role === 'customer' ? '0 0 15px rgba(109, 93, 251, 0.25)' : 'none',
                    transition: 'all 0.2s', fontWeight: 600
                  }}
                >
                  <User size={18} /> Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('technician')}
                  style={{ 
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
                    padding: '0.75rem', borderRadius: '0.75rem', cursor: 'pointer',
                    background: role === 'technician' ? 'rgba(16, 185, 129, 0.22)' : 'transparent',
                    color: role === 'technician' ? '#fff' : 'var(--text-muted)',
                    border: role === 'technician' ? '1px solid rgba(16, 185, 129, 0.6)' : '1px solid transparent',
                    boxShadow: role === 'technician' ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none',
                    transition: 'all 0.2s', fontWeight: 600
                  }}
                >
                  <Briefcase size={18} /> Technician
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin} noValidate>
              
              {/* Overall Error Alert Banner */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -8 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -8 }}
                    style={{ 
                      background: 'rgba(239, 68, 68, 0.14)', 
                      color: '#fca5a5', 
                      padding: '0.85rem 1rem', 
                      borderRadius: '0.75rem', 
                      marginBottom: '1.5rem', 
                      fontSize: '0.875rem', 
                      border: '1px solid rgba(239, 68, 68, 0.35)', 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      gap: '0.65rem',
                      lineHeight: 1.45
                    }}
                  >
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#ef4444' }} />
                    <div>{error}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Address Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label 
                  htmlFor="login-email"
                  style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}
                >
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: fieldErrors.email ? '#ef4444' : 'var(--text-muted)', pointerEvents: 'none' }}>
                    <Mail size={18} />
                  </div>
                  <input 
                    id="login-email"
                    type="email" 
                    autoComplete="email"
                    disabled={isLoading}
                    style={{ 
                      background: 'rgba(0, 0, 0, 0.25)', 
                      paddingLeft: '2.75rem', 
                      paddingRight: '1rem', 
                      paddingTop: '0.85rem', 
                      paddingBottom: '0.85rem',
                      border: `1px solid ${fieldErrors.email ? '#ef4444' : 'rgba(255, 255, 255, 0.12)'}`, 
                      borderRadius: '0.75rem', 
                      width: '100%', 
                      color: '#fff',
                      outline: 'none', 
                      transition: 'all 0.2s', 
                      fontSize: '0.975rem',
                      boxShadow: fieldErrors.email ? '0 0 0 3px rgba(239, 68, 68, 0.2)' : 'none',
                      opacity: isLoading ? 0.7 : 1,
                    }}
                    onFocus={e => { 
                      if (!fieldErrors.email) {
                        e.currentTarget.style.borderColor = 'var(--primary)'; 
                        e.currentTarget.style.background = 'rgba(79, 70, 229, 0.08)'; 
                        e.currentTarget.style.boxShadow = '0 0 0 4px rgba(109, 93, 251, 0.25)'; 
                      }
                    }}
                    onBlur={e => { 
                      if (!fieldErrors.email) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; 
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.25)'; 
                        e.currentTarget.style.boxShadow = 'none'; 
                      }
                    }}
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
                      if (error) setError('');
                    }}
                  />
                </div>
                {fieldErrors.email && (
                  <motion.div 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <AlertCircle size={14} /> {fieldErrors.email}
                  </motion.div>
                )}
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label 
                  htmlFor="login-password"
                  style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}
                >
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: fieldErrors.password ? '#ef4444' : 'var(--text-muted)', pointerEvents: 'none' }}>
                    <Lock size={18} />
                  </div>
                  <input 
                    id="login-password"
                    type={showPassword ? 'text' : 'password'} 
                    autoComplete="current-password"
                    disabled={isLoading}
                    style={{ 
                      background: 'rgba(0, 0, 0, 0.25)', 
                      paddingLeft: '2.75rem', 
                      paddingRight: '2.75rem', 
                      paddingTop: '0.85rem', 
                      paddingBottom: '0.85rem',
                      border: `1px solid ${fieldErrors.password ? '#ef4444' : 'rgba(255, 255, 255, 0.12)'}`, 
                      borderRadius: '0.75rem', 
                      width: '100%', 
                      color: '#fff',
                      outline: 'none', 
                      transition: 'all 0.2s', 
                      fontSize: '0.975rem',
                      boxShadow: fieldErrors.password ? '0 0 0 3px rgba(239, 68, 68, 0.2)' : 'none',
                      opacity: isLoading ? 0.7 : 1,
                    }}
                    onFocus={e => { 
                      if (!fieldErrors.password) {
                        e.currentTarget.style.borderColor = 'var(--primary)'; 
                        e.currentTarget.style.background = 'rgba(79, 70, 229, 0.08)'; 
                        e.currentTarget.style.boxShadow = '0 0 0 4px rgba(109, 93, 251, 0.25)'; 
                      }
                    }}
                    onBlur={e => { 
                      if (!fieldErrors.password) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; 
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.25)'; 
                        e.currentTarget.style.boxShadow = 'none'; 
                      }
                    }}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
                      if (error) setError('');
                    }}
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
                {fieldErrors.password && (
                  <motion.div 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <AlertCircle size={14} /> {fieldErrors.password}
                  </motion.div>
                )}
              </div>

              {/* Forgot Password Link */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                <Link to="/auth/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--primary-light)'}>
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <motion.button 
                type="submit" 
                whileHover={isLoading ? {} : { scale: 1.01, translateY: -2 }}
                whileTap={isLoading ? {} : { scale: 0.98 }}
                disabled={isLoading}
                style={{ 
                  width: '100%', height: '52px', borderRadius: '0.75rem', border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  background: isLoading ? 'rgba(79, 70, 229, 0.5)' : 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', 
                  color: '#fff', fontSize: '1.05rem', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  boxShadow: isLoading ? 'none' : '0 10px 25px -5px rgba(109, 93, 251, 0.45)', 
                  transition: 'all 0.2s',
                  opacity: isLoading ? 0.75 : 1,
                }} 
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" color="#fff" label="Signing in..." />
                ) : (
                  <>Sign In <ArrowRight size={18} /></>
                )}
              </motion.button>
              
            </form>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
