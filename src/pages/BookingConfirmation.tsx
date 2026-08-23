import { useLocation, Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, MapPin, User, ShieldCheck } from 'lucide-react';
import { technicians } from '../data';

export function BookingConfirmation() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { booking, service } = location.state || {};

  if (!booking || !service) {
    return (
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>No booking data found</h2>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Go Home</Link>
        </div>
      </main>
    );
  }

  const selectedTech = technicians.find(t => t.id === booking.technicianId);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#10B981' }}>
            <CheckCircle size={48} />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Booking Confirmed!</h1>
          <p style={{ color: 'var(--text-muted)' }}>Your booking ID is <strong>{id}</strong></p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
            <img src={service.image} alt={service.name} style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
            <div>
              <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{service.name}</h3>
              <div style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Total: ₹{parseInt(service.price.replace(/\D/g, '')) + 49}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--text-muted)' }}><Calendar size={20} /></div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Date & Time</div>
                <div style={{ fontWeight: 500 }}>{booking.date} at {booking.timeSlot}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--text-muted)' }}><MapPin size={20} /></div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Service Address</div>
                <div style={{ fontWeight: 500 }}>{booking.address}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--text-muted)' }}><User size={20} /></div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Assigned Professional</div>
                <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {booking.technicianId === 'auto' ? (
                    'Auto Assigned (Details sent via SMS)'
                  ) : (
                    <>
                      {selectedTech?.name} <ShieldCheck size={16} color="var(--secondary)" />
                    </>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--text-muted)' }}><CheckCircle size={20} /></div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Payment Method</div>
                <div style={{ fontWeight: 500 }}>
                  {booking.paymentMethod === 'online' ? 'Online Payment (Pending)' : 'Pay after Service (Cash)'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}
        >
          <Link to="/" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Return Home</Link>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Track Booking</button>
        </motion.div>

      </div>
    </main>
  );
}
