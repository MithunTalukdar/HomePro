import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { History, Activity } from 'lucide-react';

export function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await fetchApi('/admin/audit-logs');
      setLogs(data);
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
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Audit Logs</h1>
          <p style={{ color: 'var(--text-muted)' }}>System-wide action history</p>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>Loading logs...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Timestamp</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Admin</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Action</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Target</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>
                      {log.adminName}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        background: 'rgba(79, 70, 229, 0.1)',
                        color: 'var(--primary-light)'
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {log.targetType} {log.targetId ? `(${log.targetId.slice(-6).toUpperCase()})` : ''}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {log.details || '-'}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No audit logs found.
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
