'use client';
import { useEffect, useState, useRef } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { RichEditor } from '@/components/ui/RichEditor';
import { UploadCloud, FileText, CheckCircle, PlusCircle, Edit2, Trash2, Award } from 'lucide-react';

export default function AdminCertifications() {
  const [certs, setCerts] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCerts = () => {
    fetch('/api/certifications').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setCerts(data);
    }).catch(console.error);
  };

  useEffect(() => fetchCerts(), []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (selected.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(selected));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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

    setName(''); setIssuer(''); setYear(''); setDescription(''); clearFile();
    setUploading(false);
    fetchCerts();
  };

  const handleEdit = (cert: any) => {
    setEditingId(cert.id);
    setName(cert.name);
    setIssuer(cert.issuer);
    setYear(cert.year.toString());
    setDescription(cert.description || '');
    clearFile();
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
    setName(''); setIssuer(''); setYear(''); setDescription(''); clearFile();
  };

  const inputStyles = {
    padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)', width: '100%', transition: 'all 0.3s ease'
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <p className="accent-text" style={{ marginBottom: '0.5rem' }}>Validation Center</p>
          <h2 style={{ fontSize: '3rem', margin: 0 }}>Certifications</h2>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Left Column: Form */}
        <div style={{ flex: '1 1 400px', maxWidth: '500px', position: 'sticky', top: '100px' }}>
          <GlassCard style={{ border: editingId ? '1px solid var(--primary-color)' : '' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {editingId ? <CheckCircle className="text-primary" size={24} color="var(--primary-color)" /> : <PlusCircle className="text-accent" size={24} color="var(--accent-color)" />}
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{editingId ? 'Edit Certificate' : 'Add New Certificate'}</h3>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Certificate Name</label>
                  <input required value={name} onChange={e => setName(e.target.value)} style={inputStyles} placeholder="AWS Solutions Architect" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Year</label>
                  <input required type="number" value={year} onChange={e => setYear(e.target.value)} style={inputStyles} placeholder="2024" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Issuing Organization</label>
                <input required value={issuer} onChange={e => setIssuer(e.target.value)} style={inputStyles} placeholder="Amazon Web Services" />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Rich Text Description</label>
                <RichEditor value={description} onChange={setDescription} />
              </div>

              {/* Drag and drop styled upload */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {editingId ? 'Upload New Thumbnail (Optional)' : 'Upload Thumbnail (Required)'}
                </label>
                <div 
                  style={{ 
                    border: '2px dashed var(--glass-border)', borderRadius: '12px', padding: '2rem', textAlign: 'center', 
                    background: 'rgba(255,255,255,0.02)', position: 'relative', transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className="hover:border-primary/50 hover:bg-white/5"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange} 
                    style={{ display: 'none' }} 
                    accept="image/*,application/pdf"
                  />
                  
                  {previewUrl ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px', objectFit: 'contain' }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                        <CheckCircle size={16} color="var(--primary-color)" />
                        <span style={{ fontSize: '0.875rem' }}>{file?.name}</span>
                      </div>
                    </div>
                  ) : file ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={48} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{file.name} selected</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', opacity: 0.6 }}>
                      <UploadCloud size={48} style={{ marginBottom: '0.5rem' }} />
                      <p style={{ margin: 0, fontSize: '0.95rem' }}>Click or drag file to upload</p>
                      <p style={{ margin: 0, fontSize: '0.75rem' }}>SVG, PNG, JPG or PDF</p>
                    </div>
                  )}
                </div>
                {file && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); clearFile(); }} style={{ background: 'none', border: 'none', color: '#ff4d4f', fontSize: '0.8rem', cursor: 'pointer', marginTop: '0.5rem', padding: 0 }}>
                    Remove file
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-end', marginTop: '1rem' }}>
                {editingId && <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>}
                <Button type="submit" variant="primary">
                  {uploading ? 'Processing...' : (editingId ? 'Save Changes' : 'Add Certificate')}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Right Column: List */}
        <div style={{ flex: '2 1 500px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {certs.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', opacity: 0.5 }}>
                <Award size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.2, display: 'block' }} />
                <p>No certifications found.</p>
              </div>
            ) : (
              certs.map(cert => (
                <GlassCard key={cert.id} style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {cert.fileUrl && (
                    <div style={{ width: '100%', height: '160px', background: 'rgba(0,0,0,0.2)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {cert.fileUrl.endsWith('.pdf') ? (
                        <FileText size={48} color="var(--primary-color)" />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={cert.fileUrl} alt={cert.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </div>
                  )}
                  
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.3 }}>{cert.name}</h4>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      <span style={{ padding: '4px 8px', background: 'rgba(0, 240, 255, 0.1)', color: 'var(--primary-color)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {cert.issuer}
                      </span>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <span style={{ padding: '4px 8px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'var(--font-space)' }}>
                        {cert.year}
                      </span>
                      {cert.fileUrl ? (
                        <a href={cert.fileUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)', fontSize: '0.9rem', textDecoration: 'underline', opacity: 0.8 }} className="hover:text-primary transition-colors">View Credentials ↗</a>
                      ) : (
                        <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', opacity: 0.5, cursor: 'not-allowed' }}>Credentials Unavailable</span>
                      )}
                    </div>

                    {cert.description && (
                      <div style={{ paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid var(--glass-border)', fontSize: '0.875rem', color: 'var(--text-secondary)', flex: 1 }} dangerouslySetInnerHTML={{ __html: cert.description }} />
                    )}
                    
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                      <button onClick={() => handleEdit(cert)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-primary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }} className="hover:bg-white/10">
                        <Edit2 size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(cert.id)} style={{ background: 'rgba(255, 77, 79, 0.1)', border: 'none', color: '#ff4d4f', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }} className="hover:bg-red-500/20">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
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
