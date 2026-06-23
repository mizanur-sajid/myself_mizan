'use client';
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Search, Edit2, Trash2, PlusCircle, CheckCircle, Share2 } from 'lucide-react';

interface Social {
  id: number;
  name: string;
  url: string;
  icon: string;
}

export default function AdminSocials() {
  const [socials, setSocials] = useState<Social[]>([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSocials = () => {
    fetch('/api/admin/socials')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setSocials(data); })
      .catch(console.error);
  };

  useEffect(() => fetchSocials(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/admin/socials/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, url, icon }) });
      setEditingId(null);
    } else {
      await fetch('/api/admin/socials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, url, icon }) });
    }
    setName(''); setUrl(''); setIcon('');
    fetchSocials();
  };

  const handleEdit = (social: Social) => {
    setEditingId(social.id);
    setName(social.name);
    setUrl(social.url);
    setIcon(social.icon);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this social link?')) return;
    await fetch(`/api/admin/socials/${id}`, { method: 'DELETE' });
    fetchSocials();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName(''); setUrl(''); setIcon('');
  };

  const filteredSocials = socials.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const inputStyles = {
    padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)', width: '100%', transition: 'all 0.3s ease'
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <p className="accent-text" style={{ marginBottom: '0.5rem' }}>Public Links Configuration</p>
          <h2 style={{ fontSize: '3rem', margin: 0 }}>Social Profiles</h2>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Left Column: Form */}
        <div style={{ flex: '1 1 400px', maxWidth: '500px', position: 'sticky', top: '100px' }}>
          <GlassCard style={{ border: editingId ? '1px solid var(--primary-color)' : '' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {editingId ? <CheckCircle className="text-primary" size={24} color="var(--primary-color)" /> : <PlusCircle className="text-accent" size={24} color="var(--accent-color)" />}
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{editingId ? 'Edit Social Link' : 'Add New Social Link'}</h3>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Display Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} style={inputStyles} placeholder="e.g. GitHub" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Profile URL</label>
                <input required type="url" value={url} onChange={e => setUrl(e.target.value)} style={inputStyles} placeholder="https://github.com/mizan" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Icon Identifier (e.g. github, linkedin, twitter, mail)</label>
                <input required value={icon} onChange={e => setIcon(e.target.value)} style={inputStyles} placeholder="github" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-end', marginTop: '0.5rem' }}>
                {editingId && <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>}
                <Button type="submit" variant="primary">{editingId ? 'Save Changes' : 'Initialize'}</Button>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Right Column: Search & List */}
        <div style={{ flex: '2 1 500px' }}>
          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search socials by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)', fontSize: '1rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filteredSocials.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', opacity: 0.5 }}>
                <Share2 size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.2, display: 'block' }} />
                <p>No social links found.</p>
              </div>
            ) : (
              filteredSocials.map(social => (
                <GlassCard key={social.id} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{social.name}</h4>
                    <span style={{ fontFamily: 'var(--font-space)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Icon: {social.icon}</span>
                  </div>
                  <a href={social.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', color: 'var(--primary-color)', marginBottom: '1.5rem', wordBreak: 'break-all' }}>{social.url}</a>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                    <button onClick={() => handleEdit(social)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-primary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }} className="hover:bg-white/10">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(social.id)} style={{ background: 'rgba(255, 77, 79, 0.1)', border: 'none', color: '#ff4d4f', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }} className="hover:bg-red-500/20">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
