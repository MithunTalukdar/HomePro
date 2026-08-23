import { Zap, Droplets, Wind, Wrench, Camera, Droplet, Sparkles, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categories } from '../data';

// Map icon names and accents to components
const getCategoryStyle = (slug: string) => {
  switch(slug) {
    case 'electrical': return { icon: <Zap size={32} />, color: 'var(--accent-elec)' };
    case 'ac-service': return { icon: <Wind size={32} />, color: 'var(--accent-ac)' };
    case 'plumbing': return { icon: <Droplets size={32} />, color: 'var(--accent-plumb)' };
    case 'appliance-repair': return { icon: <Wrench size={32} />, color: 'var(--accent-appliance)' };
    case 'cctv': return { icon: <Camera size={32} />, color: 'var(--accent-cctv)' };
    case 'ro-water': return { icon: <Droplet size={32} />, color: 'var(--accent-ro)' };
    case 'cleaning': return { icon: <Sparkles size={32} />, color: 'var(--accent-clean)' };
    case 'installation': return { icon: <PenTool size={32} />, color: 'var(--accent-install)' };
    default: return { icon: <Zap size={32} />, color: 'var(--primary-light)' };
  }
};

export function ServiceCategories() {
  return (
    <section className="section section-secondary relative" style={{ padding: '6rem 0', overflow: 'hidden' }}>
      {/* Ambient background glow */}
      <div className="ambient-glow-purple" style={{ top: '-10%', left: '-5%' }} />
      <div className="ambient-glow-cyan" style={{ bottom: '-10%', right: '-5%' }} />

      <div className="container relative" style={{ zIndex: 10 }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Explore Categories
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            Find the right professional for your specific needs
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
          {categories.map((category, index) => {
            const style = getCategoryStyle(category.slug);
            return (
              <motion.div 
                key={category.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                style={{ height: '100%' }}
              >
                <Link 
                  to={`/services/${category.slug}`} 
                  className="glass-card" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '2.5rem 1.5rem', 
                    textDecoration: 'none', 
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    const iconWrapper = e.currentTarget.querySelector('.icon-wrapper') as HTMLElement;
                    if (iconWrapper) {
                      iconWrapper.style.transform = 'scale(1.15) translateY(-5px)';
                      iconWrapper.style.boxShadow = `0 0 20px ${style.color}40`;
                    }
                  }}
                  onMouseOut={(e) => {
                    const iconWrapper = e.currentTarget.querySelector('.icon-wrapper') as HTMLElement;
                    if (iconWrapper) {
                      iconWrapper.style.transform = 'scale(1) translateY(0)';
                      iconWrapper.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div 
                    className="icon-wrapper"
                    style={{ 
                      color: style.color, 
                      marginBottom: '1.5rem',
                      padding: '1.25rem',
                      background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))`,
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${style.color}30`,
                      transition: 'all var(--transition-bounce)'
                    }}
                  >
                    {style.icon}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                    {category.name}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    {category.desc}
                  </p>

                  {/* Subtle bottom border accent */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '3px',
                    background: `linear-gradient(90deg, transparent, ${style.color}, transparent)`,
                    opacity: 0.5
                  }} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
