import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { LifeBuoy, Plus, MessageCircle } from 'lucide-react';

export function Support() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'TICKETS' | 'WARRANTY'>('TICKETS');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    issueType: 'General',
    subject: '',
    description: '',
    bookingId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tData, cData] = await Promise.all([
        fetchApi('/support/tickets'),
        fetchApi('/support/warranty')
      ]);
      setTickets(tData);
      setClaims(cData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'TICKETS') {
        await fetchApi('/support/tickets', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      } else {
        await fetchApi('/support/warranty', {
          method: 'POST',
          body: JSON.stringify({ bookingId: formData.bookingId, issueDescription: formData.description })
        });
      }
      setIsModalOpen(false);
      setFormData({ issueType: 'General', subject: '', description: '', bookingId: '' });
      loadData();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Help & Support</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your support tickets and warranty claims</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> {activeTab === 'TICKETS' ? 'New Ticket' : 'File Claim'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('TICKETS')}
          style={{ 
            background: 'none', border: 'none', padding: '1rem 0', fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
            color: activeTab === 'TICKETS' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'TICKETS' ? '2px solid var(--primary)' : '2px solid transparent'
          }}
        >
          Support Tickets
        </button>
        <button 
          onClick={() => setActiveTab('WARRANTY')}
          style={{ 
            background: 'none', border: 'none', padding: '1rem 0', fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
            color: activeTab === 'WARRANTY' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'WARRANTY' ? '2px solid var(--primary)' : '2px solid transparent'
          }}
        >
          Warranty Claims
        </button>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{activeTab === 'TICKETS' ? 'Ticket ID / Type' : 'Claim ID / Booking'}</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'TICKETS' ? tickets : claims).map((item) => (
                  <tr key={item._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: 600 }}>#{item._id.slice(-6).toUpperCase()}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {activeTab === 'TICKETS' ? item.issueType : (item.bookingId ? 'Ref: ' + item.bookingId.slice(-6) : '')}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        background: (item.status === 'OPEN' || item.status === 'PENDING') ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: (item.status === 'OPEN' || item.status === 'PENDING') ? '#3b82f6' : '#10b981'
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {activeTab === 'TICKETS' ? item.subject : item.issueDescription}
                    </td>
                  </tr>
                ))}
                {(activeTab === 'TICKETS' ? tickets : claims).length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No {activeTab === 'TICKETS' ? 'tickets' : 'claims'} found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--surface)', width: '100%', maxWidth: '500px', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              {activeTab === 'TICKETS' ? 'Create Support Ticket' : 'File Warranty Claim'}
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeTab === 'TICKETS' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Issue Type</label>
                  <select 
                    value={formData.issueType}
                    onChange={(e) => setFormData({...formData, issueType: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)' }}
                  >
                    <option value="General">General Inquiry</option>
                    <option value="Booking">Booking Issue</option>
                    <option value="Payment">Payment Issue</option>
                    <option value="Technician">Technician Feedback</option>
                    <option value="Refund">Refund Request</option>
                  </select>
                </div>
              )}

              {activeTab === 'TICKETS' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Subject</label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="search-input"
                    style={{ width: '100%', background: 'var(--background)', padding: '0.75rem 1rem' }}
                  />
                </div>
              )}

              {activeTab === 'WARRANTY' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Booking ID</label>
                  <input 
                    type="text" 
                    required
                    value={formData.bookingId}
                    onChange={(e) => setFormData({...formData, bookingId: e.target.value})}
                    className="search-input"
                    placeholder="Enter Booking ID"
                    style={{ width: '100%', background: 'var(--background)', padding: '0.75rem 1rem' }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="search-input"
                  style={{ width: '100%', background: 'var(--background)', padding: '1rem', resize: 'none' }}
                  placeholder="Please describe the issue in detail..."
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
