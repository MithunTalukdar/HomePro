import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Calendar, Star, ChevronRight, CheckCircle2, Truck, Wrench, PackageCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../../services/api';

export function Overview() {
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await fetchApi('/bookings/my');
      

      const active = data.find((b: any) => !['COMPLETED', 'CANCELLED'].includes(b.status));
      const recent = data.filter((b: any) => ['COMPLETED', 'CANCELLED'].includes(b.status));

      setActiveBooking(active);
      setRecentBookings(recent);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><span className="dot-pulse">...</span></div>;

  const getStatusClass = (status: string) => {
    if (['REQUESTED', 'ON_THE_WAY', 'ARRIVED'].includes(status)) return 'pending';
    if (['CONFIRMED', 'ASSIGNED', 'IN_PROGRESS'].includes(status)) return 'confirmed';
    if (status === 'COMPLETED') return 'completed';
    if (status === 'CANCELLED') return 'cancelled';
    return 'confirmed';
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: 800 }}>Dashboard Overview</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Track your active services and manage your account.</p>

      
      {activeBooking && (
        <section style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontWeight: 700 }}>Active Booking</h2>
          
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 500, letterSpacing: '0.05em' }}>BOOKING ID: {activeBooking.id}</div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>{activeBooking.serviceName}</h3>
                <span className={`status-badge ${getStatusClass(activeBooking.status)}`}>
                  {activeBooking.status.replace(/_/g, ' ')}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(15, 23, 42, 0.4)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)' }}>
                <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=100" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-light)' }} />
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{activeBooking.technicianName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Professional</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Bookings</h2>
          <Link to="/dashboard/bookings" style={{ color: 'var(--primary-light)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>View All <ChevronRight size={16} /></Link>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recentBookings.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>No recent bookings.</p>}
          {recentBookings.slice(0, 3).map((booking: any) => (
            <Link to={`/dashboard/bookings`} key={booking._id} className="glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'inherit', transition: 'all var(--transition-smooth)' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateX(5px)'; e.currentTarget.style.borderColor = 'var(--primary-light)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '1.05rem' }}>{booking.serviceName}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={14} /> {booking.date}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{booking.price}</div>
                <ChevronRight size={20} color="var(--primary-light)" />
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
