const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$queryRawUnsafe(`DELETE FROM Skill WHERE name IN ('Project Coordination', 'Communication')`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
