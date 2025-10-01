import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import archiver from "archiver";
import axios from "axios";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  const rows = await prisma.row.findMany({ where: { projectId: params.projectId, status: "SUCCEEDED" } });
  if (rows.length === 0) return NextResponse.json({ error: "No completed renders" }, { status: 400 });

  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = new ReadableStream({
    start(controller) {
      archive.on("data", (d) => controller.enqueue(d));
      archive.on("end", () => controller.close());
      archive.on("error", (err) => controller.error(err));
    }
  });

  for (const [i, r] of rows.entries()) {
    if (!r.downloadUrl) continue;
    const resp = await axios.get(r.downloadUrl, { responseType: "arraybuffer" });
    archive.append(Buffer.from(resp.data), { name: `row_${i + 1}_${r.id}.mp4` });
  }
  archive.finalize();

  return new NextResponse(stream as any, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename=project_${params.projectId}.zip`
    }
  });
}
