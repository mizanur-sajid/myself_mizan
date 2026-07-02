'use client';
import { useEffect, useState, useRef } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { RichEditor } from '@/components/ui/RichEditor';
import { UploadCloud, CheckCircle, PlusCircle, Edit2, Trash2, BookOpen, FileText, Link as LinkIcon, Calendar } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitize';

export default function AdminPublications() {
  const [pubs, setPubs] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPubs = () => {
    fetch('/api/publications.php').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setPubs(data);
    }).catch(console.error);
  };

  useEffect(() => fetchPubs(), []);

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

    let fileUrl = pubs.find(p => p.id === editingId)?.fileUrl || '';
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/upload.php', { method: 'POST', headers: { 'X-CSRF-Token': sessionStorage.getItem('csrf_token') || '' }, body: formData });
      if (uploadRes.ok) {
        const d = await uploadRes.json();
        fileUrl = d.url;
      }
    }

    if (editingId) {
      await fetch('/api/publications.php', {
        method: 'PUT',
        headers: { 'X-CSRF-Token': sessionStorage.getItem('csrf_token') || '', 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, title, link, year: parseInt(year), description, fileUrl })
      });
      setEditingId(null);
    } else {
      await fetch('/api/publications.php', {
        method: 'POST',
        headers: { 'X-CSRF-Token': sessionStorage.getItem('csrf_token') || '', 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, link, year: parseInt(year), description, fileUrl })
      });
    }

    setTitle(''); setLink(''); setYear(''); setDescription(''); clearFile();
    setUploading(false);
    fetchPubs();
  };

  const handleEdit = (pub: any) => {
    setEditingId(pub.id);
    setTitle(pub.title);
    setLink(pub.link);
    setYear(pub.year.toString());
    setDescription(pub.description || '');
    clearFile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;
    await fetch('/api/publications.php', {
      method: 'DELETE',
      headers: { 'X-CSRF-Token': sessionStorage.getItem('csrf_token') || '', 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchPubs();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle(''); setLink(''); setYear(''); setDescription(''); clearFile();
  };

  const handleAddNew = () => {
    setEditingId(null);
    setTitle(''); setLink(''); setYear(''); setDescription(''); clearFile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const inputStyles = {
    padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--panel-bg)', color: 'var(--text-primary)', width: '100%', transition: 'all 0.3s ease'
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <BookOpen className="accent-text" /> Publications
        </h1>
        <Button onClick={handleAddNew} variant="primary">
          <PlusCircle size={18} style={{ marginRight: '0.5rem' }} /> Add New Publication
        </Button>
      </div>
      
      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Left Column: Form */}
        <div style={{ flex: '1 1 400px', maxWidth: '500px', position: 'sticky', top: '100px' }}>
          <GlassCard style={{ border: editingId ? '1px solid var(--primary-color)' : '' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {editingId ? <CheckCircle className="text-primary" size={24} color="var(--primary-color)" /> : <PlusCircle className="text-accent" size={24} color="var(--accent-color)" />}
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{editingId ? 'Edit Publication' : 'Publish New Publication'}</h3>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Publication Title</label>
                  <input required value={title} onChange={e => setTitle(e.target.value)} style={inputStyles} placeholder="Publication Title" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Year</label>
                  <input required type="number" value={year} onChange={e => setYear(e.target.value)} style={inputStyles} placeholder="2024" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>External Link (URL)</label>
                <div style={{ position: 'relative' }}>
                  <LinkIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input required value={link} onChange={e => setLink(e.target.value)} style={{ ...inputStyles, paddingLeft: '40px' }} placeholder="https://doi.org/..." />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Rich Text Description</label>
                <RichEditor value={description} onChange={setDescription} />
              </div>

              {/* Drag and drop styled upload */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {editingId ? 'Upload New Document (Optional)' : 'Upload Document/Image'}
                </label>
                <div 
                  style={{ 
                    border: '2px dashed var(--glass-border)', borderRadius: '12px', padding: '2rem', textAlign: 'center', 
                    background: 'var(--panel-bg)', position: 'relative', transition: 'all 0.3s ease',
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
                  {uploading ? 'Processing...' : (editingId ? 'Save Changes' : 'Publish Entry')}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Right Column: List */}
        <div style={{ flex: '2 1 500px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {pubs.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', opacity: 0.5 }}>
                <BookOpen size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.2, display: 'block' }} />
                <p>No publications found.</p>
              </div>
            ) : (
              pubs.map(pub => (
                <GlassCard key={pub.id} style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {pub.fileUrl && (
                    <div style={{ width: '100%', height: '160px', background: 'var(--panel-border)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {pub.fileUrl.endsWith('.pdf') ? (
                        <FileText size={48} color="var(--primary-color)" />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={pub.fileUrl} alt={pub.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </div>
                  )}
                  
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.3 }}>{pub.title}</h4>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>University Of Global Village</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--panel-bg-hover)', padding: '4px 8px', borderRadius: '4px' }}>
                        <Calendar size={14} /> {pub.year}
                      </div>
                      {pub.link && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-alpha-10)', padding: '4px 8px', borderRadius: '4px' }}>
                          <LinkIcon size={14} color="var(--primary-color)" /> <a href={pub.link} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontWeight: 500 }}>Read Publication</a>
                        </div>
                      )}
                    </div>

                    {pub.description && (
                      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', fontSize: '0.875rem', color: 'var(--text-secondary)', flex: 1 }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(pub.description) }} />
                    )}
                    
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                      <button onClick={() => handleEdit(pub)} style={{ background: 'var(--panel-bg-hover)', border: 'none', color: 'var(--text-primary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }} className="hover:bg-white/10">
                        <Edit2 size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(pub.id)} style={{ background: 'var(--danger-alpha-10)', border: 'none', color: '#ff4d4f', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }} className="hover:bg-red-500/20">
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
