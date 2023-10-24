import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient;
}
let prisma: PrismaClient;

prisma =
  global.prisma ||
  new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
      {
        emit: "stdout",
        level: "error",
      },
      {
        emit: "stdout",
        level: "warn",
      },
    ],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
