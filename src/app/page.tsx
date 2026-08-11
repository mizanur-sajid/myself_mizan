'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { ContactForm } from '../components/ui/ContactForm';
import { StickyNav } from '../components/ui/StickyNav';
import { SkillIcon } from '../components/ui/SkillIcon';
import { AvailabilityBadge } from '../components/ui/AvailabilityBadge';
import { Database, Brain, Eye, LineChart, Activity, Headset, Globe, Code2, CheckCircle2, Award, Building2, Layers, GitBranch, ExternalLink, ArrowRight, Monitor, Network, Sparkles, LayoutTemplate, LifeBuoy, MessageSquareText, ChevronUp, Briefcase, GraduationCap, FolderKanban } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitize';
import { ImageViewerModal } from '../components/ui/ImageViewerModal';

// Keep the public portfolio complete when PHP is unavailable (for example,
// during a static preview). Valid API arrays, including an intentional empty
// array, still take precedence over these display-only fallbacks.
const fallbackSkills = [
  { id: -1, name: 'Python', level: 95, category: 'Technical Skills', icon: 'python' },
  { id: -2, name: 'JavaScript', level: 90, category: 'Technical Skills', icon: 'javascript' },
  { id: -3, name: 'React', level: 88, category: 'Technical Skills', icon: 'react' },
  { id: -4, name: 'Next.js', level: 86, category: 'Technical Skills', icon: 'nextjs' },
  { id: -5, name: 'PHP', level: 84, category: 'Technical Skills', icon: 'php' },
  { id: -6, name: 'MySQL', level: 82, category: 'Technical Skills', icon: 'mysql' },
  { id: -7, name: 'IT Support', level: 92, category: 'Additional Skills', icon: 'headset' },
  { id: -8, name: 'Troubleshooting', level: 90, category: 'Additional Skills', icon: 'wrench' },
  { id: -9, name: 'Networking', level: 88, category: 'Additional Skills', icon: 'network' },
  { id: -10, name: 'Problem Solving', level: 94, category: 'Additional Skills', icon: 'brain' },
];

const fallbackPublications = [{ id: -1, link: '', fileUrl: '' }];

