'use client';

import { Workflow } from '@weaverboard/sdk';
import { useMemo } from 'react';
import { Card } from '@weaverboard/ui';

export function InspectorPanel({ workflow }: { workflow: Workflow }) {
  const selectedNode = useMemo(() => workflow.graph.nodes[0] ?? null, [workflow.graph.nodes]);

  if (!selectedNode) {
    return (
      <aside className="rounded border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
        Select a node to edit its properties.
      </aside>
    );
  }

  return (
    <aside className="space-y-3 rounded border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-white">Inspector</h2>
      <Card className="border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-200">
        <p className="text-xs uppercase tracking-wide text-slate-400">{selectedNode.kind}</p>
        <p className="text-base font-medium text-white">{selectedNode.label}</p>
        <div className="mt-3 space-y-2 text-xs text-slate-300">
          {Object.entries(selectedNode.props ?? {}).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span>{key}</span>
              <code className="rounded bg-slate-950 px-2 py-1">{JSON.stringify(value)}</code>
            </div>
          ))}
        </div>
      </Card>
    </aside>
  );
}
