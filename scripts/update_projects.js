const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.project.deleteMany({});
  
  await prisma.project.create({
    data: {
      title: 'InspireInk - Writing Prompt Generator',
      year: 2024,
      link: 'https://example.com/inspireink',
      description: '<ul><li>InspireInk is a app that generates writing prompts and lets users save and share their writing.</li><li>Generates fresh prompts by category and saves past writings locally for later review.</li></ul>',
    }
  });

  await prisma.project.create({
    data: {
      title: 'AI-Powered Skin Disease Diagnosis System',
      year: 2024,
      link: 'https://example.com/skindisease',
      description: '<ul><li>A web app that uses deep learning to detect skin diseases from uploaded images.</li><li>It delivers explainable predictions backed by clinical insights.</li></ul>',
    }
  });

  console.log("Projects updated successfully");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
