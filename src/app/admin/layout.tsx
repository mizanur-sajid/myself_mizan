import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
      <aside style={{ width: '250px', borderRight: '1px solid var(--glass-border)', padding: '2rem' }}>
        <h2 className="neon-text" style={{ marginBottom: '2rem' }}>Admin Panel</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a href="/admin" style={{ padding: '0.5rem', background: 'var(--glass-bg)', borderRadius: '4px' }}>Dashboard</a>
          <a href="/admin/messages" style={{ padding: '0.5rem' }}>Messages</a>
          <a href="/admin/skills" style={{ padding: '0.5rem' }}>Skills</a>
          <a href="/" style={{ padding: '0.5rem', marginTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>Back to Site</a>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}
