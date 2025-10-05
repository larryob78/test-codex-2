import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  public async generateCopy(productName: string, tone: string) {
    return { copy: `${productName} is ${tone}.` };
  }

  public async generateImage(prompt: string, width: number, height: number) {
    return { url: `https://placehold.co/${width}x${height}?text=${encodeURIComponent(prompt)}` };
  }

  public async generateVideo(concept: string, durationSeconds: number) {
    return { url: `https://example.com/mock-video.mp4`, durationSeconds, concept };
  }
}
