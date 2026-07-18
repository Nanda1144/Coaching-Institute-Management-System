import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe('UPDATE faculty SET created_by_id = NULL, updated_by_id = NULL');
  await prisma.$executeRawUnsafe('DELETE FROM faculty');
  const [row] = await prisma.$queryRawUnsafe<[{cnt: number}]>('SELECT COUNT(*)::int as cnt FROM faculty');
  console.log(`Faculty remaining: ${row.cnt}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
