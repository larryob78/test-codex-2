import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const project = await prisma.project.create({ data: { name: body.name ?? "Campaign", templateId: body.templateId } });
  return NextResponse.json({ id: project.id });
}
