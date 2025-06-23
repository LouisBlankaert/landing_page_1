import { PrismaClient } from '@prisma/client';

// Évite de créer plusieurs instances de Prisma Client en développement
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Initialiser PrismaClient avec des options de journalisation en développement
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Attribuer l'instance client à l'objet global pour éviter les connexions multiples en développement
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
