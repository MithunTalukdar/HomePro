import { useState, useEffect } from 'react';
import { Plus, MoreVertical, MapPin, Home, Briefcase } from 'lucide-react';
import { fetchApi } from '../../services/api';

export function Addresses() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await fetchApi('/users/addresses');
      setAddresses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading addresses...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Saved Addresses</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your service locations.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem' }}><Plus size={18} /> Add New Address</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {addresses.map(addr => (
          <div key={addr._id} style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: addr.isDefault ? '2px solid var(--primary)' : '1px solid var(--border)', position: 'relative' }}>
            {addr.isDefault && (
              <div style={{ position: 'absolute', top: '-10px', left: '1.5rem', background: 'var(--primary)', color: 'white', padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, borderRadius: 'var(--radius-full)' }}>
                Default
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary-light)' }}>
                {addr.label === 'Home' ? <Home size={24} /> : (addr.label === 'Office' ? <Briefcase size={24} /> : <MapPin size={24} />)}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>{addr.label}</h3>
              </div>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><MoreVertical size={20} /></button>
            </div>
            
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
              {addr.address}<br />
              {addr.city}, {addr.pincode}
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <button style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>Edit</button>
              <button style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>Delete</button>
              {!addr.isDefault && (
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', marginLeft: 'auto' }}>Set Default</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
