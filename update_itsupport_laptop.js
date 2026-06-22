const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$queryRawUnsafe(`UPDATE Skill SET icon = 'laptop' WHERE name = 'IT Support'`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
