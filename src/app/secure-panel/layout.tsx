import React from 'react';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AuthGuard } from '@/components/admin/AuthGuard';
import { AdminClock } from '@/components/admin/AdminClock';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-color)', position: 'relative', zIndex: 1 }}>
        <AdminSidebar />
        <main data-lenis-prevent="true" style={{ flex: 1, height: '100%', minHeight: 0, overflowY: 'auto', padding: '0', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ padding: '1.25rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--glass-border)', background: 'var(--glass-bg)', boxShadow: '0 4px 24px -6px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
            <AdminClock />
            <ThemeToggle />
          </div>
          <div className="admin-page-container">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
