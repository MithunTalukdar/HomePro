import { Home, Globe, Mail, MessageSquare, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer style={{ background: '#080D18', borderTop: '1px solid var(--border)', position: 'relative' }}>
      {/* Top Accent Line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--primary), var(--accent-electric), transparent)' }} />
      
      <div className="container" style={{ paddingTop: '5rem', paddingBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          <div style={{ gridColumn: '1 / -1', '@media (min-width: 768px)': { gridColumn: 'span 2' } } as any}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent-electric))', padding: '0.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: 'var(--shadow-glow)' }}>
                <Home size={22} strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.5px', color: '#fff' }}>
                Home<span style={{ color: 'var(--primary-light)' }}>Pro</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6', maxWidth: '300px' }}>
              The premium destination for all your home service needs. We connect you with top-rated professionals in your area.
            </p>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)' }}>
              <Globe size={20} style={{ cursor: 'pointer', transition: 'color var(--transition-smooth)' }} onMouseOver={e => e.currentTarget.style.color = 'var(--primary-light)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'} />
              <Mail size={20} style={{ cursor: 'pointer', transition: 'color var(--transition-smooth)' }} onMouseOver={e => e.currentTarget.style.color = 'var(--primary-light)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'} />
              <MessageSquare size={20} style={{ cursor: 'pointer', transition: 'color var(--transition-smooth)' }} onMouseOver={e => e.currentTarget.style.color = 'var(--primary-light)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'} />
              <Phone size={20} style={{ cursor: 'pointer', transition: 'color var(--transition-smooth)' }} onMouseOver={e => e.currentTarget.style.color = 'var(--primary-light)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'} />
            </div>
          </div>
          
          <div>
            <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '0.025em' }}>Services</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Electrical', 'Plumbing', 'HVAC', 'Cleaning', 'Handyman'].map(item => (
                <li key={item}>
                  <Link to={`/services`} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color var(--transition-smooth)', fontSize: '0.95rem' }} onMouseOver={e => (e.currentTarget.style.color = 'var(--primary-light)')} onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '0.025em' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['About Us', 'Careers', 'Blog', 'Contact'].map(item => (
                <li key={item}>
                  <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color var(--transition-smooth)', fontSize: '0.95rem' }} onMouseOver={e => (e.currentTarget.style.color = 'var(--primary-light)')} onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '0.025em' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Help Center', 'Trust & Safety', 'Terms of Service', 'Privacy Policy'].map(item => (
                <li key={item}>
                  <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color var(--transition-smooth)', fontSize: '0.95rem' }} onMouseOver={e => (e.currentTarget.style.color = 'var(--primary-light)')} onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} HomePro. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
