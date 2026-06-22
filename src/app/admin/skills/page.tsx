'use client';
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { RichEditor } from '@/components/ui/RichEditor';
import { Search, Edit2, Trash2, PlusCircle, CheckCircle, Code } from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  level: number;
  category: string;
  icon: string;
  description: string;
}

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('Technical Skills');
  const [icon, setIcon] = useState('code');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSkills = () => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setSkills(data); })
      .catch(console.error);
  };

  useEffect(() => fetchSkills(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch('/api/skills', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, name, level: parseInt(level), category, icon, description }) });
      setEditingId(null);
    } else {
      await fetch('/api/skills', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, level: parseInt(level), category, icon, description }) });
    }
    setName(''); setLevel(''); setCategory('Technical Skills'); setIcon('code'); setDescription('');
    fetchSkills();
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setName(skill.name);
    setLevel(skill.level.toString());
    setCategory(skill.category || 'Technical Skills');
    setIcon(skill.icon || 'code');
    setDescription(skill.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    await fetch('/api/skills', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchSkills();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName(''); setLevel(''); setCategory('Technical Skills'); setIcon('code'); setDescription('');
  };

  const filteredSkills = skills.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const inputStyles = {
    padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)', width: '100%', transition: 'all 0.3s ease'
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <p className="accent-text" style={{ marginBottom: '0.5rem' }}>Database Configuration</p>
          <h2 style={{ fontSize: '3rem', margin: 0 }}>Skill Matrices</h2>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Left Column: Form */}
        <div style={{ flex: '1 1 400px', maxWidth: '500px', position: 'sticky', top: '100px' }}>
          <GlassCard style={{ border: editingId ? '1px solid var(--primary-color)' : '' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {editingId ? <CheckCircle className="text-primary" size={24} color="var(--primary-color)" /> : <PlusCircle className="text-accent" size={24} color="var(--accent-color)" />}
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{editingId ? 'Edit Skill Entry' : 'Append New Skill'}</h3>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Skill Identifier</label>
                  <input required value={name} onChange={e => setName(e.target.value)} style={inputStyles} placeholder="e.g. React.js" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Proficiency</label>
                  <input required type="number" min="1" max="100" value={level} onChange={e => setLevel(e.target.value)} style={inputStyles} placeholder="85" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Category</label>
                  <select required value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyles, appearance: 'none', background: 'rgba(255,255,255,0.05)' }}>
                    <option value="Technical Skills">Technical Skills</option>
                    <option value="Professional Skills">Professional Skills</option>
                    <option value="Programming & Frameworks">Programming & Frameworks</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Icon Name / SVG Class</label>
                  <input required value={icon} onChange={e => setIcon(e.target.value)} style={inputStyles} placeholder="e.g. simple-icons:python or lucide:code" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Rich Text Description</label>
                <RichEditor value={description} onChange={setDescription} />
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
              placeholder="Search skills by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)', fontSize: '1rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filteredSkills.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', opacity: 0.5 }}>
                <Code size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.2, display: 'block' }} />
                <p>No skills found.</p>
              </div>
            ) : (
              filteredSkills.map(skill => (
                <GlassCard key={skill.id} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{skill.name}</h4>
                    <span style={{ fontFamily: 'var(--font-space)', color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: 600 }}>{skill.level}%</span>
                  </div>
                  <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', height: '6px', borderRadius: '3px', marginBottom: '1rem', overflow: 'hidden' }}>
                    <div style={{ width: `${skill.level}%`, background: 'var(--primary-color)', height: '100%', borderRadius: '3px', transition: 'width 1s ease-out' }}></div>
                  </div>
                  {skill.description && (
                    <div style={{ padding: '1rem 0', borderTop: '1px solid var(--glass-border)', fontSize: '0.875rem', color: 'var(--text-secondary)', flex: 1 }} dangerouslySetInnerHTML={{ __html: skill.description }} />
                  )}
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem', borderTop: skill.description ? 'none' : '1px solid var(--glass-border)' }}>
                    <button onClick={() => handleEdit(skill)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-primary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }} className="hover:bg-white/10">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(skill.id)} style={{ background: 'rgba(255, 77, 79, 0.1)', border: 'none', color: '#ff4d4f', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }} className="hover:bg-red-500/20">
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
