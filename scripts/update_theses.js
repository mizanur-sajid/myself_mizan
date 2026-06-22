const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.publication.deleteMany({});
  
  await prisma.publication.create({
    data: {
      title: 'Predictive Analytics using Deep Learning Models',
      year: 2024,
      link: '#',
      description: '<strong>Status: Completed</strong><br/>A comprehensive thesis exploring the application of advanced machine learning and deep neural networks to optimize data processing pipelines. Researched and developed at the <strong>University Of Global Village</strong>.',
    }
  });

  await prisma.publication.create({
    data: {
      title: 'Natural Language Processing for Automated Systems',
      year: 2025,
      link: '#',
      description: '<strong>Status: In Progress</strong><br/>An ongoing thesis focusing on transformer-based AI models to automate and enhance complex decision-making processes. Currently being researched at the <strong>University Of Global Village</strong>.',
    }
  });

  console.log("Database updated successfully");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
