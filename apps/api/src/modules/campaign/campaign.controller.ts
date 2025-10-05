import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@ApiTags('campaigns')
@ApiBearerAuth()
@Controller('v1/campaigns')
export class CampaignController {
  public constructor(private readonly service: CampaignService) {}

  @Get()
  public findAll() {
    return this.service.findAll('demo-org');
  }

  @Post()
  public create(@Body() body: CreateCampaignDto) {
    return this.service.create('demo-org', body);
  }
}
