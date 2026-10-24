import { PrismaClient } from '@prisma/client';

const pass = process.env.DB_PASSWORD || process.env.DB_PASS;
if (process.env.DB_HOST && process.env.DB_USER && pass) {
  const user = encodeURIComponent(process.env.DB_USER.trim());
  const encodedPass = encodeURIComponent(pass.trim());
  const host = process.env.DB_HOST.trim();
  const port = process.env.DB_PORT || 3306;
  const db = (process.env.DB_NAME || '').trim();
  process.env.DATABASE_URL = `mysql://${user}:${encodedPass}@${host}:${port}/${db}`;
}

const prisma = new PrismaClient();

export default prisma;