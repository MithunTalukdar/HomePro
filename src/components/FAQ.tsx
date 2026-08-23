import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'Are all your professionals verified?',
    answer: 'Yes, every professional on our platform undergoes a rigorous background check, skills assessment, and identity verification before they can accept bookings.'
  },
  {
    question: 'How do I pay for the service?',
    answer: 'You can pay securely online through our platform after the service is completed, or choose to pay via cash directly to the professional.'
  },
  {
    question: 'What if I am not satisfied with the work?',
    answer: 'We offer a 30-day service warranty on all completed jobs. If you are not satisfied, we will send someone to fix the issue at no additional cost.'
  },
  {
    question: 'Can I reschedule or cancel my booking?',
    answer: 'Yes, you can reschedule or cancel your booking for free up to 2 hours before the scheduled time.'
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section bg-slate-900">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Everything you need to know about our services</p>
        </div>
        
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div 
                className="faq-question" 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                {faq.question}
                {openIndex === index ? <ChevronUp size={20} color="var(--primary-light)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
              </div>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="faq-answer">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
