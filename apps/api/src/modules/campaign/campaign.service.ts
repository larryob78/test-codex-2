import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class CampaignService {
  public constructor(private readonly prisma: PrismaService) {}

  public findAll(orgId: string) {
    return this.prisma.campaign.findMany({ where: { orgId }, include: { creatives: true } });
  }

  public create(orgId: string, dto: CreateCampaignDto) {
    return this.prisma.campaign.create({
      data: {
        orgId,
        name: dto.name,
        status: 'ACTIVE',
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        dailyBudgetCents: dto.dailyBudgetCents,
        totalBudgetCents: dto.totalBudgetCents,
        goal: dto.goal,
        lineItems: {
          create: dto.lineItems.map((item) => ({
            countryCodes: item.countryCodes,
            devices: item.devices,
            contexts: item.contexts,
            segments: item.segments
          }))
        }
      },
      include: { creatives: true }
    });
  }
}
