import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const payload = await request.json();
  const upstream = await fetch(process.env.AI_LLM_URL ?? 'http://ai-llm:8000/generate-copy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await upstream.json();
  return NextResponse.json(json);
}
