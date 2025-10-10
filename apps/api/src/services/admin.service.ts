import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  listPlans() {
    return this.prisma.plan.findMany({ orderBy: { priceCents: 'asc' } });
  }

  async updatePlan(planId: string, monthlyCredits: number) {
    await this.prisma.plan.update({ where: { id: planId }, data: { monthlyCredits } });
  }

  async listCreditCosts() {
    const defaults = [
      { modelCode: 'flux.fast', cost: 1, description: 'Fast text-to-image generation' },
      { modelCode: 'flux.ultra', cost: 8, description: 'High fidelity generation' },
      { modelCode: 'ideogram.v3', cost: 8, description: 'Typography focused generator' },
      { modelCode: 'gpt.image.1.edit', cost: 8, description: 'Image editing model' }
    ];
    return defaults;
  }

  async updateCreditCost(modelCode: string, cost: number) {
    await this.prisma.creditLedger.create({
      data: {
        workspaceId: 'admin',
        delta: -cost,
        reason: `admin.update.${modelCode}`,
        modelCode
      }
    });
  }
}
