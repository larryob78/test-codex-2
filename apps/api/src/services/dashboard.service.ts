import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [workflows, runs, credits, apps] = await Promise.all([
      this.prisma.workflow.count(),
      this.prisma.run.count({ where: { status: { in: ['pending', 'running'] } } }),
      this.prisma.creditLedger.aggregate({ _sum: { delta: true } }),
      this.prisma.appPublish.count()
    ]);

    return {
      workflows,
      activeRuns: runs,
      credits: credits._sum.delta ?? 0,
      apps
    };
  }
}
