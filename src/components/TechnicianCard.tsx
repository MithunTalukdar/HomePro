import { Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Technician } from '../data';

interface TechnicianCardProps {
  technician: Technician;
  onClick: () => void;
}

export function TechnicianCard({ technician, onClick }: TechnicianCardProps) {
  return (
    <motion.div 
      layoutId={`card-container-${technician.id}`}
      className="tech-card" 
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div layoutId={`card-image-wrapper-${technician.id}`} className="tech-image-wrapper">
        <motion.img 
          layoutId={`card-image-${technician.id}`}
          src={technician.imageUrl} 
          alt={technician.name} 
          className="tech-image" 
        />
        <div className="tech-badge">
          <Star size={12} fill="#fbbf24" color="#fbbf24" />
          {technician.rating} ({technician.reviews})
        </div>
      </motion.div>
      <motion.div className="tech-content" layoutId={`card-content-${technician.id}`}>
        <div className="tech-header">
          <div>
            <motion.h3 layoutId={`card-name-${technician.id}`} className="tech-name">
              {technician.name} {technician.verified && <ShieldCheck color="var(--secondary)" size={18} />}
            </motion.h3>
            <span className="tech-role">{technician.role}</span>
          </div>
        </div>
        <div className="tech-stats">
          <div className="tech-stat">
            <span className="stat-val">{technician.experience}</span>
            <span className="stat-label">Experience</span>
          </div>
          <div className="tech-stat">
            <span className="stat-val">{technician.jobsCompleted}+</span>
            <span className="stat-label">Jobs</span>
          </div>
        </div>
        <div className="tech-skills">
          {technician.skills.slice(0, 3).map(skill => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
          {technician.skills.length > 3 && (
            <span className="skill-tag">+{technician.skills.length - 3}</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
