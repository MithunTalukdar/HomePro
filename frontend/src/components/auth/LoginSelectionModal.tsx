import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginSelectionModal({ isOpen, onClose }: LoginSelectionModalProps) {
  const navigate = useNavigate();

  const handleSelect = (type: 'customer' | 'technician') => {
    onClose();
    navigate(`/auth/login?type=${type}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)' }} 
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{ 
              position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)', 
              borderRadius: 'var(--radius-xl)', padding: '2.5rem', width: '100%', maxWidth: '500px', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', zIndex: 10 
            }}
          >
            <button 
              onClick={onClose}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome to HomePro</h2>
              <p style={{ color: 'var(--text-muted)' }}>How would you like to continue?</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                onClick={() => handleSelect('customer')}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%', padding: '1.5rem', 
                  background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', 
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(79, 70, 229, 0.05)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--background)'; }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Customer</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Book and manage home services.</p>
                </div>
              </button>

              <button 
                onClick={() => handleSelect('technician')}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%', padding: '1.5rem', 
                  background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', 
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--secondary)'; e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--background)'; }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Technician</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage jobs and grow your business.</p>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
