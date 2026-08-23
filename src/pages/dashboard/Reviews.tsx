import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { Star, MessageSquare } from 'lucide-react';

export function Reviews() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await fetchApi('/bookings');
      // Only show completed bookings
      setBookings(data.filter((b: any) => b.status === 'COMPLETED'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    try {
      await fetchApi('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          bookingId: reviewModal._id,
          rating,
          comment
        })
      });
      alert('Review submitted successfully!');
      setReviewModal(null);
      // In a real app, update the booking to indicate it's been reviewed.
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>My Reviews</h1>
        <p style={{ color: 'var(--text-muted)' }}>Rate your past services and professionals</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div>Loading...</div>
        ) : bookings.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1', background: 'var(--surface)', borderRadius: 'var(--radius-xl)' }}>
            No completed services to review.
          </div>
        ) : (
          bookings.map(booking => (
            <div key={booking._id} style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{booking.date}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>Completed</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{booking.serviceName}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>ID: {booking._id.slice(-6).toUpperCase()}</p>
              
              <button 
                onClick={() => setReviewModal(booking)}
                className="btn btn-primary" 
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Star size={18} fill="currentColor" /> Write a Review
              </button>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--surface)', width: '100%', maxWidth: '500px', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Review Service</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{reviewModal.serviceName} on {reviewModal.date}</p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 500 }}>Rate your experience</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={32} 
                    onClick={() => setRating(star)}
                    fill={star <= rating ? '#f59e0b' : 'transparent'} 
                    color={star <= rating ? '#f59e0b' : 'var(--border)'} 
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tell us more</label>
              <textarea 
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="search-input"
                style={{ width: '100%', background: 'var(--background)', padding: '1rem', resize: 'none' }}
                placeholder="How was the service?"
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setReviewModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={submitReview}>Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
