import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, MapPin, Calendar, Clock, CreditCard, User, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { services, technicians } from '../data';
import { TechnicianCard } from '../components/TechnicianCard';
import { fetchApi } from '../services/api';
import { LoginSelectionModal } from '../components/auth/LoginSelectionModal';
import { useAuth } from '../context/AuthContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

type BookingData = {
  serviceId: string;
  address: string;
  date: string;
  timeSlot: string;
  technicianId: 'auto' | string;
  paymentMethod: string;
};

const steps = [
  { id: 1, title: 'Service' },
  { id: 2, title: 'Address' },
  { id: 3, title: 'Date' },
  { id: 4, title: 'Time' },
  { id: 5, title: 'Technician' },
  { id: 6, title: 'Review' },
  { id: 7, title: 'Payment' },
];

export function BookingWizard() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const service = services.find(s => s.id === serviceId) || services[0];
  const { user, token } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<BookingData>({
    serviceId: service.id,
    address: '',
    date: '',
    timeSlot: '',
    technicianId: 'auto',
    paymentMethod: ''
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);


  useEffect(() => {
    const savedData = sessionStorage.getItem(`booking_data_${service.id}`);
    const savedStep = sessionStorage.getItem(`booking_step_${service.id}`);
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
        if (savedStep) setCurrentStep(parseInt(savedStep, 10));
      } catch(e) {}
    }
  }, [service.id]);


  useEffect(() => {
    sessionStorage.setItem(`booking_data_${service.id}`, JSON.stringify(data));
    sessionStorage.setItem(`booking_step_${service.id}`, currentStep.toString());
  }, [data, currentStep, service.id]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponId, setCouponId] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');
  
  const basePrice = parseInt(service.price.replace(/\D/g, ''));
  const taxes = 49;
  const totalAmount = basePrice + taxes - discountAmount;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const handleNext = async () => {

    const newErrors: Record<string, string> = {};
    if (currentStep === 2 && !data.address.trim()) newErrors.address = 'Address is required';
    if (currentStep === 3 && !data.date) newErrors.date = 'Please select a date';
    if (currentStep === 4 && !data.timeSlot) newErrors.timeSlot = 'Please select a time slot';
    if (currentStep === 7 && !data.paymentMethod) newErrors.paymentMethod = 'Please select a payment method';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    if (currentStep === 7) {
      setIsSubmitting(true);
      try {
        const payload = {
          serviceId: service.id,
          serviceName: service.name,
          date: data.date,
          timeSlot: data.timeSlot,
          address: {
            address: data.address,
            city: 'Default City',
            pincode: '000000'
          },
          price: `₹${totalAmount}`,
          couponId: couponId || undefined,
          discountAmount: discountAmount || 0,
          paymentStatus: 'PENDING'
        };

        const booking = await fetchApi('/bookings', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        
        if (data.paymentMethod === 'online') {

          const order = await fetchApi('/payments/create-order', {
            method: 'POST',
            body: JSON.stringify({ amount: totalAmount, currency: 'INR', receipt: `rcpt_${booking._id}` })
          });
          

          const options = {
            key: 'rzp_test_123',
            amount: order.amount,
            currency: order.currency,
            name: 'ServeSync',
            description: `Payment for ${service.name}`,
            order_id: order.id,
            handler: async function (response: any) {
              try {
                await fetchApi('/payments/verify', {
                  method: 'POST',
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    bookingId: booking._id,
                    amount: totalAmount
                  })
                });
                navigate(`/booking-confirmation/${booking._id}`, { state: { booking: data, service } });
              } catch (err) {
                alert('Payment verification failed!');
              }
            },
            prefill: {
              name: 'Customer Name',
              email: 'customer@example.com',
              contact: '9999999999'
            },
            theme: { color: '#4f46e5' }
          };
          
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response: any) {
             alert(response.error.description);
             setIsSubmitting(false);
          });
          rzp.open();
        } else {

          sessionStorage.removeItem(`booking_data_${service.id}`);
          sessionStorage.removeItem(`booking_step_${service.id}`);
          navigate(`/booking-confirmation/${booking._id}`, { state: { booking: data, service } });
        }
      } catch (error: any) {
        if (error.message === 'Something went wrong' || error.message.includes('token') || error.message.includes('auth') || error.message.includes('Not authorized')) {
           alert('Please log in first to complete your booking.');
           navigate('/auth/login', { state: { from: `/book/${service.id}` } });
        } else {
           alert(error.message);
        }
        setIsSubmitting(false);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
    else navigate(-1);
  };

  const selectedTech = technicians.find(t => t.id === data.technicianId);

  const applyCoupon = async () => {
    try {
      setCouponError('');
      const response = await fetchApi('/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code: couponCode, orderValue: basePrice })
      });
      setDiscountAmount(response.discountAmount);
      setCouponId(response.couponId);
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon');
      setDiscountAmount(0);
      setCouponId(null);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '15px', left: 0, width: '100%', height: '2px', background: 'var(--border)', zIndex: 0 }}></div>
            <div style={{ position: 'absolute', top: '15px', left: 0, width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`, height: '2px', background: 'var(--primary)', zIndex: 1, transition: 'width 0.3s ease' }}></div>
            
            {steps.map(step => (
              <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: currentStep >= step.id ? 'var(--primary)' : 'var(--surface)', 
                  border: `2px solid ${currentStep >= step.id ? 'var(--primary)' : 'var(--border)'}`,
                  color: currentStep >= step.id ? 'white' : 'var(--text-muted)',
                  fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.3s ease'
                }}>
                  {currentStep > step.id ? <Check size={16} /> : step.id}
                </div>
                <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: currentStep >= step.id ? 'var(--text-main)' : 'var(--text-muted)' }}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
          
          
          <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', minHeight: '400px', position: 'relative' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                
                {currentStep === 1 && (
                  <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Confirm Service</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <img src={service.image} alt={service.name} style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{service.name}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{service.duration} • {service.rating} Rating</p>
                        <div style={{ color: 'var(--primary-light)', fontWeight: 700, fontSize: '1.1rem' }}>{service.price}</div>
                      </div>
                    </div>
                  </div>
                )}

                
                {currentStep === 2 && (
                  <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Where do you need the service?</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 500 }}>Full Address</span>
                        <textarea 
                          rows={4}
                          className="search-input"
                          style={{ background: 'var(--background)', padding: '1rem', border: `1px solid ${errors.address ? '#ef4444' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', resize: 'none' }}
                          placeholder="House/Flat No., Building Name, Street, Landmark, City, Pincode"
                          value={data.address}
                          onChange={(e) => setData({ ...data, address: e.target.value })}
                        />
                      </label>
                      {errors.address && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.address}</span>}
                    </div>
                  </div>
                )}

                
                {currentStep === 3 && (
                  <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>When do you need the service?</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {['Today', 'Tomorrow', 'Day after tomorrow'].map((day, i) => {
                        const dateObj = new Date();
                        dateObj.setDate(dateObj.getDate() + i);
                        const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                        
                        return (
                          <div 
                            key={day}
                            onClick={() => setData({ ...data, date: dateStr })}
                            style={{ 
                              flex: 1, minWidth: '120px', padding: '1.5rem 1rem', textAlign: 'center', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                              border: `2px solid ${data.date === dateStr ? 'var(--primary)' : 'var(--border)'}`,
                              background: data.date === dateStr ? 'rgba(79, 70, 229, 0.1)' : 'var(--background)',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{day}</div>
                            <div style={{ color: 'var(--text-muted)' }}>{dateStr}</div>
                          </div>
                        )
                      })}
                    </div>
                    {errors.date && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '1rem' }}>{errors.date}</div>}
                  </div>
                )}

                
                {currentStep === 4 && (
                  <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Select a Time Slot</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                      {['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM'].map((slot) => (
                        <div 
                          key={slot}
                          onClick={() => setData({ ...data, timeSlot: slot })}
                          style={{ 
                            padding: '1rem', textAlign: 'center', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                            border: `2px solid ${data.timeSlot === slot ? 'var(--primary)' : 'var(--border)'}`,
                            background: data.timeSlot === slot ? 'rgba(79, 70, 229, 0.1)' : 'var(--background)',
                            transition: 'all 0.2s', fontWeight: 500
                          }}
                        >
                          {slot}
                        </div>
                      ))}
                    </div>
                    {errors.timeSlot && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '1rem' }}>{errors.timeSlot}</div>}
                  </div>
                )}

                
                {currentStep === 5 && (
                  <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Select Professional</h2>
                    
                    <div 
                      onClick={() => setData({ ...data, technicianId: 'auto' })}
                      style={{ 
                        padding: '1.5rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: '2rem',
                        border: `2px solid ${data.technicianId === 'auto' ? 'var(--primary)' : 'var(--border)'}`,
                        background: data.technicianId === 'auto' ? 'rgba(79, 70, 229, 0.1)' : 'var(--background)',
                        display: 'flex', alignItems: 'center', gap: '1rem'
                      }}
                    >
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <User size={24} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Auto Assign Best Professional</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>We will assign the highest-rated professional available at your chosen time.</div>
                      </div>
                      {data.technicianId === 'auto' && <CheckCircle2 size={24} color="var(--primary)" style={{ marginLeft: 'auto' }} />}
                    </div>

                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Or choose a specific professional</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      {technicians.slice(0, 2).map(tech => (
                        <div 
                          key={tech.id} 
                          style={{ position: 'relative', border: data.technicianId === tech.id ? '2px solid var(--primary)' : '2px solid transparent', borderRadius: 'var(--radius-lg)' }}
                          onClick={() => setData({ ...data, technicianId: tech.id })}
                        >
                          {data.technicianId === tech.id && (
                            <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--primary)', color: 'white', borderRadius: '50%', padding: '0.2rem', zIndex: 10 }}>
                              <Check size={20} />
                            </div>
                          )}
                          <TechnicianCard technician={tech} onClick={() => setData({ ...data, technicianId: tech.id })} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                
                {currentStep === 6 && (
                  <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Review Booking</h2>
                    
                    <div style={{ background: 'var(--background)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1rem' }}>
                      <h4 style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Service</h4>
                      <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{service.name}</div>
                    </div>
                    
                    <div style={{ background: 'var(--background)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1rem' }}>
                      <h4 style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Date & Time</h4>
                      <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{data.date} at {data.timeSlot}</div>
                    </div>
                    
                    <div style={{ background: 'var(--background)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1rem' }}>
                      <h4 style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Address</h4>
                      <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{data.address}</div>
                    </div>
                    
                    <div style={{ background: 'var(--background)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                      <h4 style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Professional</h4>
                      <div style={{ fontSize: '1.1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {data.technicianId === 'auto' ? (
                          <>Auto Assigned</>
                        ) : (
                          <>
                            <img src={selectedTech?.imageUrl} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                            {selectedTech?.name} <ShieldCheck size={16} color="var(--secondary)" />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                
                {currentStep === 7 && (
                  <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Payment Method</h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div 
                        onClick={() => setData({ ...data, paymentMethod: 'online' })}
                        style={{ 
                          padding: '1.5rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                          border: `2px solid ${data.paymentMethod === 'online' ? 'var(--primary)' : 'var(--border)'}`,
                          background: data.paymentMethod === 'online' ? 'rgba(79, 70, 229, 0.1)' : 'var(--background)',
                          display: 'flex', alignItems: 'center', gap: '1rem'
                        }}
                      >
                        <CreditCard size={24} color="var(--primary-light)" />
                        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Pay Online (Card / UPI)</div>
                        {data.paymentMethod === 'online' && <CheckCircle2 size={24} color="var(--primary)" style={{ marginLeft: 'auto' }} />}
                      </div>
                      
                      <div 
                        onClick={() => setData({ ...data, paymentMethod: 'cash' })}
                        style={{ 
                          padding: '1.5rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                          border: `2px solid ${data.paymentMethod === 'cash' ? 'var(--primary)' : 'var(--border)'}`,
                          background: data.paymentMethod === 'cash' ? 'rgba(79, 70, 229, 0.1)' : 'var(--background)',
                          display: 'flex', alignItems: 'center', gap: '1rem'
                        }}
                      >
                        <User size={24} color="var(--secondary)" />
                        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Pay after Service (Cash)</div>
                        {data.paymentMethod === 'cash' && <CheckCircle2 size={24} color="var(--primary)" style={{ marginLeft: 'auto' }} />}
                      </div>
                    </div>
                    {errors.paymentMethod && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '1rem' }}>{errors.paymentMethod}</div>}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-outline" onClick={handleBack}>
                <ChevronLeft size={20} /> Back
              </button>
              <button className="btn btn-primary" onClick={handleNext} disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : (currentStep === 7 ? 'Confirm Booking' : 'Next Step')}
              </button>
            </div>
          </div>

          
          <div>
            <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Booking Summary</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Service</div>
                  <div style={{ fontWeight: 600 }}>{service.name}</div>
                </div>
                
                {data.date && (
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Schedule</div>
                    <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} /> {data.date}
                    </div>
                    {data.timeSlot && (
                      <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <Clock size={14} /> {data.timeSlot}
                      </div>
                    )}
                  </div>
                )}
                
                {data.address && (
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Location</div>
                    <div style={{ fontWeight: 500, display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <MapPin size={14} style={{ marginTop: '3px', flexShrink: 0 }} /> 
                      <span style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{data.address}</span>
                    </div>
                  </div>
                )}

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Service Total</span>
                    <span style={{ fontWeight: 600 }}>₹{basePrice}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Taxes & Fees</span>
                    <span style={{ fontWeight: 600 }}>₹{taxes}</span>
                  </div>
                  
                  
                  {currentStep >= 6 && (
                    <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input 
                          type="text" 
                          placeholder="Coupon Code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="search-input"
                          style={{ flex: 1, background: 'var(--background)', padding: '0.5rem 1rem' }}
                        />
                        <button onClick={applyCoupon} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Apply</button>
                      </div>
                      {couponError && <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem' }}>{couponError}</div>}
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#10b981' }}>
                      <span style={{ fontWeight: 500 }}>Discount applied</span>
                      <span style={{ fontWeight: 600 }}>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border)', fontSize: '1.25rem' }}>
                    <span style={{ fontWeight: 700 }}>Total</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
