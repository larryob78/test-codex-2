'use client';

import ReactFlow, { Background, Controls, MiniMap } from 'react-flow-renderer';
import { useMemo } from 'react';
import { useCanvasStore } from './useCanvasStore';
import { Workflow } from '@weaverboard/sdk';
import { InspectorPanel } from './InspectorPanel';
import { RunLogPanel } from './RunLogPanel';
import { Toolbar } from './Toolbar';

export function CanvasShell({ workflow }: { workflow: Workflow }) {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useCanvasStore(workflow);

  const fitViewOptions = useMemo(() => ({ padding: 0.2 }), []);

  return (
    <div className="grid h-[calc(100vh-4rem)] grid-cols-[260px_1fr_320px] grid-rows-[auto_220px] gap-4 bg-slate-950 p-6">
      <Toolbar className="col-span-3" />
      <aside className="rounded border border-slate-800 bg-slate-900/40 p-4 text-sm text-white">
        <input
          className="w-full rounded border border-slate-700 bg-slate-800 p-2"
          placeholder="Search nodes"
        />
        <p className="mt-3 text-xs text-slate-400">Drag a node onto the canvas to add it to the workflow.</p>
      </aside>
      <section className="relative overflow-hidden rounded border border-slate-800 bg-slate-900">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          fitViewOptions={fitViewOptions}
        >
          <Background variant="dots" gap={16} size={1} />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </section>
      <InspectorPanel workflow={workflow} />
      <RunLogPanel className="col-span-3" workflowId={workflow.id} />
    </div>
  );
}
