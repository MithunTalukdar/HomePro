import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

export function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    startingPrice: '',
    estimatedDuration: '',
    description: '',
    image: '',
    isActive: true
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadServices();
    loadCategories();
  }, []);

  const loadServices = async () => {
    try {
      const data = await fetchApi('/services');
      setServices(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchApi('/services/categories');
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (service: any = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        category: service.category?._id || service.category,
        startingPrice: service.startingPrice,
        estimatedDuration: service.estimatedDuration,
        description: service.description,
        image: service.image || '',
        isActive: service.isActive
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        category: '',
        startingPrice: '',
        estimatedDuration: '',
        description: '',
        image: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editingService) {
        await fetchApi(`/admin/services/${editingService._id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await fetchApi('/admin/services', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      handleCloseModal();
      loadServices();
    } catch (error) {
      console.error(error);
      alert('Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete ${title}?`)) {
      try {
        await fetchApi(`/admin/services/${id}`, {
          method: 'DELETE'
        });
        loadServices();
      } catch (error) {
        console.error(error);
        alert('Failed to delete service');
      }
    }
  };
  const filteredServices = services.filter(s => s.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Service Catalog</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage categories, services, and pricing</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                {filteredServices.map((service) => (
                  <tr key={service._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {service.image && (
                          <img src={service.image} alt={service.title} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                        )}
                        {service.title}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{service.category?.name || 'Uncategorized'}</td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>₹{service.startingPrice}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{service.estimatedDuration}</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <button onClick={() => handleOpenModal(service)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginRight: '1rem' }} title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(service._id, service.title)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredServices.length === 0 && (
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

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#111827', border: '1px solid #1f2937', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '700px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', zIndex: 1001 }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #1f2937' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#f9fafb', margin: 0 }}>{editingService ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', padding: '4px' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ overflowY: 'auto', paddingRight: '8px' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db', marginBottom: '8px' }}>Service Title</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required 
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', padding: '12px', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db', marginBottom: '8px' }}>Category</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required 
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', padding: '12px', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }}
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db', marginBottom: '8px' }}>Starting Price (₹)</label>
                    <input 
                      type="number" 
                      value={formData.startingPrice} 
                      onChange={(e) => setFormData({...formData, startingPrice: e.target.value})}
                      required 
                      style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', padding: '12px', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db', marginBottom: '8px' }}>Estimated Duration</label>
                    <input 
                      type="text" 
                      value={formData.estimatedDuration} 
                      onChange={(e) => setFormData({...formData, estimatedDuration: e.target.value})}
                      required 
                      placeholder="e.g. 2 hours"
                      style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', padding: '12px', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db', marginBottom: '8px' }}>Image URL</label>
                  <input 
                    type="text" 
                    value={formData.image} 
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', padding: '12px', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db', marginBottom: '8px' }}>Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required 
                    style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', color: '#F8FAFC', padding: '12px', borderRadius: '6px', fontSize: '1rem', minHeight: '100px', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #1f2937' }}>
                  <button type="button" onClick={handleCloseModal} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid #4b5563', borderRadius: '6px', color: '#e5e7eb', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.875rem', borderRadius: '6px' }}>
                    {submitting ? 'Saving...' : 'Save Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
