import { PrismaClient } from '@prisma/client';

const dbPass = process.env.DB_PASSWORD || process.env.DB_PASS;
if (!process.env.DATABASE_URL && process.env.DB_USER && dbPass) {
  const user = encodeURIComponent(process.env.DB_USER.trim());
  const pass = encodeURIComponent(dbPass.trim());
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 3306;
  const db = process.env.DB_NAME || '';
  process.env.DATABASE_URL = `mysql://${user}:${pass}@${host}:${port}/${db}`;
}

const prisma = new PrismaClient();

export default prisma;