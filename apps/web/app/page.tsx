import Link from 'next/link';
import { QuickStartCard } from '../components/QuickStartCard';
import { DashboardSummary } from '../components/DashboardSummary';

export default function DashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Weaverboard</h1>
          <p className="text-sm text-slate-300">
            Build and ship creative automation workflows with credits based runs.
          </p>
        </div>
        <Link
          href="/workflows/new"
          className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow"
        >
          New workflow
        </Link>
      </header>
      <DashboardSummary />
      <section>
        <h2 className="text-lg font-semibold">Quick starts</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <QuickStartCard
            title="Prompt Enhancer"
            description="Improve prompts using the built-in enhancer node."
            href="/workflows/prompt-enhancer"
          />
          <QuickStartCard
            title="Text Iterator"
            description="Batch run prompts across generation nodes."
            href="/workflows/text-iterator"
          />
          <QuickStartCard
            title="Design App"
            description="Publish workflow inputs to a reusable app."
            href="/apps/demo"
          />
        </div>
      </section>
    </main>
  );
}
