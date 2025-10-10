import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WorkflowService } from '../services/workflow.service';

@Controller('workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Get(':id')
  getWorkflow(@Param('id') id: string) {
    return this.workflowService.getWorkflow(id);
  }

  @Get(':id/runs')
  getRuns(@Param('id') id: string) {
    return this.workflowService.listRuns(id);
  }

  @Post(':id/runs')
  triggerRun(@Param('id') id: string, @Body() body: Record<string, unknown> = {}) {
    return this.workflowService.queueRun(id, body);
  }

  @Get(':id/events')
  async pollEvents(@Param('id') id: string) {
    return this.workflowService.getRecentEvents(id);
  }
}
