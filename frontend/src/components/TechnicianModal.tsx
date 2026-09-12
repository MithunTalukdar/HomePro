import { useEffect } from 'react';
import { X, Star, Calendar, ShieldCheck, CheckCircle2, Clock, MapPin, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Technician } from '../data';

interface TechnicianModalProps {
  technician: Technician;
  onClose: () => void;
}

export function TechnicianModal({ technician, onClose }: TechnicianModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ animation: 'none', background: 'rgba(15, 23, 42, 0.9)' }}>
      <motion.div 
        layoutId={`card-container-${technician.id}`}
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'none', background: 'var(--surface)' }}
      >
        <button className="modal-close" onClick={onClose} style={{ zIndex: 100 }}>
          <X size={20} />
        </button>
        
        <div className="modal-grid">
          <motion.div layoutId={`card-image-wrapper-${technician.id}`} className="modal-hero">
            <motion.img 
              layoutId={`card-image-${technician.id}`}
              src={technician.imageUrl} 
              alt={technician.name} 
              className="modal-image" 
            />
          </motion.div>
          <motion.div className="modal-body" layoutId={`card-content-${technician.id}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <motion.h2 layoutId={`card-name-${technician.id}`} className="modal-name">
                  {technician.name} {technician.verified && <ShieldCheck color="var(--secondary)" size={28} />}
                </motion.h2>
                <div className="modal-role">{technician.role}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star fill="#fbbf24" color="#fbbf24" size={20} />
                <span style={{ fontWeight: 'bold' }}>{technician.rating}</span>
                <span style={{ color: 'var(--text-muted)' }}>({technician.reviews} reviews)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: technician.availability === 'Available Now' ? 'var(--secondary)' : 'var(--primary-light)' }}>
                {technician.availability === 'Available Now' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                <span style={{ fontWeight: '500' }}>{technician.availability}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <MapPin size={18} /> {technician.serviceAreas[0]}
              </div>
            </div>
            
            <h3 className="modal-section-title">About</h3>
            <p className="modal-desc">{technician.bio}</p>

            <div className="tech-stats" style={{ border: 'none', paddingBottom: 0, marginBottom: '1.5rem' }}>
              <div className="tech-stat">
                <span className="stat-val">{technician.experience}</span>
                <span className="stat-label">Years of Experience</span>
              </div>
              <div className="tech-stat">
                <span className="stat-val">{technician.jobsCompleted}+</span>
                <span className="stat-label">Jobs Completed successfully</span>
              </div>
              <div className="tech-stat">
                <span className="stat-val" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Globe size={18} /> {technician.languages.length}</span>
                <span className="stat-label">{technician.languages.join(', ')}</span>
              </div>
            </div>
            
            <h3 className="modal-section-title">Expertise</h3>
            <div className="tech-skills" style={{ marginBottom: '2rem' }}>
              {technician.skills.map(skill => (
                <span key={skill} className="skill-tag" style={{ fontSize: '0.875rem', padding: '0.45rem 1rem' }}>
                  {skill}
                </span>
              ))}
            </div>
            
            <div className="modal-actions">
              <button className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                <Calendar size={18} /> View Schedule
              </button>
              <button className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                <CheckCircle2 size={18} /> Book Now
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
