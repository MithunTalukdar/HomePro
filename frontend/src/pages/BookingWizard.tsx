import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, ChevronLeft, MapPin, Calendar, Clock, CreditCard, 
  User, ShieldCheck, CheckCircle2, Navigation, Banknote, Tag, Home as HomeIcon, Building 
} from 'lucide-react';
import { services, technicians, savedAddresses } from '../data';
import { TechnicianCard } from '../components/TechnicianCard';
import { fetchApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocationContext } from '../context/LocationContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

type BookingData = {
  serviceId: string;
  houseNo: string;
  street: string;
  city: string;
  pincode: string;
  address: string;
  date: string;
  timeSlot: string;
  technicianId: 'auto' | string;
  paymentMethod: 'cash' | 'online' | string;
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
  const { user } = useAuth();
  const { city: defaultCity, area: defaultArea, pincode: defaultPin, detectCurrentLocation, isDetecting } = useLocationContext();

  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<BookingData>({
    serviceId: service.id,
    houseNo: '',
    street: defaultArea || '',
    city: defaultCity || 'Bangalore',
    pincode: defaultPin || '560038',
    address: '',
    date: '',
    timeSlot: '',
    technicianId: 'auto',
    paymentMethod: 'cash' // Default to Cash on Delivery
  });

  useEffect(() => {
    const savedData = sessionStorage.getItem(`booking_data_${service.id}`);
    const savedStep = sessionStorage.getItem(`booking_step_${service.id}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setData(prev => ({ ...prev, ...parsed }));
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
  const totalAmount = Math.max(0, basePrice + taxes - discountAmount);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  // Sync combined address string whenever houseNo, street, city or pincode changes
  const fullAddressString = [data.houseNo, data.street, data.city, data.pincode].filter(Boolean).join(', ');

  const handleUseGPS = async () => {
    const success = await detectCurrentLocation();
    if (success) {
      setData(prev => ({
        ...prev,
        city: defaultCity,
        street: defaultArea,
        pincode: defaultPin
      }));
    }
  };

  const handleSelectSavedAddress = (saved: typeof savedAddresses[0]) => {
    setData(prev => ({
      ...prev,
      houseNo: saved.address.split(',')[0] || '',
      street: saved.address.split(',').slice(1).join(',').trim() || saved.address,
      city: saved.city,
      pincode: saved.pincode,
      address: `${saved.address}, ${saved.city} - ${saved.pincode}`
    }));
    setErrors(prev => ({ ...prev, houseNo: '', street: '', pincode: '', address: '' }));
  };

  const handleNext = async () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 2) {
      if (!data.houseNo.trim()) newErrors.houseNo = 'House / Flat / Floor No. is required';
      if (!data.street.trim()) newErrors.street = 'Street / Area / Landmark is required';
      if (!data.pincode.trim() || data.pincode.trim().length < 5) newErrors.pincode = 'Valid 6-digit Pincode is required';
      if (!data.city.trim()) newErrors.city = 'City is required';
    }

    if (currentStep === 3 && !data.date) newErrors.date = 'Please select a preferred service date';
    if (currentStep === 4 && !data.timeSlot) newErrors.timeSlot = 'Please select a preferred time slot';
    if (currentStep === 7 && !data.paymentMethod) newErrors.paymentMethod = 'Please choose a payment method';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Step 7: Final Submission
    if (currentStep === 7) {
      setIsSubmitting(true);
      const combinedAddress = fullAddressString || data.address;

      try {
        const payload = {
          serviceId: service.id,
          serviceName: service.name,
          date: data.date,
          timeSlot: data.timeSlot,
          address: {
            address: `${data.houseNo ? data.houseNo + ', ' : ''}${data.street}`,
            city: data.city || defaultCity,
            pincode: data.pincode || defaultPin
          },
          price: `₹${totalAmount}`,
          paymentMethod: data.paymentMethod === 'online' ? 'ONLINE' : 'CASH',
          paymentStatus: 'PENDING',
          couponId: couponId || undefined,
          discountAmount: discountAmount || 0
        };

        const booking = await fetchApi('/bookings', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        // 1. CASH ON DELIVERY (Pay after service)
        if (data.paymentMethod === 'cash') {
          sessionStorage.removeItem(`booking_data_${service.id}`);
          sessionStorage.removeItem(`booking_step_${service.id}`);
          
          navigate(`/booking-confirmation/${booking._id}`, { 
            state: { 
              booking: { 
                ...data, 
                address: combinedAddress,
                paymentMethod: 'cash',
                discountAmount 
              }, 
              service 
            } 
          });
          return;
        }

        // 2. ONLINE PAYMENT (Razorpay checkout)
        if (data.paymentMethod === 'online') {
          try {
            const order = await fetchApi('/payments/create-order', {
              method: 'POST',
              body: JSON.stringify({ amount: totalAmount, currency: 'INR', receipt: `rcpt_${booking._id}` })
            });

            if (window.Razorpay) {
              const options = {
                key: 'rzp_test_123',
                amount: order.amount,
                currency: order.currency,
                name: 'HomePro',
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
                    sessionStorage.removeItem(`booking_data_${service.id}`);
                    sessionStorage.removeItem(`booking_step_${service.id}`);
                    navigate(`/booking-confirmation/${booking._id}`, { 
                      state: { 
                        booking: { ...data, address: combinedAddress, paymentMethod: 'online', discountAmount }, 
                        service 
                      } 
                    });
                  } catch (err) {
                    alert('Payment verification failed, but booking was saved!');
                    navigate(`/booking-confirmation/${booking._id}`, { 
                      state: { booking: { ...data, address: combinedAddress, paymentMethod: 'online' }, service } 
                    });
                  }
                },
                prefill: {
                  name: user?.name || 'Valued Customer',
                  email: user?.email || 'customer@example.com',
                  contact: user?.phone || '9999999999'
                },
                theme: { color: '#4f46e5' }
              };

              const rzp = new window.Razorpay(options);
              rzp.on('payment.failed', function (response: any) {
                alert(response.error?.description || 'Payment did not complete.');
                setIsSubmitting(false);
              });
              rzp.open();
            } else {
              // Razorpay script not loaded; proceed with confirmed booking
              navigate(`/booking-confirmation/${booking._id}`, { 
                state: { booking: { ...data, address: combinedAddress, paymentMethod: 'online', discountAmount }, service } 
              });
            }
          } catch (e) {
            // Online gateway mock fallback
            navigate(`/booking-confirmation/${booking._id}`, { 
              state: { booking: { ...data, address: combinedAddress, paymentMethod: 'online', discountAmount }, service } 
            });
          }
        }
      } catch (error: any) {
        if (error.message?.includes('token') || error.message?.includes('auth') || error.message?.includes('authorized')) {
          alert('Please log in first to confirm your booking.');
          navigate('/auth/login', { state: { from: `/book/${service.id}` } });
        } else {
          alert(error.message || 'Something went wrong while booking.');
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
    if (!couponCode.trim()) return;
    try {
      setCouponError('');
      const response = await fetchApi('/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code: couponCode.trim().toUpperCase(), orderValue: basePrice })
      });
      setDiscountAmount(response.discountAmount || 50);
      setCouponId(response.couponId);
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon code');
      setDiscountAmount(0);
      setCouponId(null);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1060px' }}>
        
        {/* Progress Stepper Bar */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '2rem', right: '2rem', height: '3px', background: 'var(--border)', zIndex: 1, transform: 'translateY(-50%)' }} />
            <div 
              style={{ 
                position: 'absolute', top: '50%', left: '2rem', height: '3px', 
                background: 'linear-gradient(to right, var(--primary), var(--accent-electric))', 
                zIndex: 2, transform: 'translateY(-50%)',
                width: `${((currentStep - 1) / (steps.length - 1)) * 92}%`,
                transition: 'width 0.4s ease'
              }} 
            />

            {steps.map((s) => {
              const isPassed = s.id < currentStep;
              const isCurrent = s.id === currentStep;

              return (
                <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, cursor: isPassed ? 'pointer' : 'default' }} onClick={() => isPassed && setCurrentStep(s.id)}>
                  <div 
                    style={{ 
                      width: '38px', height: '38px', borderRadius: '50%', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isPassed ? 'var(--secondary)' : isCurrent ? 'var(--primary)' : 'var(--surface)',
                      border: `2px solid ${isPassed ? 'var(--secondary)' : isCurrent ? 'var(--primary-light)' : 'var(--border)'}`,
                      color: isPassed || isCurrent ? '#fff' : 'var(--text-muted)',
                      fontWeight: 700, fontSize: '0.9rem',
                      boxShadow: isCurrent ? '0 0 15px rgba(79, 70, 229, 0.4)' : 'none',
                      transition: 'all 0.3s'
                    }}
                  >
                    {isPassed ? <Check size={18} strokeWidth={3} /> : s.id}
                  </div>
                  <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: isCurrent ? '#fff' : 'var(--text-muted)', fontWeight: isCurrent ? 600 : 400 }}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column Splitwise Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }} className="booking-layout-grid">
          
          {/* Left Column: Form Content */}
          <div style={{ background: 'var(--surface)', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* STEP 1: Service Confirmation */}
                {currentStep === 1 && (
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>Selected Service</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Review the service details before proceeding to schedule.</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', background: 'var(--background)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                      <img 
                        src={service.image} 
                        alt={service.name} 
                        onError={(e) => { e.currentTarget.src = `/images/services/${service.slug}.jpg`; }}
                        style={{ width: '90px', height: '90px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} 
                      />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary-light)', fontWeight: 700, letterSpacing: '0.05em' }}>
                          {service.categorySlug.replace('-', ' ')}
                        </span>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', margin: '0.2rem 0 0.5rem' }}>{service.name}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Duration: {service.duration} • Rating: ★ {service.rating.toFixed(1)} ({service.reviews})</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Standard Rate</div>
                        <div style={{ color: 'var(--primary-light)', fontWeight: 800, fontSize: '1.4rem' }}>{service.price}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Address & Location */}
                {currentStep === 2 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>Where do you need the service?</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Enter complete door-to-door address for the service expert.</p>
                      </div>

                      {/* GPS Auto-Detect Button */}
                      <button
                        type="button"
                        onClick={handleUseGPS}
                        disabled={isDetecting}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.55rem 1rem',
                          background: 'rgba(79, 70, 229, 0.15)',
                          border: '1px solid rgba(79, 70, 229, 0.35)',
                          borderRadius: 'var(--radius-full)',
                          color: '#fff',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: isDetecting ? 'wait' : 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Navigation size={14} color="var(--accent-electric)" className={isDetecting ? 'animate-spin' : ''} />
                        {isDetecting ? 'Detecting...' : 'Detect GPS Location'}
                      </button>
                    </div>

                    {/* Saved Addresses Quick Pick */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                        Quick Select Saved Locations
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {savedAddresses.map(sa => (
                          <button
                            key={sa.id}
                            type="button"
                            onClick={() => handleSelectSavedAddress(sa)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.6rem 1rem',
                              background: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: 'var(--radius-md)',
                              color: '#fff',
                              cursor: 'pointer',
                              fontSize: '0.85rem'
                            }}
                          >
                            {sa.label === 'Home' ? <HomeIcon size={15} color="var(--primary-light)" /> : <Building size={15} color="var(--secondary)" />}
                            <span><strong>{sa.label}:</strong> {sa.address.split(',')[0]}, {sa.city}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Structured Address Inputs */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                          House / Flat / Floor No. *
                        </label>
                        <input
                          type="text"
                          className="search-input"
                          style={{
                            width: '100%',
                            background: 'var(--background)',
                            padding: '0.8rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: `1px solid ${errors.houseNo ? '#ef4444' : 'var(--border)'}`,
                            color: '#fff'
                          }}
                          placeholder="e.g. Flat 402, Tower B"
                          value={data.houseNo}
                          onChange={e => {
                            setData({ ...data, houseNo: e.target.value });
                            if (errors.houseNo) setErrors({ ...errors, houseNo: '' });
                          }}
                        />
                        {errors.houseNo && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.houseNo}</span>}
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                          Street, Area, Landmark *
                        </label>
                        <input
                          type="text"
                          className="search-input"
                          style={{
                            width: '100%',
                            background: 'var(--background)',
                            padding: '0.8rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: `1px solid ${errors.street ? '#ef4444' : 'var(--border)'}`,
                            color: '#fff'
                          }}
                          placeholder="e.g. 12th Main Road, Near Metro Station"
                          value={data.street}
                          onChange={e => {
                            setData({ ...data, street: e.target.value });
                            if (errors.street) setErrors({ ...errors, street: '' });
                          }}
                        />
                        {errors.street && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.street}</span>}
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                          City *
                        </label>
                        <input
                          type="text"
                          className="search-input"
                          style={{
                            width: '100%',
                            background: 'var(--background)',
                            padding: '0.8rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: `1px solid ${errors.city ? '#ef4444' : 'var(--border)'}`,
                            color: '#fff'
                          }}
                          placeholder="e.g. Bangalore, Kolkata, Mumbai"
                          value={data.city}
                          onChange={e => {
                            setData({ ...data, city: e.target.value });
                            if (errors.city) setErrors({ ...errors, city: '' });
                          }}
                        />
                        {errors.city && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.city}</span>}
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                          Pincode *
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          className="search-input"
                          style={{
                            width: '100%',
                            background: 'var(--background)',
                            padding: '0.8rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: `1px solid ${errors.pincode ? '#ef4444' : 'var(--border)'}`,
                            color: '#fff'
                          }}
                          placeholder="6-digit Pincode (e.g. 560038)"
                          value={data.pincode}
                          onChange={e => {
                            setData({ ...data, pincode: e.target.value });
                            if (errors.pincode) setErrors({ ...errors, pincode: '' });
                          }}
                        />
                        {errors.pincode && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.pincode}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Date Selection */}
                {currentStep === 3 && (
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>When do you need the service?</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Select your preferred day for the technician to visit.</p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {['Today', 'Tomorrow', 'Day after tomorrow', 'This Weekend'].map((day, i) => {
                        const dateObj = new Date();
                        dateObj.setDate(dateObj.getDate() + i);
                        const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                        
                        return (
                          <div 
                            key={day}
                            onClick={() => {
                              setData({ ...data, date: dateStr });
                              if (errors.date) setErrors({ ...errors, date: '' });
                            }}
                            style={{ 
                              flex: 1, minWidth: '130px', padding: '1.5rem 1rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                              border: `2px solid ${data.date === dateStr ? 'var(--primary)' : 'var(--border)'}`,
                              background: data.date === dateStr ? 'rgba(79, 70, 229, 0.15)' : 'var(--background)',
                              transition: 'all 0.2s',
                              boxShadow: data.date === dateStr ? '0 0 15px rgba(79, 70, 229, 0.25)' : 'none'
                            }}
                          >
                            <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.35rem', fontSize: '1.05rem' }}>{day}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{dateStr}</div>
                          </div>
                        );
                      })}
                    </div>
                    {errors.date && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '1rem' }}>{errors.date}</div>}
                  </div>
                )}

                {/* STEP 4: Time Slot */}
                {currentStep === 4 && (
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>Select a Time Slot</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Choose an arrival window convenient for you.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                      {[
                        { slot: '09:00 AM - 11:00 AM', label: 'Morning Slot' },
                        { slot: '11:00 AM - 01:00 PM', label: 'Noon Slot' },
                        { slot: '02:00 PM - 04:00 PM', label: 'Afternoon Slot' },
                        { slot: '04:00 PM - 06:00 PM', label: 'Evening Slot' }
                      ].map(({ slot, label }) => (
                        <div 
                          key={slot}
                          onClick={() => {
                            setData({ ...data, timeSlot: slot });
                            if (errors.timeSlot) setErrors({ ...errors, timeSlot: '' });
                          }}
                          style={{ 
                            padding: '1.25rem 1rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                            border: `2px solid ${data.timeSlot === slot ? 'var(--primary)' : 'var(--border)'}`,
                            background: data.timeSlot === slot ? 'rgba(79, 70, 229, 0.15)' : 'var(--background)',
                            transition: 'all 0.2s',
                            boxShadow: data.timeSlot === slot ? '0 0 15px rgba(79, 70, 229, 0.25)' : 'none'
                          }}
                        >
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</div>
                          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{slot}</div>
                        </div>
                      ))}
                    </div>
                    {errors.timeSlot && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '1rem' }}>{errors.timeSlot}</div>}
                  </div>
                )}

                {/* STEP 5: Select Professional */}
                {currentStep === 5 && (
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>Select Professional</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Opt for our smart auto-assignment or handpick a specialist.</p>
                    
                    <div 
                      onClick={() => setData({ ...data, technicianId: 'auto' })}
                      style={{ 
                        padding: '1.5rem', borderRadius: 'var(--radius-lg)', cursor: 'pointer', marginBottom: '1.5rem',
                        border: `2px solid ${data.technicianId === 'auto' ? 'var(--primary)' : 'var(--border)'}`,
                        background: data.technicianId === 'auto' ? 'rgba(79, 70, 229, 0.15)' : 'var(--background)',
                        display: 'flex', alignItems: 'center', gap: '1.25rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>
                        <ShieldCheck size={26} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>Auto-Assign Best Available Pro (Recommended)</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>We allocate the highest-rated verified technician closest to your location.</div>
                      </div>
                      {data.technicianId === 'auto' && <CheckCircle2 size={24} color="var(--primary-light)" />}
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1rem' }}>
                      Or Choose Specific Technician:
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                      {technicians.map((tech) => (
                        <div 
                          key={tech.id} 
                          onClick={() => setData({ ...data, technicianId: tech.id })}
                          style={{
                            cursor: 'pointer', borderRadius: 'var(--radius-lg)',
                            border: `2px solid ${data.technicianId === tech.id ? 'var(--primary)' : 'transparent'}`,
                            boxShadow: data.technicianId === tech.id ? '0 0 15px rgba(79, 70, 229, 0.3)' : 'none',
                            transition: 'all 0.2s'
                          }}
                        >
                          <TechnicianCard technician={tech} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 6: Review Summary */}
                {currentStep === 6 && (
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>Review Booking Details</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Please verify your service details before choosing payment.</p>
                    
                    <div style={{ background: 'var(--background)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Service</span>
                        <strong style={{ color: '#fff' }}>{service.name}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Scheduled Date & Time</span>
                        <strong style={{ color: '#fff' }}>{data.date} at {data.timeSlot}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Service Address</span>
                        <strong style={{ color: '#fff', textAlign: 'right', maxWidth: '60%' }}>{fullAddressString}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Professional</span>
                        <strong style={{ color: '#fff' }}>{data.technicianId === 'auto' ? 'Auto-Assigned Verified Expert' : selectedTech?.name}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 7: Payment Method Selection */}
                {currentStep === 7 && (
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.35rem', color: '#fff' }}>Select Payment Method</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Choose how you would like to pay. Zero risk option available.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      
                      {/* CASH ON DELIVERY (PRIMARY) */}
                      <div 
                        onClick={() => {
                          setData({ ...data, paymentMethod: 'cash' });
                          if (errors.paymentMethod) setErrors({ ...errors, paymentMethod: '' });
                        }}
                        style={{ 
                          padding: '1.5rem', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                          border: `2px solid ${data.paymentMethod === 'cash' ? '#10B981' : 'var(--border)'}`,
                          background: data.paymentMethod === 'cash' ? 'rgba(16, 185, 129, 0.12)' : 'var(--background)',
                          display: 'flex', alignItems: 'center', gap: '1.25rem',
                          transition: 'all 0.2s',
                          boxShadow: data.paymentMethod === 'cash' ? '0 0 20px rgba(16, 185, 129, 0.25)' : 'none'
                        }}
                      >
                        <div style={{ 
                          width: '52px', height: '52px', borderRadius: '12px', 
                          background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center' 
                        }}>
                          <Banknote size={28} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '1.15rem', color: '#fff' }}>Cash on Delivery (Pay after service)</span>
                            <span style={{ background: 'rgba(16, 185, 129, 0.25)', color: '#10B981', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                              MOST POPULAR
                            </span>
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem', lineHeight: 1.4 }}>
                            Pay ₹{totalAmount} via Cash or UPI directly to the technician once service is completed to your satisfaction. No advance payment required!
                          </div>
                        </div>
                        {data.paymentMethod === 'cash' && <CheckCircle2 size={24} color="#10B981" />}
                      </div>

                      {/* PAY ONLINE */}
                      <div 
                        onClick={() => {
                          setData({ ...data, paymentMethod: 'online' });
                          if (errors.paymentMethod) setErrors({ ...errors, paymentMethod: '' });
                        }}
                        style={{ 
                          padding: '1.5rem', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                          border: `2px solid ${data.paymentMethod === 'online' ? 'var(--primary)' : 'var(--border)'}`,
                          background: data.paymentMethod === 'online' ? 'rgba(79, 70, 229, 0.12)' : 'var(--background)',
                          display: 'flex', alignItems: 'center', gap: '1.25rem',
                          transition: 'all 0.2s',
                          boxShadow: data.paymentMethod === 'online' ? '0 0 20px rgba(79, 70, 229, 0.25)' : 'none'
                        }}
                      >
                        <div style={{ 
                          width: '52px', height: '52px', borderRadius: '12px', 
                          background: 'rgba(79, 70, 229, 0.2)', color: 'var(--primary-light)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center' 
                        }}>
                          <CreditCard size={28} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 700, fontSize: '1.15rem', color: '#fff' }}>Pay Online (UPI / Card / NetBanking)</span>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                            Instant secure digital payment via Razorpay. Receipt sent instantly to your email.
                          </div>
                        </div>
                        {data.paymentMethod === 'online' && <CheckCircle2 size={24} color="var(--primary-light)" />}
                      </div>

                    </div>
                    {errors.paymentMethod && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '1rem' }}>{errors.paymentMethod}</div>}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Step Navigation Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <button type="button" className="btn btn-outline" onClick={handleBack} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ChevronLeft size={20} /> Back
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleNext} 
                disabled={isSubmitting}
                style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
              >
                {isSubmitting ? 'Confirming Booking...' : (currentStep === 7 ? (data.paymentMethod === 'cash' ? 'Confirm (Cash on Delivery)' : 'Proceed to Pay') : 'Next Step')}
              </button>
            </div>
          </div>

          {/* Right Column: Splitwise-Style Bill Breakdown */}
          <div>
            <div style={{ 
              background: 'var(--surface)', padding: '1.75rem', borderRadius: 'var(--radius-xl)', 
              border: '1px solid var(--border)', position: 'sticky', top: '100px',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#fff' }}>Booking Summary</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)', background: 'rgba(79, 70, 229, 0.15)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                  Step {currentStep} of {steps.length}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>Service</div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem' }}>{service.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{service.categorySlug.replace('-', ' ')}</div>
                </div>
                
                {data.date && (
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>Schedule</div>
                    <div style={{ fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                      <Calendar size={14} color="var(--primary-light)" /> {data.date}
                    </div>
                    {data.timeSlot && (
                      <div style={{ fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', fontSize: '0.9rem' }}>
                        <Clock size={14} color="var(--primary-light)" /> {data.timeSlot}
                      </div>
                    )}
                  </div>
                )}
                
                {fullAddressString && (
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>Location</div>
                    <div style={{ fontWeight: 500, color: '#fff', display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.85rem', lineHeight: 1.4 }}>
                      <MapPin size={14} color="var(--accent-electric)" style={{ marginTop: '2px', flexShrink: 0 }} /> 
                      <span>{fullAddressString}</span>
                    </div>
                  </div>
                )}

                {/* Splitwise Itemized Bill Split */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    Payment Breakdown
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Service Base Price</span>
                    <span style={{ fontWeight: 600, color: '#fff' }}>₹{basePrice}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Taxes & Safety Fee</span>
                    <span style={{ fontWeight: 600, color: '#fff' }}>₹{taxes}</span>
                  </div>
                  
                  {/* Coupon Box */}
                  <div style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        placeholder="Coupon Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="search-input"
                        style={{ flex: 1, background: 'var(--background)', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                      />
                      <button type="button" onClick={applyCoupon} className="btn btn-outline" style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}>
                        Apply
                      </button>
                    </div>
                    {couponError && <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>{couponError}</div>}
                  </div>

                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#10b981', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Tag size={13} /> Discount</span>
                      <span style={{ fontWeight: 700 }}>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border)' 
                  }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>Total Payable</span>
                      <div style={{ fontSize: '0.75rem', color: data.paymentMethod === 'cash' ? '#10B981' : 'var(--primary-light)', fontWeight: 600 }}>
                        {data.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Online Payment'}
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--primary-light)', fontSize: '1.4rem' }}>
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
