import React from 'react';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AuthGuard } from '@/components/admin/AuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-color)', position: 'relative', zIndex: 1 }}>
        <AdminSidebar />
        <main style={{ flex: 1, height: '100%', overflowY: 'auto', padding: '0', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid var(--glass-border)', background: 'var(--panel-bg)', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
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
