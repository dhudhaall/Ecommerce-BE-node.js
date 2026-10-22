import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL && process.env.DB_USER && process.env.DB_PASS) {
  const user = encodeURIComponent(process.env.DB_USER.trim());
  const pass = encodeURIComponent(process.env.DB_PASS.trim());
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 3306;
  const db = process.env.DB_NAME || '';
  process.env.DATABASE_URL = `mysql://${user}:${pass}@${host}:${port}/${db}`;
}

const prisma = new PrismaClient();

export default prisma;