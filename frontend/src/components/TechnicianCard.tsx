import { Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Technician } from '../data';

interface TechnicianCardProps {
  technician: Technician;
  onClick?: () => void;
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

      <div className="tech-info">
        <div className="tech-header">
          <h3 className="tech-name">{technician.name}</h3>
          <ShieldCheck size={18} className="verified-badge" />
        </div>

        <p className="tech-specialty">{technician.role}</p>

        <div className="tech-meta">
          <span className="experience-pill">{technician.experience}</span>
          <span className="price-tag">{technician.availability}</span>
        </div>

        <p className="tech-bio">{technician.bio}</p>

        <div className="skills-container">
          {technician.skills.map((skill, index) => (
            <span key={index} className="skill-pill">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
