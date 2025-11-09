import {PrismaClient} from '@prisma/client';

// type assertion for globalThis first we are changing globalThis into type unknown and then into type {prisma:PrismaClient}
const globalForPrisma = globalThis as unknown as {prisma:PrismaClient}

export const prisma = globalForPrisma.prisma || new PrismaClient();

if(process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;