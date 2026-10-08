import { useLocation, Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, MapPin, User, ShieldCheck, Banknote, CreditCard, ArrowRight } from 'lucide-react';
import { technicians } from '../data';

export function BookingConfirmation() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
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
  const totalAmount = parseInt(service.price.replace(/\D/g, '')) + 49 - (booking.discountAmount || 0);
  const isCash = booking.paymentMethod === 'cash' || booking.paymentMethod === 'CASH' || !booking.paymentMethod;

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '4rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        
        {/* Animated Success Icon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <div style={{ 
            width: '84px', height: '84px', borderRadius: '50%', 
            background: 'rgba(16, 185, 129, 0.15)', 
            border: '2px solid rgba(16, 185, 129, 0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            margin: '0 auto 1.5rem', color: '#10B981',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.25)'
          }}>
            <CheckCircle size={52} />
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#fff' }}>
            Booking Confirmed!
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Your booking reference ID is <strong style={{ color: 'var(--primary-light)' }}>{id}</strong>
          </p>
        </motion.div>

        {/* Booking Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ 
            background: 'var(--surface)', 
            padding: '2rem', 
            borderRadius: 'var(--radius-xl)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
          }}
        >
          {/* Service Summary Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
            <img 
              src={service.image} 
              alt={service.name} 
              onError={(e) => { e.currentTarget.src = `/images/services/${service.slug}.jpg`; }}
              style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} 
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.25rem', color: '#fff' }}>{service.name}</h3>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{service.duration} • 30-Day Service Warranty</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</div>
              <div style={{ color: 'var(--primary-light)', fontWeight: 800, fontSize: '1.35rem' }}>₹{totalAmount}</div>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--primary-light)', padding: '0.4rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '8px' }}>
                <Calendar size={20} />
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Scheduled Date & Time</div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '1rem', marginTop: '0.15rem' }}>
                  {booking.date} at {booking.timeSlot}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--accent-electric)', padding: '0.4rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '8px' }}>
                <MapPin size={20} />
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Service Address</div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem', marginTop: '0.15rem', lineHeight: 1.4 }}>
                  {booking.address}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--secondary)', padding: '0.4rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                <User size={20} />
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Assigned Professional</div>
                <div style={{ fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                  {booking.technicianId === 'auto' ? (
                    'Auto-Assigning Top Rated Pro (Details sent via SMS)'
                  ) : (
                    <>
                      {selectedTech?.name} <ShieldCheck size={16} color="var(--secondary)" />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method Details */}
            <div style={{ 
              display: 'flex', gap: '1rem', alignItems: 'flex-start',
              background: isCash ? 'rgba(16, 185, 129, 0.08)' : 'rgba(79, 70, 229, 0.08)',
              padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)',
              border: `1px solid ${isCash ? 'rgba(16, 185, 129, 0.25)' : 'rgba(79, 70, 229, 0.25)'}`
            }}>
              <div style={{ color: isCash ? '#10B981' : 'var(--primary-light)', padding: '0.4rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                {isCash ? <Banknote size={22} /> : <CreditCard size={22} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Payment Method
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: isCash ? '#10B981' : 'var(--primary-light)', marginTop: '0.15rem' }}>
                  {isCash ? 'Cash on Delivery (Pay after service)' : 'Paid Online'}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.35rem', lineHeight: 1.4 }}>
                  {isCash 
                    ? `No advance payment required. Please pay ₹${totalAmount} via cash or UPI directly to the technician after job completion.` 
                    : 'Online payment received. A tax invoice has been generated for your records.'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}
        >
          <Link to="/" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '0.85rem' }}>
            Return Home
          </Link>
          <button 
            type="button"
            onClick={() => navigate(`/dashboard/bookings`)} 
            className="btn btn-primary" 
            style={{ flex: 1, justifyContent: 'center', padding: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>View My Bookings</span>
            <ArrowRight size={18} />
          </button>
        </motion.div>

      </div>
    </main>
  );
}
