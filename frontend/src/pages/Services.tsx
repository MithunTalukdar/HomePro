import { useState, useEffect } from 'react';
import { Search, Filter, Star, Clock, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { categories, services } from '../data';
import { useLocationContext } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';

export function Services() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || null;

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'rating'>('recommended');
  const [isLoading, setIsLoading] = useState(true);

  const { city, area, openLocationModal } = useLocationContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const q = searchParams.get('search') || searchParams.get('q') || '';
    if (q) setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredServices = services
    .filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? s.categoryId === selectedCategory : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') {
        return parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''));
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });

  const handleBookNow = (serviceId: string) => {
    if (user) {
      navigate(`/book/${serviceId}`);
    } else {
      navigate('/auth/login?type=customer', { state: { from: `/book/${serviceId}` } });
    }
  };

  return (
    <main style={{ minHeight: '80vh', paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div className="container">
        {/* Location & Title Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <h1 className="section-title" style={{ marginBottom: '0.5rem', textAlign: 'left', fontSize: '2.5rem', fontWeight: 800 }}>
                All Available Services
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
                Transparent pricing, verified professionals, 30-day warranty & Cash on Delivery available
              </p>
            </div>

            {/* Location Badge */}
            <button
              type="button"
              onClick={openLocationModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.6rem 1.2rem',
                background: 'rgba(79, 70, 229, 0.12)',
                border: '1px solid rgba(79, 70, 229, 0.3)',
                borderRadius: 'var(--radius-full)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary-light)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.3)'}
            >
              <MapPin size={16} color="var(--accent-electric)" />
              <span>Available in: <strong style={{ color: 'var(--primary-light)' }}>{area}, {city}</strong></span>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(Change)</span>
            </button>
          </div>
          
          {/* Controls Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            
            <div className="search-input-group" style={{ background: 'var(--background)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', maxWidth: '420px', flex: '1 1 300px' }}>
              <Search size={20} color="var(--text-muted)" />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search services (e.g. Fan, AC, Plumbing...)" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <select 
                className="btn btn-outline" 
                style={{ background: 'var(--background)' }}
                value={selectedCategory || ''}
                onChange={e => setSelectedCategory(e.target.value || null)}
              >
                <option value="">All Categories ({categories.length})</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select 
                className="btn btn-outline" 
                style={{ background: 'var(--background)' }}
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Services Results Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <span>Showing <strong>{filteredServices.length}</strong> services</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10B981' }}>
            <CheckCircle size={14} /> Cash on Delivery Available on all services
          </span>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : filteredServices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <Filter size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>No services found</h3>
            <p>Try adjusting your search query or category filters.</p>
            <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="popular-services-grid" style={{ marginBottom: '4rem' }}>
            {filteredServices.map((service, index) => (
              <motion.div 
                key={service.id} 
                className="popular-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--surface)',
                  borderRadius: '1.25rem',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div className="popular-image-wrapper" style={{ position: 'relative', paddingTop: '58%', overflow: 'hidden', background: '#0f172a' }}>
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    onError={(e) => {
                      e.currentTarget.src = `/images/services/${service.slug}.jpg`;
                    }}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,17,32,0.9) 0%, transparent 60%)', pointerEvents: 'none' }} />
                  
                  <span style={{ 
                    position: 'absolute', top: '0.75rem', right: '0.75rem', 
                    background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)',
                    padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', 
                    fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-light)',
                    border: '1px solid rgba(79, 70, 229, 0.4)'
                  }}>
                    {service.categorySlug.toUpperCase().replace('-', ' ')}
                  </span>
                </div>

                <div className="popular-content" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div className="popular-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 className="popular-title" style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, flex: 1, paddingRight: '0.5rem' }}>
                      {service.name}
                    </h3>
                    <span className="popular-price" style={{ fontWeight: 800, color: 'var(--primary-light)', fontSize: '1.2rem' }}>
                      {service.price}
                    </span>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {service.description}
                  </p>

                  <div className="popular-meta" style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={15} /> {service.duration}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Star size={15} fill="var(--warning)" color="var(--warning)" /> {service.rating.toFixed(1)} ({service.reviews})
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: 'auto', color: 'var(--secondary)' }}>
                      <ShieldCheck size={14} /> 30d Warranty
                    </span>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                    <Link 
                      to={`/services/${service.categorySlug}/${service.slug}`} 
                      className="btn btn-outline" 
                      style={{ flex: 1, justifyContent: 'center', padding: '0.65rem 0.5rem', fontSize: '0.85rem' }}
                    >
                      Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleBookNow(service.id)}
                      className="btn btn-primary"
                      style={{ flex: 1, justifyContent: 'center', padding: '0.65rem 0.5rem', fontSize: '0.85rem' }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
