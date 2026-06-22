const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.certification.deleteMany({});
  
  await prisma.certification.create({
    data: {
      name: 'IT Support Service, Level-3',
      issuer: 'NATIONAL SKILLS DEVELOPMENT AUTHORITY (NSDA)',
      year: 2024,
    }
  });

  await prisma.certification.create({
    data: {
      name: 'Foundation English Test (FET)',
      issuer: 'British Council — CEFR Level B1 (Score: 73)',
      year: 2024,
    }
  });

  await prisma.certification.create({
    data: {
      name: 'Python Programming Course',
      issuer: 'Bangladesh Computer Council',
      year: 2024,
    }
  });

  console.log("Certifications updated successfully");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
