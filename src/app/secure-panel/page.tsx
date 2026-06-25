'use client';
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { AdminCharts } from '@/components/admin/AdminCharts';
import { ActivityFeed } from '@/components/admin/ActivityFeed';
import { Users, Eye, Mail, BookOpen, Code, Briefcase, Award } from 'lucide-react';

export default function AdminDashboard() {
  const [messagesCount, setMessagesCount] = useState(0);
  const [skillsCount, setSkillsCount] = useState(0);
  const [pubsCount, setPubsCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [certsCount, setCertsCount] = useState(0);
  const [views, setViews] = useState(0);

  useEffect(() => {
    // Fetch stats
    fetch('/api/stats.php').then(r => r.json()).then(d => setViews(d.views || 0)).catch(() => {});
    
    // Fetch counts by getting arrays and measuring length
    fetch(`/api/messages.php?t=${Date.now()}`).then(r => r.json()).then(d => setMessagesCount(Array.isArray(d) ? d.length : 0)).catch(() => {});
    fetch(`/api/skills.php?t=${Date.now()}`).then(r => r.json()).then(d => setSkillsCount(Array.isArray(d) ? d.length : 0)).catch(() => {});
    fetch(`/api/publications.php?t=${Date.now()}`).then(r => r.json()).then(d => setPubsCount(Array.isArray(d) ? d.length : 0)).catch(() => {});
    fetch(`/api/projects.php?t=${Date.now()}`).then(r => r.json()).then(d => setProjectsCount(Array.isArray(d) ? d.length : 0)).catch(() => {});
    fetch(`/api/certifications.php?t=${Date.now()}`).then(r => r.json()).then(d => setCertsCount(Array.isArray(d) ? d.length : 0)).catch(() => {});
  }, []);
  
  // Mock data for advanced stats
  const uniqueVisitors = Math.floor(views * 0.6) || 1205;
  const dailyVisits = 142;
  const weeklyVisits = 980;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <p className="accent-text" style={{ marginBottom: '0.5rem' }}>System Status</p>
          <h1 style={{ fontSize: '3rem', margin: 0 }}>Command Center</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Traffic Overview */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '8px', background: 'var(--primary-alpha-10)', borderRadius: '8px', color: 'var(--primary-color)' }}>
              <Eye size={20} />
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 600 }}>Traffic Overview</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flex: 1 }}>
            <div style={{ background: 'var(--panel-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', transition: 'background 0.2s' }} className="hover:bg-white/5">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>Total Views</p>
              <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-space)', margin: 0, fontWeight: 700, color: 'var(--primary-color)' }}>{views}</p>
            </div>
            <div style={{ background: 'var(--panel-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', transition: 'background 0.2s' }} className="hover:bg-white/5">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>Unique Visitors</p>
              <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-space)', margin: 0, fontWeight: 700 }}>{uniqueVisitors}</p>
            </div>
            <div style={{ background: 'var(--panel-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', transition: 'background 0.2s' }} className="hover:bg-white/5">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>Daily Visits</p>
              <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-space)', margin: 0, fontWeight: 700 }}>{dailyVisits}</p>
            </div>
            <div style={{ background: 'var(--panel-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', transition: 'background 0.2s' }} className="hover:bg-white/5">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>Weekly Visits</p>
              <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-space)', margin: 0, fontWeight: 700 }}>{weeklyVisits}</p>
            </div>
          </div>
        </GlassCard>

        {/* Portfolio Summary */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '8px', background: 'var(--accent-alpha-10)', borderRadius: '8px', color: 'var(--accent-color)' }}>
              <Briefcase size={20} />
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 600 }}>Portfolio Summary</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flex: 1 }}>
            <div style={{ background: 'var(--panel-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', transition: 'background 0.2s' }} className="hover:bg-white/5">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}><BookOpen size={14} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> Publications</p>
              <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-space)', margin: 0, fontWeight: 700, color: 'var(--accent-color)' }}>{pubsCount}</p>
            </div>
            <div style={{ background: 'var(--panel-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', transition: 'background 0.2s' }} className="hover:bg-white/5">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}><Award size={14} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> Certifications</p>
              <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-space)', margin: 0, fontWeight: 700 }}>{certsCount}</p>
            </div>
            <div style={{ background: 'var(--panel-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', transition: 'background 0.2s' }} className="hover:bg-white/5">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}><Briefcase size={14} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> Projects</p>
              <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-space)', margin: 0, fontWeight: 700 }}>{projectsCount}</p>
            </div>
            <div style={{ background: 'var(--panel-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', transition: 'background 0.2s' }} className="hover:bg-white/5">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}><Code size={14} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> Active Skills</p>
              <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-space)', margin: 0, fontWeight: 700 }}>{skillsCount}</p>
            </div>
          </div>
        </GlassCard>

        {/* Notifications */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', border: messagesCount > 0 ? '1px solid var(--primary-color)' : '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '8px', background: messagesCount > 0 ? 'var(--primary-alpha-20)' : 'var(--panel-bg-hover)', borderRadius: '8px', color: messagesCount > 0 ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
              <Mail size={20} />
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 600 }}>Action Required</h3>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '1rem', background: 'var(--panel-bg)', borderRadius: '8px', border: '1px solid var(--glass-border)', textAlign: 'center', transition: 'background 0.2s' }} className="hover:bg-white/5">
            {messagesCount > 0 ? (
              <>
                <p style={{ fontSize: '3.5rem', fontFamily: 'var(--font-space)', margin: 0, fontWeight: 700, color: 'var(--primary-color)', lineHeight: 1 }}>{messagesCount}</p>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Unread Messages</p>
                <a href="/admin/messages" style={{ marginTop: '1.5rem', display: 'inline-block', padding: '8px 16px', background: 'var(--primary-alpha-10)', color: 'var(--primary-color)', borderRadius: '6px', fontSize: '0.9rem', border: '1px solid var(--primary-alpha-20)', textDecoration: 'none', transition: 'background 0.2s' }} className="hover:bg-cyan-500/20">Go to Inbox ↗</a>
              </>
            ) : (
              <>
                <Mail size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-primary)' }}>All caught up!</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>No new messages to review.</p>
              </>
            )}
          </div>
        </GlassCard>
      </div>

      <AdminCharts />
      <ActivityFeed />
    </div>
  );
}
