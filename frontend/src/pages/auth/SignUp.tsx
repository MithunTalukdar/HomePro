import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchApi } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, Briefcase, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('type') === 'technician' ? 'technician' : 'customer';
  const [role, setRole] = useState<'customer' | 'technician'>(initialRole);
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; phone?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentType = searchParams.get('type') === 'technician' ? 'technician' : 'customer';
    if (currentType !== role) {
      navigate(`/auth/signup?type=${role}`, { replace: true });
    }
  }, [role, searchParams, navigate]);

  const validateForm = (): boolean => {
    const errs: { name?: string; email?: string; phone?: string; password?: string } = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const cleanPhone = formData.phone.replace(/\D/g, '');

    if (!trimmedName) {
      errs.name = 'Please enter your full name.';
    } else if (trimmedName.length < 2) {
      errs.name = 'Full name must be at least 2 characters.';
    }

    if (!trimmedEmail) {
      errs.email = 'Please enter your email address.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        errs.email = 'Please enter a valid email address (e.g. name@example.com).';
      }
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Please enter your mobile phone number.';
    } else if (cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.password) {
      errs.password = 'Please create a password.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setError('Please resolve the errors highlighted below.');
      return false;
    }
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          password: formData.password
        })
      });

      // Update auth context
      login(data, data.token);

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

      if (errField === 'email' || errMsg.toLowerCase().includes('email already') || errMsg.toLowerCase().includes('already exists')) {
        setFieldErrors({ email: 'An account with this email already exists. Please sign in instead.' });
        setError('This email is already registered. Please sign in or use a different email.');
      } else if (errField === 'phone' || errMsg.toLowerCase().includes('phone')) {
        setFieldErrors({ phone: 'This phone number is already associated with another account.' });
        setError('Phone number already registered. Please use another number or sign in.');
      } else if (errField === 'password') {
        setFieldErrors({ password: errMsg });
        setError(errMsg);
      } else {
        setError(errMsg || 'Failed to create account. Please check your information and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', position: 'relative', overflow: 'hidden', padding: '2rem 1rem' }}>
      {/* Background Ambient Glows */}
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
            Create an Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Join thousands of satisfied customers on HomePro
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
          {/* Header Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <button 
              onClick={() => navigate(`/auth/login?type=${role}`)}
              style={{ flex: 1, textAlign: 'center', padding: '1.25rem', background: 'transparent', border: 'none', borderBottom: '2px solid transparent', color: 'var(--text-muted)', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.color = '#fff'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Sign In
            </button>
            <div style={{ flex: 1, textAlign: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderBottom: '2px solid var(--primary)', color: '#fff', fontWeight: 600, cursor: 'default' }}>
              Sign Up
            </div>
          </div>

          <div style={{ padding: '2.5rem' }}>
            {/* Account Role Selector */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 500 }}>Registering as</p>
              <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.35rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <button
                  type="button"
                  onClick={() => { setRole('customer'); setFieldErrors({}); setError(''); }}
                  style={{ 
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
                    padding: '0.75rem', borderRadius: '0.75rem', cursor: 'pointer',
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
                  onClick={() => { setRole('technician'); setFieldErrors({}); setError(''); }}
                  style={{ 
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
                    padding: '0.75rem', borderRadius: '0.75rem', cursor: 'pointer',
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

            {role === 'technician' ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', padding: '1rem 0 2rem' }}
              >
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <Briefcase size={40} color="#10b981" />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#fff', fontWeight: 600 }}>Join as a Professional</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>Technician registration requires a few extra details to verify your expertise and service areas.</p>
                <motion.button 
                  onClick={() => navigate('/technician/register')}
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ 
                    width: '100%', height: '52px', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontSize: '1.05rem', fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)', transition: 'box-shadow 0.2s'
                  }} 
                >
                  Start Application <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            ) : (
              <motion.form 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSignUp}
                noValidate
              >
                {/* Global Error Banner */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      style={{ 
                        background: 'rgba(239, 68, 68, 0.12)', 
                        color: '#f87171', 
                        padding: '0.85rem 1rem', 
                        borderRadius: '0.75rem', 
                        marginBottom: '1.5rem', 
                        fontSize: '0.875rem', 
                        border: '1px solid rgba(239, 68, 68, 0.35)', 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        gap: '0.65rem'
                      }}
                    >
                      <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ lineHeight: 1.4 }}>{error}</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Full Name Field */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: fieldErrors.name ? '#ef4444' : 'var(--text-muted)', pointerEvents: 'none' }}>
                      <User size={18} />
                    </div>
                    <input 
                      type="text" 
                      style={{ 
                        background: 'rgba(0, 0, 0, 0.2)', paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.875rem', paddingBottom: '0.875rem',
                        border: fieldErrors.name ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)', 
                        borderRadius: '0.75rem', width: '100%', color: '#fff',
                        outline: 'none', transition: 'all 0.2s', fontSize: '1rem',
                        boxShadow: fieldErrors.name ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : 'none'
                      }}
                      onFocus={e => { 
                        if (!fieldErrors.name) {
                          e.currentTarget.style.borderColor = 'var(--primary)'; 
                          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; 
                        }
                      }}
                      onBlur={e => { 
                        if (!fieldErrors.name) {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; 
                          e.currentTarget.style.boxShadow = 'none'; 
                        }
                      }}
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={e => {
                        setFormData({...formData, name: e.target.value});
                        if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
                      }}
                    />
                  </div>
                  {fieldErrors.name && (
                    <motion.div 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <AlertCircle size={13} /> {fieldErrors.name}
                    </motion.div>
                  )}
                </div>

                {/* Email Address Field */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
                    Email Address <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: fieldErrors.email ? '#ef4444' : 'var(--text-muted)', pointerEvents: 'none' }}>
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      style={{ 
                        background: 'rgba(0, 0, 0, 0.2)', paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.875rem', paddingBottom: '0.875rem',
                        border: fieldErrors.email ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)', 
                        borderRadius: '0.75rem', width: '100%', color: '#fff',
                        outline: 'none', transition: 'all 0.2s', fontSize: '1rem',
                        boxShadow: fieldErrors.email ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : 'none'
                      }}
                      onFocus={e => { 
                        if (!fieldErrors.email) {
                          e.currentTarget.style.borderColor = 'var(--primary)'; 
                          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; 
                        }
                      }}
                      onBlur={e => { 
                        if (!fieldErrors.email) {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; 
                          e.currentTarget.style.boxShadow = 'none'; 
                        }
                      }}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={e => {
                        setFormData({...formData, email: e.target.value});
                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                      }}
                    />
                  </div>
                  {fieldErrors.email && (
                    <motion.div 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <AlertCircle size={13} /> {fieldErrors.email}
                    </motion.div>
                  )}
                </div>

                {/* Phone Number Field */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
                    Phone Number <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: fieldErrors.phone ? '#ef4444' : 'var(--text-muted)', pointerEvents: 'none' }}>
                      <Phone size={18} />
                    </div>
                    <input 
                      type="tel" 
                      style={{ 
                        background: 'rgba(0, 0, 0, 0.2)', paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.875rem', paddingBottom: '0.875rem',
                        border: fieldErrors.phone ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)', 
                        borderRadius: '0.75rem', width: '100%', color: '#fff',
                        outline: 'none', transition: 'all 0.2s', fontSize: '1rem',
                        boxShadow: fieldErrors.phone ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : 'none'
                      }}
                      onFocus={e => { 
                        if (!fieldErrors.phone) {
                          e.currentTarget.style.borderColor = 'var(--primary)'; 
                          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; 
                        }
                      }}
                      onBlur={e => { 
                        if (!fieldErrors.phone) {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; 
                          e.currentTarget.style.boxShadow = 'none'; 
                        }
                      }}
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={e => {
                        setFormData({...formData, phone: e.target.value});
                        if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: undefined });
                      }}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <motion.div 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <AlertCircle size={13} /> {fieldErrors.phone}
                    </motion.div>
                  )}
                </div>

                {/* Password Field */}
                <div style={{ marginBottom: '2.25rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
                    Password <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: fieldErrors.password ? '#ef4444' : 'var(--text-muted)', pointerEvents: 'none' }}>
                      <Lock size={18} />
                    </div>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      style={{ 
                        background: 'rgba(0, 0, 0, 0.2)', paddingLeft: '2.75rem', paddingRight: '2.75rem', paddingTop: '0.875rem', paddingBottom: '0.875rem',
                        border: fieldErrors.password ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)', 
                        borderRadius: '0.75rem', width: '100%', color: '#fff',
                        outline: 'none', transition: 'all 0.2s', fontSize: '1rem',
                        boxShadow: fieldErrors.password ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : 'none'
                      }}
                      onFocus={e => { 
                        if (!fieldErrors.password) {
                          e.currentTarget.style.borderColor = 'var(--primary)'; 
                          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)'; 
                        }
                      }}
                      onBlur={e => { 
                        if (!fieldErrors.password) {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; 
                          e.currentTarget.style.boxShadow = 'none'; 
                        }
                      }}
                      placeholder="At least 6 characters"
                      value={formData.password}
                      onChange={e => {
                        setFormData({...formData, password: e.target.value});
                        if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
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
                  {fieldErrors.password ? (
                    <motion.div 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <AlertCircle size={13} /> {fieldErrors.password}
                    </motion.div>
                  ) : (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: formData.password.length >= 6 ? '#10B981' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {formData.password.length >= 6 ? <CheckCircle2 size={13} color="#10B981" /> : <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--text-muted)' }} />}
                      Password must be at least 6 characters long
                    </div>
                  )}
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
                    <>Create Account <ArrowRight size={18} /></>
                  )}
                </motion.button>
              </motion.form>
            )}
          </div>
        </div>
      </motion.div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
