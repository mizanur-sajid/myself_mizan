import { GlassCard } from '@/components/ui/GlassCard';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const [messagesCount, skillsCount, pubsCount, siteStat] = await Promise.all([
    prisma.message.count(),
    prisma.skill.count(),
    prisma.publication.count(),
    prisma.siteStat.findUnique({ where: { id: 1 } })
  ]);

  const views = siteStat?.views || 0;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <p className="accent-text" style={{ marginBottom: '0.5rem' }}>System Status</p>
      <h1 style={{ fontSize: '3rem', marginBottom: '3rem' }}>Command Center</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <GlassCard style={{ borderTop: '4px solid var(--accent-color)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Portfolio Views</h3>
          <p style={{ fontSize: '3.5rem', fontFamily: 'var(--font-space)', fontWeight: 700, lineHeight: 1 }}>{views}</p>
          <div style={{ width: '100%', height: '2px', background: 'var(--glass-border)', marginTop: '2rem' }}></div>
        </GlassCard>

        <GlassCard>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unread Messages</h3>
          <p style={{ fontSize: '3.5rem', fontFamily: 'var(--font-space)', fontWeight: 700, lineHeight: 1 }}>{messagesCount}</p>
          <div style={{ width: '100%', height: '2px', background: 'var(--glass-border)', marginTop: '2rem' }}></div>
        </GlassCard>
        
        <GlassCard>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Skills</h3>
          <p style={{ fontSize: '3.5rem', fontFamily: 'var(--font-space)', fontWeight: 700, lineHeight: 1 }}>{skillsCount}</p>
          <div style={{ width: '100%', height: '2px', background: 'var(--glass-border)', marginTop: '2rem' }}></div>
        </GlassCard>
        
        <GlassCard>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Publications</h3>
          <p style={{ fontSize: '3.5rem', fontFamily: 'var(--font-space)', fontWeight: 700, lineHeight: 1 }}>{pubsCount}</p>
          <div style={{ width: '100%', height: '2px', background: 'var(--glass-border)', marginTop: '2rem' }}></div>
        </GlassCard>
      </div>
    </div>
  );
}
