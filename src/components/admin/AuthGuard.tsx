'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check sessionStorage first to enforce strictly asking for password on new browser sessions
    const sessionAuth = sessionStorage.getItem('isAdminAuth');
    if (!sessionAuth) {
      window.location.href = '/secure-login';
      return;
    }

    // Verify with backend to ensure the session hasn't expired
    fetch('/api/auth.php')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          if (data.csrf_token) sessionStorage.setItem('csrf_token', data.csrf_token);
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem('isAdminAuth');
          window.location.href = '/secure-login';
        }
      })
      .catch(() => {
        window.location.href = '/secure-login';
      });
  }, []);

  if (isAuthenticated === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', flex: 1, minHeight: '100vh', background: 'var(--bg-color)' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid var(--glass-border)', 
          borderTopColor: 'var(--primary-color)', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }} />
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}} />
      </div>
    );
  }

  return <>{children}</>;
}
