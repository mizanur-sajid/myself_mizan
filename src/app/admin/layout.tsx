import React from 'react';
import Image from 'next/image';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { AdminProfileCard } from '@/components/ui/AdminProfileCard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-color)', position: 'relative', zIndex: 1 }}>
      <aside style={{ width: '280px', height: '100%', overflowY: 'auto', flexShrink: 0, borderRight: '1px solid var(--glass-border)', padding: '2rem 1.5rem', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Image src="/logo.png" alt="Logo" width={140} height={48} className="logo-invert" style={{ objectFit: 'contain' }} priority />
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <a href="/admin" style={{ padding: '0.75rem 1rem', borderRadius: '8px', transition: 'background 0.2s', fontWeight: 500 }} className="hover:bg-white/5">Overview</a>
          <a href="/admin/messages" style={{ padding: '0.75rem 1rem', borderRadius: '8px', transition: 'background 0.2s', fontWeight: 500 }} className="hover:bg-white/5">Messages</a>
          <a href="/admin/skills" style={{ padding: '0.75rem 1rem', borderRadius: '8px', transition: 'background 0.2s', fontWeight: 500 }} className="hover:bg-white/5">Skills</a>
          <a href="/admin/publications" style={{ padding: '0.75rem 1rem', borderRadius: '8px', transition: 'background 0.2s', fontWeight: 500 }} className="hover:bg-white/5">Publications</a>
          <a href="/admin/certifications" style={{ padding: '0.75rem 1rem', borderRadius: '8px', transition: 'background 0.2s', fontWeight: 500 }} className="hover:bg-white/5">Certifications</a>
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
            <AdminProfileCard />
            <a href="/" style={{ padding: '0.5rem 1rem', display: 'block', fontWeight: 500, color: 'var(--text-secondary)' }} className="hover:text-primary">← Public Sector</a>
          </div>
        </nav>
      </aside>
      <main style={{ flex: 1, height: '100%', overflowY: 'auto', padding: '2rem 3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
          <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  );
}
