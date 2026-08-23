import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Search, Filter, ChevronDown, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '../../services/api';
import { Link } from 'react-router-dom';

export function Bookings() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await fetchApi('/bookings/my');
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(b => !['COMPLETED', 'CANCELLED'].includes(b.status));
  const pastBookings = bookings.filter(b => ['COMPLETED', 'CANCELLED'].includes(b.status));
  
  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  if (isLoading) return <div>Loading bookings...</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '#10B981';
      case 'CANCELLED': return '#ef4444';
      default: return 'var(--primary-light)';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'rgba(16, 185, 129, 0.1)';
      case 'CANCELLED': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(79, 70, 229, 0.1)';
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Booking History</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>View and manage all your service bookings.</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('upcoming')}
          style={{ padding: '0.75rem 0', background: 'none', border: 'none', color: activeTab === 'upcoming' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: activeTab === 'upcoming' ? 600 : 500, cursor: 'pointer', borderBottom: activeTab === 'upcoming' ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: '-1px' }}
        >
          Upcoming Bookings ({upcomingBookings.length})
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          style={{ padding: '0.75rem 0', background: 'none', border: 'none', color: activeTab === 'past' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: activeTab === 'past' ? 600 : 500, cursor: 'pointer', borderBottom: activeTab === 'past' ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: '-1px' }}
        >
          Past Bookings ({pastBookings.length})
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {displayBookings.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-muted)' }}>No bookings found.</p>
          </div>
        )}
        
        {displayBookings.map(booking => (
          <div key={booking._id} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Booking ID: {booking._id}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{booking.serviceName}</h3>
              </div>
              <div style={{ 
                fontSize: '0.875rem', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontWeight: 600,
                background: getStatusBg(booking.status),
                color: getStatusColor(booking.status)
              }}>
                {booking.status.replace(/_/g, ' ')}
              </div>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Schedule</div>
                <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> {booking.date} at {booking.timeSlot}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Location</div>
                <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> {booking.address?.city || 'Default City'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Price</div>
                <div style={{ fontWeight: 600, color: 'var(--primary-light)', fontSize: '1.1rem' }}>{booking.price}</div>
              </div>
            </div>

            {booking.technicianName && (
              <div style={{ padding: '1.5rem', background: 'var(--background)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>{booking.technicianName[0]}</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{booking.technicianName}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Assigned Professional</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {!['COMPLETED', 'CANCELLED'].includes(booking.status) && (
                    <Link to={`/dashboard/bookings/${booking._id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>Track Live</Link>
                  )}
                  <Link to={`/booking-confirmation/${booking._id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>View Details</Link>
                </div>
              </div>
            )}
            {!booking.technicianName && (
              <div style={{ padding: '1.5rem', background: 'var(--background)', display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {!['COMPLETED', 'CANCELLED'].includes(booking.status) && (
                    <Link to={`/dashboard/bookings/${booking._id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>Track Live</Link>
                  )}
                  <Link to={`/booking-confirmation/${booking._id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>View Details</Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
