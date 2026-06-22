import { GlassCard } from '@/components/ui/GlassCard';
import { prisma } from '@/lib/prisma';
import { AdminCharts } from '@/components/admin/AdminCharts';
import { ActivityFeed } from '@/components/admin/ActivityFeed';
import { Users, Eye, Mail, BookOpen, Code, Briefcase, Award } from 'lucide-react';

export default async function AdminDashboard() {
  const [messagesCount, skillsCount, pubsCount, projectsCount, certsCount, siteStat] = await Promise.all([
    prisma.message.count({ where: { deleted: false } }),
    prisma.skill.count(),
    prisma.publication.count(),
    prisma.project.count(),
    prisma.certification.count(),
    prisma.siteStat.findUnique({ where: { id: 1 } })
  ]);

  const views = siteStat?.views || 0;
  
  // Mock data for advanced stats
  const uniqueVisitors = Math.floor(views * 0.6) || 1205;
  const dailyVisits = 142;
  const weeklyVisits = 980;

  const statCards = [
    { title: 'Total Views', value: views, icon: <Eye size={24} />, color: 'var(--primary-color)' },
    { title: 'Unique Visitors', value: uniqueVisitors, icon: <Users size={24} />, color: 'var(--accent-color)' },
    { title: 'Daily Visits', value: dailyVisits, icon: <Eye size={24} />, color: 'var(--primary-color)' },
    { title: 'Weekly Visits', value: weeklyVisits, icon: <Eye size={24} />, color: 'var(--accent-color)' },
    { title: 'Unread Messages', value: messagesCount, icon: <Mail size={24} />, color: 'var(--primary-color)' },
    { title: 'Active Skills', value: skillsCount, icon: <Code size={24} />, color: 'var(--accent-color)' },
    { title: 'Publications', value: pubsCount, icon: <BookOpen size={24} />, color: 'var(--primary-color)' },
    { title: 'Certifications', value: certsCount, icon: <Award size={24} />, color: 'var(--accent-color)' },
    { title: 'Projects', value: projectsCount, icon: <Briefcase size={24} />, color: 'var(--primary-color)' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <p className="accent-text" style={{ marginBottom: '0.5rem' }}>System Status</p>
          <h1 style={{ fontSize: '3rem', margin: 0 }}>Command Center</h1>
        </div>
      </div>
      
      <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {statCards.map((stat, i) => (
          <GlassCard key={i} style={{ borderTop: `4px solid ${stat.color}`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.title}</h3>
              <div style={{ opacity: 0.8, color: stat.color }}>{stat.icon}</div>
            </div>
            <p style={{ fontSize: '3.5rem', fontFamily: 'var(--font-space)', fontWeight: 700, lineHeight: 1, margin: 0 }}>{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      <AdminCharts />
      <ActivityFeed />
    </div>
  );
}
