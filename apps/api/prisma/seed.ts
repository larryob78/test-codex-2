import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const org = await prisma.organization.upsert({
    where: { id: 'demo-org' },
    create: {
      id: 'demo-org',
      name: 'Demo Org',
      users: {
        create: [
          { id: 'admin-user', email: 'admin@example.com', role: 'ADMIN' },
          { id: 'advertiser-user', email: 'advertiser@example.com', role: 'ADVERTISER' },
          { id: 'analyst-user', email: 'analyst@example.com', role: 'ANALYST' }
        ]
      }
    },
    update: {}
  });

  await prisma.campaign.upsert({
    where: { id: 'cmp-demo' },
    create: {
      id: 'cmp-demo',
      orgId: org.id,
      name: 'Launch Campaign',
      status: 'ACTIVE',
      startAt: new Date(),
      endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      dailyBudgetCents: 5000,
      totalBudgetCents: 150000,
      goal: 'CLICKS',
      lineItems: {
        create: [
          {
            countryCodes: ['US'],
            devices: ['mobile'],
            contexts: ['IAB1'],
            segments: ['sports']
          }
        ]
      },
      creatives: {
        create: [
          {
            id: 'crt-demo',
            kind: 'IMAGE',
            headline: 'Sample Creative',
            body: 'Great product for everyone',
            mediaUrl: 'https://placehold.co/1200x628',
            width: 1200,
            height: 628,
            status: 'APPROVED'
          }
        ]
      }
    },
    update: {}
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
