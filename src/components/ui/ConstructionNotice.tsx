'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function ConstructionNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Wait 5 seconds before showing
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    // Hide after another 5 seconds (10s total)
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      background: 'var(--bg-color)',
      backdropFilter: 'blur(10px)',
      border: '1px solid var(--accent-color)',
      borderRadius: '8px',
      padding: '1rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      boxShadow: 'var(--card-shadow)',
      animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      <AlertTriangle color="var(--accent-color)" size={24} />
      <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.4, maxWidth: '300px' }}>
        This site is under construction. any possible error is expected.
      </p>
      <button 
        onClick={() => setIsVisible(false)}
        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px', display: 'flex', marginLeft: '0.5rem' }}
        className="hover:text-primary transition-colors"
      >
        <X size={18} />
      </button>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
    </div>
  );
}
