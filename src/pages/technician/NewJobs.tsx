import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { MapPin, Calendar, Clock, IndianRupee } from 'lucide-react';

export function NewJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNewJobs();
  }, []);



  const loadNewJobs = async () => {
    try {







      setJobs([]); 
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptJob = async (id: string) => {
    try {
      await fetchApi(`/bookings/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'ASSIGNED' })
      });
      setJobs(jobs.filter(j => j._id !== id));
      alert('Job Accepted!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (isLoading) return <div>Loading jobs...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>New Job Requests</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Available jobs in your service areas.</p>

      {jobs.length === 0 ? (
        <div style={{ background: 'var(--surface)', padding: '3rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No new job requests at the moment. Check back later!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {jobs.map(job => (
            <div key={job._id} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{job.serviceName}</h3>
                <span style={{ fontWeight: 600, color: 'var(--primary-light)' }}>{job.price}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> {job.date}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> {job.timeSlot}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> {job.address?.address}, {job.address?.city}</div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-outline" style={{ flex: 1 }}>Ignore</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleAcceptJob(job._id)}>Accept Job</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
