import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ChevronDown } from 'lucide-react';

export function ActiveJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      // In a real app, backend would filter based on technicianId
      // Since getMyBookings currently uses customerId, we would need a specific endpoint for technician bookings.
      // For now, empty state.
      setJobs([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetchApi(`/bookings/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      loadJobs();
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (isLoading) return <div>Loading active jobs...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Active Jobs</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage your currently assigned jobs.</p>

      {jobs.length === 0 ? (
        <div style={{ background: 'var(--surface)', padding: '3rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>You don't have any active jobs right now.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {jobs.map(job => (
            <div key={job._id} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '1.5rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                   <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{job.serviceName}</h3>
                   <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Booking ID: {job._id}</div>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <select 
                      className="search-input" 
                      value={job.status} 
                      onChange={(e) => handleUpdateStatus(job._id, e.target.value)}
                      style={{ background: 'var(--background)' }}
                    >
                      <option value="ASSIGNED">Assigned</option>
                      <option value="ON_THE_WAY">On The Way</option>
                      <option value="ARRIVED">Arrived</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                    <Link to={`/technician/dashboard/bookings/${job._id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>
                      Track Live
                    </Link>
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
