'use client';
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

interface Message {
  id: number;
  name: string;
  email: string;
  content: string;
  createdAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetch('/api/contact')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <p className="accent-text" style={{ marginBottom: '0.5rem' }}>Inbound</p>
      <h2 style={{ fontSize: '3rem', marginBottom: '3rem' }}>Communications</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
        {messages.length === 0 ? (
          <GlassCard style={{ textAlign: 'center', opacity: 0.5 }}>No communications found in the database.</GlassCard>
        ) : (
          messages.map(msg => (
            <GlassCard key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.25rem', margin: 0 }}>{msg.name}</h4>
                  <a href={`mailto:${msg.email}`} style={{ fontSize: '0.875rem', color: 'var(--primary-color)' }}>{msg.email}</a>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {new Date(msg.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <p style={{ fontSize: '1rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
