import { useState } from 'react';
import { Star, Clock, ShieldCheck, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { services, categories } from '../data';
import { Link, useNavigate } from 'react-router-dom';
import { useLocationContext } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';

const getCategoryAccent = (slug: string) => {
  switch(slug) {
    case 'electrical': return 'var(--accent-elec)';
    case 'ac-service': return 'var(--accent-ac)';
    case 'plumbing': return 'var(--accent-plumb)';
    case 'appliance-repair': return 'var(--accent-appliance)';
    case 'cctv': return 'var(--accent-cctv)';
    case 'ro-water': return 'var(--accent-ro)';
    case 'cleaning': return 'var(--accent-clean)';
    case 'installation': return 'var(--accent-install)';
    default: return 'var(--primary-light)';
  }
};

export function PopularServices() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { city, area } = useLocationContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const filteredServices = activeCategory === 'all'
    ? services.slice(0, 8)
    : services.filter(s => s.categorySlug === activeCategory).slice(0, 8);

  const handleBookNow = (serviceId: string) => {
    if (user) {
      navigate(`/book/${serviceId}`);
    } else {
      navigate('/auth/login?type=customer', { state: { from: `/book/${serviceId}` } });
    }
  };

  return (
    <section className="section section-primary relative" style={{ padding: '6rem 0' }}>
      <div className="container relative" style={{ zIndex: 10 }}>
        {/* Section Header */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(79, 70, 229, 0.1)',
            border: '1px solid rgba(79, 70, 229, 0.25)',
            color: 'var(--primary-light)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1rem'
          }}>
            <Zap size={14} /> Instant Home Booking Available
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            Popular Services
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            Most booked services in <strong style={{ color: '#fff' }}>{area}, {city}</strong> with verified on-time pros
          </p>
        </div>

        {/* Category Filter Pills */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '3rem'
        }}>
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.9rem',
              fontWeight: activeCategory === 'all' ? 700 : 500,
              background: activeCategory === 'all' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
              color: activeCategory === 'all' ? '#fff' : 'var(--text-muted)',
              border: activeCategory === 'all' ? '1px solid var(--primary-light)' : '1px solid rgba(255, 255, 255, 0.08)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeCategory === 'all' ? '0 4px 15px rgba(79, 70, 229, 0.35)' : 'none'
            }}
          >
            All Services ({services.length})
          </button>
          {categories.map(cat => {
            const isSelected = activeCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                style={{
                  padding: '0.5rem 1.2rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9rem',
                  fontWeight: isSelected ? 700 : 500,
                  background: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#fff' : 'var(--text-muted)',
                  border: isSelected ? '1px solid var(--primary-light)' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 4px 15px rgba(79, 70, 229, 0.35)' : 'none'
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
        
        {/* Services Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}
          >
            {filteredServices.map((service, index) => {
              const accentColor = getCategoryAccent(service.categorySlug);
              return (
                <motion.div 
                  key={service.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  style={{ height: '100%' }}
                >
                  <div 
                    className="glass-card"
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      height: '100%', 
                      overflow: 'hidden',
                      borderRadius: '1.25rem',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.borderColor = `${accentColor}80`;
                      e.currentTarget.style.boxShadow = `0 20px 40px -10px ${accentColor}25`;
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Card Image Banner */}
                    <div style={{ position: 'relative', width: '100%', paddingTop: '58%', overflow: 'hidden', background: '#0f172a' }}>
                      <img 
                        src={service.image} 
                        alt={service.name} 
                        onError={(e) => {
                          // Fallback to local image if remote image fails
                          e.currentTarget.src = `/images/services/${service.slug}.jpg`;
                        }}
                        style={{ 
                          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
                          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' 
                        }} 
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,17,32,0.95) 0%, rgba(11,17,32,0.3) 50%, transparent 100%)', pointerEvents: 'none' }} />
                      
                      {/* Category Tag */}
                      <span 
                        style={{ 
                          position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
                          padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700,
                          color: accentColor, border: `1px solid ${accentColor}50`, letterSpacing: '0.04em'
                        }}
                      >
                        {service.categorySlug.toUpperCase().replace('-', ' ')}
                      </span>

                      {/* COD Supported Pill */}
                      <span 
                        style={{ 
                          position: 'absolute', bottom: '0.75rem', left: '1rem', background: 'rgba(16, 185, 129, 0.2)', backdropFilter: 'blur(6px)',
                          padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600,
                          color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', gap: '0.3rem'
                        }}
                      >
                        <CheckCircle size={12} /> Cash on Delivery Available
                      </span>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, flex: 1, paddingRight: '0.75rem' }}>
                          {service.name}
                        </h3>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 800, color: accentColor, fontSize: '1.25rem' }}>{service.price}</span>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Standard rate</div>
                        </div>
                      </div>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                        {service.description}
                      </p>

                      <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Clock size={15} color="var(--text-muted)" /> {service.duration}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Star size={15} fill="var(--warning)" color="var(--warning)" /> {service.rating.toFixed(1)} ({service.reviews})
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: 'auto', color: 'var(--secondary)' }}>
                          <ShieldCheck size={15} /> 30d Warranty
                        </span>
                      </div>

                      {/* Split Actions */}
                      <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem' }}>
                        <Link 
                          to={`/services/${service.categorySlug}/${service.slug}`} 
                          className="btn btn-outline" 
                          style={{ flex: 1, justifyContent: 'center', padding: '0.7rem 0.5rem', fontSize: '0.9rem' }}
                        >
                          View Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleBookNow(service.id)}
                          className="btn btn-primary"
                          style={{ flex: 1, justifyContent: 'center', padding: '0.7rem 0.5rem', fontSize: '0.9rem' }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* View All Services Footer CTA */}
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link 
            to="/services" 
            className="btn btn-primary"
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 8px 30px rgba(79, 70, 229, 0.4)'
            }}
          >
            <span>View All {services.length} Services</span>
            <ArrowRight size={20} />
          </Link>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.75rem' }}>
            Browse electrical, AC, plumbing, appliances, cleaning, CCTV and more
          </div>
        </div>
      </div>
    </section>
  );
}
