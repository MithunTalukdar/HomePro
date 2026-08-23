import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';

export function AdminSupport() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Support & Warranty</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage customer tickets and claims</p>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No open tickets.
      </div>
    </div>
  );
}
