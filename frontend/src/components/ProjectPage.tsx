import { Fragment, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import useProjectDetail from '../hooks/useProjectDetail';
import useFrameMutations from '../hooks/useFrameMutations';
import FrameRow from './FrameRow';
import GenerationPanel from './GenerationPanel';

const ProjectPage = () => {
  const { projectId = '' } = useParams();
  const { data: project } = useProjectDetail(projectId);
  const { createFrame } = useFrameMutations(projectId);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);

  const frames = useMemo(() => project?.frames ?? [], [project]);
  const characters = project?.characters ?? [];
  const locations = project?.locations ?? [];
  const props = project?.props ?? [];

  const renderAssetPreview = (items: { id: string; name: string; description?: string }[]) => {
    if (items.length === 0) {
      return <p className="text-xs text-slate-500">No entries yet.</p>;
    }
    return (
      <ul className="mt-2 space-y-1 text-xs text-slate-400">
        {items.slice(0, 3).map((item) => (
          <li key={item.id} className="truncate">
            <span className="font-medium text-slate-200">{item.name}</span>
            {item.description ? <span className="text-slate-500"> — {item.description}</span> : null}
          </li>
        ))}
        {items.length > 3 && (
          <li className="text-[11px] uppercase tracking-widest text-slate-500">+{items.length - 3} more</li>
        )}
      </ul>
    );
  };

  return (
    <div className="grid min-h-screen grid-cols-[18rem_1fr_24rem] bg-slate-950">
      <aside className="border-r border-slate-900/70 bg-slate-950/80 p-6">
        <h2 className="text-sm font-medium uppercase tracking-widest text-slate-500">Assets</h2>
        <nav className="mt-4 space-y-5 text-sm text-slate-300">
          <section>
            <header className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-200">Characters</h3>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{characters.length}</span>
            </header>
            <p className="text-xs text-slate-500">Maintain consistent heroes.</p>
            {renderAssetPreview(characters)}
          </section>
          <section>
            <header className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-200">Locations</h3>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{locations.length}</span>
            </header>
            <p className="text-xs text-slate-500">Manage reusable settings.</p>
            {renderAssetPreview(locations)}
          </section>
          <section>
            <header className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-200">Props</h3>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{props.length}</span>
            </header>
            <p className="text-xs text-slate-500">Curate key scene items.</p>
            {renderAssetPreview(props)}
          </section>
        </nav>
      </aside>
      <main className="border-r border-slate-900/70 bg-slate-950/60">
        <header className="flex items-center justify-between border-b border-slate-900/70 px-8 py-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Project</p>
            <h1 className="text-2xl font-semibold text-white">{project?.name ?? 'Loading…'}</h1>
            <p className="mt-1 max-w-xl text-sm text-slate-400">{project?.description}</p>
          </div>
          <button
            onClick={() => createFrame()}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark"
          >
            Add Frame
          </button>
        </header>

        <div className="space-y-4 px-6 py-6">
          {frames.map((frame) => (
            <Fragment key={frame.id}>
              <FrameRow frame={frame} onSelect={() => setSelectedFrameId(frame.id)} />
            </Fragment>
          ))}
          {frames.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/50 p-8 text-center text-sm text-slate-400">
              Upload sketches or add frames to kickstart your storyboard.
            </div>
          )}
        </div>
      </main>
      <GenerationPanel frameId={selectedFrameId} projectId={project?.id ?? null} />
    </div>
  );
};

export default ProjectPage;
