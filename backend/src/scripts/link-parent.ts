import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.parent.updateMany({
    where: { email: 'parent@gmail.com' },
    data: { linkedRoll: 'R2024001', linkedStudent: 'Demo Student' },
  });
  console.log(`Updated ${result.count} parent record(s) — linked to student R2024001`);
}

main()
  .catch((e) => { console.error('Error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
