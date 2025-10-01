import { prisma } from "@/lib/db";

export default async function Dashboard() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { rows: { orderBy: { createdAt: "desc" } } }
  });
  return (
    <main className="space-y-6">
      {projects.map(p => (
        <section key={p.id} className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-medium">{p.name}</h2>
          <p className="text-sm text-neutral-600">Template: {p.templateId} • Created {p.createdAt.toISOString()}</p>
          <table className="mt-3 w-full table-fixed border-collapse text-sm">
            <thead>
              <tr>
                <th className="border p-2 text-left">Row</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Download</th>
                <th className="border p-2 text-left">Error</th>
              </tr>
            </thead>
            <tbody>
              {p.rows.map((r, i) => (
                <tr key={r.id}>
                  <td className="border p-2 align-top">{i + 1}</td>
                  <td className="border p-2 align-top">{r.status}</td>
                  <td className="border p-2 align-top">
                    {r.downloadUrl ? <a className="text-blue-600 underline" href={r.downloadUrl} target="_blank">Video</a> : "-"}
                  </td>
                  <td className="border p-2 align-top">{r.errorMessage ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </main>
  );
}
