const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tables = [
    'batchStudent', 'batchTransfer', 'revaluationRequest', 'revaluationTimeline',
    'scholarship', 'feeStructure', 'installment', 'coursePrerequisite', 'enrollment'
  ];
  for (const t of tables) {
    const count = await prisma[t].count();
    console.log(t + ': ' + count);
  }
}

main()
  .catch((e: any) => console.error(e))
  .finally(() => prisma.$disconnect());
