import { BillingCycle } from '@prisma/client';

import { prisma } from '@/bootstrap/prisma';

export const seedPlans = async () => {
  const plans = [
    {
      code: 'FREE',
      name: 'Free Trial',
      description: 'For new doctors to try the platform',
      billingCycle: BillingCycle.MONTHLY,
      price: 0,
      currency: 'BDT',
      maxPatients: 50,
    },
    {
      code: 'BASIC',
      name: 'Basic Plan',
      description: 'For small clinics',
      billingCycle: BillingCycle.MONTHLY,
      price: 499,
      currency: 'BDT',
      maxPatients: 200,
    },
    {
      code: 'PRO',
      name: 'Pro Plan',
      description: 'For growing clinics',
      billingCycle: BillingCycle.MONTHLY,
      price: 999,
      currency: 'BDT',
      maxPatients: 1000,
    },
    {
      code: 'ENTERPRISE',
      name: 'Enterprise Plan',
      description: 'For hospitals and large setups',
      billingCycle: BillingCycle.MONTHLY,
      price: 4999,
      currency: 'BDT',
      maxPatients: 10000,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { code: plan.code },
      update: plan,
      create: plan,
    });
  }

  console.info('✅ Plans seeded successfully');
};
