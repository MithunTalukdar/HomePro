import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast, type ToastType } from '../../context/ToastContext';

const toastConfig: Record<ToastType, { icon: typeof CheckCircle2; bg: string; border: string; text: string; iconColor: string }> = {
  success: {
    icon: CheckCircle2,
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.35)',
    text: '#A7F3D0',
    iconColor: '#10B981',
  },
  error: {
    icon: AlertCircle,
    bg: 'rgba(239, 68, 68, 0.14)',
    border: 'rgba(239, 68, 68, 0.35)',
    text: '#FECACA',
    iconColor: '#EF4444',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'rgba(245, 158, 11, 0.14)',
    border: 'rgba(245, 158, 11, 0.35)',
    text: '#FDE68A',
    iconColor: '#F59E0B',
  },
  info: {
    icon: Info,
    bg: 'rgba(56, 189, 248, 0.14)',
    border: 'rgba(56, 189, 248, 0.35)',
    text: '#BAE6FD',
    iconColor: '#38BDF8',
  },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      style={{
        position: 'fixed',
        top: '1.25rem',
        right: '1.25rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '420px',
        width: 'calc(100% - 2.5rem)',
        pointerEvents: 'none',
      }}
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((item) => {
          const config = toastConfig[item.type] || toastConfig.info;
          const Icon = config.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                pointerEvents: 'auto',
                background: 'rgba(15, 23, 42, 0.92)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${config.border}`,
                borderRadius: '1rem',
                padding: '1rem 1.25rem',
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Type indicator vertical bar */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: config.iconColor,
                }}
              />

              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: config.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                <Icon size={18} color={config.iconColor} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {item.title && (
                  <div
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#fff',
                      marginBottom: '0.2rem',
                      letterSpacing: '-0.2px',
                    }}
                  >
                    {item.title}
                  </div>
                )}
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: config.text,
                    lineHeight: 1.45,
                    wordBreak: 'break-word',
                  }}
                >
                  {item.message}
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeToast(item.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.15s, background 0.15s',
                  marginLeft: '0.25rem',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.background = 'transparent';
                }}
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
