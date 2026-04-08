// src/tests/prisma-test-db.ts

import { prisma } from '@/bootstrap/prisma';

export async function resetDatabase() {
  await prisma.$transaction([
    prisma.user.deleteMany(),
  ]);
}

// 2️⃣ prisma-test-db.ts
// এটা test database helper।
// Testing এ production DB use করা উচিত না।

// এখানে থাকে:
// reset database
// seed data
// transaction rollback
