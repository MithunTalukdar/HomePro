import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ShieldCheck, Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const servicesHero = [
  {
    id: "fan-repair",
    title: "Fan Repair Service",
    description: "Professional fan repair and installation at your doorstep.",
    buttonText: "Explore Service",
    price: "Starting from ₹149",
    image: "/images/services/fan-repair.jpg",
    categorySlug: "electrical",
    serviceSlug: "fan-repair",
    serviceId: "ps1"
  },
  {
    id: "ac-repair",
    title: "AC Repair & Service",
    description: "Professional AC repair, maintenance and servicing at home.",
    buttonText: "Explore AC Service",
    price: "Starting from ₹499",
    image: "/images/services/ac-repair.jpg",
    categorySlug: "ac-service",
    serviceSlug: "ac-general-service",
    serviceId: "ps11"
  },
  {
    id: "refrigerator-repair",
    title: "Refrigerator Repair",
    description: "Fast and reliable refrigerator repair at your doorstep.",
    buttonText: "Explore Service",
    price: "Starting from ₹299",
    image: "/images/services/refrigerator-repair.jpg",
    categorySlug: "appliance-repair",
    serviceSlug: "refrigerator-repair",
    serviceId: "ps30"
  },
  {
    id: "electrician",
    title: "Professional Electrician",
    description: "Trusted professionals for your home electrical needs.",
    buttonText: "Explore Electrician Service",
    price: "Starting from ₹149",
    image: "/images/services/electrician.jpg",
    categorySlug: "electrical",
    serviceSlug: "electrical-wiring",
    serviceId: "ps4"
  },
  {
    id: "cleaning",
    title: "Professional Home Cleaning",
    description: "A cleaner and healthier home with trusted professionals.",
    buttonText: "Explore Service",
    price: "Starting from ₹499",
    image: "/images/services/home-cleaning.jpg",
    categorySlug: "cleaning",
    serviceSlug: "home-deep-cleaning",
    serviceId: "ps48"
  }
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Auto-advance slider for images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % servicesHero.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % servicesHero.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? servicesHero.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleBookNow = (serviceId: string) => {
    if (user) {
      navigate(`/book/${serviceId}`);
    } else {
      navigate('/auth/login?type=customer');
    }
  };

  const handleExplore = (categorySlug: string, serviceSlug: string) => {
    navigate(`/services/${categorySlug}/${serviceSlug}`);
  };

  return (
    <section className="hero" style={{ padding: 0, minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Background Images */}
      {servicesHero.map((slide, index) => (
        <div 
          key={slide.id}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: currentSlide === index ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: currentSlide === index ? 0 : -1,
            backgroundColor: '#0f172a'
          }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          {/* Cinematic Dark Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(11, 17, 32, 0.95) 0%, rgba(11, 17, 32, 0.4) 40%, rgba(11, 17, 32, 0.95) 100%)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, transparent 0%, rgba(11, 17, 32, 0.6) 100%)',
            pointerEvents: 'none'
          }} />
        </div>
      ))}

      <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8rem 1rem 6rem' }}>
        
        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ maxWidth: '850px', textAlign: 'center', color: '#fff', width: '100%' }}
          >
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
              fontWeight: 800, 
              lineHeight: 1.1, 
              color: '#fff', 
              textShadow: '0 8px 24px rgba(0,0,0,0.6)',
              marginBottom: '1.25rem',
              letterSpacing: '-0.02em'
            }}>
              {servicesHero[currentSlide].title}
            </h1>
            <p style={{ 
              fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', 
              color: 'rgba(248, 250, 252, 0.9)', 
              textShadow: '0 4px 12px rgba(0,0,0,0.6)', 
              marginBottom: '1.5rem', 
              maxWidth: '650px', 
              marginLeft: 'auto', 
              marginRight: 'auto',
              lineHeight: 1.6
            }}>
              {servicesHero[currentSlide].description}
            </p>
            <p style={{ 
              fontSize: '1.75rem', 
              fontWeight: 700, 
              color: 'var(--accent-electric)', 
              textShadow: '0 4px 12px rgba(0,0,0,0.6)', 
              marginBottom: '3rem' 
            }}>
              {servicesHero[currentSlide].price}
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
              <button 
                onClick={() => handleExplore(servicesHero[currentSlide].categorySlug, servicesHero[currentSlide].serviceSlug)}
                className="btn btn-secondary" 
                style={{ padding: '0.9rem 2.25rem', fontSize: '1.1rem' }}
              >
                {servicesHero[currentSlide].buttonText}
              </button>
              <button 
                onClick={() => handleBookNow(servicesHero[currentSlide].serviceId)}
                className="btn btn-primary"
                style={{ padding: '0.9rem 2.25rem', fontSize: '1.1rem' }}
              >
                Book Now
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Existing Search Functionality */}
        <motion.div 
          className="search-container glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ width: '100%' }}
        >
          <div className="search-input-group">
            <Search size={20} color="var(--text-muted)" />
            <input type="text" className="search-input" placeholder="Search for a service (e.g., Fan Repair)" style={{ color: 'var(--text-main)', background: 'transparent' }} />
          </div>
          <div className="search-divider" style={{ backgroundColor: 'var(--border)' }}></div>
          <div className="search-input-group">
            <MapPin size={20} color="var(--text-muted)" />
            <input type="text" className="search-input" placeholder="Zip code or City" style={{ color: 'var(--text-main)', background: 'transparent' }} />
          </div>
          <button className="btn btn-primary search-btn">Book Now</button>
        </motion.div>

        {/* Badges */}
        <motion.div 
          style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: 500, fontSize: '0.95rem' }}>
            <ShieldCheck size={20} color="var(--success)" /> Verified Pros
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: 500, fontSize: '0.95rem' }}>
            <Star size={20} fill="var(--warning)" color="var(--warning)" /> 4.8/5 Avg Rating
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: 500, fontSize: '0.95rem' }}>
            <Clock size={20} color="var(--accent-electric)" /> On-Time Guarantee
          </div>
        </motion.div>
      </div>

      {/* Slider Controls */}
      <button 
        onClick={prevSlide}
        style={{
          position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)',
          zIndex: 20, background: 'var(--bg-glass)', border: '1px solid var(--border)', color: 'var(--text-main)',
          width: '44px', height: '44px', borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          backdropFilter: 'blur(12px)', transition: 'all var(--transition-smooth)'
        }}
        onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'var(--primary-light)'; e.currentTarget.style.boxShadow = 'var(--shadow-glow)'; }}
        onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-glass)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button 
        onClick={nextSlide}
        style={{
          position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)',
          zIndex: 20, background: 'var(--bg-glass)', border: '1px solid var(--border)', color: 'var(--text-main)',
          width: '44px', height: '44px', borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          backdropFilter: 'blur(12px)', transition: 'all var(--transition-smooth)'
        }}
        onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'var(--primary-light)'; e.currentTarget.style.boxShadow = 'var(--shadow-glow)'; }}
        onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-glass)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination Dots */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
        zIndex: 20, display: 'flex', gap: '0.75rem',
        background: 'var(--bg-glass)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-full)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)'
      }}>
        {servicesHero.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: currentSlide === index ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: currentSlide === index ? 'var(--primary-light)' : 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-smooth)',
              boxShadow: currentSlide === index ? 'var(--shadow-glow)' : 'none'
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
