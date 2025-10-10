import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma.module';
import { WorkflowModule } from './workflow.module';
import { AdminModule } from './admin.module';
import { DashboardModule } from './dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    WorkflowModule,
    AdminModule,
    DashboardModule
  ]
})
export class AppModule {}
