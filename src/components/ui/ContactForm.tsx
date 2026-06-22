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
    setStatus('Sending transmit...');
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setStatus('Message received. I will be in touch shortly.');
      setFormData({ name: '', email: '', content: '' });
    } else {
      setStatus('Transmission failed. Please try again.');
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
