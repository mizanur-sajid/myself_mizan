'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

export const StickyNav = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'skills', 'publications', 'certifications', 'contact'];
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
    { id: 'skills', label: 'Expertise' },
    { id: 'publications', label: 'Publications' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '0.6rem 2rem', 
      border: '1px solid var(--glass-border)',
      position: 'sticky', 
      top: '1.5rem', 
      zIndex: 1000,
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      margin: '0 0 4rem 0',
      borderRadius: '100px',
      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <Image src="/logo.png" alt="Logo" width={140} height={40} className="logo-invert" style={{ objectFit: 'contain' }} priority />
        </a>
      </div>
      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '0.96rem', fontWeight: 600 }}>
        {links.map(link => (
          <a 
            key={link.id}
            href={`#${link.id}`} 
            className="nav-link"
            style={{
              color: activeSection === link.id ? 'var(--primary-color)' : 'inherit',
              paddingBottom: '0.25rem',
            }}
          >
            {link.label}
            {activeSection === link.id && (
              <span style={{
                position: 'absolute',
                bottom: '-4px', left: 0, width: '100%', height: '2px',
                background: 'var(--primary-color)',
                borderRadius: '2px',
              }} />
            )}
          </a>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  );
};
