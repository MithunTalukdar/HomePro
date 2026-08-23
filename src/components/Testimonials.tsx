import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { testimonials } from '../data';

export function Testimonials() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Real reviews from people who used our services</p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={testimonial.id}
              className="testimonial-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="testimonial-header">
                <div>
                  <div className="testimonial-name">{testimonial.name}</div>
                  <div className="testimonial-location">{testimonial.location}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.1rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < testimonial.rating ? "#fbbf24" : "transparent"} 
                      color={i < testimonial.rating ? "#fbbf24" : "var(--border)"} 
                    />
                  ))}
                </div>
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {testimonial.date}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
