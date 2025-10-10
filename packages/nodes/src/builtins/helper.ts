import { z } from 'zod';
import type { NodeManifest } from '../types';

export const importNode: NodeManifest<Record<string, never>, { asset: { uploadUrl: string } }, { mimeTypes: string[] }> = {
  id: 'helper.import',
  kind: 'helper',
  label: 'Import',
  description: 'Generate a signed upload URL for new assets.',
  inputs: [],
  outputs: [{ id: 'asset', type: 'asset', label: 'Asset' }],
  propsSchema: z.object({
    mimeTypes: z.array(z.string()).default(['image/png', 'image/jpeg', 'video/mp4'])
  }),
  async run({ props, enqueueJob }) {
    const result = await enqueueJob({
      nodeId: 'helper.import',
      payload: { mimeTypes: props.mimeTypes }
    });
    return { asset: result.outputs.asset } as any;
  }
};

export const exportNode: NodeManifest<{ asset?: { id: string } }, { url: string }, { expiresIn: number }> = {
  id: 'helper.export',
  kind: 'helper',
  label: 'Export',
  description: 'Return a signed download URL for an asset.',
  inputs: [{ id: 'asset', type: 'asset', label: 'Asset' }],
  outputs: [{ id: 'url', type: 'text', label: 'Download URL' }],
  propsSchema: z.object({ expiresIn: z.number().min(60).max(60 * 60 * 24).default(3600) }),
  async run({ inputs, props, enqueueJob }) {
    const asset = inputs.asset;
    if (!asset) {
      throw new Error('Asset input is required');
    }
    const result = await enqueueJob({
      nodeId: 'helper.export',
      payload: { assetId: asset.id, expiresIn: props.expiresIn }
    });
    return { url: String(result.outputs.url) };
  }
};

export const previewNode: NodeManifest<{ asset?: { id: string } }, { assetId: string }, { label: string }> = {
  id: 'helper.preview',
  kind: 'helper',
  label: 'Preview',
  description: 'Store preview metadata for downstream nodes.',
  inputs: [{ id: 'asset', type: 'asset', label: 'Asset' }],
  outputs: [{ id: 'assetId', type: 'text', label: 'Asset Id' }],
  propsSchema: z.object({ label: z.string().default('Preview') }),
  async run({ inputs, props, enqueueJob }) {
    if (!inputs.asset) {
      throw new Error('Preview node requires an asset input');
    }
    const result = await enqueueJob({
      nodeId: 'helper.preview',
      payload: { assetId: inputs.asset.id, label: props.label }
    });
    return { assetId: String(result.outputs.assetId) };
  }
};

export const routerNode: NodeManifest<{ input?: unknown }, Record<string, unknown>, { branches: number }> = {
  id: 'helper.router',
  kind: 'helper',
  label: 'Router',
  description: 'Fan out a value to multiple outputs based on branch count.',
  inputs: [{ id: 'input', type: 'any', label: 'Input' }],
  outputs: Array.from({ length: 3 }, (_, index) => ({
    id: `out${index + 1}`,
    type: 'any',
    label: `Branch ${index + 1}`
  })),
  propsSchema: z.object({ branches: z.number().min(1).max(5).default(3) }),
  async run({ inputs, props }) {
    const result: Record<string, unknown> = {};
    for (let index = 0; index < props.branches; index += 1) {
      result[`out${index + 1}`] = inputs.input;
    }
    return result;
  }
};

export const outputNode: NodeManifest<{ input?: unknown }, { value: unknown }, { locked: boolean }> = {
  id: 'helper.output',
  kind: 'helper',
  label: 'Output',
  description: 'Expose a value for published app inputs/outputs.',
  inputs: [{ id: 'input', type: 'any', label: 'Input' }],
  outputs: [{ id: 'value', type: 'any', label: 'Value' }],
  propsSchema: z.object({ locked: z.boolean().default(false) }),
  async run({ inputs }) {
    return { value: inputs.input };
  }
};

export const textIteratorNode: NodeManifest<{ prompts?: string[] }, { assets: string[] }, { runnerNodeId: string }> = {
  id: 'iterator.text',
  kind: 'iterator',
  label: 'Text Iterator',
  description: 'Fan out prompts to a configured generation node and collect asset ids.',
  inputs: [{ id: 'prompts', type: 'array', label: 'Prompts' }],
  outputs: [{ id: 'assets', type: 'array', label: 'Generated Asset Ids' }],
  propsSchema: z.object({ runnerNodeId: z.string() }),
  async run({ inputs, props, enqueueJob }) {
    const prompts = inputs.prompts ?? [];
    const assetIds: string[] = [];
    for (const prompt of prompts) {
      const result = await enqueueJob({
        nodeId: props.runnerNodeId,
        payload: { prompt }
      });
      if (Array.isArray(result.outputs.assets)) {
        assetIds.push(...result.outputs.assets.map((asset: any) => String(asset.id ?? asset)));
      }
    }
    return { assets: assetIds };
  }
};
