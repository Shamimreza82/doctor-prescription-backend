import { Role, UserStatus, TenantStatus } from "@prisma/client";
import bcrypt from "bcrypt";

import { logger } from "@/bootstrap/logger";
import { prisma } from "@/bootstrap/prisma";


export const seedSuperAdmin = async () => {
  const email = "admin@system.com";

  // 1. Check exists
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    logger.info("✅ Super Admin already exists");
    return;
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash("123456", 10);

  // 3. Create Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      tenantId: null, // 🔥 important (platform-level user)
      emailVerified: true,
      createdBy: "system",
    },
  });

  // 4. Create Tenant (System Tenant)
  const tenant = await prisma.tenant.create({
    data: {
      name: "System Tenant",
      slug: "system-tenant",
      code: "SYS-001",
      status: TenantStatus.ACTIVE,

      ownerUserId: superAdmin.id,

      isTrial: false,
      activatedAt: new Date(),

      metadata: {
        type: "SYSTEM",
      },
    },
  });

  // 5. Create Tenant Settings
  await prisma.tenantSetting.create({
    data: {
      tenantId: tenant.id,
      timezone: "Asia/Dhaka",
      currency: "BDT",
      language: "en",
    },
  });

  // 6. (OPTIONAL) assign tenant to user
  // ⚠️ Usually Super Admin is platform-level → tenantId null রাখাই better
  // কিন্তু চাইলে assign করতে পারো 👇

  // await prisma.user.update({
  //   where: { id: superAdmin.id },
  //   data: { tenantId: tenant.id },
  // });

  logger.info("🚀 Super Admin + Tenant created successfully");
};