// import { PrismaClient, UserRole } from "../generated/prisma/index.js";

// const prismaObj = new PrismaClient();

// export default { prismaObj, UserRole };

import * as pkg from "../generated/prisma/index.js";

// PrismaClient is a class, so it should be capitalized.
const { PrismaClient } = pkg;

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices
const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
