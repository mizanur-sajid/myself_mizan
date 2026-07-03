'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminProfileCard } from '@/components/ui/AdminProfileCard';
import { LayoutDashboard, Mail, Code, BookOpen, Award, Briefcase, Menu, X, Share2, Shield, Settings } from 'lucide-react';

export const AdminSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { name: 'Overview', path: '/secure-panel', icon: <LayoutDashboard size={20} /> },
    { name: 'Messages', path: '/secure-panel/messages', icon: <Mail size={20} /> },
    { name: 'Skills', path: '/secure-panel/skills', icon: <Code size={20} /> },
    { name: 'Publications', path: '/secure-panel/publications', icon: <BookOpen size={20} /> },
    { name: 'Certifications', path: '/secure-panel/certifications', icon: <Award size={20} /> },
    { name: 'Projects', path: '/secure-panel/projects', icon: <Briefcase size={20} /> },
    { name: 'Socials', path: '/secure-panel/socials', icon: <Share2 size={20} /> },
    { name: 'Settings', path: '/secure-panel/settings', icon: <Settings size={20} /> },
    { name: 'Security', path: '/secure-panel/security', icon: <Shield size={20} /> },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button 
          className="mobile-menu-toggle" 
          onClick={() => setIsOpen(true)}
          style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 50, background: 'var(--primary-color)', color: '#000', border: 'none', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px -5px rgba(0, 240, 255, 0.5)' }}
        >
          <Menu size={28} />
        </button>
      )}

      {/* Sidebar */}
      <aside data-lenis-prevent="true" className={`admin-sidebar ${isOpen || !isMobile ? 'open' : ''}`} style={{ 
        width: '260px', 
        height: '100%', 
        overflowY: 'auto', 
        flexShrink: 0, 
        borderRight: '1px solid var(--glass-border)', 
        padding: '2rem 1.5rem', 
        background: 'var(--bg-color)', 
        display: 'flex', 
        flexDirection: 'column',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: 0,
        zIndex: 100,
        transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Image src="/logo.png" alt="Logo" width={140} height={48} className="logo-invert" style={{ objectFit: 'contain' }} priority />
          {isMobile && (
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          )}
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`admin-sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => isMobile && setIsOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
            <AdminProfileCard />
            <Link href="/" className="visit-site-btn" style={{ marginTop: '0.5rem', display: 'block', width: '100%' }}>
              Visit Site ↗
            </Link>
          </div>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="admin-sidebar-overlay" 
          onClick={() => setIsOpen(false)} 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 90 }}
        />
      )}
    </>
  );
};
