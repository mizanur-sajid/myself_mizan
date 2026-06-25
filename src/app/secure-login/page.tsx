'use client';
import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      const data = await res.json();
      sessionStorage.setItem('isAdminAuth', 'true');
      if (data.csrf_token) sessionStorage.setItem('csrf_token', data.csrf_token);
      window.location.href = '/secure-panel';
    } else {
      const data = await res.json();
      setError(data.error || 'Invalid credentials');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', height: '100vh', background: 'var(--bg-color)', justifyContent: 'center' }}>
      <GlassCard style={{ width: '400px', padding: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Admin Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <input
            required
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)', width: '100%' }}
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)', width: '100%' }}
          />
          {error && <p style={{ color: '#ff4d4f', fontSize: '0.875rem' }}>{error}</p>}
          <Button type="submit" variant="primary">Access Command Center</Button>
        </form>
      </GlassCard>
    </div>
  );
}
