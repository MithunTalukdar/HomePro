import { useState } from 'react';
import { Plus } from 'lucide-react';

export function AdminCoupons() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Coupons & Offers</h1>
          <p style={{ color: 'var(--text-muted)' }}>Create and manage discount codes</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No coupons created yet.
      </div>
    </div>
  );
}
