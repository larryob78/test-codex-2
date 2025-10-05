import { Controller, Get } from '@nestjs/common';

@Controller('healthz')
export class HealthController {
  @Get()
  public check() {
    return { status: 'ok' };
  }
}
