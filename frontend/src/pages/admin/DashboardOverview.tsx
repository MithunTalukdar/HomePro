import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { Users, Wrench, Calendar, DollarSign, Activity, CheckCircle, XCircle, AlertCircle, TrendingUp, BarChart2, Briefcase } from 'lucide-react';

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
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><span className="dot-pulse">...</span></div>;
  }

  const statCards = [
    { label: 'Total Customers', value: stats?.totalUsers || 0, icon: Users, color: '#3b82f6' },
    { label: 'Total Technicians', value: stats?.totalTechnicians || 0, icon: Briefcase, color: '#6366f1' },
    { label: 'Active Technicians', value: stats?.activeTechnicians || 0, icon: Wrench, color: '#10b981' },
    { label: 'Inactive Techs', value: stats?.inactiveTechnicians || 0, icon: AlertCircle, color: '#ef4444' },
    
    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: Calendar, color: '#8b5cf6' },
    { label: 'Pending Bookings', value: stats?.pendingBookings || 0, icon: Activity, color: '#f59e0b' },
    { label: 'Confirmed Bookings', value: stats?.confirmedBookings || 0, icon: CheckCircle, color: '#0ea5e9' },
    { label: 'Completed Jobs', value: stats?.completedBookings || 0, icon: CheckCircle, color: '#14b8a6' },
    { label: 'Cancelled Bookings', value: stats?.cancelledBookings || 0, icon: XCircle, color: '#f43f5e' },
    
    { label: 'Total Revenue', value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, icon: DollarSign, color: '#10b981' },
    { label: "Today's Revenue", value: `₹${stats?.todaysRevenue?.toLocaleString() || 0}`, icon: TrendingUp, color: '#3b82f6' },
    { label: 'Monthly Revenue', value: `₹${stats?.monthlyRevenue?.toLocaleString() || 0}`, icon: BarChart2, color: '#8b5cf6' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome back to the admin command center.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)' }} onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={24} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stat.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="var(--primary)" /> Service Performance
          </h2>
          {stats?.servicePerformance?.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No service data available</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats?.servicePerformance?.map((service: any, index: number) => {
                const max = Math.max(...stats.servicePerformance.map((s: any) => s.count));
                const percentage = (service.count / max) * 100;
                return (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 500 }}>{service.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{service.count} bookings</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--primary-light))', borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={18} color="var(--primary)" /> Technician Workload
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6', marginBottom: '0.5rem' }}>{stats?.technicianPerformance?.totalAssigned || 0}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Assigned</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', marginBottom: '0.5rem' }}>{stats?.technicianPerformance?.activeJobs || 0}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Active Jobs</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#8b5cf6', marginBottom: '0.5rem' }}>{stats?.technicianPerformance?.completedJobs || 0}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Completed Jobs</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.5rem' }}>{stats?.technicianPerformance?.pendingJobs || 0}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Pending Jobs</div>
            </div>
          </div>
        </div>

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
