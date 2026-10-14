import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export function VerifyOTP() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
      setError('');
    }
  };

  const handleResend = () => {
    if (resendCountdown > 0) return;
    setResendCountdown(60);
    toast.info('A new verification code has been dispatched to your email.', 'Code Resent');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    
    if (otp.join('').length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('token', 'sample-token');
      toast.success('Your email has been verified successfully!', 'Verification Complete');
      navigate('/', { replace: true });
    }, 1200);
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
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.15)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '1px solid rgba(109, 93, 251, 0.3)' }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #c7d2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
            Verify Email
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem', lineHeight: 1.5 }}>
            We've sent a 6-digit confirmation code to your inbox
          </p>
        </div>

        <form 
          onSubmit={handleVerify} 
          style={{ 
            background: 'rgba(15, 23, 42, 0.72)', 
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '1.5rem', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
            padding: '2.25rem'
          }}
        >
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.14)', color: '#fca5a5', padding: '0.85rem 1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.35)', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div 
            style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', marginBottom: '2rem' }}
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={isLoading}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                style={{
                  width: '48px', 
                  height: '58px', 
                  fontSize: '1.5rem', 
                  textAlign: 'center', 
                  fontWeight: 700,
                  background: 'rgba(0, 0, 0, 0.3)', 
                  border: digit ? '1px solid var(--primary-light)' : '1px solid rgba(255, 255, 255, 0.12)', 
                  borderRadius: '0.75rem',
                  color: '#fff',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxShadow: digit ? '0 0 10px rgba(109, 93, 251, 0.3)' : 'none',
                  opacity: isLoading ? 0.7 : 1,
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(109, 93, 251, 0.25)';
                }}
                onBlur={e => {
                  if (!otp[index]) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              />
            ))}
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
              <LoadingSpinner size="sm" color="#fff" label="Verifying code..." />
            ) : (
              <>Verify Code <ArrowRight size={18} /></>
            )}
          </motion.button>
          
          <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
            <button 
              type="button" 
              onClick={handleResend}
              disabled={resendCountdown > 0}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: resendCountdown > 0 ? 'var(--text-muted)' : 'var(--primary-light)', 
                fontSize: '0.875rem', 
                fontWeight: 600, 
                cursor: resendCountdown > 0 ? 'default' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'color 0.2s'
              }}
            >
              <RotateCcw size={14} />
              {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend Verification Code'}
            </button>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
