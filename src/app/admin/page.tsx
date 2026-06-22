import { GlassCard } from '@/components/ui/GlassCard';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="gradient-text" style={{ marginBottom: '2rem' }}>Welcome, Admin</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <GlassCard>
          <h3>Total Messages</h3>
          <p className="neon-text" style={{ fontSize: '2rem', marginTop: '1rem' }}>0</p>
        </GlassCard>
        <GlassCard>
          <h3>Total Skills</h3>
          <p className="neon-text" style={{ fontSize: '2rem', marginTop: '1rem' }}>0</p>
        </GlassCard>
        <GlassCard>
          <h3>Publications</h3>
          <p className="neon-text" style={{ fontSize: '2rem', marginTop: '1rem' }}>0</p>
        </GlassCard>
      </div>
    </div>
  );
}
