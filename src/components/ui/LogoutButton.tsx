'use client';

export const LogoutButton = () => {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <button 
      onClick={handleLogout}
      style={{ 
        background: 'rgba(255, 77, 79, 0.1)', 
        color: '#ff4d4f', 
        border: '1px solid rgba(255, 77, 79, 0.2)', 
        padding: '0.5rem 1rem', 
        borderRadius: '6px', 
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: 600,
        width: '100%',
        transition: 'all 0.2s',
        marginTop: '0.5rem'
      }}
      className="hover:bg-red-500/20"
    >
      Log Out
    </button>
  );
};
