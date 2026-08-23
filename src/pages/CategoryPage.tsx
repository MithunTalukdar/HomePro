import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Clock, ChevronRight, Zap, Droplets, Wind, Wrench, Camera, Droplet, Sparkles, PenTool, ShieldCheck, DollarSign, Headset } from 'lucide-react';
import { motion } from 'framer-motion';
import { categories, services as allServices } from '../data';
import { SEO } from '../components/SEO';

const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap size={32} />,
  Droplets: <Droplets size={32} />,
  Wind: <Wind size={32} />,
  Wrench: <Wrench size={32} />,
  Camera: <Camera size={32} />,
  Droplet: <Droplet size={32} />,
  Sparkles: <Sparkles size={32} />,
  Tool: <PenTool size={32} />
};

export function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'rating'>('recommended');
  const [isLoading, setIsLoading] = useState(true);

  const category = categories.find(c => c.slug === categorySlug);

  useEffect(() => {
    if (!category && !isLoading) {
      navigate('/services', { replace: true });
    }
  }, [category, isLoading, navigate]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [categorySlug]);

  if (!category) {
    return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="dot-pulse">...</span></div>;
  }

  const categoryServices = allServices.filter(s => s.categorySlug === categorySlug);

  const filteredServices = categoryServices
    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') {
        return parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''));
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });

  return (
    <main>
      <SEO 
        title={`${category.name} Services`} 
        description={category.longDescription} 
        keywords={`${category.name.toLowerCase()}, home service, repair, installation`} 
      />

      {/* Breadcrumbs */}
      <div style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/services" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Services</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-main)' }}>{category.name}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section style={{ position: 'relative', padding: '6rem 0', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1,
          backgroundImage: `url(${category.image})`, backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, background: 'linear-gradient(to right, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.7) 100%)' }} />
        
        <div className="container">
          <div style={{ maxWidth: '600px' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(79, 70, 229, 0.2)', color: 'var(--primary)', marginBottom: '1.5rem', backdropFilter: 'blur(10px)' }}
            >
              {iconMap[category.icon]}
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: 'white', letterSpacing: '-0.02em' }}
            >
              {category.name} Services
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', lineHeight: 1.6 }}
            >
              {category.longDescription}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ display: 'flex', gap: '0.5rem', background: 'rgba(30, 41, 59, 0.8)', padding: '0.5rem', borderRadius: 'var(--radius-full)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '1rem' }}>
                <Search size={20} color="rgba(255,255,255,0.5)" />
                <input 
                  type="text" 
                  placeholder={`Search ${category.name} services...`}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: 'none', color: 'white', outline: 'none' }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Listing */}
      <section className="section bg-slate-900">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title" style={{ margin: 0, textAlign: 'left' }}>Available Services</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sort by:</span>
              <select 
                className="btn btn-outline" 
                style={{ background: 'var(--surface)', padding: '0.5rem 1rem' }}
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
              <span className="dot-pulse">...</span>
            </div>
          ) : filteredServices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
              <Filter size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>No services found</h3>
              <p>We couldn't find any services matching "{searchQuery}" in {category.name}.</p>
            </div>
          ) : (
            <div className="popular-services-grid">
              {filteredServices.map((service, index) => (
                <motion.div 
                  key={service.id} 
                  className="popular-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  <div 
                    onClick={() => navigate(`/services/${category.slug}/${service.slug}`)} 
                    style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1, cursor: 'pointer' }}
                  >
                    <div className="popular-image-wrapper">
                      <img src={service.image} alt={service.name} className="popular-image" />
                    </div>
                    <div className="popular-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div className="popular-header">
                        <h3 className="popular-title">{service.name}</h3>
                        <span className="popular-price">{service.price}</span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', flex: 1 }}>{service.description}</p>
                      <div className="popular-meta" style={{ marginBottom: '1.5rem' }}>
                        <span><Clock size={16} /> {service.duration}</span>
                        <span><Star size={16} fill="#fbbf24" color="#fbbf24" /> {service.rating.toFixed(1)} ({service.reviews})</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Details</div>
                        <button 
                          className="btn btn-primary" 
                          style={{ flex: 1, justifyContent: 'center' }} 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!localStorage.getItem('token')) {
                              navigate('/auth/login?type=customer', { state: { from: { pathname: `/book/${service.id}` } } });
                            } else {
                              navigate(`/book/${service.id}`);
                            }
                          }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div style={{ padding: '2rem' }}>
              <div style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Verified Professionals</h3>
              <p style={{ color: 'var(--text-muted)' }}>All our technicians are background checked and certified.</p>
            </div>
            <div style={{ padding: '2rem' }}>
              <div style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Transparent Pricing</h3>
              <p style={{ color: 'var(--text-muted)' }}>No hidden costs. You know exactly what you're paying for.</p>
            </div>
            <div style={{ padding: '2rem' }}>
              <div style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Headset size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>24/7 Customer Support</h3>
              <p style={{ color: 'var(--text-muted)' }}>We are always here to help if something goes wrong.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
