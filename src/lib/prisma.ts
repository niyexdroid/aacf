import { PrismaClient } from "@prisma/client";
import { logDbOperation } from "./logger";

const prismaClientSingleton = () => {
  const client = new PrismaClient().$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, model, args, query }) {
          const startTime = Date.now();

          try {
            const result = await query(args);
            const duration = Date.now() - startTime;

            // Log successful operations
            logDbOperation(operation.toUpperCase(), model, duration);

            return result;
          } catch (error) {
            const duration = Date.now() - startTime;

            // Log failed operations
            logDbOperation(
              `${operation.toUpperCase()} (FAILED)`,
              model,
              duration,
            );

            throw error;
          }
        },
      },
    },
  });

  return client;
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
