import { Module } from '@nestjs/common';
import { WorkflowController } from '../routes/workflow.controller';
import { WorkflowService } from '../services/workflow.service';

@Module({
  controllers: [WorkflowController],
  providers: [WorkflowService]
})
export class WorkflowModule {}
