import { MousePointerClick, CalendarDays, Wrench, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  { icon: MousePointerClick, title: 'Choose Service', desc: 'Select the service you need from our extensive list.' },
  { icon: CalendarDays, title: 'Select Date & Time', desc: 'Pick a convenient slot that works for your schedule.' },
  { icon: Wrench, title: 'Get a Professional', desc: 'A vetted expert arrives at your doorstep on time.' },
  { icon: CheckCircle, title: 'Service Completed', desc: 'Pay only after you are completely satisfied.' },
];

export function HowItWorks() {
  return (
    <section className="section bg-slate-900">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Four simple steps to get your home services sorted</p>
        </div>
        
        <div className="timeline-container">
          {steps.map((step, index) => (
            <motion.div 
              key={step.title}
              className="timeline-item"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="timeline-icon">
                <step.icon size={28} />
              </div>
              {index !== steps.length - 1 && <div className="timeline-line"></div>}
              <div className="timeline-content">
                <h3 className="timeline-title">{step.title}</h3>
                <p className="timeline-desc">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
