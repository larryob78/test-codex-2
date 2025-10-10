'use client';

import { useCallback } from 'react';
import { create } from 'zustand';
import type { Edge, Node } from 'react-flow-renderer';
import { Workflow } from '@weaverboard/sdk';
import { nanoid } from 'nanoid';

interface CanvasState {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

const useStore = create<CanvasState>((set) => ({
  nodes: [],
  edges: [],
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges })
}));

export function useCanvasStore(workflow: Workflow) {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const setNodes = useStore((state) => state.setNodes);
  const setEdges = useStore((state) => state.setEdges);

  if (nodes.length === 0 && workflow.graph.nodes.length > 0) {
    setNodes(
      workflow.graph.nodes.map((node) => ({
        id: node.id,
        type: 'default',
        position: node.position ?? { x: Math.random() * 400, y: Math.random() * 400 },
        data: { label: node.label }
      }))
    );
    setEdges(
      workflow.graph.edges.map((edge) => ({
        id: edge.id ?? nanoid(),
        source: edge.source,
        target: edge.target,
        animated: false
      }))
    );
  }

  const onNodesChange = useCallback((changes: any) => {
    setNodes(
      nodes.map((node) => {
        const change = changes.find((ch: any) => ch.id === node.id);
        if (change?.type === 'position') {
          return { ...node, position: change.position };
        }
        return node;
      })
    );
  }, [nodes, setNodes]);

  const onEdgesChange = useCallback(
    (changes: any) => {
      if (Array.isArray(changes)) {
        setEdges(changes);
      }
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: any) => {
      setEdges([...edges, { id: nanoid(), ...connection }]);
    },
    [edges, setEdges]
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect
  };
}
