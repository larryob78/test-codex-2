import { useMemo } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

import useGenerations from '../hooks/useGenerations';
import useGenerationMutations from '../hooks/useGenerationMutations';
import VideoProvidersPanel from './VideoProvidersPanel';

interface GenerationPanelProps {
  frameId: string | null;
  projectId: string | null;
}

const GenerationPanel = ({ frameId, projectId }: GenerationPanelProps) => {
  const { data } = useGenerations(frameId);
  const { generate, confirm, isGenerating, isConfirming } = useGenerationMutations(
    frameId ?? undefined,
    projectId ?? undefined,
  );

  const generations = useMemo(() => data ?? [], [data]);

  if (!frameId) {
    return (
      <aside className="hidden border-l border-slate-900/70 bg-slate-950/80 p-6 text-sm text-slate-500 lg:block">
        <p>Select a frame to manage AI generations.</p>
        <VideoProvidersPanel />
      </aside>
    );
  }

  return (
    <aside className="border-l border-slate-900/70 bg-slate-950/80 p-6">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-slate-500">Generations</p>
        <h2 className="text-xl font-semibold text-white">Frame Output</h2>
        <p className="text-sm text-slate-400">Review, compare, and confirm AI results.</p>
      </header>

      <div className="space-y-3">
        {generations.map((generation) => (
          <div
            key={generation.id}
            className="overflow-hidden rounded-xl border border-slate-900/60 bg-slate-900/60"
          >
            <figure className="relative aspect-video w-full bg-slate-800/70">
              <img
                src={generation.image_url}
                alt={`Generation preview for ${generation.type}`}
                className="h-full w-full object-cover"
              />
              {generation.is_confirmed ? (
                <span className="absolute right-3 top-3 rounded-full bg-emerald-500/90 px-2 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-950">
                  Confirmed
                </span>
              ) : null}
            </figure>
            <div className="space-y-2 px-4 py-3 text-xs text-slate-400">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-slate-200">
                  {generation.type.toUpperCase()} • {generation.settings.mode}
                </p>
                {!generation.is_confirmed ? (
                  <button
                    className="rounded-full border border-brand/40 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-brand transition hover:border-brand hover:text-brand-light disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={async () => {
                      try {
                        await confirm(generation.id);
                      } catch (error) {
                        console.error('Failed to confirm generation', error);
                        window.alert('Confirming the generation failed. Please try again.');
                      }
                    }}
                    disabled={isConfirming}
                  >
                    {isConfirming ? 'Confirming…' : 'Confirm'}
                  </button>
                ) : null}
              </div>
              <p>Seed: {generation.settings.seed ?? 'auto'}</p>
              <p>{generation.prompt.slice(0, 120)}…</p>
            </div>
          </div>
        ))}
        {generations.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/50 p-8 text-center text-sm text-slate-400">
            No generations yet. Run AI to see variations for this frame.
          </div>
        )}
      </div>

      <button
        onClick={() => generate({ mode: 'turbo' })}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isGenerating}
      >
        <SparklesIcon className="h-5 w-5" /> {isGenerating ? 'Generating…' : 'Generate Variations'}
      </button>

      <VideoProvidersPanel />
    </aside>
  );
};

export default GenerationPanel;
