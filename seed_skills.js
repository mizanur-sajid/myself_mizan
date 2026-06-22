const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.skill.deleteMany({});
  
  const skills = [
    // Technical Skills
    { name: 'IT Support', level: 90, category: 'Technical Skills', icon: 'wrench' },
    { name: 'Computer Troubleshooting', level: 85, category: 'Technical Skills', icon: 'wrench' },
    { name: 'Basic Networking', level: 80, category: 'Technical Skills', icon: 'network' },
    { name: 'Microsoft Office', level: 95, category: 'Technical Skills', icon: 'filetext' },
    { name: 'Web Design', level: 85, category: 'Technical Skills', icon: 'monitor' },
    { name: 'Research', level: 90, category: 'Technical Skills', icon: 'search' },
    { name: 'Data Analysis', level: 85, category: 'Technical Skills', icon: 'barchart' },

    // Professional Skills
    { name: 'Problem Solving', level: 95, category: 'Professional Skills', icon: 'lightbulb' },
    { name: 'Communication', level: 90, category: 'Professional Skills', icon: 'messagesquare' },
    { name: 'Technical Training', level: 85, category: 'Professional Skills', icon: 'bookopen' },
    { name: 'Project Coordination', level: 85, category: 'Professional Skills', icon: 'users' },
    { name: 'Team Collaboration', level: 95, category: 'Professional Skills', icon: 'users' },

    // Programming & Frameworks
    { name: 'Python', level: 90, category: 'Programming & Frameworks', icon: 'python' },
    { name: 'JavaScript', level: 85, category: 'Programming & Frameworks', icon: 'javascript' },
    { name: 'Django', level: 85, category: 'Programming & Frameworks', icon: 'django' },
    { name: 'Git', level: 90, category: 'Programming & Frameworks', icon: 'git' },

    // AI & Machine Learning
    { name: 'Machine Learning', level: 80, category: 'AI & Machine Learning', icon: 'brain' },
    { name: 'Artificial Intelligence', level: 80, category: 'AI & Machine Learning', icon: 'cpu' },
  ];

  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
