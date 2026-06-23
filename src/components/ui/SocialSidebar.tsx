'use client';
import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SocialSidebar() {
  const [isVisible, setIsVisible] = useState(false);

  const [socials, setSocials] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/socials.php')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setSocials(data); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const skillsSection = document.getElementById('skills');
      const projectsSection = document.getElementById('projects');

      if (skillsSection && projectsSection) {
        // Trigger when scrolling into skills
        const startY = skillsSection.offsetTop - window.innerHeight / 2;
        // Hide when scrolling past projects
        const endY = projectsSection.offsetTop + projectsSection.offsetHeight - window.innerHeight / 2;
        
        if (window.scrollY >= startY && window.scrollY <= endY) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'github': return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"/><path d="M9 18c-4.5 1-5-2.5-7-3"/></svg>;
      case 'linkedin': return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
      case 'mail':
      case 'email': return <Mail size={22} />;
      default: return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
    }
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && socials.length > 0 && (
          <motion.div 
            className="social-sidebar" 
            initial={{ y: '-100vh', opacity: 0 }}
            animate={{ y: '-50%', opacity: 1 }}
            exit={{ y: '100vh', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            style={{
              position: 'fixed',
              right: '24px',
              top: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              zIndex: 50,
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--glass-border)',
              padding: '1.5rem 1rem',
              borderRadius: '2rem',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            {socials.map((social) => (
              <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className={`social-link ${social.icon}`}>
                <span className="social-tooltip">{social.name}</span>
                {getIcon(social.icon)}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .social-link {
          position: relative;
          color: var(--text-secondary);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .social-tooltip {
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%) translateX(-10px);
          background: var(--bg-color);
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid var(--glass-border);
          font-size: 0.85rem;
          font-weight: 500;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          margin-right: 15px;
          color: var(--text-primary);
          box-shadow: var(--card-shadow);
        }
        .social-link:hover .social-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateY(-50%) translateX(0);
        }
        .social-link.github:hover {
          color: var(--text-primary);
          transform: translateY(-4px) scale(1.1);
        }
        .social-link.linkedin:hover {
          color: #0a66c2;
          transform: translateY(-4px) scale(1.1);
        }
        .social-link.email:hover {
          color: #ea4335;
          transform: translateY(-4px) scale(1.1);
        }
        @media (max-width: 1024px) {
          .social-sidebar {
            display: none !important;
          }
        }
      `}} />
    </>
  );
}
