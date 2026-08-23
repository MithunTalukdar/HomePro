import { motion } from 'framer-motion';

export function Statistics() {
  const stats = [
    { number: '10,000+', label: 'Services Completed' },
    { number: '500+', label: 'Verified Professionals' },
    { number: '4.8', label: 'Average Rating' },
    { number: '24/7', label: 'Customer Support' },
  ];

  return (
    <section className="section trust-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
