import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { Star, CheckCircle, XCircle } from 'lucide-react';

export function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    // In a real app we'd fetch all reviews from an admin endpoint
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Review Moderation</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage customer feedback</p>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No reviews to moderate at this time.
      </div>
    </div>
  );
}
