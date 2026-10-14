import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | number;
  color?: string;
  label?: string;
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  color = 'var(--primary-light)',
  label,
  className = '',
}: LoadingSpinnerProps) {
  let pixelSize = 24;
  let strokeWidth = 3;

  if (typeof size === 'number') {
    pixelSize = size;
  } else if (size === 'sm') {
    pixelSize = 16;
    strokeWidth = 2.5;
  } else if (size === 'lg') {
    pixelSize = 36;
    strokeWidth = 3.5;
  }

  return (
    <div
      className={`inline-flex items-center justify-center gap-2 ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
    >
      <svg
        style={{
          width: `${pixelSize}px`,
          height: `${pixelSize}px`,
          animation: 'spin 0.8s linear infinite',
        }}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeOpacity="0.2"
          style={{ stroke: color }}
        />
        <path
          d="M12 2C6.47715 2 2 6.47715 2 12C2 14.2361 2.7344 16.3007 3.97495 17.9739"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
      {label && (
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {label}
        </span>
      )}
    </div>
  );
}

export function BrandedLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        padding: '2rem',
      }}
    >
      <div style={{ position: 'relative', width: '56px', height: '56px' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(109, 93, 251, 0.4) 0%, rgba(109, 93, 251, 0) 70%)',
            filter: 'blur(10px)',
            animation: 'pulseGlow 2s infinite ease-in-out',
          }}
        />
        <svg
          style={{
            width: '56px',
            height: '56px',
            animation: 'spin 1.1s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite',
          }}
          viewBox="0 0 50 50"
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="4"
          />
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="url(#gradientSpinner)"
            strokeWidth="4"
            strokeDasharray="80"
            strokeDashoffset="60"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradientSpinner" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6D5DFB" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div
        style={{
          fontSize: '0.95rem',
          fontWeight: 600,
          color: 'var(--text-muted)',
          letterSpacing: '0.02em',
        }}
      >
        {message}
      </div>
    </div>
  );
}
