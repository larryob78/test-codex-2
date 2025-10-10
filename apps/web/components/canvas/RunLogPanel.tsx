'use client';

import { sdk } from '../../lib/sdk';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Card } from '@weaverboard/ui';

type Props = {
  className?: string;
  workflowId: string;
};

type RunLogItem = {
  id: string;
  status: string;
  modelCode?: string;
};

export function RunLogPanel({ className, workflowId }: Props) {
  const [runs, setRuns] = useState<RunLogItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    sdk.runs.list(workflowId).then((items) => {
      if (!cancelled) {
        setRuns(items);
      }
    });

    const unsubscribe = sdk.events.subscribe(workflowId, (event) => {
      setRuns((prev) => {
        const next = prev.filter((item) => item.id !== event.runId);
        next.unshift({ id: event.runId, status: event.status, modelCode: event.modelCode });
        return next.slice(0, 10);
      });
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [workflowId]);

  return (
    <Card className={clsx('flex flex-col gap-2 border border-slate-800 bg-slate-900/40 p-4', className)}>
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Run log</h2>
        <button
          className="rounded bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200"
          onClick={() => sdk.runs.trigger(workflowId)}
        >
          Run workflow
        </button>
      </header>
      <ul className="space-y-1 text-sm">
        {runs.map((run) => (
          <li key={run.id} className="flex items-center justify-between rounded bg-slate-950/60 px-3 py-2">
            <span className="font-medium text-white">{run.id}</span>
            <span className="text-xs uppercase tracking-wide text-slate-400">{run.status}</span>
          </li>
        ))}
        {runs.length === 0 && <p className="text-xs text-slate-400">No runs yet.</p>}
      </ul>
    </Card>
  );
}
