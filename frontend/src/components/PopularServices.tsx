import { Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { services } from '../data';
import { Link } from 'react-router-dom';

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
  return (
    <section className="section section-primary relative">
      <div className="container relative" style={{ zIndex: 10 }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>Popular Services</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Most booked services in your area</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {services.slice(0, 6).map((service, index) => {
            const accentColor = getCategoryAccent(service.categorySlug);
            return (
              <motion.div 
                key={service.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                style={{ height: '100%' }}
              >
                <div 
                  className="glass-card"
                  style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
                >
                  <div style={{ position: 'relative', width: '100%', paddingTop: '60%', overflow: 'hidden' }}>
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      style={{ 
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' 
                      }} 
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,17,32,0.9) 0%, transparent 60%)', pointerEvents: 'none' }} />
                    <span 
                      style={{ 
                        position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
                        padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600,
                        color: accentColor, border: `1px solid ${accentColor}40`
                      }}
                    >
                      {service.categorySlug.toUpperCase().replace('-', ' ')}
                    </span>
                  </div>
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', margin: 0, flex: 1, paddingRight: '1rem' }}>{service.name}</h3>
                      <span style={{ fontWeight: 700, color: accentColor, fontSize: '1.1rem' }}>{service.price}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Clock size={16} color="var(--text-muted)" /> {service.duration}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Star size={16} fill="var(--warning)" color="var(--warning)" /> {service.rating.toFixed(1)} ({service.reviews})</span>
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                      <Link to={`/services/${service.categorySlug}/${service.slug}`} className="btn btn-secondary w-full" style={{ justifyContent: 'center' }}>
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
