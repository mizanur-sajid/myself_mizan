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
    
    // Since InfinityFree is static, we must use a mailto link instead of a backend API
    const subject = encodeURIComponent(`Contact from ${formData.name}`);
    
    // Use window to strip HTML tags from rich editor content for the email body
    let cleanContent = formData.content;
    if (typeof window !== 'undefined') {
       const temp = document.createElement('div');
       temp.innerHTML = formData.content;
       cleanContent = temp.textContent || temp.innerText || '';
    }
    
    const body = encodeURIComponent(`${cleanContent}\n\n---\nSender Email: ${formData.email}\nSender Name: ${formData.name}`);
    
    window.location.href = `mailto:mizanursajid@gmail.com?subject=${subject}&body=${body}`;
    setStatus('Opened your email client. Please send the email from there!');
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
