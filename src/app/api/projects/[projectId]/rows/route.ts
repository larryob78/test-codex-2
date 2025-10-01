import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { csvRowSchema } from "@/lib/zod";

export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  const { rows } = await req.json();
  const data = rows.map((r: unknown) => csvRowSchema.parse(r));
  await prisma.row.createMany({
    data: data.map((d: any) => ({ projectId: params.projectId, data: d, outputPreset: d.output_preset ?? "1080x1920" }))
  });
  return NextResponse.json({ ok: true });
}
