import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Controller('analytics')
class AnalyticsController {
  @Get('campaign/:id/summary')
  public summary(@Param('id') id: string) {
    return { id, impressions: 1000, clicks: 50, conversions: 5, spendCents: 5000, revenueCents: 8000 };
  }

  @Get('campaign/:id/timeseries')
  public timeseries(@Param('id') id: string, @Query('granularity') granularity = 'hour') {
    return {
      id,
      granularity,
      points: [{ ts: new Date().toISOString(), impressions: 100, clicks: 5, conversions: 1, spendCents: 500, revenueCents: 800 }]
    };
  }
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AnalyticsController]
})
class AnalyticsModule {}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AnalyticsModule);
  await app.listen(process.env.PORT ?? 4100);
}

void bootstrap();
