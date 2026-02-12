// src/lib/prisma.ts
// Perhatikan path import di bawah ini, disesuaikan dengan log terminal kamu
import { PrismaClient } from "../generated/prisma"; 

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
