import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

export function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await fetchApi('/services'); // use public endpoint for listing
      setServices(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Service Catalog</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage categories, services, and pricing</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Service
        </button>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search services..." 
              className="search-input"
              style={{ width: '100%', paddingLeft: '2.75rem', background: 'var(--background)' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Service Name</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Base Price</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Duration</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{service.title}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{service.category?.name || 'Uncategorized'}</td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>₹{service.startingPrice}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{service.estimatedDuration}</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginRight: '1rem' }} title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No services found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
