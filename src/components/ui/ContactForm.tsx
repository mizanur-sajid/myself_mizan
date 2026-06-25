'use client';
import { useState } from 'react';
import { GlassCard } from './GlassCard';
import { RichEditor } from './RichEditor';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserRound, Mail, PenSquare, Rocket, Microscope, 
  Briefcase, GraduationCap, MessageCircle, ShieldCheck, 
  Clock3, SendHorizontal, Sparkles 
} from 'lucide-react';

export const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', content: '' });
  const [status, setStatus] = useState('');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const topics = [
    { id: 'collab', icon: <Rocket size={14} />, text: 'Project Collaboration' },
    { id: 'research', icon: <Microscope size={14} />, text: 'Research Discussion' },
    { id: 'job', icon: <Briefcase size={14} />, text: 'Job Opportunity' },
    { id: 'academic', icon: <GraduationCap size={14} />, text: 'Academic Inquiry' },
    { id: 'general', icon: <MessageCircle size={14} />, text: 'General Question' },
  ];

  const handleTopicClick = (topicText: string, topicId: string) => {
    setActiveTopic(topicId);
    if (!formData.content) {
      setFormData(prev => ({ ...prev, content: `<p>Regarding: <strong>${topicText}</strong></p><p><br></p>` }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setStatus('Sending message...');
    
    try {
      const res = await fetch('/api/contact.php', {
        method: 'POST',
        headers: { 'X-CSRF-Token': sessionStorage.getItem('csrf_token') || '', 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setStatus('Message sent successfully! I will get back to you soon.');
          setFormData({ name: '', email: '', content: '' }); // Reset form
          setActiveTopic(null);
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

  const getInputStyle = (fieldName: string) => ({
    padding: '16px 20px 16px 48px', 
    borderRadius: '16px', 
    border: focusedField === fieldName ? '1px solid var(--primary-alpha-20)' : '1px solid var(--glass-border)', 
    background: focusedField === fieldName ? 'var(--input-bg-focus)' : 'var(--input-bg)', 
    color: 'var(--text-primary)',
    width: '100%',
    transition: 'all 0.3s ease',
    fontSize: '1rem',
    outline: 'none',
    boxShadow: focusedField === fieldName ? '0 4px 20px -5px var(--primary-alpha-10)' : 'none',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ position: 'relative', maxWidth: '750px', margin: '0 auto' }}
    >
      {/* Decorative Particles */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '150px', height: '150px', background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 70%)', opacity: 0.15, filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '200px', height: '200px', background: 'radial-gradient(circle, var(--accent-color) 0%, transparent 70%)', opacity: 0.15, filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none' }} />

      <GlassCard style={{ padding: '3rem', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        
        {/* Topic Chips */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="var(--primary-color)" /> What would you like to discuss?
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {topics.map((t) => (
              <motion.button
                key={t.id}
                type="button"
                whileHover={{ y: -2, backgroundColor: 'rgba(0, 240, 255, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTopicClick(t.text, t.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '100px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  background: activeTopic === t.id ? 'rgba(0, 240, 255, 0.15)' : 'var(--glass-bg)',
                  border: activeTopic === t.id ? '1px solid rgba(0, 240, 255, 0.4)' : '1px solid var(--glass-border)',
                  color: activeTopic === t.id ? 'var(--primary-color)' : 'var(--text-secondary)',
                  transition: 'background 0.3s, color 0.3s, border 0.3s'
                }}
              >
                {t.icon} {t.text}
              </motion.button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="contact-flex" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: focusedField === 'name' ? 'var(--primary-color)' : 'var(--text-secondary)', transition: 'color 0.3s' }}>
                <UserRound size={18} />
              </div>
              <input
                required
                placeholder="Your Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                style={getInputStyle('name')}
              />
            </div>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: focusedField === 'email' ? 'var(--primary-color)' : 'var(--text-secondary)', transition: 'color 0.3s' }}>
                <Mail size={18} />
              </div>
              <input
                required
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                style={getInputStyle('email')}
              />
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', color: focusedField === 'content' ? 'var(--primary-color)' : 'var(--text-secondary)', transition: 'color 0.3s', fontSize: '0.9rem' }}>
              <PenSquare size={16} /> <span>Your Message</span>
            </div>
            <div 
              onFocus={() => setFocusedField('content')} 
              onBlur={() => setFocusedField(null)}
              style={{
                border: focusedField === 'content' ? '1px solid var(--primary-alpha-20)' : '1px solid var(--glass-border)',
                borderRadius: '16px',
                background: focusedField === 'content' ? 'var(--input-bg-focus)' : 'var(--input-bg)',
                transition: 'all 0.3s ease',
                boxShadow: focusedField === 'content' ? '0 4px 20px -5px var(--primary-alpha-10)' : 'none',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                overflow: 'hidden'
              }}
            >
              <RichEditor
                placeholder="How can I help you?"
                value={formData.content}
                onChange={value => setFormData({ ...formData, content: value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <AnimatePresence mode="wait">
                {status ? (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ fontSize: '0.95rem', color: status.includes('success') ? 'var(--primary-color)' : status.includes('Failed') || status.includes('error') ? '#ff4b4b' : 'var(--text-secondary)', margin: 0, fontWeight: 500 }}
                  >
                    {status}
                  </motion.p>
                ) : (
                  <div style={{ display: 'flex', gap: '1.5rem', opacity: 0.6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      <Clock3 size={14} /> <span>Typical response: 12–24 hours</span>
                    </div>
                  </div>
                )}
              </AnimatePresence>

              <motion.button 
                type="submit" 
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '100px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  minWidth: '200px',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px -3px var(--primary-alpha-20)'
                }}
              >
                Submit Message <SendHorizontal size={18} />
              </motion.button>
            </div>

            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', opacity: 0.7 }}>
              <ShieldCheck size={14} color="var(--accent-color)" /> 
              <span>Your information is secure and will only be used to respond to your message.</span>
            </div>

          </div>
        </form>
      </GlassCard>
    </motion.div>
  );
};
