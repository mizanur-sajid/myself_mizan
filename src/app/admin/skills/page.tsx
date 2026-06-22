'use client';
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { RichEditor } from '@/components/ui/RichEditor';

interface Skill {
  id: number;
  name: string;
  level: number;
  description: string;
}

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchSkills = () => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSkills(data);
      })
      .catch(console.error);
  };

  useEffect(() => fetchSkills(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch('/api/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, name, level: parseInt(level), description })
      });
      setEditingId(null);
    } else {
      await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, level: parseInt(level), description })
      });
    }
    setName('');
    setLevel('');
    setDescription('');
    fetchSkills();
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setName(skill.name);
    setLevel(skill.level.toString());
    setDescription(skill.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    await fetch('/api/skills', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchSkills();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName(''); setLevel(''); setDescription('');
  };

  const inputStyles = {
    padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)', width: '100%', transition: 'all 0.3s ease'
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <p className="accent-text" style={{ marginBottom: '0.5rem' }}>Database Configuration</p>
      <h2 style={{ fontSize: '3rem', marginBottom: '3rem' }}>Skill Matrices</h2>
      
      <GlassCard className="mb-4" style={{ marginBottom: '4rem', maxWidth: '800px', border: editingId ? '1px solid var(--primary-color)' : '' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>{editingId ? 'Edit Skill Entry' : 'Append New Skill'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Skill Identifier</label>
              <input required value={name} onChange={e => setName(e.target.value)} style={inputStyles} placeholder="e.g. React.js" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Proficiency (1-100)</label>
              <input required type="number" min="1" max="100" value={level} onChange={e => setLevel(e.target.value)} style={inputStyles} placeholder="85" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Rich Text Description</label>
            <RichEditor value={description} onChange={setDescription} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-end' }}>
            {editingId && <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>}
            <Button type="submit" variant="primary">{editingId ? 'Save Changes' : 'Initialize'}</Button>
          </div>
        </form>
      </GlassCard>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {skills.map(skill => (
          <GlassCard key={skill.id} style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{skill.name}</h4>
              <span style={{ fontFamily: 'var(--font-space)', opacity: 0.5, fontSize: '0.875rem' }}>{skill.level}%</span>
            </div>
            <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', height: '6px', borderRadius: '3px' }}>
              <div style={{ width: `${skill.level}%`, background: 'var(--primary-color)', height: '100%', borderRadius: '3px' }}></div>
            </div>
            {skill.description && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', fontSize: '0.875rem' }} dangerouslySetInnerHTML={{ __html: skill.description }} />
            )}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button onClick={() => handleEdit(skill)} style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
              <button onClick={() => handleDelete(skill.id)} style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: '#ff4d4f', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
