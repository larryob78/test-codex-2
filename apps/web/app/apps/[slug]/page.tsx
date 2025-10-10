import { sdk } from '../../../lib/sdk';
import { notFound } from 'next/navigation';

export default async function PublishedAppPage({ params }: { params: { slug: string } }) {
  const app = await sdk.workflows.get('prompt-enhancer-workflow').catch(() => null);
  if (!app) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 p-10">
      <header>
        <h1 className="text-2xl font-semibold text-white">App: {params.slug}</h1>
        <p className="text-sm text-slate-300">Interact with exposed workflow inputs and run it as a shareable app.</p>
      </header>
      <form className="space-y-4 rounded border border-slate-800 bg-slate-900/40 p-6">
        <label className="flex flex-col gap-2 text-sm text-white">
          Prompt
          <textarea className="min-h-[120px] rounded border border-slate-700 bg-slate-900 p-2 text-sm text-slate-200" defaultValue="Describe a surreal forest of neon trees" />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white">
          Seed
          <input type="number" className="rounded border border-slate-700 bg-slate-900 p-2 text-sm text-slate-200" defaultValue={42} />
        </label>
        <button className="rounded bg-indigo-500 px-4 py-2 text-sm font-medium text-white">Run</button>
      </form>
      <section className="rounded border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-lg font-semibold text-white">Preview</h2>
        <p className="mt-2 text-sm text-slate-300">Runs will appear here with live updates via WebSocket.</p>
      </section>
    </main>
  );
}
