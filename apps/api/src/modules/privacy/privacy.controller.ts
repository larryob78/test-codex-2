import { Body, Controller, Post } from '@nestjs/common';
import { PrivacyService } from './privacy.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('privacy')
@Controller('v1/privacy')
export class PrivacyController {
  public constructor(private readonly service: PrivacyService) {}

  @Post('export')
  public export(@Body() body: { userKey: string }) {
    return this.service.export(body.userKey);
  }

  @Post('erase')
  public erase(@Body() body: { userKey: string }) {
    return this.service.erase(body.userKey);
  }
}
