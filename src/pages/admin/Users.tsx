import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { Search, ShieldAlert, CheckCircle, MoreVertical } from 'lucide-react';

export function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchApi('/admin/users');
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Users Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage all customer accounts</p>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search users..." 
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
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Name</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Contact Info</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Joined Date</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {user.name.charAt(0)}
                        </div>
                        <div style={{ fontWeight: 500 }}>{user.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div>{user.email}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{user.phone}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981'
                      }}>
                        Active
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No users found.
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
