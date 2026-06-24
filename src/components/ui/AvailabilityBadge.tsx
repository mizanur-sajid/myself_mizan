import React from 'react';

export function AvailabilityBadge() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes status-ping {
          75%, 100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        .animate-status-ping {
          animation: status-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}} />
      <div 
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          background: 'rgba(34, 197, 94, 0.15)',
          borderRadius: '100px',
          marginBottom: '1.5rem',
          width: 'fit-content'
        }}
      >
        <div style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
          <span 
            className="animate-status-ping"
            style={{ 
              position: 'absolute', 
              display: 'inline-flex', 
              height: '100%', 
              width: '100%', 
              borderRadius: '50%', 
              backgroundColor: '#4ade80', 
              opacity: 0.75 
            }} 
          />
          <span 
            style={{ 
              position: 'relative', 
              display: 'inline-flex', 
              borderRadius: '50%', 
              height: '8px', 
              width: '8px', 
              backgroundColor: '#4ade80' 
            }} 
          />
        </div>
        <span 
          style={{ 
            color: '#4ade80', 
            fontSize: '0.9rem', 
            fontWeight: 600,
            letterSpacing: '0.02em'
          }}
        >
          Available for work
        </span>
      </div>
    </>
  );
}
