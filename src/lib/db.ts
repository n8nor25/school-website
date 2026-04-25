import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use the PostgreSQL URL from DIRECT_URL for local dev
// This ensures we connect to Supabase PostgreSQL even if
// the system env has a SQLite URL
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
