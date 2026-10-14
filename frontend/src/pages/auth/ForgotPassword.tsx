import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { fetchApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setFieldError('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setFieldError('Please enter your email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setFieldError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await fetchApi('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: trimmedEmail }),
      });
      setIsSent(true);
      toast.success('Password recovery instructions sent to your email.', 'Email Dispatched');
    } catch (err: any) {
      const errMsg = err.message || 'Failed to send reset link. Please verify your connection or try again.';
      setError(errMsg);
      toast.error(errMsg, 'Dispatch Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', position: 'relative', overflow: 'hidden', padding: '2rem 1rem' }}>
      {/* Background Ambient Glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.18) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(70px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(70px)', zIndex: 0 }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: '440px', zIndex: 10, position: 'relative' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #c7d2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
            Reset Password
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.5 }}>
            Enter your registered email to receive a recovery link
          </p>
        </div>

        <div style={{ 
          background: 'rgba(15, 23, 42, 0.72)', 
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '1.5rem', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          padding: '2.25rem'
        }}>
          {isSent ? (
            <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
                <CheckCircle2 size={40} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', color: '#fff' }}>Email Dispatched!</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
                If an account with that email exists, we've sent password reset instructions and a direct recovery link to:
                <br /><strong style={{ color: '#fff' }}>{email}</strong>
              </p>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '2rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <ShieldCheck size={16} /> Link valid for 15 minutes
                </div>
                Check your Inbox as well as Spam/Junk folder. You can click the link in the email or enter the reset token directly.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/auth/reset-password" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                  Enter Reset Token Directly <ArrowRight size={16} />
                </Link>
                <Link to="/auth/login" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                  Return to Sign In
                </Link>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleReset} noValidate>
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
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
                      gap: '0.65rem'
                    }}
                  >
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#ef4444' }} />
                    <div style={{ lineHeight: 1.45 }}>{error}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ marginBottom: '2rem' }}>
                <label 
                  htmlFor="forgot-email"
                  style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}
                >
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: fieldError ? '#ef4444' : 'var(--text-muted)', pointerEvents: 'none' }}>
                    <Mail size={18} />
                  </div>
                  <input
                    id="forgot-email"
                    type="email"
                    disabled={isLoading}
                    style={{
                      background: 'rgba(0, 0, 0, 0.25)', 
                      paddingLeft: '2.75rem', 
                      paddingRight: '1rem', 
                      paddingTop: '0.85rem', 
                      paddingBottom: '0.85rem',
                      border: fieldError ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.12)', 
                      borderRadius: '0.75rem', 
                      width: '100%', 
                      color: '#fff',
                      outline: 'none', 
                      transition: 'all 0.2s', 
                      fontSize: '0.975rem',
                      boxShadow: fieldError ? '0 0 0 3px rgba(239, 68, 68, 0.2)' : 'none',
                      opacity: isLoading ? 0.7 : 1,
                    }}
                    onFocus={e => { 
                      if (!fieldError) {
                        e.currentTarget.style.borderColor = 'var(--primary)'; 
                        e.currentTarget.style.background = 'rgba(79, 70, 229, 0.08)'; 
                        e.currentTarget.style.boxShadow = '0 0 0 4px rgba(109, 93, 251, 0.25)'; 
                      }
                    }}
                    onBlur={e => { 
                      if (!fieldError) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; 
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.25)'; 
                        e.currentTarget.style.boxShadow = 'none'; 
                      }
                    }}
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldError) setFieldError('');
                      if (error) setError('');
                    }}
                  />
                </div>
                {fieldError && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <AlertCircle size={13} /> {fieldError}
                  </motion.div>
                )}
              </div>

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
                  <LoadingSpinner size="sm" color="#fff" label="Sending link..." />
                ) : (
                  <>Send Reset Link <ArrowRight size={18} /></>
                )}
              </motion.button>
            </form>
          )}

          {!isSent && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/auth/login" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </main>
  );
}
