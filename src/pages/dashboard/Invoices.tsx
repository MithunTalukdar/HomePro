import { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { FileText, Download } from 'lucide-react';

export function Invoices() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      // In a real app, we would have a specific /invoices endpoint.
      // Here we can use completed bookings that have a payment.
      const data = await fetchApi('/bookings');
      const completed = data.filter((b: any) => b.status === 'COMPLETED' || b.paymentStatus === 'PAID');
      setBookings(completed);
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
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Invoices</h1>
          <p style={{ color: 'var(--text-muted)' }}>View and download your payment receipts</p>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>Loading invoices...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Invoice / Booking ID</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Service</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>INV-{booking._id.slice(-6).toUpperCase()}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ref: {booking._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{booking.date}</td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{booking.serviceName}</td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>
                      {booking.price}
                      {booking.paymentStatus === 'PAID' && (
                        <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>Paid</div>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        <Download size={16} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No invoices found.
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
