import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ShieldCheck, Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocationContext } from '../context/LocationContext';
import { services } from '../data';

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
    image: "/images/services/professional-electrician.jpg",
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { city, area, openLocationModal } = useLocationContext();

  const matchingServices = searchQuery.trim()
    ? services.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.categorySlug.includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (matchingServices.length > 0) {
      navigate(`/services/${matchingServices[0].categorySlug}/${matchingServices[0].slug}`);
    } else if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/services');
    }
  };
  

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

        
        {/* Interactive Search & Location Bar */}
        <motion.div 
          ref={searchRef}
          className="search-container glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ width: '100%', position: 'relative' }}
        >
          {/* Service Search Input */}
          <div className="search-input-group" style={{ position: 'relative' }}>
            <Search size={20} color="var(--primary-light)" />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search services (e.g., Fan Repair, AC Cleaning...)" 
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSearchSubmit();
              }}
              style={{ color: 'var(--text-main)', background: 'transparent' }} 
            />
            {/* Live Autocomplete Dropdown */}
            <AnimatePresence>
              {showSuggestions && matchingServices.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 12px)',
                    left: 0,
                    right: 0,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    zIndex: 50,
                    overflow: 'hidden'
                  }}
                >
                  {matchingServices.map(s => (
                    <div
                      key={s.id}
                      onClick={() => {
                        navigate(`/services/${s.categorySlug}/${s.slug}`);
                        setShowSuggestions(false);
                      }}
                      style={{
                        padding: '0.85rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(79, 70, 229, 0.15)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={s.image} alt={s.name} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{s.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.categorySlug.replace('-', ' ')} • {s.duration}</div>
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--primary-light)', fontSize: '0.95rem' }}>{s.price}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="search-divider" style={{ backgroundColor: 'var(--border)' }}></div>

          {/* Location Picker Trigger */}
          <div 
            className="search-input-group" 
            onClick={openLocationModal} 
            style={{ cursor: 'pointer' }}
            title="Click to change location"
          >
            <MapPin size={20} color="var(--accent-electric)" />
            <div style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {area}, {city}
            </div>
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', background: 'rgba(79, 70, 229, 0.2)', color: 'var(--primary-light)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(79, 70, 229, 0.3)' }}>
              Change
            </span>
          </div>

          <button 
            type="button"
            className="btn btn-primary search-btn"
            onClick={() => handleSearchSubmit()}
          >
            Book Now
          </button>
        </motion.div>

        
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
