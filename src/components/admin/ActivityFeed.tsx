import { GlassCard } from '@/components/ui/GlassCard';

export const ActivityFeed = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
      <GlassCard>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Top Referrers</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { site: 'google.com', visits: 1205 },
            { site: 'github.com', visits: 840 },
            { site: 'linkedin.com', visits: 630 },
            { site: 'twitter.com', visits: 215 },
          ].map(ref => (
            <div key={ref.site} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{ref.site}</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{ref.visits}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Recent Activity Feed</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[
            { action: 'New message received', time: '5 minutes ago', type: 'message' },
            { action: 'Updated project "Public Sector"', time: '2 hours ago', type: 'update' },
            { action: 'New visitor from San Francisco', time: '3 hours ago', type: 'visitor' },
            { action: 'Added new skill "React Native"', time: 'Yesterday', type: 'add' },
          ].map((act, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: act.type === 'message' ? 'var(--primary-color)' : 'var(--accent-color)', marginTop: '6px' }} />
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{act.action}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{act.time}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
