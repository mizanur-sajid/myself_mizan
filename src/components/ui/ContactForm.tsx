'use client';
import { useState } from 'react';
import { Button } from './Button';
import { GlassCard } from './GlassCard';
import { RichEditor } from './RichEditor';

export const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', content: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setStatus('Sending message...');
    
    try {
      const res = await fetch('/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setStatus('Message sent successfully! I will get back to you soon.');
          setFormData({ name: '', email: '', content: '' }); // Reset form
        } else {
          setStatus(data.error || 'Failed to send message. Please try again.');
        }
      } else {
        setStatus('Failed to send message. Please ensure the backend is running.');
      }
    } catch (err) {
      console.error(err);
      setStatus('An error occurred. Please try again.');
    }
  };

  const inputStyles = {
    padding: '16px 20px', 
    borderRadius: '12px', 
    border: '1px solid var(--glass-border)', 
    background: 'rgba(255,255,255,0.02)', 
    color: 'var(--text-primary)',
    width: '100%',
    transition: 'all 0.3s ease',
    fontSize: '1rem'
  };

  return (
    <GlassCard style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="contact-flex" style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <input
              required
              placeholder="Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              style={inputStyles}
            />
          </div>
          <div style={{ flex: 1 }}>
            <input
              required
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              style={inputStyles}
            />
          </div>
        </div>
        <div style={{ paddingBottom: '2.5rem' }}>
          <RichEditor
            placeholder="How can I help you?"
            value={formData.content}
            onChange={value => setFormData({ ...formData, content: value })}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <p style={{ fontSize: '0.875rem', opacity: 0.6, margin: 0 }}>{status}</p>
          <Button type="submit" variant="primary" style={{ minWidth: '160px' }}>Submit</Button>
        </div>
      </form>
    </GlassCard>
  );
};
