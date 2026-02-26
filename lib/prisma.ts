import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// In Prisma 7+, direct database connections require a driver adapter.
// CockroachDB is PostgreSQL-compatible, so we use @prisma/adapter-pg.
// PrismaPg requires a pg.Pool instance — passing a raw URL string causes errors.
const prismaClientSingleton = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in your environment variables");
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// We create the instance
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// Exporting it so your routes can use it
export { prisma }

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma