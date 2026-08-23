import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { Search, Filter, MoreVertical } from 'lucide-react';

export function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await fetchApi('/admin/bookings');
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => filter === 'ALL' ? true : b.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Bookings Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Monitor and assign service requests</p>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              className="search-input"
              style={{ width: '100%', paddingLeft: '2.75rem', background: 'var(--background)' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} color="var(--text-muted)" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ background: 'var(--background)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}
            >
              <option value="ALL">All Status</option>
              <option value="REQUESTED">Requested</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>ID / Date</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Service</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Customer Info</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: 600 }}>#{booking._id.slice(-6).toUpperCase()}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{booking.date} | {booking.timeSlot}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>
                      {booking.serviceName}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div>{booking.address?.address}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{booking.address?.city} - {booking.address?.pincode}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        background: booking.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : 
                                    booking.status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: booking.status === 'COMPLETED' ? '#10b981' : 
                               booking.status === 'CANCELLED' ? '#ef4444' : '#3b82f6'
                      }}>
                        {booking.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      {booking.status === 'REQUESTED' && (
                        <button className="btn btn-primary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', marginRight: '0.5rem' }}>
                          Assign
                        </button>
                      )}
                      <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No bookings found matching criteria.
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
