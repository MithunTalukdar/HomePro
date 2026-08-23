import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (otp.join('').length < 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('token', 'sample-token');
      navigate('/', { replace: true });
    }, 1500);
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '2rem 0' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Verify Email</h1>
          <p style={{ color: 'var(--text-muted)' }}>We sent a 6-digit code to your email.</p>
        </div>

        <form onSubmit={handleVerify} style={{ background: 'var(--surface)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
          
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid #ef4444' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', marginBottom: '2rem' }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                style={{
                  width: '45px', height: '56px', fontSize: '1.5rem', textAlign: 'center', fontWeight: 600,
                  background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)'
                }}
              />
            ))}
          </div>

          <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', height: '48px' }} disabled={isLoading}>
            {isLoading ? <span style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span> : 'Verify Code'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button type="button" style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
              Resend Code
            </button>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
