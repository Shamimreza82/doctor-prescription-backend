import { prisma } from "@/bootstrap/prisma";

import { seedPlans } from './seed/plan.seed';
import { seedSuperAdmin } from './seed/superAdmin.seed';

async function main() {
  await seedSuperAdmin();
  await seedPlans()
}

main()
  .then(() => {
   console.info("🌱 Seeding completed");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });