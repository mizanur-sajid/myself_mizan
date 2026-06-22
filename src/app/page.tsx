import Image from 'next/image';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { ContactForm } from '../components/ui/ContactForm';
import { StickyNav } from '../components/ui/StickyNav';
import { SkillIcon } from '../components/ui/SkillIcon';
import { SirenText } from '../components/ui/SirenText';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Home() {
  await prisma.siteStat.upsert({
    where: { id: 1 },
    update: { views: { increment: 1 } },
    create: { id: 1, views: 1 },
  });

  const rawSkills = await prisma.$queryRawUnsafe('SELECT * FROM Skill') as any[];
  const skills = rawSkills.sort((a, b) => {
    if (a.name.toLowerCase() === 'python') return -1;
    if (b.name.toLowerCase() === 'python') return 1;
    if (a.name.toLowerCase() === 'it support') return 1;
    if (b.name.toLowerCase() === 'it support') return -1;
    return a.id - b.id;
  });
  const publications = await prisma.publication.findMany();
  const certifications = await prisma.certification.findMany();
  const projects = await prisma.project.findMany();

  return (
    <main style={{ padding: '0 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <StickyNav />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
      <section className="hero-section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', gap: '4rem', flexWrap: 'wrap-reverse' }}>
        <div style={{ maxWidth: '600px', zIndex: 10, flex: '1 1 400px' }}>
          <SirenText />
          <h2 className="section-title" style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', marginBottom: '1.5rem', lineHeight: 1.05 }}>
            Mizanur <br />
            <span className="gradient-text">Rahman</span>.
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '3rem', opacity: 0.7, maxWidth: '600px', lineHeight: 1.6 }}>
            Computer Science and IT Engineer with strong problem-solving skills and a passion for building practical technology solutions. Ready to contribute to impactful projects while continuously expanding professional expertise.
          </p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="#contact">
              <Button variant="primary">Start a Project</Button>
            </a>
            <a href="/Mizan_CV.pdf" download>
              <Button variant="outline">View Résumé</Button>
            </a>
          </div>
        </div>
        <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 'clamp(250px, 30vw, 400px)', height: 'clamp(250px, 30vw, 400px)', borderRadius: '50%', padding: '10px', background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', boxShadow: '0 20px 50px -10px rgba(0,240,255,0.3)' }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: 'var(--bg-color)' }}>
              <Image src="/profile.png" alt="Mizan Profile" fill style={{ objectFit: 'cover' }} priority />
            </div>
          </div>
        </div>
      </section>

      <section id="skills" style={{ padding: '4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
          <div>
            <p className="accent-text" style={{ marginBottom: '0.5rem' }}>Core Competencies</p>
            <h2 className="section-title" style={{ fontSize: '3rem' }}>Technical Skills</h2>
          </div>
        </div>
        
        <div>
          {skills.length > 0 ? (
            Object.entries(skills.reduce((acc, skill) => {
              const cat = skill.category === 'Technical Skills' ? 'Technical Skills' : 'Additional Skills';
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(skill);
              return acc;
            }, { 'Technical Skills': [], 'Additional Skills': [] } as Record<string, typeof skills>))
            .filter(([_, catSkills]) => catSkills.length > 0)
            .map(([category, catSkills]) => (
              <div key={category} style={{ marginBottom: '4rem' }}>
                {category === 'Additional Skills' && (
                  <h3 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--text-primary)', fontWeight: 600 }}>Additional Skills</h3>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', alignItems: 'center' }}>
                  {catSkills.map(skill => (
                    <div key={skill.id} className="skill-icon-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                      <span className="skill-svg-container" style={{ color: 'var(--text-primary)', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <SkillIcon name={skill.icon || 'code'} size={48} />
                      </span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500, transition: 'color 0.3s ease' }} className="skill-name-text">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p style={{ opacity: 0.5 }}>System awaiting skill initialization...</p>
          )}
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          .skill-icon-wrapper:hover .skill-svg-container {
            color: var(--primary-color) !important;
            transform: translateY(-8px) scale(1.15);
          }
          .skill-icon-wrapper:hover .skill-name-text {
            color: var(--text-primary) !important;
          }
        `}} />
      </section>

      <section id="publications" style={{ padding: '4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
          <div>
            <p className="accent-text" style={{ marginBottom: '0.5rem' }}>Academic Research</p>
            <h2 className="section-title" style={{ fontSize: '3rem' }}>Publications</h2>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {publications.length > 0 ? publications.map(pub => (
            <GlassCard key={pub.id} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{pub.title}</h3>
                  <p style={{ fontSize: '0.9rem', margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' }}>University Of Global Village</p>
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--primary-color)', fontFamily: 'var(--font-space)' }}>{pub.year}</span>
              </div>
              <a href={pub.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', opacity: 0.8, textDecoration: 'underline' }}>Read Publication ↗</a>
              {pub.fileUrl && <a href={pub.fileUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontSize: '0.875rem', display: 'block', margin: '0.5rem 0' }}>View Uploaded Document</a>}
              {pub.description && <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', fontSize: '0.9rem' }} dangerouslySetInnerHTML={{ __html: pub.description }} />}
            </GlassCard>
          )) : (
            <p style={{ opacity: 0.5 }}>System awaiting publications...</p>
          )}
        </div>
      </section>

      <section id="certifications" style={{ padding: '4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
          <div>
            <p className="accent-text" style={{ marginBottom: '0.5rem' }}>Professional Validation</p>
            <h2 className="section-title" style={{ fontSize: '3rem' }}>Certifications</h2>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {certifications.length > 0 ? certifications.map(cert => (
            <GlassCard key={cert.id} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{cert.name}</h3>
                <p style={{ opacity: 0.7, fontSize: '0.95rem' }}>{cert.issuer}</p>
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--primary-color)', fontFamily: 'var(--font-space)' }}>{cert.year}</span>
                {cert.fileUrl ? (
                  <a href={cert.fileUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)', fontSize: '0.9rem', textDecoration: 'underline', opacity: 0.8 }} className="hover:text-primary transition-colors">View Credentials ↗</a>
                ) : (
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', opacity: 0.5, cursor: 'not-allowed' }}>Credentials Unavailable</span>
                )}
              </div>
              {cert.description && <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', fontSize: '0.9rem' }} dangerouslySetInnerHTML={{ __html: cert.description }} />}
            </GlassCard>
          )) : (
            <p style={{ opacity: 0.5 }}>System awaiting certifications...</p>
          )}
        </div>
      </section>

      <section id="projects" style={{ padding: '4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
          <div>
            <p className="accent-text" style={{ marginBottom: '0.5rem' }}>Showcase</p>
            <h2 className="section-title" style={{ fontSize: '3rem' }}>Projects</h2>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {projects.length > 0 ? projects.map(project => (
            <GlassCard key={project.id} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{project.title}</h3>
                <span style={{ fontSize: '0.875rem', color: 'var(--primary-color)', fontFamily: 'var(--font-space)' }}>{project.year}</span>
              </div>
              {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="visit-site-btn">Live Demo ↗</a>}
              {project.fileUrl && <a href={project.fileUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontSize: '0.875rem', display: 'block', margin: '0.5rem 0' }}>View Image</a>}
              {project.description && <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', fontSize: '0.9rem' }} dangerouslySetInnerHTML={{ __html: project.description }} />}
            </GlassCard>
          )) : (
            <p style={{ opacity: 0.5 }}>System awaiting projects...</p>
          )}
        </div>
      </section>

      <section id="contact" style={{ padding: '6rem 0 10rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p className="accent-text" style={{ marginBottom: '0.5rem' }}>Initiate Connection</p>
          <h2 className="section-title" style={{ fontSize: '3rem' }}>Let's Build Something.</h2>
        </div>
        <ContactForm />
      </section>

      <footer style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid var(--glass-border)', marginTop: '2rem' }}>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Made with ❤️ and passion by Mizanur Rahman
        </p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-space)' }}>
          &copy; 2026 All Rights Reserved
        </p>
      </footer>
      </div>
    </main>
  );
}
