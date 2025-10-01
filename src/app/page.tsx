"use client";
import { useMemo, useState } from "react";
import Papa from "papaparse";
import { csvRowSchema } from "@/lib/zod";

export default function Home() {
  const [templateId, setTemplateId] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const columns = useMemo(() => [
    "title_text","subtitle_text","body_text","image_url","video_clip_url","logo_url","brand_color_hex","music_url","duration_hint_seconds","output_preset"
  ], []);

  function parseCSV(file: File) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => {
        const parsed: any[] = [];
        const errs: string[] = [];
        (results.data as any[]).forEach((row, idx) => {
          const safe = {} as Record<string, any>;
          columns.forEach(c => { if (row[c] !== undefined) safe[c] = row[c]; });
          const check = csvRowSchema.safeParse(safe);
          if (!check.success) {
            errs.push(`Row ${idx + 1}: ${check.error.issues.map(i => i.message).join(", ")}`);
          } else parsed.push(check.data);
        });
        setRows(parsed);
        setErrors(errs);
      }
    });
  }

  async function createProject() {
    const res = await fetch("/api/projects", {
      method: "POST",
      body: JSON.stringify({ name: `Campaign ${new Date().toISOString()}`, templateId }),
    });
    const json = await res.json();
    setProjectId(json.id);
  }

  async function uploadRows() {
    if (!projectId) return;
    setIsUploading(true);
    const res = await fetch(`/api/projects/${projectId}/rows`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows })
    });
    setIsUploading(false);
    if (!res.ok) alert("Failed to save rows");
  }

  async function previewRow(index: number) {
    if (!projectId) return alert("Create a project first");
    const res = await fetch(`/api/render?projectId=${projectId}&index=${index}&preview=1`, { method: "POST" });
    const { renderId } = await res.json();
    alert(`Preview started. Render ID: ${renderId}`);
  }

  async function renderBatch() {
    if (!projectId) return alert("Create a project first");
    const res = await fetch(`/api/render?projectId=${projectId}`, { method: "POST" });
    if (res.ok) alert("Batch queued");
    else alert("Failed to queue batch");
  }

  return (
    <main className="space-y-6">
      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">1. Pick template</h2>
        <input
          className="w-full rounded border p-2"
          placeholder="Creatomate template_id"
          value={templateId}
          onChange={e => setTemplateId(e.target.value)}
        />
        <div className="mt-3 flex gap-2">
          <button onClick={createProject} className="rounded bg-black px-3 py-2 text-white">Create project</button>
          {projectId && <span className="text-sm">Project: {projectId}</span>}
        </div>
      </section>

      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">2. Import CSV</h2>
        <input type="file" accept=".csv" onChange={e => e.target.files && parseCSV(e.target.files[0])} />
        <p className="mt-2 text-sm text-neutral-600">Required column: title_text. Optional columns listed below.</p>
        {errors.length > 0 && (
          <div className="mt-3 rounded border border-red-300 bg-red-50 p-2 text-sm text-red-800">
            <strong>Validation errors</strong>
            <ul className="list-inside list-disc">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        )}
        {rows.length > 0 && (
          <div className="mt-3">
            <button disabled={isUploading} onClick={uploadRows} className="rounded bg-black px-3 py-2 text-white">
              {isUploading ? "Uploading..." : "Save rows"}
            </button>
          </div>
        )}
        {rows.length > 0 && (
          <table className="mt-4 w-full table-fixed border-collapse text-sm">
            <thead>
              <tr>
                {columns.map(c => <th key={c} className="truncate border p-2 text-left">{c}</th>)}
                <th className="border p-2">Preview</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 10).map((r, i) => (
                <tr key={i}>
                  {columns.map(c => <td key={c} className="truncate border p-2 align-top">{String(r[c] ?? "")}</td>)}
                  <td className="border p-2"><button onClick={() => previewRow(i)} className="rounded bg-neutral-800 px-2 py-1 text-white">Preview</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">3. Render</h2>
        <button onClick={renderBatch} className="rounded bg-emerald-600 px-3 py-2 text-white">Queue batch</button>
        <p className="mt-2 text-sm">Status updates will arrive via webhook. Check the Dashboard.</p>
      </section>
    </main>
  );
}
