import { useMemo, useRef } from 'react';
import { PlayIcon, PlusCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

import { Frame } from '../state/types';
import useGenerationMutations from '../hooks/useGenerationMutations';
import useSketchUpload from '../hooks/useSketchUpload';

interface FrameRowProps {
  frame: Frame;
  onSelect: () => void;
}

const FrameRow = ({ frame, onSelect }: FrameRowProps) => {
  const { generate } = useGenerationMutations(frame.id, frame.project_id);
  const { upload, isUploading } = useSketchUpload(frame.project_id, frame.id);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const statusLabel = useMemo(() => {
    if (frame.confirmed_image_url) return 'Confirmed';
    if (frame.prompt) return 'Ready to Generate';
    return 'Draft';
  }, [frame]);

  const renderConfirmedPreview = (
    type: 'blackAndWhite' | 'color',
    emptyLabel: string,
    actionLabel: string,
  ) => (
    <div className="flex flex-col items-center justify-center gap-3 border-r border-slate-900/60 p-4 last:border-r-0">
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-slate-800/80 bg-slate-800/70">
        {frame.confirmed_type === type && frame.confirmed_image_url ? (
          <img
            src={frame.confirmed_image_url}
            alt={`${type} generation preview`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-2 text-center text-[11px] uppercase tracking-widest text-slate-600">
            {emptyLabel}
          </div>
        )}
      </div>
      <button
        onClick={async (event) => {
          event.stopPropagation();
          try {
            await generate({ mode: type === 'blackAndWhite' ? 'turbo' : 'highFidelity' });
          } catch (error) {
            console.error('Failed to trigger generation', error);
            window.alert('Generation failed to start. Please try again.');
          }
        }}
        className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs transition ${
          type === 'blackAndWhite'
            ? 'bg-slate-800 text-white hover:bg-brand'
            : 'bg-brand text-white hover:bg-brand-dark font-medium'
        }`}
      >
        {type === 'blackAndWhite' ? <SparklesIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
        {actionLabel}
      </button>
    </div>
  );

  return (
    <div
      className="rounded-2xl border border-slate-900/60 bg-slate-900/40 shadow-xl shadow-black/20 backdrop-blur-md"
      onClick={onSelect}
    >
      <div className="grid grid-cols-[12rem_1fr_12rem_12rem] items-stretch">
        <div className="flex flex-col gap-2 border-r border-slate-900/60 p-4">
          <div className="aspect-video overflow-hidden rounded-lg border border-slate-800/80 bg-slate-800/70">
            {frame.sketch?.image_url ? (
              <img src={frame.sketch.image_url} alt={frame.sketch.file_name ?? 'Storyboard sketch'} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-slate-600">
                No sketch yet
              </div>
            )}
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:border-brand hover:text-brand-light disabled:cursor-not-allowed disabled:opacity-60"
            onClick={(event) => {
              event.stopPropagation();
              fileInputRef.current?.click();
            }}
            disabled={isUploading}
          >
            <PlusCircleIcon className="h-4 w-4" /> {isUploading ? 'Uploading…' : 'Upload Sketch'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (file) {
                try {
                  await upload(file);
                } catch (error) {
                  console.error('Failed to upload sketch', error);
                  window.alert('Sketch upload failed. Please try again with a PNG, JPG, WebP, or SVG file.');
                }
              }
              event.target.value = '';
            }}
          />
        </div>
        <div className="flex flex-col gap-3 border-r border-slate-900/60 p-4">
          <header className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">Frame {frame.frame_number}</p>
              <h3 className="text-lg font-semibold text-white">{frame.metadata.scene ?? 'Untitled Scene'}</h3>
            </div>
            <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">{statusLabel}</span>
          </header>
          <textarea
            value={frame.prompt}
            readOnly
            className="h-24 w-full resize-none rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300 outline-none"
            placeholder="Describe the action"
          />
          <div className="flex gap-2 text-xs text-slate-400">
            <span className="rounded-full border border-slate-800 px-2 py-1">Characters: {frame.selected_characters?.length ?? 0}</span>
            <span className="rounded-full border border-slate-800 px-2 py-1">Locations: {frame.selected_locations?.length ?? 0}</span>
            <span className="rounded-full border border-slate-800 px-2 py-1">Props: {frame.selected_props?.length ?? 0}</span>
          </div>
        </div>
        {renderConfirmedPreview('blackAndWhite', 'Awaiting B&W preview', 'Generate B&W')}
        {renderConfirmedPreview('color', 'Awaiting color preview', 'Generate Color')}
      </div>
    </div>
  );
};

export default FrameRow;
