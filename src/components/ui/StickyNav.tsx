'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Menu, X } from 'lucide-react';

export const StickyNav = () => {
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(0.4);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Scroll-based background opacity
      const opacity = Math.min(0.95, 0.4 + window.scrollY / 300);
      setScrollOpacity(opacity);

      const sections = ['about', 'skills', 'publications', 'certifications', 'projects', 'contact'];
      let current = '';
      
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Detect if the section is currently the primary one in the viewport
          if (rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3) {
            current = section;
          }
        }
      });
      
      // If no section is found but we are at the very top, activate 'about'
      if (!current && window.scrollY < 100) {
        current = 'about';
      }

      if (current !== activeSection) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger immediately to set initial active section
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const links = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'publications', label: 'Publications' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky-nav" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '0.6rem 1.5rem', 
      border: '1px solid var(--glass-border)',
      position: 'sticky', 
      top: '1.5rem', 
      zIndex: 1000,
      background: 'var(--glass-bg)',
      backdropFilter: `blur(${Math.round(20 + scrollOpacity * 30)}px)`,
      WebkitBackdropFilter: `blur(${Math.round(20 + scrollOpacity * 30)}px)`,
      margin: '0 auto 4rem auto',
      width: '100%',
      borderRadius: '100px',
      boxShadow: scrollOpacity > 0.6 ? 'var(--card-shadow)' : '0 4px 20px -8px rgba(0,0,0,0.05)',
      transition: 'box-shadow 0.4s ease, border-color 0.4s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMobileMenuOpen(false); }}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <Image src="/logo.png" alt="Logo" width={140} height={40} className="logo-invert" style={{ objectFit: 'contain' }} priority />
        </a>
      </div>

      {isMobile ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeToggle />
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.25rem' }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      ) : (
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '0.96rem', fontWeight: 600 }}>
          {links.map(link => (
            <a 
              key={link.id}
              href={`#${link.id}`} 
              className="nav-link"
              style={{
                color: activeSection === link.id ? 'var(--primary-color)' : 'inherit',
                paddingBottom: '0.25rem',
                position: 'relative'
              }}
            >
              {link.label}
              {activeSection === link.id && (
                <span style={{
                  position: 'absolute',
                  bottom: '-4px', left: '10%', width: '80%', height: '3px',
                  background: 'var(--primary-color)',
                  borderRadius: '100px',
                  boxShadow: '0 2px 10px var(--primary-alpha-20)'
                }} />
              )}
            </a>
          ))}
          <ThemeToggle />
        </nav>
      )}

      {/* Mobile Menu Dropdown */}
      {isMobile && isMobileMenuOpen && (
        <nav style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '1rem',
          background: 'color-mix(in srgb, var(--bg-color) 95%, transparent)',
          backdropFilter: 'blur(80px) saturate(200%)',
          WebkitBackdropFilter: 'blur(80px) saturate(200%)',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxShadow: 'var(--card-shadow)',
          zIndex: 1000
        }}>
          {links.map(link => (
            <a 
              key={link.id}
              href={`#${link.id}`} 
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                color: activeSection === link.id ? 'var(--primary-color)' : 'var(--text-primary)',
                fontSize: '1.1rem',
                fontWeight: 600,
                textDecoration: 'none',
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--divider-color)'
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};
