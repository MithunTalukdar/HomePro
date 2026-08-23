import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, MapPin, FileText, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../../services/api';

const steps = [
  { id: 1, title: 'Personal', icon: User },
  { id: 2, title: 'Professional', icon: Briefcase },
  { id: 3, title: 'Service Areas', icon: MapPin },
  { id: 4, title: 'Documents', icon: FileText }
];

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    bio: '',
    experienceYears: '',
    skills: '',
    serviceAreas: '',
    idProofUrl: '',
    certificationUrl: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()),
        serviceAreas: formData.serviceAreas.split(',').map(s => s.trim()),
        experienceYears: Number(formData.experienceYears),
        documents: {
          idProofUrl: formData.idProofUrl,
          certificationUrl: formData.certificationUrl
        }
      };

      await fetchApi('/technicians/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      // Auto-login logic can be added here or redirect to a success page
      alert('Registration successful! Please login.');
      navigate('/auth/login');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '80px', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>
          Become a <span style={{ color: 'var(--primary)' }}>Technician</span>
        </h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '24px', left: '0', right: '0', height: '2px', background: 'var(--border)', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: '24px', left: '0', height: '2px', background: 'var(--primary)', zIndex: 1, width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`, transition: 'width 0.3s ease' }} />
          
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = step.id <= currentStep;
            return (
              <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: isActive ? 'var(--primary)' : 'var(--surface)', border: isActive ? 'none' : '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? 'white' : 'var(--text-muted)', marginBottom: '0.5rem', transition: 'all 0.3s ease' }}>
                  {step.id < currentStep ? <CheckCircle size={24} /> : <Icon size={24} />}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: isActive ? 'var(--text)' : 'var(--text-muted)' }}>{step.title}</span>
              </div>
            );
          })}
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', border: '1px solid var(--border)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Personal Information</h3>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
                    <input type="text" name="name" className="search-input" style={{ width: '100%', background: 'var(--background)' }} value={formData.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
                    <input type="email" name="email" className="search-input" style={{ width: '100%', background: 'var(--background)' }} value={formData.email} onChange={handleChange} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Phone</label>
                    <input type="tel" name="phone" className="search-input" style={{ width: '100%', background: 'var(--background)' }} value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
                    <input type="password" name="password" className="search-input" style={{ width: '100%', background: 'var(--background)' }} value={formData.password} onChange={handleChange} required />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Professional Details</h3>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Bio</label>
                    <textarea name="bio" className="search-input" style={{ width: '100%', background: 'var(--background)', minHeight: '100px', resize: 'vertical' }} value={formData.bio} onChange={handleChange} placeholder="Tell customers about your experience..." required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Years of Experience</label>
                    <input type="number" name="experienceYears" className="search-input" style={{ width: '100%', background: 'var(--background)' }} value={formData.experienceYears} onChange={handleChange} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Skills (comma separated)</label>
                    <input type="text" name="skills" className="search-input" style={{ width: '100%', background: 'var(--background)' }} placeholder="e.g. Electrical Wiring, Plumbing, AC Repair" value={formData.skills} onChange={handleChange} required />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Service Areas</h3>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Locations or Zip Codes (comma separated)</label>
                    <input type="text" name="serviceAreas" className="search-input" style={{ width: '100%', background: 'var(--background)' }} placeholder="e.g. Downtown, 10001, Northside" value={formData.serviceAreas} onChange={handleChange} required />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Documents</h3>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>ID Proof URL</label>
                    <input type="text" name="idProofUrl" className="search-input" style={{ width: '100%', background: 'var(--background)' }} placeholder="https://..." value={formData.idProofUrl} onChange={handleChange} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Certification/License URL</label>
                    <input type="text" name="certificationUrl" className="search-input" style={{ width: '100%', background: 'var(--background)' }} placeholder="https://..." value={formData.certificationUrl} onChange={handleChange} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <button className="btn" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: currentStep === 1 ? 0 : 1, pointerEvents: currentStep === 1 ? 'none' : 'auto' }} onClick={handlePrev}>
              <ArrowLeft size={20} /> Back
            </button>
            
            {currentStep < steps.length ? (
              <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={handleNext}>
                Continue <ArrowRight size={20} />
              </button>
            ) : (
              <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Complete Registration'} <CheckCircle size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
