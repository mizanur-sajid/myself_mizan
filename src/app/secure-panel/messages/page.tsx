'use client';
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Search, Trash2, Archive, Inbox, User, Clock, CheckSquare, Square, Mail } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitize';

interface Message {
  id: number;
  name: string;
  email: string;
  content: string;
  createdAt: string;
  archived: boolean;
  deleted: boolean;
}

function formatBangladeshDateTime(value: string) {
  const date = new Date(value.replace(' ', 'T'));
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dhaka',
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date).replace(',', '');
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'inbox' | 'archived' | 'recycle'>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [readIds, setReadIds] = useState<Set<number>>(new Set()); // UI only placeholder
  const [expandedMsgId, setExpandedMsgId] = useState<number | null>(null);

  const fetchMessages = () => {
    fetch(`/api/messages.php?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMessages(data.map(m => ({
            ...m,
            archived: Boolean(Number(m.archived)),
            deleted: Boolean(Number(m.deleted))
          })));
        }
      })
      .catch(console.error);
  };

  useEffect(() => fetchMessages(), []);

  const handleArchive = async (id: number, currentStatus: boolean) => {
    await fetch('/api/messages.php', { method: 'PUT', headers: { 'X-CSRF-Token': sessionStorage.getItem('csrf_token') || '', 'Content-Type': 'application/json' }, body: JSON.stringify({ id, archived: !currentStatus }) });
    fetchMessages();
  };

  const handleSoftDelete = async (id: number, restore = false) => {
    await fetch('/api/messages.php', { method: 'PUT', headers: { 'X-CSRF-Token': sessionStorage.getItem('csrf_token') || '', 'Content-Type': 'application/json' }, body: JSON.stringify({ id, deleted: !restore }) });
    fetchMessages();
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Permanently delete this message?')) return;
    await fetch('/api/messages.php', { method: 'DELETE', headers: { 'X-CSRF-Token': sessionStorage.getItem('csrf_token') || '', 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchMessages();
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleBulkAction = async (action: 'archive' | 'delete' | 'restore' | 'permanent') => {
    if (selectedIds.size === 0) return;
    if (action === 'permanent' && !confirm('Permanently delete selected messages?')) return;
    
    // Process sequentially to avoid overwhelming SQLite/API
    for (const id of selectedIds) {
      if (action === 'archive') {
        const msg = messages.find(m => m.id === id);
        if (msg) await fetch('/api/messages.php', { method: 'PUT', headers: { 'X-CSRF-Token': sessionStorage.getItem('csrf_token') || '', 'Content-Type': 'application/json' }, body: JSON.stringify({ id, archived: true }) });
      } else if (action === 'delete') {
        await fetch('/api/messages.php', { method: 'PUT', headers: { 'X-CSRF-Token': sessionStorage.getItem('csrf_token') || '', 'Content-Type': 'application/json' }, body: JSON.stringify({ id, deleted: true }) });
      } else if (action === 'restore') {
        await fetch('/api/messages.php', { method: 'PUT', headers: { 'X-CSRF-Token': sessionStorage.getItem('csrf_token') || '', 'Content-Type': 'application/json' }, body: JSON.stringify({ id, deleted: false }) });
      } else if (action === 'permanent') {
        await fetch('/api/messages.php', { method: 'DELETE', headers: { 'X-CSRF-Token': sessionStorage.getItem('csrf_token') || '', 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      }
    }
    setSelectedIds(new Set());
    fetchMessages();
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredMessages.length && filteredMessages.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMessages.map(m => m.id)));
    }
  };

  const markAsRead = (id: number) => {
    setReadIds(prev => { const n = new Set(prev); n.add(id); return n; });
  };

  const filteredMessages = messages.filter(m => {
    const isDeleted = Boolean(Number(m.deleted));
    const isArchived = Boolean(Number(m.archived));
    
    const matchesTab = activeTab === 'recycle' ? isDeleted : (activeTab === 'archived' ? isArchived && !isDeleted : !isArchived && !isDeleted);
    const matchesSearch = (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (m.email || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (m.content || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => { setActiveTab(id); setSelectedIds(new Set()); }}
      style={{ 
        display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '10px 20px', borderRadius: '8px', fontWeight: 500, fontSize: '0.95rem',
        background: activeTab === id ? 'var(--primary-alpha-10)' : 'transparent',
        color: activeTab === id ? 'var(--primary-color)' : 'var(--text-secondary)',
        border: activeTab === id ? '1px solid var(--primary-alpha-20)' : '1px solid transparent',
        transition: 'all 0.2s', cursor: 'pointer'
      }}
    >
      <Icon size={18} /> {label}
    </button>
  );

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .message-content,
        .message-content * {
          max-width: 100%;
        }

        .message-content img,
        .message-content video,
        .message-content iframe,
        .message-content table,
        .message-content pre,
        .message-content code {
          max-width: 100%;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
      ` }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <p className="accent-text" style={{ marginBottom: '0.5rem' }}>Communication</p>
          <h2 style={{ fontSize: '3rem', margin: 0 }}>Inbox</h2>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--panel-bg)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <TabButton id="inbox" label="Inbox" icon={Inbox} />
            <TabButton id="archived" label="Archived" icon={Archive} />
            <TabButton id="recycle" label="Recycle Bin" icon={Trash2} />
          </div>
          
          <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--panel-bg)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div style={{ padding: '1rem', background: 'var(--primary-alpha-10)', borderRadius: '8px', border: '1px solid var(--primary-alpha-20)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'fadeIn 0.2s', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{selectedIds.size} message(s) selected</span>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {activeTab === 'inbox' && <button onClick={() => handleBulkAction('archive')} style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Archive size={16}/> Archive</button>}
              {activeTab !== 'recycle' ? (
                <button onClick={() => handleBulkAction('delete')} style={{ background: 'transparent', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Trash2 size={16}/> Delete</button>
              ) : (
                <>
                  <button onClick={() => handleBulkAction('restore')} style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Inbox size={16}/> Restore</button>
                  <button onClick={() => handleBulkAction('permanent')} style={{ background: 'transparent', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Trash2 size={16}/> Permanently Delete</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Message List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 1.5rem', marginBottom: '0.5rem', opacity: 0.6 }}>
            <button onClick={toggleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, display: 'flex' }}>
              {selectedIds.size === filteredMessages.length && filteredMessages.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
            </button>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '1rem' }}>Select All</span>
          </div>

          {filteredMessages.length === 0 ? (
            <GlassCard style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Mail size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto', display: 'block' }} />
              <p style={{ opacity: 0.5, margin: 0 }}>No messages found.</p>
            </GlassCard>
          ) : (
            filteredMessages.map(msg => {
              const isSelected = selectedIds.has(msg.id);
              const isUnread = !readIds.has(msg.id) && activeTab === 'inbox';
              return (
                <GlassCard 
                  key={msg.id} 
                  style={{ 
                    padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
                    border: isSelected ? '1px solid var(--primary-color)' : '1px solid var(--glass-border)',
                    background: isUnread ? 'var(--panel-bg-hover)' : 'var(--panel-border)',
                    transition: 'all 0.2s ease', cursor: 'pointer', overflow: 'hidden'
                  }}
                  onClick={() => { markAsRead(msg.id); }}
                >
                  <button onClick={(e) => { e.stopPropagation(); toggleSelect(msg.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSelected ? 'var(--primary-color)' : 'var(--text-secondary)', padding: 0, display: 'flex', marginTop: '4px' }}>
                    {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>
                  
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={20} color="var(--text-secondary)" />
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <h4 style={{ fontSize: '1.1rem', margin: 0, color: isUnread ? '#fff' : 'var(--text-primary)', fontWeight: isUnread ? 600 : 400 }}>{msg.name}</h4>
                        {isUnread && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-color)' }} />}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={14} />
                          <span>{formatBangladeshDateTime(msg.createdAt)}</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--primary-color)' }}>BST / Dhaka</span>
                      </div>
                    </div>
                    
                    <a href={`mailto:${msg.email}`} style={{ fontSize: '0.875rem', color: 'var(--primary-color)', display: 'inline-block', marginBottom: '1rem', wordBreak: 'break-word' }} onClick={e => e.stopPropagation()}>{msg.email}</a>
                    
                    <div className="message-content" style={{ fontSize: '0.95rem', lineHeight: 1.6, color: isUnread ? 'var(--text-primary)' : 'var(--text-secondary)', overflowWrap: 'anywhere', wordBreak: 'break-word', maxWidth: '100%', ...(expandedMsgId !== msg.id ? { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}) }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(msg.content) }} />
                    
                    {msg.content && msg.content.length > 150 && (
                      <button onClick={(e) => { e.stopPropagation(); setExpandedMsgId(expandedMsgId === msg.id ? null : msg.id); }} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', padding: '0', marginTop: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                        {expandedMsgId === msg.id ? 'Show Less' : 'Read Full Message'}
                      </button>
                    )}
                    
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--panel-bg-hover)', paddingTop: '1rem', flexWrap: 'wrap' }}>
                      <a href={`mailto:${msg.email}`} onClick={e => e.stopPropagation()} style={{ background: 'var(--primary-alpha-10)', border: '1px solid var(--primary-alpha-20)', color: 'var(--primary-color)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                        <Mail size={14} /> Reply
                      </a>
                      {activeTab !== 'recycle' ? (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); handleArchive(msg.id, msg.archived); }} style={{ background: 'var(--panel-bg-hover)', border: 'none', color: 'var(--text-primary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover:bg-white/10">
                            <Archive size={14} /> {msg.archived ? 'Move to Inbox' : 'Archive'}
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleSoftDelete(msg.id); }} style={{ background: 'var(--danger-alpha-10)', border: 'none', color: '#ff4d4f', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover:bg-red-500/20">
                            <Trash2 size={14} /> Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); handleSoftDelete(msg.id, true); }} style={{ background: 'var(--primary-alpha-10)', border: 'none', color: 'var(--primary-color)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover:bg-cyan-500/20">
                            <Inbox size={14} /> Restore
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }} style={{ background: 'var(--danger-alpha-10)', border: 'none', color: '#ff4d4f', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover:bg-red-500/20">
                            <Trash2 size={14} /> Permanently Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
