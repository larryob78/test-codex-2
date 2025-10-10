import { z } from 'zod';
import type { NodeManifest } from '../types';

export const promptNode: NodeManifest<{ text?: string }, { text: string }, { prompt: string }> = {
  id: 'text.prompt',
  kind: 'text',
  label: 'Prompt',
  description: 'Emit a text prompt from user input.',
  inputs: [],
  outputs: [{ id: 'text', type: 'text', label: 'Prompt' }],
  propsSchema: z.object({
    prompt: z.string().default('Describe a futuristic city skyline at dusk.')
  }),
  async run({ props }) {
    return { text: props.prompt };
  }
};

export const promptConcatNode: NodeManifest<{ a?: string; b?: string }, { text: string }, { separator: string }> = {
  id: 'text.prompt.concat',
  kind: 'text',
  label: 'Prompt Concatenator',
  description: 'Combine text inputs with a separator.',
  inputs: [
    { id: 'a', type: 'text', label: 'Prompt A' },
    { id: 'b', type: 'text', label: 'Prompt B' }
  ],
  outputs: [{ id: 'text', type: 'text', label: 'Combined prompt' }],
  propsSchema: z.object({ separator: z.string().default('\n\n') }),
  async run({ inputs, props }) {
    const { a = '', b = '' } = inputs;
    return { text: [a, b].filter(Boolean).join(props.separator) };
  }
};

export const runAnyLlmNode: NodeManifest<{ prompt?: string }, { text: string }, { model: string; temperature: number }> = {
  id: 'text.run-any-llm',
  kind: 'text',
  label: 'Run Any LLM',
  description: 'Invoke the configured LLM adapter with custom parameters.',
  inputs: [{ id: 'prompt', type: 'text', label: 'Prompt' }],
  outputs: [{ id: 'text', type: 'text', label: 'LLM response' }],
  propsSchema: z.object({
    model: z.string().default('flux.fast'),
    temperature: z.number().min(0).max(1).default(0.7)
  }),
  async run({ inputs, props, enqueueJob }) {
    const payload = {
      model: props.model,
      prompt: inputs.prompt,
      temperature: props.temperature
    };
    const result = await enqueueJob({ nodeId: 'text.run-any-llm', modelCode: props.model, payload });
    return { text: String(result.outputs.text ?? '') };
  }
};

export const promptEnhancerNode: NodeManifest<{ prompt?: string }, { text: string }, { tone: string }> = {
  id: 'text.prompt.enhancer',
  kind: 'text',
  label: 'Prompt Enhancer',
  description: 'Improve a prompt using the Run Any LLM node with a system instruction.',
  inputs: [{ id: 'prompt', type: 'text', label: 'Prompt' }],
  outputs: [{ id: 'text', type: 'text', label: 'Enhanced prompt' }],
  propsSchema: z.object({
    tone: z.string().default('vivid and cinematic')
  }),
  async run({ inputs, props, enqueueJob }) {
    const basePrompt = inputs.prompt ?? '';
    const result = await enqueueJob({
      nodeId: 'text.prompt.enhancer',
      modelCode: 'flux.fast',
      payload: {
        system: `You are a creative director. Rewrite prompts in a ${props.tone} tone.`,
        prompt: basePrompt
      }
    });
    return { text: String(result.outputs.text ?? basePrompt) };
  }
};
