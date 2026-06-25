'use client';
import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Shield, Lock, Link as LinkIcon, AlertTriangle, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export default function SecurityPage() {
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const securityFeatures = [
    {
      title: 'Hidden URL Routing',
      description: 'The admin panel uses a non-standard URL to evade automated bot discovery and limit unauthorized access attempts.',
      status: 'Active',
      icon: <LinkIcon size={24} color="#60a5fa" />,
      color: '#60a5fa',
      bgAlpha: 'rgba(96, 165, 250, 0.1)'
    },
    {
      title: 'Secure Session Cookies',
      description: 'Authentication cookies are strictly flagged with HttpOnly, Secure, and Strict SameSite attributes to prevent hijacking and XSS.',
      status: 'Active',
      icon: <Lock size={24} color="#4ade80" />,
      color: '#4ade80',
      bgAlpha: 'rgba(74, 222, 128, 0.1)'
    },
    {
      title: 'Brute-Force Account Lockout',
      description: 'IP addresses are temporarily locked out for 15 minutes after 5 consecutive failed login attempts to stop brute-forcing.',
      status: 'Active',
      icon: <Shield size={24} color="#c084fc" />,
      color: '#c084fc',
      bgAlpha: 'rgba(192, 132, 252, 0.1)'
    }
  ];

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const res = await fetch('/api/credentials.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': sessionStorage.getItem('csrf_token') || ''
        },
        body: JSON.stringify({
          username,
          currentPassword,
          newPassword
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: 'Credentials updated successfully. Please remember your new password!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ text: data.error || 'Failed to update credentials.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred.', type: 'error' });
    }
    setLoading(false);
  };

  const inputStyles = {
    padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--panel-bg)', color: 'var(--text-primary)', width: '100%', transition: 'all 0.3s ease'
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Shield size={32} style={{ color: 'var(--primary-color)' }} />
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Security Center</h1>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem' }}>
        Overview of the active security measures protecting this admin panel.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {securityFeatures.map((feature, index) => (
          <motion.div 
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  background: feature.bgAlpha,
                  border: `1px solid ${feature.bgAlpha.replace('0.1', '0.2')}`
                }}>
                  {feature.icon}
                </div>
                <div style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '9999px', 
                  background: 'rgba(74, 222, 128, 0.1)', 
                  border: '1px solid rgba(74, 222, 128, 0.2)',
                  color: '#4ade80',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }}></div>
                  {feature.status}
                </div>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>{feature.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <GlassCard style={{ padding: '2rem', border: '1px solid var(--primary-alpha-20)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Key size={24} color="var(--primary-color)" />
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Change Credentials</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Update your admin login username and password. This will update the secure credentials file.
          </p>

          <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>New Username (or current)</label>
              <input required value={username} onChange={e => setUsername(e.target.value)} style={inputStyles} placeholder="Admin Username" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Current Password</label>
              <input required type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={inputStyles} placeholder="••••••••" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>New Password</label>
              <input required type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyles} placeholder="••••••••" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Confirm New Password</label>
              <input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inputStyles} placeholder="••••••••" />
            </div>
            
            {message.text && (
              <div style={{ 
                padding: '1rem', 
                borderRadius: '8px', 
                background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(74, 222, 128, 0.1)',
                color: message.type === 'error' ? '#ef4444' : '#4ade80',
                border: message.type === 'error' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(74, 222, 128, 0.2)',
                fontSize: '0.9rem'
              }}>
                {message.text}
              </div>
            )}

            <Button type="submit" variant="primary" style={{ alignSelf: 'flex-start' }}>
              {loading ? 'Updating...' : 'Update Credentials'}
            </Button>
          </form>
        </GlassCard>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ marginTop: '3rem' }}
      >
        <GlassCard style={{ padding: '2rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <AlertTriangle size={32} style={{ color: '#ef4444', flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#ef4444' }}>Important Note</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                These features provide strong baseline security. Ensure you keep your dependencies updated, 
                continue to use strong, unique passwords, and consider running periodic security audits.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

