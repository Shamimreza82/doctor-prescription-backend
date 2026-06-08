import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

import { envConfig } from '@/config/env.config';

const connectionString = envConfig.databaseUrl;
const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter, log: ['error', 'warn'] });

if (envConfig.nodeEnv !== 'production') {
  globalForPrisma.prisma = prisma;
}

///// in future use case

// import { PrismaClient } from "@prisma/client";

// import { generateId } from "@/shared/utils/generateId";

// const prisma = new PrismaClient().$extends({
//     query: {
//         user: {
//             async create({ args, query }) {

//                 args.data.publicId = generateId("usr");

//                 return query(args);
//             },
//         },
//         tenant: {
//             async create({ args, query }) {
//                 args.data.publicId = generateId("ten");
//                 return query(args);
//             }
//         }
//     },
// });

// export { prisma };
