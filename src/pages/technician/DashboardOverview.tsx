import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, Clock, DollarSign, Star } from 'lucide-react';
import { fetchApi } from '../../services/api';

export function TechnicianDashboardOverview() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await fetchApi('/technicians/profile');
      setProfile(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading dashboard...</div>;

  const stats = [
    { title: 'Completed Jobs', value: profile?.completedJobs || 0, icon: CheckCircle, color: 'var(--success)' },
    { title: 'Average Rating', value: profile?.rating || 0, icon: Star, color: 'var(--warning)' },
    { title: 'Active Jobs', value: 0, icon: Briefcase, color: 'var(--primary)' },
    { title: 'Earnings (Month)', value: '$0', icon: DollarSign, color: 'var(--text)' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome back, {profile?.user?.name}!</h1>
        <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your jobs today.</p>
        
        {profile?.verificationStatus === 'PENDING' && (
           <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(234, 179, 8, 0.1)', color: 'var(--warning)', borderRadius: 'var(--radius-md)', border: '1px solid var(--warning)' }}>
             Your profile is currently pending verification. You will not receive new job requests until an admin verifies your documents.
           </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
            >
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                <Icon size={28} />
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>{stat.title}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)' }}>{stat.value}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Job Requests</h2>
          <div style={{ color: 'var(--text-muted)' }}>
             No new job requests at this time.
          </div>
        </div>
      </div>
    </div>
  );
}
