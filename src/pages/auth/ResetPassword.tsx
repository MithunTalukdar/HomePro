import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Simulate API call
    setTimeout(() => {
      setIsSuccess(true);
      setTimeout(() => navigate('/auth/login'), 2000);
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '400px', width: '100%', background: 'var(--surface)', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle2 size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Password Reset Successfully</h2>
          <p style={{ color: 'var(--text-muted)' }}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '400px', width: '100%', background: 'var(--surface)', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>Create New Password</h2>
          <p style={{ color: 'var(--text-muted)' }}>Please enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="search-input"
                style={{ width: '100%', paddingLeft: '3rem', paddingRight: '3rem', background: 'var(--background)' }}
                placeholder="Enter new password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="search-input"
                style={{ width: '100%', paddingLeft: '3rem', paddingRight: '3rem', background: 'var(--background)' }}
                placeholder="Confirm new password"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
