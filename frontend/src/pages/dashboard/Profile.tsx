import { useState, useEffect } from 'react';
import { Camera, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { fetchApi } from '../../services/api';

export function Profile() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [userProfile, setUserProfile] = useState<any>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await fetchApi('/users/profile');
      setUserProfile(data);
      setName(data.name);
      setPhone(data.phone);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await fetchApi('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, phone })
      });
      alert('Profile updated successfully');
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (isLoading) return <div>Loading profile...</div>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Profile Settings</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Update your personal information and security settings.</p>

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '2rem', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Personal Information</h2>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          <div style={{ position: 'relative' }}>
            <img src={userProfile?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} alt="Profile" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--border)' }} />
            <button style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--primary)', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <Camera size={18} />
            </button>
          </div>

          <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
              <input type="text" className="search-input" style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} value={name} onChange={e => setName(e.target.value)} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="email" disabled className="search-input" style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', paddingLeft: '2.5rem', opacity: 0.7 }} defaultValue={userProfile?.email} />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="tel" className="search-input" style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', paddingLeft: '2.5rem' }} value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <button className="btn btn-primary" onClick={handleUpdateProfile}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={20} /> Account Security</h2>
        
        <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Current Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} className="search-input" style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} placeholder="••••••••" />
              <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showNewPassword ? 'text' : 'password'} className="search-input" style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} placeholder="••••••••" />
              <button onClick={() => setShowNewPassword(!showNewPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <button className="btn btn-outline">Update Password</button>
          </div>
        </div>
      </div>
    </div>
  );
}
