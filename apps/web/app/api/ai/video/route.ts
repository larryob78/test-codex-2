import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const payload = await request.json();
  const upstream = await fetch(process.env.AI_VIDEO_URL ?? 'http://ai-video:8002/generate-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await upstream.json();
  return NextResponse.json(json);
}
