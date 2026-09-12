import { useState, useEffect } from 'react';
import { Search, Filter, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categories, services } from '../data';

export function Services() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'rating'>('recommended');
  
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredServices = services
    .filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
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

  return (
    <main style={{ minHeight: '80vh', paddingTop: '2rem' }}>
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <h1 className="section-title" style={{ marginBottom: '1rem', textAlign: 'left' }}>Our Services</h1>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            
            <div className="search-input-group" style={{ background: 'var(--background)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', maxWidth: '400px', flex: '1 1 300px' }}>
              <Search size={20} />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search services..." 
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
                <option value="">All Categories</option>
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

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : filteredServices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <Filter size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>No services found</h3>
            <p>Try adjusting your search or filters.</p>
            <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => {setSearchQuery(''); setSelectedCategory(null);}}>Clear Filters</button>
          </div>
        ) : (
          <div className="popular-services-grid" style={{ marginBottom: '4rem' }}>
            {filteredServices.map((service, index) => (
              <motion.div 
                key={service.id} 
                className="popular-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="popular-image-wrapper">
                  <img src={service.image} alt={service.name} className="popular-image" />
                </div>
                <div className="popular-content">
                  <div className="popular-header">
                    <h3 className="popular-title">{service.name}</h3>
                    <span className="popular-price">{service.price}</span>
                  </div>
                  <div className="popular-meta">
                    <span><Clock size={16} /> {service.duration}</span>
                    <span><Star size={16} fill="#fbbf24" color="#fbbf24" /> {service.rating.toFixed(1)} ({service.reviews})</span>
                  </div>
                  <Link to={`/services/${service.categorySlug}/${service.slug}`} className="btn btn-outline w-full" style={{ justifyContent: 'center' }}>View Details</Link>
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
