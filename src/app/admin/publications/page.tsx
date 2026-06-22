'use client';
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { RichEditor } from '@/components/ui/RichEditor';

export default function AdminPublications() {
  const [pubs, setPubs] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchPubs = () => {
    fetch('/api/publications').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setPubs(data);
    }).catch(console.error);
  };

  useEffect(() => fetchPubs(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let fileUrl = pubs.find(p => p.id === editingId)?.fileUrl || '';
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (uploadRes.ok) {
        const d = await uploadRes.json();
        fileUrl = d.url;
      }
    }

    if (editingId) {
      await fetch('/api/publications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, title, link, year: parseInt(year), description, fileUrl })
      });
      setEditingId(null);
    } else {
      await fetch('/api/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, link, year: parseInt(year), description, fileUrl })
      });
    }

    setTitle(''); setLink(''); setYear(''); setDescription(''); setFile(null);
    setUploading(false);
    fetchPubs();
  };

  const handleEdit = (pub: any) => {
    setEditingId(pub.id);
    setTitle(pub.title);
    setLink(pub.link);
    setYear(pub.year.toString());
    setDescription(pub.description || '');
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;
    await fetch('/api/publications', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchPubs();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle(''); setLink(''); setYear(''); setDescription(''); setFile(null);
  };

  const inputStyles = {
    padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)', width: '100%', marginBottom: '1rem'
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <p className="accent-text" style={{ marginBottom: '0.5rem' }}>Knowledge Base</p>
      <h2 style={{ fontSize: '3rem', marginBottom: '3rem' }}>Publications</h2>
      
      <GlassCard className="mb-4" style={{ marginBottom: '4rem', maxWidth: '800px', border: editingId ? '1px solid var(--primary-color)' : '' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>{editingId ? 'Edit Publication' : 'Publish New Entry'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input required value={title} onChange={e => setTitle(e.target.value)} style={inputStyles} placeholder="Publication Title" />
            <input required type="number" value={year} onChange={e => setYear(e.target.value)} style={inputStyles} placeholder="Year (e.g. 2024)" />
          </div>
          <input required value={link} onChange={e => setLink(e.target.value)} style={inputStyles} placeholder="External Link (URL)" />
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Rich Text Description</label>
            <RichEditor value={description} onChange={setDescription} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{editingId ? 'Upload New Document (Optional)' : 'Upload Document/Image'}</label>
            <input type="file" onChange={e => e.target.files && setFile(e.target.files[0])} style={{ color: 'var(--text-primary)' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-end' }}>
            {editingId && <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>}
            <Button type="submit" variant="primary">
              {uploading ? 'Processing...' : (editingId ? 'Save Changes' : 'Publish Entry')}
            </Button>
          </div>
        </form>
      </GlassCard>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {pubs.map(pub => (
          <GlassCard key={pub.id} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.25rem' }}>{pub.title}</h4>
                <p style={{ opacity: 0.6, fontSize: '0.875rem' }}>{pub.year} • <a href={pub.link} target="_blank" rel="noreferrer" className="hover:text-primary">{pub.link}</a></p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(pub)} style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                <button onClick={() => handleDelete(pub.id)} style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: '#ff4d4f', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
              </div>
            </div>
            {pub.fileUrl && <a href={pub.fileUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontSize: '0.875rem', display: 'block', margin: '0.5rem 0' }}>View Uploaded File</a>}
            {pub.description && <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', fontSize: '0.9rem' }} dangerouslySetInnerHTML={{ __html: pub.description }} />}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
