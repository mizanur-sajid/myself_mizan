'use client';

export const LogoutButton = () => {
  const handleLogout = async () => {
    const csrfToken = sessionStorage.getItem('csrf_token') || '';
    await fetch('/api/auth.php', { method: 'DELETE', headers: { 'X-CSRF-Token': csrfToken } });
    sessionStorage.removeItem('isAdminAuth');
    sessionStorage.removeItem('csrf_token');
    window.location.href = '/secure-login';
  };

  return (
    <button 
      onClick={handleLogout}
      style={{ 
        background: 'var(--danger-alpha-10)', 
        color: '#ff4d4f', 
        border: '1px solid var(--danger-alpha-20)', 
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
