import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, CheckCircle2, XCircle, ShieldCheck, ChevronRight } from 'lucide-react';
import { services, categories } from '../data';
import { TechnicianShowcase } from '../components/TechnicianShowcase';
import { FAQ } from '../components/FAQ';
import { Testimonials } from '../components/Testimonials';
import { SEO } from '../components/SEO';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export function ServiceDetail() {
  const { categorySlug, serviceSlug } = useParams<{ categorySlug: string, serviceSlug: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const service = services.find(s => s.slug === serviceSlug && s.categorySlug === categorySlug);
  const category = categories.find(c => c.slug === categorySlug);

  useEffect(() => {

    if (!service) {
      if (category) {
        navigate(`/services/${category.slug}`, { replace: true });
      } else {
        navigate('/services', { replace: true });
      }
    }
  }, [service, category, navigate]);

  if (!service || !category) {
    return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="dot-pulse">...</span></div>;
  }
  
  const relatedServices = services.filter(s => s.categorySlug === categorySlug && s.id !== service.id).slice(0, 3);

  return (
    <main style={{ position: 'relative', paddingBottom: '80px' }}>
      <SEO 
        title={`${service.name} | ${category.name}`} 
        description={service.description} 
        keywords={`${service.name.toLowerCase()}, ${category.name.toLowerCase()}, home service, repair`} 
      />

      
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 10, padding: '1.5rem 0', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
          <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/services" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Services</Link>
          <ChevronRight size={14} />
          <Link to={`/services/${category.slug}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{category.name}</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'white' }}>{service.name}</span>
        </div>
      </div>

      
      <div style={{ position: 'relative', height: '450px', width: '100%' }}>
        <img src={service.image} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--background) 0%, rgba(15, 23, 42, 0.4) 100%)' }}></div>
        <div className="container" style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', paddingBottom: '2rem' }}>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {service.name}
          </motion.h1>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Star size={18} fill="#fbbf24" color="#fbbf24" /> {service.rating.toFixed(1)} ({service.reviews} reviews)</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={18} /> {service.duration}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-light)', fontWeight: 600 }}>Starting at {service.price}</span>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '3rem', display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
        
        
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>About this service</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '1.1rem' }}>{service.description}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)' }}>
                <CheckCircle2 /> What's Included
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0 }}>
                {service.included.map((item, i) => (
                  <li key={i} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--secondary)', marginTop: '0.2rem' }}>•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                <XCircle /> What's Not Included
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0 }}>
                {service.notIncluded.map((item, i) => (
                  <li key={i} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: '#ef4444', marginTop: '0.2rem' }}>•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', background: 'rgba(79, 70, 229, 0.1)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-md)', color: 'var(--primary-light)' }}>
            <ShieldCheck size={24} />
            <div>
              <strong>Warranty Protection:</strong> {service.warranty}
            </div>
          </div>
        </section>

        
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Professionals for this service</h2>
          <TechnicianShowcase />
        </div>

        
        <div style={{ marginTop: '-4rem' }}>
          <Testimonials />
        </div>

        
        <div style={{ marginTop: '-4rem' }}>
          <FAQ />
        </div>

        
        {relatedServices.length > 0 && (
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Related Services</h2>
            <div className="popular-services-grid">
              {relatedServices.map((related) => (
                <div key={related.id} className="popular-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
                  <img src={related.image} alt={related.name} style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ fontWeight: 600 }}>{related.name}</h4>
                    <div style={{ color: 'var(--primary-light)', fontWeight: 600, fontSize: '0.9rem' }}>{related.price}</div>
                    <Link to={`/services/${category.slug}/${related.slug}`} style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'underline' }}>View details</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      
      <div style={{ 
        position: 'fixed', bottom: 0, left: 0, width: '100%', 
        background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', 
        borderTop: '1px solid var(--border)', padding: '1rem 0', zIndex: 40 
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{service.name}</div>
            <div style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{service.price}</div>
          </div>
          <button onClick={() => {
            if (!token || !user) {
              navigate('/auth/login?type=customer', { state: { from: location.pathname } });
            } else {
              navigate(`/book/${service.id}`);
            }
          }} className="btn btn-primary" style={{ padding: '0.75rem 2.5rem', fontSize: '1.1rem', textDecoration: 'none' }}>
            Book Now <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </main>
  );
}
