import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { creatomateRender } from "@/lib/creatomate";

function toModifications(data: any) {
  // Map CSV fields to template modifications. Keys should match Creatomate layer names.
  const mods: Record<string, any> = {};
  if (data.title_text) mods["title_text"] = { text: data.title_text };
  if (data.subtitle_text) mods["subtitle_text"] = { text: data.subtitle_text };
  if (data.body_text) mods["body_text"] = { text: data.body_text };
  if (data.image_url) mods["image"] = { source: data.image_url };
  if (data.video_clip_url) mods["clip"] = { source: data.video_clip_url };
  if (data.logo_url) mods["logo"] = { source: data.logo_url };
  if (data.brand_color_hex) mods["brand_color"] = { color: data.brand_color_hex.startsWith("#") ? data.brand_color_hex : `#${data.brand_color_hex}` };
  if (data.music_url) mods["music"] = { source: data.music_url };
  if (data.duration_hint_seconds) mods["duration"] = { seconds: data.duration_hint_seconds };
  return mods;
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const indexParam = searchParams.get("index");
  const preview = searchParams.get("preview");
  if (!projectId) return NextResponse.json({ error: "Missing projectId" }, { status: 400 });

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  if (indexParam !== null) {
    const index = Number(indexParam);
    const row = await prisma.row.findFirst({ where: { projectId }, orderBy: { createdAt: "asc" }, skip: index, take: 1 });
    if (!row) return NextResponse.json({ error: "Row not found" }, { status: 404 });

    const payload = {
      template_id: project.templateId,
      modifications: toModifications(row.data),
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook`
    };
    const created = await creatomateRender(payload);
    await prisma.row.update({ where: { id: row.id }, data: { status: "RENDERING", renderId: created.id } });
    return NextResponse.json({ renderId: created.id, preview: Boolean(preview) });
  }

  // Batch
  const rows = await prisma.row.findMany({ where: { projectId, status: { in: ["PENDING", "FAILED"] } }, orderBy: { createdAt: "asc" } });
  for (const row of rows) {
    const payload = {
      template_id: project.templateId,
      modifications: toModifications(row.data),
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook`
    };
    try {
      const created = await creatomateRender(payload);
      await prisma.row.update({ where: { id: row.id }, data: { status: "RENDERING", renderId: created.id } });
    } catch (e: any) {
      await prisma.row.update({ where: { id: row.id }, data: { status: "FAILED", errorMessage: e?.message ?? "Render error" } });
    }
  }
  return NextResponse.json({ queued: rows.length });
}
