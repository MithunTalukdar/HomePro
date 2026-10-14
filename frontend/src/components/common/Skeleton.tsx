import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  style?: React.CSSProperties;
}

export function Skeleton({
  className = '',
  width,
  height,
  borderRadius,
  variant = 'rectangular',
  style = {},
}: SkeletonProps) {
  let defaultRadius = '0.5rem';
  let defaultHeight = '1.25rem';
  let defaultWidth = '100%';

  if (variant === 'circular') {
    defaultRadius = '50%';
    defaultHeight = typeof width === 'number' ? `${width}px` : (width as string) || '40px';
    defaultWidth = defaultHeight;
  } else if (variant === 'text') {
    defaultRadius = '0.375rem';
    defaultHeight = '1rem';
  } else if (variant === 'card') {
    defaultRadius = '1rem';
    defaultHeight = '200px';
  }

  const finalWidth = width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : defaultWidth;
  const finalHeight = height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : defaultHeight;
  const finalRadius = borderRadius !== undefined ? (typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius) : defaultRadius;

  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width: finalWidth,
        height: finalHeight,
        borderRadius: finalRadius,
        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.04) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.04) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmerSweep 1.8s infinite ease-in-out',
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ height = '240px' }: { height?: string }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minHeight: height,
      }}
    >
      <Skeleton height="140px" borderRadius="0.75rem" />
      <Skeleton width="60%" height="1.25rem" />
      <Skeleton width="90%" height="0.875rem" />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem' }}>
        <Skeleton width="35%" height="1rem" />
        <Skeleton width="25%" height="1rem" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 3, height = '240px' }: { count?: number; height?: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        width: '100%',
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} height={height} />
      ))}
    </div>
  );
}
