import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle, Key, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { fetchApi } from '../../services/api';

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();

  const initialEmail = searchParams.get('email') || '';
  const initialCode = searchParams.get('code') || searchParams.get('token') || (params as any).token || '';

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState(initialCode);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; code?: string; password?: string; confirmPassword?: string }>({});

  useEffect(() => {
    if (initialEmail && !email) setEmail(initialEmail);
    if (initialCode && !code) setCode(initialCode);
  }, [initialEmail, initialCode]);

  const validate = (): boolean => {
    const errs: { email?: string; code?: string; password?: string; confirmPassword?: string } = {};
    const trimmedEmail = email.trim();
    const trimmedCode = code.trim();

    if (!trimmedEmail) {
      errs.email = 'Please enter your registered email address.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        errs.email = 'Please enter a valid email address.';
      }
    }

    if (!trimmedCode) {
      errs.code = 'Please enter the 6-digit code sent to your email.';
    } else if (trimmedCode.includes('@')) {
      errs.code = 'Please enter the 6-digit reset code here, not your email address.';
    }

    if (!password) {
      errs.password = 'Please enter your new password.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters long.';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your new password.';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setError('Please resolve the errors highlighted below.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      await fetchApi('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(),
          code: code.trim(),
          token: code.trim(),
          password 
        }),
      });
      setIsSuccess(true);
      setTimeout(() => navigate('/auth/login'), 2500);
    } catch (err: any) {
      const errMsg = err.message || '';
      if (errMsg.toLowerCase().includes('code') || errMsg.toLowerCase().includes('token') || errMsg.toLowerCase().includes('expired') || errMsg.toLowerCase().includes('invalid')) {
        setFieldErrors({ code: errMsg });
        setError(errMsg);
      } else if (errMsg.toLowerCase().includes('email')) {
        setFieldErrors({ email: errMsg });
        setError(errMsg);
      } else {
        setError(errMsg || 'Failed to reset password. Please verify the code and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '2rem 1rem' }}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ 
            maxWidth: '440px', width: '100%', 
            background: 'rgba(15, 23, 42, 0.75)', 
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '3rem 2rem', 
            borderRadius: '1.5rem', 
            border: '1px solid rgba(16, 185, 129, 0.3)', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            textAlign: 'center' 
          }}
        >
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <CheckCircle2 size={40} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', color: '#fff' }}>Password Reset Complete!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '2rem' }}>
            Your account password has been updated successfully. Redirecting you to the sign-in page...
          </p>
          <Link to="/auth/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
            Go to Sign In Now
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', position: 'relative', overflow: 'hidden', padding: '2rem 1rem' }}>
      {/* Background Ambient Glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', zIndex: 0 }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: '480px', zIndex: 10, position: 'relative' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Set New Password
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Enter your email and the 6-digit code received in your inbox
          </p>
        </div>

        <div style={{ 
          background: 'rgba(15, 23, 42, 0.65)', 
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '1.5rem', 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          padding: '2.5rem'
        }}>
          {/* Global Alert */}
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

          <form onSubmit={handleSubmit} noValidate>
            {/* Email Address Field */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: fieldErrors.email ? '#ef4444' : 'var(--text-muted)', pointerEvents: 'none' }}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="e.g. name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                  }}
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)', paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.875rem', paddingBottom: '0.875rem',
                    border: fieldErrors.email ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)', 
                    borderRadius: '0.75rem', width: '100%', color: '#fff',
                    outline: 'none', transition: 'all 0.2s', fontSize: '1rem',
                    boxShadow: fieldErrors.email ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : 'none'
                  }}
                />
              </div>
              {fieldErrors.email && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <AlertCircle size={13} /> {fieldErrors.email}
                </motion.div>
              )}
            </div>

            {/* 6-Digit Reset Code / Token Field */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
                  6-Digit Reset Code (from email)
                </label>
                {initialCode && (
                  <span style={{ fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ShieldCheck size={12} /> Auto-filled from link
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: fieldErrors.code ? '#ef4444' : 'var(--text-muted)', pointerEvents: 'none' }}>
                  <Key size={18} />
                </div>
                <input 
                  type="text"
                  placeholder="e.g. 849201"
                  value={code}
                  maxLength={50}
                  onChange={(e) => {
                    setCode(e.target.value);
                    if (fieldErrors.code) setFieldErrors({ ...fieldErrors, code: undefined });
                  }}
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)', paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.875rem', paddingBottom: '0.875rem',
                    border: fieldErrors.code ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)', 
                    borderRadius: '0.75rem', width: '100%', color: '#fff',
                    outline: 'none', transition: 'all 0.2s', fontSize: '1.05rem', letterSpacing: '2px', fontWeight: 600,
                    boxShadow: fieldErrors.code ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : 'none'
                  }}
                />
              </div>
              {fieldErrors.code && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <AlertCircle size={13} /> {fieldErrors.code}
                </motion.div>
              )}
            </div>

            {/* New Password */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: fieldErrors.password ? '#ef4444' : 'var(--text-muted)', pointerEvents: 'none' }}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password (min 6 characters)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                  }}
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)', paddingLeft: '2.75rem', paddingRight: '2.75rem', paddingTop: '0.875rem', paddingBottom: '0.875rem',
                    border: fieldErrors.password ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)', 
                    borderRadius: '0.75rem', width: '100%', color: '#fff',
                    outline: 'none', transition: 'all 0.2s', fontSize: '1rem',
                    boxShadow: fieldErrors.password ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <AlertCircle size={13} /> {fieldErrors.password}
                </motion.div>
              )}
            </div>

            {/* Confirm New Password */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: fieldErrors.confirmPassword ? '#ef4444' : 'var(--text-muted)', pointerEvents: 'none' }}>
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat your new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: undefined });
                  }}
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)', paddingLeft: '2.75rem', paddingRight: '2.75rem', paddingTop: '0.875rem', paddingBottom: '0.875rem',
                    border: fieldErrors.confirmPassword ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)', 
                    borderRadius: '0.75rem', width: '100%', color: '#fff',
                    outline: 'none', transition: 'all 0.2s', fontSize: '1rem',
                    boxShadow: fieldErrors.confirmPassword ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <AlertCircle size={13} /> {fieldErrors.confirmPassword}
                </motion.div>
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
                <>Update Password <ArrowRight size={18} /></>
              )}
            </motion.button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/auth/login" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>
              Remember your password? <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign in</span>
            </Link>
          </div>
        </div>
      </motion.div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
