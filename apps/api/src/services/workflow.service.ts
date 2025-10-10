import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { createRegistry } from '@weaverboard/nodes';

@Injectable()
export class WorkflowService {
  private registry = createRegistry();

  constructor(private readonly prisma: PrismaService) {}

  async getWorkflow(id: string) {
    const workflow = await this.prisma.workflow.findUnique({ where: { id } });
    if (!workflow) {
      throw new Error('Workflow not found');
    }
    const graph = workflow.jsonGraph as any;
    return {
      id: workflow.id,
      name: workflow.name,
      graph
    };
  }

  async listRuns(workflowId: string) {
    const runs = await this.prisma.run.findMany({
      where: { workflowId },
      orderBy: { startedAt: 'desc' },
      take: 10
    });
    return runs.map((run) => ({ id: run.id, status: run.status, modelCode: run.modelCode ?? undefined }));
  }

  async queueRun(workflowId: string, _body: Record<string, unknown>) {
    await this.prisma.run.create({
      data: {
        workflowId,
        status: 'queued'
      }
    });
  }

  async getRecentEvents(workflowId: string) {
    const runs = await this.listRuns(workflowId);
    return runs.map((run) => ({ runId: run.id, status: run.status, modelCode: run.modelCode }));
  }
}
