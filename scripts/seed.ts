import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@weaverboard.test' },
    update: {},
    create: {
      email: 'admin@weaverboard.test',
      name: 'Admin',
      role: 'admin'
    }
  });

  const workspace = await prisma.workspace.upsert({
    where: { id: 'demo-workspace' },
    update: {},
    create: {
      id: 'demo-workspace',
      name: 'Demo Workspace'
    }
  });

  await prisma.membership.upsert({
    where: { id: 'admin-membership' },
    update: {},
    create: {
      id: 'admin-membership',
      userId: admin.id,
      workspaceId: workspace.id,
      role: 'owner'
    }
  });

  const creditMap = {
    'flux.fast': 1,
    'flux.ultra': 8,
    'ideogram.v3': 8,
    'gpt.image.1.edit': 8,
    'runway.gen4.img': 10,
    'imagen.4': 10,
    'veo.3.fast': 120,
    'upscale.generic': 8
  };

  await prisma.plan.createMany({
    skipDuplicates: true,
    data: [
      { code: 'free', name: 'Free', monthlyCredits: 50, rollover: false, priceCents: 0 },
      { code: 'starter', name: 'Starter', monthlyCredits: 500, rollover: true, priceCents: 1900 },
      { code: 'pro', name: 'Pro', monthlyCredits: 2500, rollover: true, priceCents: 7900 },
      { code: 'team', name: 'Team', monthlyCredits: 6000, rollover: true, priceCents: 15900 },
      { code: 'enterprise', name: 'Enterprise', monthlyCredits: 20000, rollover: true, priceCents: 49900 }
    ]
  });

  await prisma.subscription.upsert({
    where: { id: 'demo-subscription' },
    update: {},
    create: {
      id: 'demo-subscription',
      workspaceId: workspace.id,
      planId: (await prisma.plan.findFirst({ where: { code: 'starter' } }))!.id,
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });

  const workflowGraph = JSON.parse(
    readFileSync(resolve(__dirname, '../docs/examples/prompt-enhancer.json'), 'utf8')
  );

  const workflow = await prisma.workflow.upsert({
    where: { id: 'prompt-enhancer-workflow' },
    update: {},
    create: {
      id: 'prompt-enhancer-workflow',
      workspaceId: workspace.id,
      name: 'Prompt Enhancer Pipeline',
      jsonGraph: workflowGraph,
      createdBy: admin.id
    }
  });

  await prisma.workflowVersion.upsert({
    where: { id: 'prompt-enhancer-version-1' },
    update: {},
    create: {
      id: 'prompt-enhancer-version-1',
      workflowId: workflow.id,
      version: 1,
      jsonGraph: workflowGraph
    }
  });

  await prisma.appPublish.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      workflowId: workflow.id,
      versionId: 'prompt-enhancer-version-1',
      slug: 'demo',
      isPublic: true
    }
  });

  await prisma.featureFlag.upsert({
    where: { key: 'credits:map' },
    update: { enabled: true },
    create: { key: 'credits:map', enabled: true }
  });

  console.log('Seed complete', { creditMap });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
