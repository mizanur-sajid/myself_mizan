export interface PortfolioSkill {
  id: number;
  name: string;
  level: number;
  category: string;
  icon: string;
  description?: string | null;
}

export interface PortfolioPublication {
  id: number;
  title: string;
  link: string;
  year: number;
  description?: string | null;
  fileUrl?: string | null;
}

export interface PortfolioCertification {
  id: number;
  name: string;
  issuer: string;
  year: number;
  description?: string | null;
  fileUrl?: string | null;
}

export interface PortfolioProject {
  id: number;
  title: string;
  link?: string | null;
  year: number;
  description?: string | null;
  fileUrl?: string | null;
}

export const fallbackSkills: PortfolioSkill[] = [
  { id: -1, name: 'Python', level: 95, category: 'Technical Skills', icon: 'python' },
  { id: -2, name: 'JavaScript', level: 90, category: 'Technical Skills', icon: 'javascript' },
  { id: -3, name: 'React', level: 88, category: 'Technical Skills', icon: 'monitor' },
  { id: -4, name: 'Next.js', level: 86, category: 'Technical Skills', icon: 'code' },
  { id: -5, name: 'PHP', level: 84, category: 'Technical Skills', icon: 'filetext' },
  { id: -6, name: 'MySQL', level: 82, category: 'Technical Skills', icon: 'network' },
  { id: -7, name: 'IT Support', level: 92, category: 'Additional Skills', icon: 'headset' },
  { id: -8, name: 'Troubleshooting', level: 90, category: 'Additional Skills', icon: 'wrench' },
  { id: -9, name: 'Networking', level: 88, category: 'Additional Skills', icon: 'network' },
  { id: -10, name: 'Problem Solving', level: 94, category: 'Additional Skills', icon: 'brain' },
];

export const fallbackPublications: PortfolioPublication[] = [
  {
    id: -1,
    title: 'Portfolio Engineering Notes',
    link: 'https://mizanurrahman.site.je/',
    year: 2026,
    description: 'A practical portfolio build focused on resilient publishing, content fallback handling, and deployment-friendly presentation.',
  },
];

export const fallbackCertifications: PortfolioCertification[] = [
  {
    id: -1,
    name: 'Professional Computing Certificate',
    issuer: 'Portfolio Training Record',
    year: 2026,
    description: 'Evidence of hands-on work across support, web, and portfolio maintenance tasks.',
    fileUrl: '/uploads/1782140312617-Certificate.pdf',
  },
  {
    id: -2,
    name: 'IT Support Readiness',
    issuer: 'Applied Systems Practice',
    year: 2025,
    description: 'Coverage of diagnostics, user support, and operational troubleshooting workflows.',
  },
];

export const fallbackProjects: PortfolioProject[] = [
  {
    id: -1,
    title: 'Personal Portfolio CMS',
    link: 'https://mizanurrahman.site.je/',
    year: 2026,
    description: 'A polished public portfolio with admin-managed content sections, rich media support, and static deployment compatibility.',
    fileUrl: '/logo.png',
  },
  {
    id: -2,
    title: 'Support Workflow Dashboard',
    link: 'https://mizanurrahman.site.je/',
    year: 2025,
    description: 'A streamlined support-oriented dashboard concept for monitoring tasks, status updates, and quick response handling.',
    fileUrl: '/admin-avatar.png',
  },
  {
    id: -3,
    title: 'Technical Skills Showcase',
    year: 2025,
    description: 'A visual skills grid that keeps key competencies visible even when the live content source is unavailable.',
  },
];

export function sortSkillsForDisplay(skills: PortfolioSkill[]) {
  return [...skills].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    if (nameA === 'python') return -1;
    if (nameB === 'python') return 1;
    if (nameA === 'it support') return 1;
    if (nameB === 'it support') return -1;

    return a.id - b.id;
  });
}