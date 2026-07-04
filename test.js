import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`SELECT 1`;
  console.log("DB RESULT:", result);
}

main()
  .catch((e) => {
    console.error("ERROR:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });