import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CampaignModule } from './campaign/campaign.module';
import { AiModule } from './ai/ai.module';
import { PrivacyModule } from './privacy/privacy.module';
import { HealthModule } from './health/health.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CampaignModule, AiModule, PrivacyModule, HealthModule],
  providers: [PrismaService]
})
export class AppModule {}