export default function Home() {
  const [skills, setSkills] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [viewerImage, setViewerImage] = useState<string | null>(null);
  const [carouselImages, setCarouselImages] = useState<string[] | null>(null);
  const [carouselCountdown, setCarouselCountdown] = useState<number | null>(null);
  const [hoverGithub, setHoverGithub] = useState(false);
  const [hoverLinkedin, setHoverLinkedin] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let countdownTimer: NodeJS.Timeout;
    
    if (carouselImages && carouselImages.length > 0) {
      setCarouselCountdown(5);
      
      countdownTimer = setInterval(() => {
        setCarouselCountdown((prev) => {
          if (prev === null) return null;
          if (prev <= 1) return 5;
          return prev - 1;
        });
      }, 1000);

      timer = setInterval(() => {
        setViewerImage((current) => {
          if (!current) return current;
          const currentIndex = carouselImages.indexOf(current);
          const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % carouselImages.length;
          return carouselImages[nextIndex];
        });
      }, 5000);
    } else {
      setCarouselCountdown(null);
    }
    
    return () => {
      clearInterval(timer);
      clearInterval(countdownTimer);
    };
  }, [carouselImages]);

  useEffect(() => {
    const handleScrollTop = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScrollTop, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollTop);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Increment view counter
        if (process.env.NODE_ENV === 'production' || process.env.ENABLE_VIEW_COUNTER === 'true') {
          fetch('/api/stats.php', { method: 'POST' }).catch(() => {});
        }

        const [skillsRes, pubsRes, certsRes, projsRes, configRes] = await Promise.all([
          fetch('/api/skills.php'),
          fetch('/api/publications.php'),
          fetch('/api/certifications.php'),
          fetch('/api/projects.php'),
          fetch('/api/config.php')
        ]);

        const tryParse = async (res: Response) => {
          if (!res.ok) return null;
          try {
            const text = await res.text();
            return JSON.parse(text);
          } catch {
            return null;
          }
        };

        const rawSkills = await tryParse(skillsRes);
        if (Array.isArray(rawSkills)) {
          setSkills(rawSkills.sort((a: any, b: any) => {
            if (a.name.toLowerCase() === 'python') return -1;
            if (b.name.toLowerCase() === 'python') return 1;
            if (a.name.toLowerCase() === 'it support') return 1;
            if (b.name.toLowerCase() === 'it support') return -1;
            return a.id - b.id;
          }));
        } else {
          setSkills(fallbackSkills);
        }
        
        const rawPubs = await tryParse(pubsRes);
        if (Array.isArray(rawPubs)) {
          setPublications(rawPubs);
        } else {
          setPublications(fallbackPublications);
        }

        const rawCerts = await tryParse(certsRes);
        if (Array.isArray(rawCerts)) setCertifications(rawCerts);

        const rawProjs = await tryParse(projsRes);
        if (Array.isArray(rawProjs)) setProjects(rawProjs);
        
        const rawConfig = await tryParse(configRes);
        if (rawConfig) setConfig(rawConfig);
      } catch {
        // Static previews cannot execute the PHP API.
        setSkills(fallbackSkills);
        setPublications(fallbackPublications);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <main className="portfolio-main" style={{ padding: '0 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <StickyNav />

      <div className="section-container" style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>

      {/* ====================================================
         HERO SECTION
         ==================================================== */}
      <motion.section 
        id="about"
        className="hero-section" 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ paddingTop: '0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', gap: '4rem', flexWrap: 'wrap-reverse' }}>
        <div className="hero-text" style={{ maxWidth: '600px', zIndex: 10, flex: '1 1 400px' }}>
          <AvailabilityBadge />
          <h2 className="section-title hero-name" style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', marginBottom: '1.5rem', lineHeight: 1.05 }}>
               <span className="hero-name-first">Mizanur</span> <br />
               <span>Rahman</span>.
          </h2>
          <p style={{ fontSize: '0.45rem', marginBottom: '2rem', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.6 }}>
            Computer Science and IT Engineer with strong problem-solving skills and a passion for building practical technology solutions. Ready to contribute to impactful projects while continuously expanding professional expertise.
          </p>

          {/* Hero Stat Pills */}
          <div className="hero-stats-row" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            <div className="hero-stat-pill">
              <FolderKanban size={14} color="var(--primary-color)" /> 3+ Projects
            </div>
            <div className="hero-stat-pill">
              <Award size={14} color="var(--accent-color)" /> 3 Certifications
            </div>
            <div className="hero-stat-pill">
              <GraduationCap size={14} color="var(--primary-color)" /> B.Sc. in CS
            </div>
          </div>

          <div className="hero-cta-row" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="#contact">
              <Button variant="primary">Start a Project</Button>
            </a>
            <div onClick={() => setViewerImage("/Mizan_CV.png")} style={{ cursor: 'pointer' }}>
              <Button variant="outline">View Résumé</Button>
            </div>
          </div>
        </div>
        <div className="hero-image" style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="profile-float profile-image-container profile-gradient-ring" style={{ position: 'relative', top: '-7rem', width: 'clamp(250px, 30vw, 400px)', height: 'clamp(250px, 30vw, 400px)', borderRadius: '50%', boxShadow: '0 20px 50px -10px var(--primary-alpha-20)' }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: 'var(--bg-color)' }}>
              <Image src="/profile.png" alt="Mizan Profile" fill style={{ objectFit: 'cover' }} priority />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ====================================================
         SKILLS SECTION
         ==================================================== */}
      <motion.section 
        id="skills" 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        style={{ padding: '4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: '4rem' }}>
          <div>
            <p className="accent-text" style={{ marginBottom: '0.5rem' }}>CORE COMPETENCIES</p>
            <h2 className="section-title section-title-skills" style={{ fontSize: '3.5rem', margin: '0 0 1rem 0' }}>Technical Skills</h2>
          </div>
        </div>
        
        <div>
          {loading ? (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem' }}>
               {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '24px' }} />)}
             </div>
          ) : skills.length > 0 ? (
            (Object.entries(skills.reduce((acc, skill) => {
              const cat = skill.category === 'Technical Skills' ? 'Technical Skills' : 'Additional Skills';
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(skill);
              return acc;
            }, { 'Technical Skills': [], 'Additional Skills': [] } as Record<string, typeof skills>)) as [string, any[]][])
            .filter(([_, catSkills]) => catSkills.length > 0)
            .map(([category, catSkills]) => (
              <div key={category} style={{ marginBottom: category === 'Technical Skills' ? '5rem' : '0' }}>
                {category === 'Additional Skills' && (
                  <div style={{ marginBottom: '3rem' }}>
                    <h3 className="additional-skills-title" style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontWeight: 700, letterSpacing: '-0.02em' }}>Additional Skills</h3>
                  </div>
                )}
                
                {category === 'Technical Skills' ? (
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                      visible: { transition: { staggerChildren: 0.1 } },
                      hidden: {}
                    }}
                    className="skills-grid"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem' }}
                  >
                    {catSkills.map((skill: any) => (
                      <motion.div 
                        key={skill.id} 
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                        }}
                        whileHover={{ y: -6, scale: 1.03 }}
                        style={{ 
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', 
                          padding: '2.5rem 1.5rem', 
                          background: 'var(--glass-bg)', 
                          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', 
                          border: '1px solid var(--glass-border)', 
                          borderRadius: '24px', 
                          position: 'relative', overflow: 'hidden', cursor: 'default',
                          transition: 'border 0.3s ease, box-shadow 0.3s ease'
                        }}
                        className="tech-skill-card"
                      >
                        <span style={{ color: 'var(--text-primary)', transition: 'all 0.3s ease' }} className="skill-icon-svg">
                          <SkillIcon name={skill.name} size={54} />
                        </span>
                        <span style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 600, letterSpacing: '0.01em', textAlign: 'center' }}>{skill.name}</span>
                        <div className="skill-glow-dot" style={{ position: 'absolute', bottom: '-10px', width: '30px', height: '30px', background: 'var(--primary-color)', filter: 'blur(20px)', opacity: 0.5, borderRadius: '50%', transition: 'all 0.3s ease' }} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                      visible: { transition: { staggerChildren: 0.1 } },
                      hidden: {}
                    }}
                    className="additional-skills-grid"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}
                  >
                    {catSkills.map((skill: any) => {
                      const getDesc = (name: string) => {
                        const n = name.toLowerCase().replace(/[^a-z]/g, '');
                        if (n === 'troubleshooting') return "Diagnosing and resolving technical issues efficiently.";
                        if (n === 'networking') return "Network configuration, monitoring, and infrastructure management.";
                        if (n === 'problemsolving') return "Analytical thinking and structured solution development.";
                        if (n === 'itsupport') return "Providing technical support and maintaining system reliability.";
                        if (n === 'dataanalysis') return "Extracting actionable insights and patterns from complex datasets.";
                        return "Complementary professional skill.";
                      };
                      
                      return (
                        <motion.div 
                          key={skill.id} 
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                          }}
                          whileHover={{ y: -4, scale: 1.02 }}
                          style={{ 
                            display: 'flex', alignItems: 'flex-start', gap: '1rem', 
                            padding: '1.5rem', 
                            background: 'var(--glass-bg)', 
                            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', 
                            border: '1px solid var(--glass-border)', 
                            borderRadius: '24px', 
                            position: 'relative', overflow: 'hidden', cursor: 'default',
                            transition: 'border 0.3s ease, box-shadow 0.3s ease'
                          }}
                          className="add-skill-card"
                        >
                          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--icon-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', flexShrink: 0, border: '1px solid var(--icon-border)' }} className="add-skill-icon">
                            <SkillIcon name={skill.name} size={24} />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 600 }}>{skill.name}</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{getDesc(skill.name)}</span>
                          </div>
                          <div className="skill-glow-dot-add" style={{ position: 'absolute', top: '50%', right: '-20px', transform: 'translateY(-50%)', width: '50px', height: '50px', background: 'var(--accent-color)', filter: 'blur(30px)', opacity: 0, borderRadius: '50%', transition: 'all 0.4s ease' }} />
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            ))
          ) : null}
        </div>
      </motion.section>

      {/* ====================================================
         PUBLICATIONS SECTION
         ==================================================== */}
      <motion.section 
        id="publications" 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        style={{ padding: '4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
          <div>
            <p className="accent-text" style={{ marginBottom: '0.5rem' }}>Academic Research</p>
            <h2 className="section-title" style={{ fontSize: '3rem' }}>Publications</h2>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {loading ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               {[...Array(1)].map((_, i) => <div key={i} className="skeleton" style={{ height: '320px', borderRadius: '24px' }} />)}
             </div>
          ) : publications.length > 0 ? publications.map(pub => (
            <GlassCard key={pub.id} className="ai-research-card pub-card-content border-gradient" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px 0 var(--primary-alpha-10)' }}>
              
              {/* Background Glows & Particles */}
              <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle at 50% 50%, var(--primary-alpha-10) 0%, transparent 50%)', zIndex: 0, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: '10%', right: '5%', width: '150px', height: '150px', background: 'radial-gradient(circle, var(--accent-color) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(20px)', zIndex: 0 }} />

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Header & Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'var(--primary-alpha-10)', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--primary-alpha-20)' }}>
                        <Activity size={12} /> Research Thesis
                      </span>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'var(--glass-bg)', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', border: '1px solid var(--glass-border)' }}>
                        Multi-Class Classification
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0 0 0', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.3 }}>Deep Learning-Based Skin Disease Detection Using EfficientNetV2</h3>
                    <p style={{ fontSize: '0.95rem', margin: 0, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      B.Sc. Final Year Thesis <span style={{ color: 'var(--divider-color)' }}>•</span> University of Global Village
                    </p>
                  </div>
                  <span style={{ fontSize: '1rem', color: 'var(--primary-color)', fontFamily: 'var(--font-space)', fontWeight: 600, background: 'var(--primary-alpha-10)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--primary-alpha-20)' }}>2026</span>
                </div>

                {/* Abstract */}
                <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'var(--surface-elevated)', borderLeft: '3px solid var(--primary-color)', color: 'var(--text-primary)', opacity: 0.9, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  "An AI-driven skin disease classification system leveraging EfficientNetV2 to detect multiple dermatological conditions with high accuracy."
                </div>

                {/* Research Highlights Grid */}
                <div className="pub-highlights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                  {[
                    { icon: <Database size={18} color="var(--primary-color)" />, title: 'Dataset', desc: 'Multi-class dermatological image dataset.' },
                    { icon: <Brain size={18} color="var(--accent-color)" />, title: 'Model Architecture', desc: 'EfficientNetV2 with transfer learning.' },
                    { icon: <Eye size={18} color="var(--primary-color)" />, title: 'Explainability', desc: 'Grad-CAM visualization for interpretable predictions.' },
                    { icon: <LineChart size={18} color="var(--accent-color)" />, title: 'Performance', desc: 'High classification accuracy across multiple skin diseases.' }
                  ].map((highlight, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', padding: '1rem', borderRadius: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', transition: 'transform 0.2s ease, background 0.2s ease', cursor: 'default' }} className="highlight-card">
                      <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--icon-bg)', border: '1px solid var(--icon-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'fit-content' }}>
                        {highlight.icon}
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{highlight.title}</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{highlight.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '0.5rem' }}>
                  {['Python', 'TensorFlow', 'EfficientNetV2', 'Grad-CAM', 'OpenCV', 'Deep Learning'].map(tech => (
                    <span key={tech} style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', background: 'var(--tag-bg)', color: 'var(--text-secondary)', border: '1px solid var(--tag-border)' }}>{tech}</span>
                  ))}
                </div>

                {/* Actions (Dynamic Links) */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {pub.link && (
                    <a href={pub.link} target="_blank" rel="noreferrer" style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-alpha-10)', color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', border: '1px solid var(--primary-alpha-20)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }} className="hover-glow">
                      Read Publication ↗
                    </a>
                  )}
                  {pub.fileUrl && (
                    <a href={pub.fileUrl} target="_blank" rel="noreferrer" style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--glass-bg)', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', border: '1px solid var(--glass-border)', transition: 'all 0.2s' }} className="hover-glow-white">
                      View Uploaded Document
                    </a>
                  )}
                </div>
              </div>
            </GlassCard>
          )) : null}
        </div>
      </motion.section>

      {/* ====================================================
         CERTIFICATIONS SECTION
         ==================================================== */}
      <motion.section 
        id="certifications" 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        style={{ padding: '4rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <p className="accent-text" style={{ marginBottom: '0.5rem' }}>Professional Validation</p>
            <h2 className="section-title" style={{ fontSize: '3rem' }}>Certifications</h2>
          </div>
        </div>

        {/* Compact Statistics Bar */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {[
            { icon: <Award size={16} color="var(--primary-color)" />, text: '3 Certifications' },
            { icon: <Building2 size={16} color="var(--accent-color)" />, text: '3 Organizations' },
            { icon: <Layers size={16} color="var(--primary-color)" />, text: 'Multiple Domains' }
          ].map((stat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '100px', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              {stat.icon} {stat.text}
            </div>
          ))}
        </div>

        <motion.div 
          className="cert-grid" 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
            hidden: {}
          }}
        >
          {loading ? (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
               {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '280px', borderRadius: '24px' }} />)}
             </div>
          ) : (
            (() => {
              const enhancedCerts = [
                {
                  title: "IT Support Service (Level-3)",
                  issuer: "National Skills Development Authority (NSDA)",
                  year: "2025",
                  description: "National competency certification covering IT support, system troubleshooting, hardware maintenance, networking fundamentals, and customer service.",
                  skills: ["IT Support", "Troubleshooting", "Hardware & Networking"],
                  category: "Technical Support",
                  status: "Verified",
                  icon: <Headset size={20} color="var(--primary-color)" />,
                  glowColor: "var(--primary-color)",
                  fileUrl: "/uploads/IT Support Service (Level-3).png"
                },
                {
                  title: "Foundation English Test (FET)",
                  issuer: "British Council",
                  year: "2025",
                  description: "English language proficiency certification aligned with CEFR standards, demonstrating effective communication skills for academic and professional environments.",
                  skills: ["CEFR B1", "Professional Communication", "English Proficiency"],
                  extraBadge: "Score: 73",
                  status: "Verified",
                  icon: <Globe size={20} color="var(--accent-color)" />,
                  glowColor: "var(--accent-color)",
                  fileUrl: "/uploads/Foundation English Test (FET).png"
                },
                {
                  title: "Python Programming",
                  issuer: "Bangladesh Computer Council (BCC)",
                  year: "2025",
                  description: "Comprehensive training in Python programming, problem solving, scripting, and software development fundamentals.",
                  skills: ["Python", "Problem Solving", "Programming Fundamentals"],
                  category: "Programming",
                  status: "Verified",
                  icon: <Code2 size={20} color="var(--primary-color)" />,
                  glowColor: "var(--primary-color)",
                  fileUrl: "/uploads/Python Programming Course.png"
                }
              ];

              return enhancedCerts.map((hc, idx) => {
                const dynamicCert = certifications.find((c: any) => c.name === hc.title) || {};
                const fileUrl = dynamicCert.fileUrl || hc.fileUrl;
                return (
                  <motion.div
                    key={dynamicCert.id || idx}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                    }}
                  >
                  <GlassCard className="cert-card cert-card-inner" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden', height: '100%' }}>
                    
                    {/* Header: Icon, Title, Issuer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                        <div className="cert-icon-container" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--icon-bg)', border: '1px solid var(--icon-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {hc.icon}
                        </div>
                        <div className="cert-title-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{hc.title}</h3>
                          <p style={{ opacity: 0.8, fontSize: '0.85rem', margin: 0, color: 'var(--text-secondary)' }}>{hc.issuer}</p>
                        </div>
                      </div>
                    </div>

                    {/* Year & Verified Badge & Description */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.85rem', color: hc.glowColor, fontFamily: 'var(--font-space)', fontWeight: 600 }}>{hc.year}</span>
                        <div className="cert-verified-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '2px 8px', borderRadius: '12px', color: 'var(--success-color)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          <CheckCircle2 size={12} /> {hc.status}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>{hc.description}</p>
                    </div>

                    {/* Skill Chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {hc.skills.map(skill => (
                        <span key={skill} style={{ padding: '4px 12px', background: 'var(--tag-bg)', border: '1px solid var(--tag-border)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {skill.trim()}
                        </span>
                      ))}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--divider-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      {/* Category & Extra Badge */}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {hc.category && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--glass-bg)', padding: '6px 12px', borderRadius: '100px', border: '1px solid var(--glass-border)' }}>{hc.category}</span>
                        )}
                        {hc.extraBadge && (
                          <span style={{ fontSize: '0.75rem', color: hc.glowColor, background: 'var(--accent-alpha-10)', padding: '6px 12px', borderRadius: '100px', border: '1px solid var(--accent-alpha-20)', fontWeight: 600 }}>{hc.extraBadge}</span>
                        )}
                      </div>

                      {/* View Credential Link */}
                      <motion.div 
                        whileHover={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', borderColor: 'rgba(34, 197, 94, 0.4)' }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => fileUrl ? setViewerImage(fileUrl.replace(/\.pdf$/i, '.png')) : null}
                        style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, padding: '8px 16px', background: 'var(--surface-elevated)', borderRadius: '8px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                      >
                        View Credentials ↗
                      </motion.div>
                    </div>
                  </GlassCard>
                  </motion.div>
                );
              });
            })()
          )}
        </motion.div>
      </motion.section>

      {/* ====================================================
         PROJECTS SECTION
         ==================================================== */}
      <motion.section 
        id="projects" 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        style={{ padding: '6rem 0', position: 'relative' }}>
        {/* Animated Background Pattern */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.02, backgroundImage: 'radial-gradient(var(--primary-color) 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none', zIndex: 0 }} />
        
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', marginBottom: '4rem' }}>
          <p className="accent-text" style={{ marginBottom: '0.5rem' }}>Showcase</p>
          <h2 className="section-title" style={{ fontSize: '3.5rem', margin: 0 }}>Projects</h2>
        </div>

        <motion.div 
          className="proj-grid" 
          style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2.5rem' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
            hidden: {}
          }}
        >
          {loading ? (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
               {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '400px', borderRadius: '24px' }} />)}
             </div>
          ) : (
            (() => {
              const enhancedProjects = [
                {
                  title: "AI Skin Disease Detection System",
                  year: "2026",
                  description: "DermAI Diagnostix – A deep learning-based medical image classification system for accurate skin disease detection using EfficientNetV2 with Grad-CAM explainability.",
                  badges: ["AI / ML", "Research", "Computer Vision"],
                  image: "/projects/dermai.png",
                  stats: ["10K+ Images", "8 Disease Classes", "95%+ Accuracy", "Grad-CAM Explainability"],
                  features: [
                    "Multi-class skin disease classification",
                    "AI explainability using Grad-CAM",
                    "Advanced image preprocessing pipeline",
                    "High accuracy prediction system"
                  ],
                  tech: ["Python", "TensorFlow", "EfficientNetV2", "OpenCV", "Grad-CAM", "Deep Learning"],
                  buttons: [
                    { 
                      text: "Research Details", 
                      type: "primary", 
                      icon: <ExternalLink size={16} />, 
                      action: "carousel",
                      images: [
                        "/projects/dermai/classification_report.png",
                        "/projects/dermai/confusion_matrix.png",
                        "/projects/dermai/per_class_performance.png",
                        "/projects/dermai/training_history.png"
                      ]
                    },
                    { text: "GitHub Repository", type: "secondary", icon: <GitBranch size={16} />, href:"https://github.com/mizanur-sajid/AI-Skin-Disease-Detection-System" }
                  ],
                  isFeatured: true,
                  status: "Completed"
                },
                {
                  title: "Portfolio CMS Platform",
                  year: "2025",
                  description: "Modern portfolio platform with admin-managed content, media uploads, and dynamic section rendering.",
                  badges: ["Web App", "CMS"],
                  image: "/projects/portfolio.png",
                  stats: [],
                  features: [
                    "Admin dashboard",
                    "Dynamic content rendering",
                    "Media upload & optimization",
                    "Responsive UI"
                  ],
                  tech: ["Next.js", "React", "Node.js", "MySQL"],
                  buttons: [
                    { text: "Live Demo", type: "primary", icon: <ExternalLink size={16} />, href:"https://mizanurrahman.site.je/" },
                    { text: "Source Code", type: "secondary", icon: <Code2 size={16} />, href:"https://github.com/mizanur-sajid/myself_mizan" }
                  ],
                  isFeatured: false,
                  status: "Live"
                },
                {
                  title: "InspireInk- Writing Helper",
                  year: "2024",
                  description: "A minimalist journaling app with daily prompts. Built using React Native & Expo.",
                  badges: ["Mobile App", "React Native"],
                  image: "/projects/inspireink.png",
                  stats: [],
                  features: [
                    "Random Writing Prompts",
                    "Daily Journaling Space",
                    "Save & History",
                    "Search Functionality"
                  ],
                  tech: ["React Native", "Expo", "AsyncStorage"],
                  buttons: [
                    { text: "Live Demo", type: "primary", icon: <ExternalLink size={16} />, href: "https://inspireink.site.je/" },
                    { text: "Source Code", type: "secondary", icon: <Code2 size={16} />, href: "https://github.com/mizanur-sajid/InspireInk" }
                  ],
                  isFeatured: false,
                  status: "Live"
                }
              ];

              return enhancedProjects.map((hc, idx) => {
                const dynamicProj = projects.find((p: any) => p.title === hc.title || p.name === hc.title) || {};
                const link = dynamicProj.link;
                const fileUrl = dynamicProj.fileUrl; // Admin uploaded file/image

                return (
                  <motion.div
                    key={dynamicProj.id || idx}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                    }}
                    className={hc.isFeatured ? 'proj-featured' : ''}
                    style={{ display: hc.isFeatured ? 'flex' : 'contents' }}
                  >
                  <GlassCard className={`proj-card ${hc.isFeatured ? 'proj-featured' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '0', overflow: 'hidden', padding: 0, border: '1px solid var(--glass-border)' }}>
                    {/* Thumbnail / Image Area */}
                    <div className="proj-img-wrapper" style={{ background: hc.isFeatured ? 'linear-gradient(135deg, var(--primary-alpha-10), var(--accent-alpha-10))' : 'var(--surface-elevated)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {hc.isFeatured && (
                         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 20% 50%, var(--primary-color) 0%, transparent 50%), radial-gradient(circle at 80% 80%, var(--accent-color) 0%, transparent 50%)', filter: 'blur(30px)' }} />
                      )}
                      <div className="proj-img" style={{ transition: 'transform 0.5s ease', opacity: (fileUrl || hc.image) ? 1 : 0.5, width: (fileUrl || hc.image) ? '100%' : 'auto', height: (fileUrl || hc.image) ? '100%' : 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {(fileUrl || hc.image) ? (
                          <img src={(fileUrl || hc.image)} alt={hc.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          hc.isFeatured ? <Network size={80} color="var(--primary-color)" /> : hc.title.includes("CMS") ? <LayoutTemplate size={60} color="var(--accent-color)" /> : <LifeBuoy size={60} color="var(--primary-color)" />
                        )}
                      </div>

                      {/* Status Badge */}
                      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {hc.isFeatured && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--primary-alpha-10)', border: '1px solid var(--primary-alpha-20)', padding: '6px 12px', borderRadius: '100px', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 0 20px var(--primary-alpha-10)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
                            <Sparkles size={14} /> Featured Project
                          </span>
                        )}
                      </div>

                      {/* Project Status */}
                      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
                        <span style={{ 
                          display: 'flex', alignItems: 'center', gap: '4px', 
                          padding: '4px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 600, 
                          textTransform: 'uppercase', letterSpacing: '0.05em',
                          background: hc.status === 'Live' ? 'rgba(34, 197, 94, 0.12)' : 'var(--primary-alpha-10)',
                          color: hc.status === 'Live' ? 'var(--success-color)' : 'var(--primary-color)',
                          border: hc.status === 'Live' ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid var(--primary-alpha-20)',
                          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)'
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: hc.status === 'Live' ? 'var(--success-color)' : 'var(--primary-color)' }} />
                          {hc.status}
                        </span>
                      </div>

                      <div className="proj-img-overlay" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, transition: 'all 0.3s', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '1rem' }}>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            const src = fileUrl || hc.image;
                            if (src) setViewerImage(src);
                          }}
                          style={{ padding: '8px 16px', background: 'var(--primary-color)', color: '#fff', fontSize: '0.8rem', fontWeight: 600, border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Eye size={14} /> View Image
                        </button>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="proj-content-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <h3 style={{ fontSize: hc.isFeatured ? '2rem' : '1.5rem', margin: '0 0 0.5rem 0', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{hc.title}</h3>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {hc.badges.map((b, i) => (
                              <span key={i} style={{ fontSize: '0.75rem', color: i === 0 ? 'var(--primary-color)' : 'var(--text-secondary)', background: i === 0 ? 'var(--primary-alpha-10)' : 'var(--glass-bg)', padding: '4px 10px', borderRadius: '100px', border: i === 0 ? '1px solid var(--primary-alpha-20)' : '1px solid var(--glass-border)', fontWeight: 500 }}>{b}</span>
                            ))}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontFamily: 'var(--font-space)', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', background: 'var(--primary-alpha-10)', border: '1px solid var(--primary-alpha-20)' }}>{hc.year}</span>
                      </div>

                      {/* Description */}
                      <p style={{ fontSize: hc.isFeatured ? '1.05rem' : '0.95rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{hc.description}</p>

                      {/* Stats (Featured Only) */}
                      {hc.isFeatured && hc.stats && (
                        <div className="proj-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                          {hc.stats.map((stat, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>
                              <CheckCircle2 size={16} color="var(--primary-color)" /> {stat}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Features */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: hc.isFeatured ? '0.5rem' : '0' }}>
                        {hc.features.map((feat, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <CheckCircle2 size={14} color="var(--accent-color)" /> {feat}
                          </div>
                        ))}
                      </div>

                      {/* Tech Stack Chips */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--divider-color)' }}>
                        {hc.tech.map(t => (
                          <span key={t} style={{ padding: '4px 12px', background: 'var(--tag-bg)', border: '1px solid var(--tag-border)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {t.trim()}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap', width: '100%' }}>
                        {hc.buttons.map((btn: any, i: number) => {
                          const href = btn.href || (i === 0 ? link : fileUrl) || '#';
                          if (btn.action === 'carousel') {
                            return (
                              <button 
                                key={i}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (btn.images && btn.images.length > 0) {
                                    setViewerImage(btn.images[0]);
                                    setCarouselImages(btn.images);
                                  }
                                }}
                                className="proj-btn"
                                style={{ flex: 1, minWidth: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, border: btn.type === 'primary' ? '1px solid var(--primary-alpha-20)' : '1px solid var(--glass-border)', background: btn.type === 'primary' ? 'var(--primary-alpha-10)' : 'var(--glass-bg)', color: btn.type === 'primary' ? 'var(--primary-color)' : 'var(--text-primary)', boxShadow: btn.type === 'primary' ? '0 0 15px var(--primary-alpha-10)' : 'none', cursor: 'pointer' }}
                              >
                                {btn.icon} {btn.text}
                              </button>
                            );
                          }
                          return (
                            <a key={i} href={href} target={href !== '#' ? "_blank" : "_self"} rel="noreferrer" className="proj-btn" style={{ flex: 1, minWidth: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', background: btn.type === 'primary' ? 'var(--primary-alpha-10)' : 'var(--glass-bg)', color: btn.type === 'primary' ? 'var(--primary-color)' : 'var(--text-primary)', border: btn.type === 'primary' ? '1px solid var(--primary-alpha-20)' : '1px solid var(--glass-border)', boxShadow: btn.type === 'primary' ? '0 0 15px var(--primary-alpha-10)' : 'none', textAlign: 'center' }}>
                              {btn.icon} {btn.text}
                            </a>
                          )
                        })}
                      </div>
                    </div>
                  </GlassCard>
                  </motion.div>
                );
              });
            })()
          )}
        </motion.div>
        
        <div style={{ textAlign: 'center', marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={14} color="var(--primary-color)" /> More exciting projects are currently in development
          </p>
        </div>
      </motion.section>

      {/* ====================================================
         CONTACT SECTION
         ==================================================== */}
      <motion.section 
        id="contact" 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        style={{ padding: '6rem 0 4rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ padding: '12px', background: 'var(--primary-alpha-10)', borderRadius: '14px', border: '1px solid var(--primary-alpha-20)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px var(--primary-alpha-10)' }}>
              <MessageSquareText size={28} color="var(--primary-color)" />
            </div>
            <h2 className="section-title contact-title" style={{ fontSize: '3.5rem', margin: 0 }}>Get In Touch</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6 }}>
            Interested in collaboration, research discussions, or professional opportunities? I'd love to hear from you.
          </p>
        </div>
        <ContactForm />
      </motion.section>

      {/* ====================================================
         FOOTER
         ==================================================== */}
      <motion.footer 
        className="footer-glass"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px" }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
        style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          padding: '0.6rem 0.75rem',
          border: '1px solid var(--glass-border)', 
          background: 'var(--glass-bg)', 
          backdropFilter: 'blur(40px)', 
          WebkitBackdropFilter: 'blur(40px)',
          margin: '0 auto 2rem auto',
          width: '100%',
          borderRadius: '100px',
          boxShadow: 'var(--card-shadow)',
        }}
      >
          {/* Left — GitHub */}
          <a href="https://github.com/mizanur-sajid" target="_blank" rel="noreferrer"
            onMouseEnter={() => setHoverGithub(true)}
            onMouseLeave={() => setHoverGithub(false)}
            className="desktop-only-link"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px', textDecoration: 'none', color: 'var(--text-primary)', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)', justifySelf: 'start', minHeight: '44px' }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <img src="https://github.com/mizanur-sajid.png" alt="GitHub" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {hoverGithub ? (
                <span style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--bg-color)', background: 'var(--primary-color)', padding: '6px 12px', borderRadius: '100px', boxShadow: '0 4px 14px 0 var(--primary-alpha-20)', display: 'inline-block' }}>Visit GitHub Profile</span>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', lineHeight: 1 }}>GitHub</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"/><path d="M9 18c-4.5 1-5-2.5-7-3"/></svg>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1 }}>@mizanur-sajid</span>
                </>
              )}
            </div>
          </a>

          {/* Center — branding */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', justifySelf: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
              Made with <span className="footer-heart">❤️</span> and passion by
            </p>
            <Image src="/logo.png" alt="Signature Logo" width={130} height={38} className="logo-invert" style={{ objectFit: 'contain', opacity: 0.8 }} />
            <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-space)', whiteSpace: 'nowrap' }}>
              {config?.footerText || `© ${new Date().getFullYear()} All Rights Reserved.`}
            </p>
          </div>

          {/* Right — LinkedIn */}
          <a href="https://linkedin.com/in/mizanur-sajid" target="_blank" rel="noreferrer"
            onMouseEnter={() => setHoverLinkedin(true)}
            onMouseLeave={() => setHoverLinkedin(false)}
            className="desktop-only-link"
            style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: '10px', padding: '4px', textDecoration: 'none', color: 'var(--text-primary)', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)', justifySelf: 'end', minHeight: '44px' }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <img src="/linkedin-profile.jpg" alt="LinkedIn" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', alignItems: 'flex-end' }}>
              {hoverLinkedin ? (
                <span style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--bg-color)', background: 'var(--accent-color)', padding: '6px 12px', borderRadius: '100px', boxShadow: '0 4px 14px 0 var(--accent-alpha-20)', display: 'inline-block' }}>Visit LinkedIn Profile</span>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', lineHeight: 1 }}>LinkedIn</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1 }}>mizanur-sajid</span>
                </>
              )}
            </div>
          </a>
      </motion.footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <div className="scroll-top-wrapper">
          <motion.button
            aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              position: 'relative',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--card-shadow)',
              color: 'var(--primary-color)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            whileHover={{ scale: 1.1, boxShadow: '0 8px 25px -5px var(--primary-alpha-20)' }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronUp size={22} />
          </motion.button>
          <span className="scroll-top-tooltip">Back to top</span>
          </div>
        )}
      </AnimatePresence>

      <ImageViewerModal 
        src={viewerImage} 
        countdown={carouselCountdown}
        onClose={() => {
          setViewerImage(null);
          setCarouselImages(null);
        }} 
      />
      </div>
    </main>
  );
}
