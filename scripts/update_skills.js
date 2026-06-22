const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$queryRawUnsafe(`UPDATE Skill SET category = 'Professional Skills' WHERE name IN ('Research', 'Data Analysis')`);
  
  await prisma.$queryRawUnsafe(`UPDATE Skill SET category = 'Technical Skills' WHERE name IN ('JavaScript', 'Python', 'Django', 'Git')`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
