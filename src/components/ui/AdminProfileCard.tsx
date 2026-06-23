'use client';
import { useState, useRef, useEffect } from 'react';
import { LogoutButton } from './LogoutButton';
import { ImageCropperModal } from './ImageCropperModal';

export const AdminProfileCard = () => {
  const [avatarUrl, setAvatarUrl] = useState('/admin-avatar.png');
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  
  const [name, setName] = useState('mizanursajid');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/settings.php')
      .then(r => r.json())
      .then(d => {
        if (d.name) setName(d.name);
      })
      .catch(console.error);
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
    setShowMenu(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setCropImageSrc(url);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setCropImageSrc(null);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', croppedBlob, 'avatar.png');

    try {
      const res = await fetch('/api/avatar.php', { method: 'POST', body: formData });
      if (res.ok) {
        setTimestamp(Date.now());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm('Are you sure you want to remove your profile picture?')) return;
    setUploading(true);
    setShowMenu(false);
    try {
      await fetch('/api/avatar.php', { method: 'DELETE' });
      setTimestamp(Date.now());
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleNameSave = async () => {
    setIsEditingName(false);
    if (!tempName.trim()) return;
    
    setName(tempName);
    try {
      await fetch('/api/settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tempName })
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '1.25rem 0.75rem', background: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '0.5rem', position: 'relative' }}>
      
      {cropImageSrc && (
        <ImageCropperModal 
          imageSrc={cropImageSrc} 
          onClose={() => setCropImageSrc(null)} 
          onCropComplete={handleCropComplete} 
        />
      )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => setShowMenu(!showMenu)}
              style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 'bold', 
              color: '#fff',
              fontSize: '1.25rem',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              border: showMenu ? '2px solid var(--primary-color)' : '2px solid transparent',
              transition: 'border 0.2s'
            }}
          >
            {uploading ? (
              <span style={{ fontSize: '0.75rem' }}>...</span>
            ) : (
              <img 
                src={timestamp ? `${avatarUrl}?t=${timestamp}` : avatarUrl} 
                alt="A" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={(e) => {
                  e.currentTarget.style.display = 'block';
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            )}
          </div>

          {/* Popover Menu */}
          {showMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '0.5rem',
              background: 'var(--bg-color)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              padding: '0.5rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              zIndex: 10,
              minWidth: '120px'
            }}>
              <button onClick={handleUploadClick} style={{ background: 'transparent', border: 'none', textAlign: 'left', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px', color: 'var(--text-primary)', whiteSpace: 'nowrap' }} className="hover:bg-white/5">Upload Photo</button>
              <button onClick={handleRemove} style={{ background: 'transparent', border: 'none', textAlign: 'left', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px', color: '#ff4d4f', whiteSpace: 'nowrap' }} className="hover:bg-white/5">Remove Photo</button>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>
        
        <div style={{ flex: 1, minWidth: 0, paddingRight: '0.25rem' }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary-color)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Administrator</p>
          
          {isEditingName ? (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <input 
                autoFocus
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleNameSave(); }}
                onBlur={handleNameSave}
                style={{ 
                  background: 'var(--panel-bg-hover)', 
                  border: '1px solid var(--primary-color)', 
                  color: 'var(--text-primary)', 
                  padding: '2px 6px', 
                  borderRadius: '4px', 
                  fontSize: '0.875rem',
                  width: '100%'
                }} 
              />
            </div>
          ) : (
            <p 
              onClick={() => { setTempName(name); setIsEditingName(true); }}
              title="Click to edit name"
              style={{ 
                margin: 0, 
                fontSize: '0.875rem', 
                opacity: 0.8, 
                cursor: 'pointer',
                borderBottom: '1px dashed var(--panel-border)',
                display: 'inline-block'
              }}
              className="hover:text-primary"
            >
              {name}
            </p>
          )}
        </div>
      </div>
      <LogoutButton />
    </div>
  );
};
