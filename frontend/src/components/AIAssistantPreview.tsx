import { Bot, User, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function AIAssistantPreview() {
  return (
    <section className="section">
      <div className="container">
        <div className="ai-section">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', marginBottom: '1.5rem', color: 'var(--primary-light)', fontWeight: 600 }}>
              <Sparkles size={18} /> New Feature
            </div>
            <h2 className="section-title">Meet Your AI Service Assistant</h2>
            <p className="section-subtitle" style={{ color: 'white' }}>Describe your problem, and our AI will instantly recommend the right service and professionals.</p>
          </motion.div>
          
          <motion.div 
            className="ai-chat-box"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="ai-message">
              <div className="ai-avatar user-avatar">
                <User size={20} />
              </div>
              <div className="user-bubble">
                "My fan is making a strange noise and not spinning properly."
              </div>
            </div>
            
            <div className="ai-message">
              <div className="ai-avatar">
                <Bot size={20} />
              </div>
              <div className="ai-bubble">
                I can help with that. It sounds like a motor issue or capacitor failure. I recommend our <strong>Fan Repair</strong> service.
                
                <div className="ai-suggestion">
                  <div>
                    <h4 style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Fan Repair</h4>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Starting from ₹149</span>
                  </div>
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                    Find a Technician <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
