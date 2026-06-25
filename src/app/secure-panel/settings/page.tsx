'use client';
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Settings, CheckCircle, Save, Layout, User, Phone, Type } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminSettings() {
  const [config, setConfig] = useState({
    heroTitle: '',
    heroSubtitle: '',
    aboutText: '',
    contactEmail: '',
    contactPhone: '',
    contactLocation: '',
    footerText: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetch('/api/config.php')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setConfig(data);
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const res = await fetch('/api/config.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': sessionStorage.getItem('csrf_token') || ''
        },
        body: JSON.stringify(config)
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: 'Site configuration saved successfully!', type: 'success' });
      } else {
        setMessage({ text: data.error || 'Failed to save configuration.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred.', type: 'error' });
    }
    setLoading(false);
  };

  const inputStyles = {
    padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--panel-bg)', color: 'var(--text-primary)', width: '100%', transition: 'all 0.3s ease', fontFamily: 'inherit'
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <p className="accent-text" style={{ marginBottom: '0.5rem' }}>Global Configuration</p>
          <h2 style={{ fontSize: '3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Settings size={40} className="text-primary" /> Site Settings
          </h2>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '2rem' }}>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <Layout size={24} color="var(--primary-color)" />
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Hero Section</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Hero Title</label>
                  <input required name="heroTitle" value={config.heroTitle} onChange={handleChange} style={inputStyles} placeholder="E.g. Cyber Security Specialist" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Hero Subtitle</label>
                  <textarea required name="heroSubtitle" value={config.heroSubtitle} onChange={handleChange} style={{ ...inputStyles, minHeight: '80px', resize: 'vertical' }} placeholder="Short description below the title..." />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <User size={24} color="var(--accent-color)" />
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>About Section</h3>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>About Me Text</label>
                <textarea required name="aboutText" value={config.aboutText} onChange={handleChange} style={{ ...inputStyles, minHeight: '150px', resize: 'vertical', lineHeight: '1.6' }} placeholder="Write a few paragraphs about yourself..." />
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <Phone size={24} color="#60a5fa" />
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Contact Details</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Public Email</label>
                  <input required type="email" name="contactEmail" value={config.contactEmail} onChange={handleChange} style={inputStyles} placeholder="hello@example.com" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Phone Number</label>
                  <input required name="contactPhone" value={config.contactPhone} onChange={handleChange} style={inputStyles} placeholder="+880..." />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Location</label>
                  <input required name="contactLocation" value={config.contactLocation} onChange={handleChange} style={inputStyles} placeholder="City, Country" />
                </div>
              </div>
            </GlassCard>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <GlassCard style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <Type size={24} color="#c084fc" />
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Footer</h3>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Copyright Text</label>
                <input required name="footerText" value={config.footerText} onChange={handleChange} style={inputStyles} placeholder="© 2024 Your Name. All rights reserved." />
              </div>
            </GlassCard>
          </motion.div>

        </div>

        {/* Floating Save Action */}
        <div style={{ position: 'sticky', bottom: '2rem', marginTop: '3rem', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
          {message.text && (
            <div style={{ 
              padding: '1rem 2rem', 
              borderRadius: '8px', 
              background: message.type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(74, 222, 128, 0.9)',
              color: '#000',
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
            }}>
              {message.type === 'success' && <CheckCircle size={20} />}
              {message.text}
            </div>
          )}
          
          <Button type="submit" variant="primary" style={{ padding: '16px 32px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 10px 25px -5px var(--primary-alpha-20)' }}>
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </form>
    </div>
  );
}
