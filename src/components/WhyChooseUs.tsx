import { ShieldCheck, CircleDollarSign, CheckCircle, Award, Lock, HeadphonesIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: ShieldCheck, title: 'Verified Professionals', desc: 'Background checked and rigorously tested.' },
  { icon: CircleDollarSign, title: 'Transparent Pricing', desc: 'No hidden fees or surprise charges.' },
  { icon: CheckCircle, title: 'Pay After Service', desc: 'Pay only when the job is done right.' },
  { icon: Award, title: 'Service Warranty', desc: '30-day warranty on all completed jobs.' },
  { icon: Lock, title: 'Secure Booking', desc: 'Your data and payments are 100% safe.' },
  { icon: HeadphonesIcon, title: 'Customer Support', desc: '24/7 support for any queries.' },
];

export function WhyChooseUs() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">We deliver premium service with complete peace of mind.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '1.5rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
              whileHover={{ y: -5, borderColor: 'var(--primary)' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', flexShrink: 0 }}>
                <feature.icon size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
