import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { ThemeToggle } from '../components/shared/ThemeToggle';

export default function Home() {
  return (
    <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="gradient-text" style={{ fontSize: '2rem', margin: 0 }}>Mizan.</h1>
        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="#about" style={{ fontWeight: 'bold' }}>About Me</a>
          <a href="#skills" style={{ fontWeight: 'bold' }}>Skills</a>
          <a href="#publications" style={{ fontWeight: 'bold' }}>Publications</a>
          <a href="#contact" style={{ fontWeight: 'bold' }}>Contact</a>
          <ThemeToggle />
        </nav>
      </header>

      <section style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <GlassCard className="hero-card" style={{ maxWidth: '800px', textAlign: 'center', padding: '4rem 2rem' }}>
          <h2 className="neon-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to the Future</h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
            I am a full-stack developer blending elegant aesthetics with futuristic design patterns.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button variant="primary">Hire Me</Button>
            <Button variant="neon">
              <a href="/Mizan_CV.pdf" download>Download CV</a>
            </Button>
          </div>
        </GlassCard>
      </section>
    </main>
  );
}
