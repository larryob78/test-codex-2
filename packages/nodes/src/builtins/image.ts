import { z } from 'zod';
import type { NodeManifest } from '../types';

export const compositorNode: NodeManifest<{ layers?: any[] }, { asset: any }, { blending: string }> = {
  id: 'image.compositor',
  kind: 'image',
  label: 'Compositor',
  description: 'Compose layers with blend modes and transforms.',
  inputs: [{ id: 'layers', type: 'array', label: 'Layers' }],
  outputs: [{ id: 'asset', type: 'asset', label: 'Composite' }],
  propsSchema: z.object({ blending: z.string().default('normal') }),
  async run({ inputs, props, enqueueJob }) {
    const result = await enqueueJob({
      nodeId: 'image.compositor',
      payload: {
        blending: props.blending,
        layers: inputs.layers ?? []
      }
    });
    return { asset: result.outputs.asset };
  }
};

export const cropNode: NodeManifest<{ asset?: any }, { asset: any }, { x: number; y: number; width: number; height: number }> = {
  id: 'image.crop',
  kind: 'image',
  label: 'Crop',
  description: 'Crop an image asset to a bounding box.',
  inputs: [{ id: 'asset', type: 'asset', label: 'Image' }],
  outputs: [{ id: 'asset', type: 'asset', label: 'Cropped image' }],
  propsSchema: z.object({
    x: z.number().default(0),
    y: z.number().default(0),
    width: z.number().default(1024),
    height: z.number().default(1024)
  }),
  async run({ inputs, props, enqueueJob }) {
    if (!inputs.asset) {
      throw new Error('Crop node requires an asset input');
    }
    const result = await enqueueJob({
      nodeId: 'image.crop',
      payload: { assetId: inputs.asset.id, ...props }
    });
    return { asset: result.outputs.asset };
  }
};

export const resizeNode: NodeManifest<{ asset?: any }, { asset: any }, { width: number; height: number; fit: 'cover' | 'contain' }> = {
  id: 'image.resize',
  kind: 'image',
  label: 'Resize',
  description: 'Resize an image asset with fit strategies.',
  inputs: [{ id: 'asset', type: 'asset', label: 'Image' }],
  outputs: [{ id: 'asset', type: 'asset', label: 'Resized image' }],
  propsSchema: z.object({
    width: z.number().default(1024),
    height: z.number().default(1024),
    fit: z.enum(['cover', 'contain']).default('cover')
  }),
  async run({ inputs, props, enqueueJob }) {
    if (!inputs.asset) {
      throw new Error('Resize node requires an asset input');
    }
    const result = await enqueueJob({
      nodeId: 'image.resize',
      payload: { assetId: inputs.asset.id, ...props }
    });
    return { asset: result.outputs.asset };
  }
};

export const blurNode: NodeManifest<{ asset?: any }, { asset: any }, { strength: number }> = {
  id: 'image.blur',
  kind: 'image',
  label: 'Blur',
  description: 'Apply Gaussian blur to an image.',
  inputs: [{ id: 'asset', type: 'asset', label: 'Image' }],
  outputs: [{ id: 'asset', type: 'asset', label: 'Blurred image' }],
  propsSchema: z.object({ strength: z.number().min(0).max(64).default(8) }),
  async run({ inputs, props, enqueueJob }) {
    if (!inputs.asset) {
      throw new Error('Blur node requires an asset input');
    }
    const result = await enqueueJob({
      nodeId: 'image.blur',
      payload: { assetId: inputs.asset.id, strength: props.strength }
    });
    return { asset: result.outputs.asset };
  }
};
