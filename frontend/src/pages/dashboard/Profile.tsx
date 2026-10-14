import { useState, useEffect } from 'react';
import { Camera, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { fetchApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Skeleton } from '../../components/common/Skeleton';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export function Profile() {
  const { updateUser } = useAuth();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [userProfile, setUserProfile] = useState<any>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await fetchApi('/users/profile');
      setUserProfile(data);
      setName(data.name || '');
      setPhone(data.phone || '');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdatingProfile) return;

    if (!name.trim()) {
      toast.warning('Full name cannot be empty.', 'Validation');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const updated = await fetchApi('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() })
      });
      setUserProfile((prev: any) => ({ ...prev, ...updated }));
      updateUser({ name: updated.name, phone: updated.phone });
      toast.success('Your profile has been updated successfully!', 'Changes Saved');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile.', 'Update Failed');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUpdatingPassword) return;

    if (!currentPassword) {
      toast.warning('Please enter your current password.', 'Validation');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.warning('New password must be at least 6 characters long.', 'Validation');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await fetchApi('/users/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      toast.success('Your password has been changed successfully.', 'Password Updated');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Incorrect current password or update failed.', 'Password Error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ maxWidth: '800px', padding: '0.5rem 0' }}>
        <Skeleton width="220px" height="2rem" style={{ marginBottom: '0.5rem' }} />
        <Skeleton width="380px" height="1rem" style={{ marginBottom: '2rem' }} />
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '2rem', marginBottom: '2rem' }}>
          <Skeleton width="180px" height="1.25rem" style={{ marginBottom: '1.5rem' }} />
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <Skeleton variant="circular" width={120} height={120} />
            <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Skeleton height="2.5rem" />
              <Skeleton height="2.5rem" />
              <Skeleton width="140px" height="2.5rem" borderRadius="var(--radius-full)" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px' }} className="animate-fade-in">
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: 800 }}>Profile Settings</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Update your personal information and security settings.</p>

      {/* Personal Information Card */}
      <form onSubmit={handleUpdateProfile} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '2rem', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>Personal Information</h2>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          <div style={{ position: 'relative' }}>
            <img 
              src={userProfile?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} 
              alt="Profile" 
              style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--border)' }} 
            />
            <button 
              type="button"
              title="Change Profile Photo"
              style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--primary)', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)' }}
            >
              <Camera size={18} />
            </button>
          </div>

          <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>Full Name</label>
              <input 
                type="text" 
                className="search-input" 
                style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem' }} 
                value={name} 
                onChange={e => setName(e.target.value)} 
                disabled={isUpdatingProfile}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="email" 
                    disabled 
                    className="search-input" 
                    style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', paddingLeft: '2.5rem', opacity: 0.65, cursor: 'not-allowed' }} 
                    defaultValue={userProfile?.email} 
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="tel" 
                    className="search-input" 
                    style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', paddingLeft: '2.5rem' }} 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    disabled={isUpdatingProfile}
                  />
                </div>
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isUpdatingProfile}
                style={{ opacity: isUpdatingProfile ? 0.7 : 1, cursor: isUpdatingProfile ? 'not-allowed' : 'pointer' }}
              >
                {isUpdatingProfile ? <LoadingSpinner size="sm" color="#fff" label="Saving..." /> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Account Security Card */}
      <form onSubmit={handleChangePassword} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}><Lock size={20} color="var(--primary-light)" /> Account Security</h2>
        
        <div style={{ maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>Current Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="search-input" 
                style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.75rem 2.5rem 0.75rem 1rem' }} 
                placeholder="••••••••" 
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                disabled={isUpdatingPassword}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showNewPassword ? 'text' : 'password'} 
                className="search-input" 
                style={{ width: '100%', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.75rem 2.5rem 0.75rem 1rem' }} 
                placeholder="At least 6 characters" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                disabled={isUpdatingPassword}
              />
              <button 
                type="button" 
                onClick={() => setShowNewPassword(!showNewPassword)} 
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              className="btn btn-outline"
              disabled={isUpdatingPassword}
              style={{ opacity: isUpdatingPassword ? 0.7 : 1, cursor: isUpdatingPassword ? 'not-allowed' : 'pointer' }}
            >
              {isUpdatingPassword ? <LoadingSpinner size="sm" label="Updating..." /> : 'Update Password'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
