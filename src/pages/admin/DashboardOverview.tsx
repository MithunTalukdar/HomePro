import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { Users, Wrench, Calendar, DollarSign, Activity, CheckCircle } from 'lucide-react';

export function DashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await fetchApi('/admin/stats');
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>Loading stats...</div>;
  }

  const statCards = [
    { label: 'Total Customers', value: stats?.totalUsers || 0, icon: Users, color: '#3b82f6' },
    { label: 'Verified Techs', value: stats?.activeTechnicians || 0, icon: Wrench, color: '#10b981' },
    { label: 'Total Revenue', value: `₹${stats?.revenue?.toLocaleString() || 0}`, icon: DollarSign, color: '#8b5cf6' },
    { label: "Today's Bookings", value: stats?.todaysBookings || 0, icon: Activity, color: '#f59e0b' },
    { label: 'Active Bookings', value: stats?.activeBookings || 0, icon: Calendar, color: '#06b6d4' },
    { label: 'Completed Jobs', value: stats?.completedBookings || 0, icon: CheckCircle, color: '#14b8a6' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome back to the admin command center.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `${stat.color}20`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={28} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{stat.label}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Bookings</h2>
          {stats?.recentBookings?.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No recent bookings</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '1rem' }}>ID</th>
                    <th style={{ padding: '1rem' }}>Service</th>
                    <th style={{ padding: '1rem' }}>Date & Time</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentBookings?.map((booking: any) => (
                    <tr key={booking._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>#{booking._id.slice(-6).toUpperCase()}</td>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>{booking.serviceName}</td>
                      <td style={{ padding: '1rem' }}>
                        <div>{booking.date}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.timeSlot}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '9999px', 
                          fontSize: '0.75rem', 
                          fontWeight: 600,
                          background: booking.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                          color: booking.status === 'COMPLETED' ? '#10b981' : '#3b82f6'
                        }}>
                          {booking.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>{booking.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
