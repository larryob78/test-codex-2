import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Creatomate will POST to this URL when a render changes state
// Expected body shape: { id, status, url?, error? }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, status, url, error } = body;
  if (!id || !status) return NextResponse.json({ ok: false }, { status: 400 });

  const row = await prisma.row.findUnique({ where: { renderId: id } });
  if (!row) return NextResponse.json({ ok: true });

  let nextStatus: any = row.status;
  if (status === "queued") nextStatus = "QUEUED";
  else if (status === "rendering") nextStatus = "RENDERING";
  else if (status === "succeeded") nextStatus = "SUCCEEDED";
  else if (status === "failed") nextStatus = "FAILED";

  await prisma.row.update({ where: { id: row.id }, data: { status: nextStatus, downloadUrl: url ?? row.downloadUrl, errorMessage: error ?? null } });
  return NextResponse.json({ ok: true });
}
