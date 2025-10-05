import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ai')
@Controller('v1/ai')
export class AiController {
  public constructor(private readonly service: AiService) {}

  @Post('generate-copy')
  public generateCopy(@Body() body: { productName: string; tone?: string }) {
    return this.service.generateCopy(body.productName, body.tone ?? 'neutral');
  }

  @Post('generate-image')
  public generateImage(@Body() body: { prompt: string; width?: number; height?: number }) {
    return this.service.generateImage(body.prompt, body.width ?? 1200, body.height ?? 628);
  }

  @Post('generate-video')
  public generateVideo(@Body() body: { concept: string; durationSeconds?: number }) {
    return this.service.generateVideo(body.concept, body.durationSeconds ?? 6);
  }
}
