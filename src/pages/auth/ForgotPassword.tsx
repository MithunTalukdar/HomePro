import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '2rem 0' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Reset Password</h1>
          <p style={{ color: 'var(--text-muted)' }}>Enter your email to receive a reset link</p>
        </div>

        <div style={{ background: 'var(--surface)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
          {isSent ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#10B981' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Check your email</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                We sent a password reset link to <br/><strong>{email}</strong>
              </p>
              <Link to="/auth/login" className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>Return to Login</Link>
            </motion.div>
          ) : (
            <form onSubmit={handleReset}>
              {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid #ef4444' }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    className="search-input" 
                    style={{ background: 'var(--background)', paddingLeft: '2.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', width: '100%' }}
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', height: '48px' }} disabled={isLoading}>
                {isLoading ? <span style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span> : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>
        
        {!isSent && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/auth/login" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowLeft size={16} /> Back to login
            </Link>
          </div>
        )}
      </motion.div>
    </main>
  );
}
