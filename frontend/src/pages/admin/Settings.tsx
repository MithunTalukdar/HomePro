export function Settings() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Platform Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Configure global platform settings</p>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>General Settings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Platform Name</label>
            <input type="text" className="search-input" defaultValue="ServeSync" style={{ width: '100%', background: 'var(--background)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Support Email</label>
            <input type="email" className="search-input" defaultValue="support@servesync.com" style={{ width: '100%', background: 'var(--background)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Global Commission Rate (%)</label>
            <input type="number" className="search-input" defaultValue="15" style={{ width: '100%', background: 'var(--background)' }} />
          </div>
          <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
