import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { Search, MoreVertical, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';

export function Technicians() {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadTechnicians();
  }, []);

  const loadTechnicians = async () => {
    try {
      const data = await fetchApi('/admin/technicians');
      setTechnicians(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, newStatus: string) => {
    try {
      await fetchApi(`/admin/technicians/${id}/approve`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      loadTechnicians();
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    }
  };

  const filtered = technicians.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Technicians Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Review and approve professional applications</p>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search technicians..." 
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
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Technician</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Experience</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Jobs (Assigned/Completed)</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Verification</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tech) => (
                  <tr key={tech._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {tech.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{tech.name}</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{tech.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div>{tech.profile?.experience || 'Not set'}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontSize: '0.875rem' }}>
                        <span style={{ color: '#3b82f6', fontWeight: 600 }}>{tech.stats?.assignedJobs || 0}</span> assigned<br/>
                        <span style={{ color: '#10b981', fontWeight: 600 }}>{tech.stats?.completedJobs || 0}</span> completed
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {tech.profile?.verificationStatus === 'VERIFIED' ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.875rem', fontWeight: 600 }}>
                          <ShieldCheck size={16} /> Verified
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.875rem', fontWeight: 600 }}>
                          <AlertCircle size={16} /> {tech.profile?.verificationStatus || 'PENDING'}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      {tech.profile?.verificationStatus === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleApprove(tech._id, 'VERIFIED')}
                            className="btn btn-primary"
                            style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', marginRight: '0.5rem' }}
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleApprove(tech._id, 'REJECTED')}
                            className="btn btn-primary"
                            style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', marginRight: '0.5rem', background: '#ef4444', borderColor: '#ef4444' }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No technicians found.
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
