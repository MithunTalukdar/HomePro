import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TechnicianCard } from './TechnicianCard';
import { TechnicianModal } from './TechnicianModal';
import { technicians } from '../data';

export function TechnicianShowcase() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const selectedTech = technicians.find(t => t.id === selectedId) || null;

  return (
    <section className="section bg-slate-900" style={{ position: 'relative' }}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Top-Rated Professionals</h2>
          <p className="section-subtitle">Meet our highly skilled and vetted technicians ready to help you</p>
        </div>
        
        <div className="tech-grid">
          {technicians.map((tech) => (
            <TechnicianCard 
              key={tech.id} 
              technician={tech} 
              onClick={() => setSelectedId(tech.id)} 
            />
          ))}
        </div>

        <AnimatePresence>
          {selectedId && selectedTech && (
            <TechnicianModal 
              technician={selectedTech} 
              onClose={() => setSelectedId(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
