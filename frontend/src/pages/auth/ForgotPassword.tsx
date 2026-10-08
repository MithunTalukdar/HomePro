import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { fetchApi } from '../../services/api';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link. Please verify your connection or try again.');
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
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: '440px', zIndex: 10, position: 'relative' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Reset Password
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Enter your registered email to receive a recovery link
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
          {isSent ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <CheckCircle2 size={40} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', color: '#fff' }}>Email Dispatched!</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
                If an account with that email exists, we've sent password reset instructions and a direct recovery link to:
                <br /><strong style={{ color: '#fff' }}>{email}</strong>
              </p>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '2rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontWeight: 600, marginBottom: '0.25rem' }}>
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

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: fieldError ? '#ef4444' : 'var(--text-muted)', pointerEvents: 'none' }}>
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)', paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.875rem', paddingBottom: '0.875rem',
                      border: fieldError ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)', 
                      borderRadius: '0.75rem', width: '100%', color: '#fff',
                      outline: 'none', transition: 'all 0.2s', fontSize: '1rem',
                      boxShadow: fieldError ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : 'none'
                    }}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldError) setFieldError('');
                    }}
                  />
                </div>
                {fieldError && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <AlertCircle size={13} /> {fieldError}
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
                  <>Send Reset Link <ArrowRight size={18} /></>
                )}
              </motion.button>
            </form>
          )}

          {!isSent && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/auth/login" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </motion.div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
