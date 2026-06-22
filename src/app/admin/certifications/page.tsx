'use client';
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { RichEditor } from '@/components/ui/RichEditor';

export default function AdminCertifications() {
  const [certs, setCerts] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchCerts = () => {
    fetch('/api/certifications').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setCerts(data);
    }).catch(console.error);
  };

  useEffect(() => fetchCerts(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let fileUrl = certs.find(c => c.id === editingId)?.fileUrl || '';
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
      await fetch('/api/certifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, name, issuer, year: parseInt(year), description, fileUrl })
      });
      setEditingId(null);
    } else {
      await fetch('/api/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, issuer, year: parseInt(year), description, fileUrl })
      });
    }

    setName(''); setIssuer(''); setYear(''); setDescription(''); setFile(null);
    setUploading(false);
    fetchCerts();
  };

  const handleEdit = (cert: any) => {
    setEditingId(cert.id);
    setName(cert.name);
    setIssuer(cert.issuer);
    setYear(cert.year.toString());
    setDescription(cert.description || '');
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    await fetch('/api/certifications', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchCerts();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName(''); setIssuer(''); setYear(''); setDescription(''); setFile(null);
  };

  const inputStyles = {
    padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)', width: '100%', marginBottom: '1rem'
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <p className="accent-text" style={{ marginBottom: '0.5rem' }}>Validation Center</p>
      <h2 style={{ fontSize: '3rem', marginBottom: '3rem' }}>Certifications</h2>
      
      <GlassCard className="mb-4" style={{ marginBottom: '4rem', maxWidth: '800px', border: editingId ? '1px solid var(--primary-color)' : '' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>{editingId ? 'Edit Certificate' : 'Add New Certificate'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input required value={name} onChange={e => setName(e.target.value)} style={inputStyles} placeholder="Certificate Name" />
            <input required type="number" value={year} onChange={e => setYear(e.target.value)} style={inputStyles} placeholder="Year (e.g. 2024)" />
          </div>
          <input required value={issuer} onChange={e => setIssuer(e.target.value)} style={inputStyles} placeholder="Issuing Organization" />
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Rich Text Description</label>
            <RichEditor value={description} onChange={setDescription} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{editingId ? 'Upload New Image/PDF (Optional)' : 'Upload Certificate (Image/PDF)'}</label>
            <input type="file" onChange={e => e.target.files && setFile(e.target.files[0])} style={{ color: 'var(--text-primary)' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-end' }}>
            {editingId && <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>}
            <Button type="submit" variant="primary">
              {uploading ? 'Processing...' : (editingId ? 'Save Changes' : 'Add Certificate')}
            </Button>
          </div>
        </form>
      </GlassCard>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {certs.map(cert => (
          <GlassCard key={cert.id} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.25rem' }}>{cert.name}</h4>
                <p style={{ opacity: 0.6, fontSize: '0.875rem' }}>{cert.issuer} • {cert.year}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(cert)} style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                <button onClick={() => handleDelete(cert.id)} style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: '#ff4d4f', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
              </div>
            </div>
            {cert.fileUrl && <a href={cert.fileUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontSize: '0.875rem', display: 'block', margin: '0.5rem 0' }}>View Uploaded File</a>}
            {cert.description && <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', fontSize: '0.9rem' }} dangerouslySetInnerHTML={{ __html: cert.description }} />}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
