import { PrismaClient } from "@prisma/client";

// Usar PrismaClient de manera global, solo se crea una vez
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db; // Asignamos la instancia de Prisma a globalThis.prisma
}
