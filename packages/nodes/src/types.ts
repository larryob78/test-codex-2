import { z } from 'zod';

export type NodeKind = 'text' | 'image' | 'video' | 'helper' | 'datatype' | 'iterator';

export interface NodePort {
  id: string;
  type: string;
  label?: string;
}

export interface RunContext<TInputs = Record<string, unknown>, TProps = Record<string, unknown>> {
  inputs: TInputs;
  props: TProps;
  workspaceId: string;
  runId: string;
  enqueueJob: (job: NodeJob) => Promise<NodeJobResult>;
  emitAsset: (asset: AssetRef) => Promise<AssetRef>;
}

export type NodeJob = {
  nodeId: string;
  modelCode?: string;
  payload: Record<string, unknown>;
};

export type NodeJobResult = {
  outputs: Record<string, unknown>;
};

export type AssetRef = {
  id: string;
  url: string;
  kind: 'image' | 'video' | 'text' | 'file';
};

export interface NodeManifest<TInputs = any, TOutputs = any, TProps = any> {
  id: string;
  kind: NodeKind;
  label: string;
  description: string;
  inputs: NodePort[];
  outputs: NodePort[];
  propsSchema: z.ZodSchema<TProps>;
  run: (context: RunContext<TInputs, TProps>) => Promise<TOutputs> | TOutputs;
}

export type NodeRegistry = Record<string, NodeManifest>;
