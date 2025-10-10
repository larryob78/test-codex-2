import { RocketLaunchIcon } from '@heroicons/react/24/outline';

import useVideoProviders from '../hooks/useVideoProviders';

const VideoProvidersPanel = () => {
  const { data: providers } = useVideoProviders();

  return (
    <section className="mt-10 rounded-2xl border border-slate-900/70 bg-slate-950/70 p-5">
      <header className="flex items-center gap-2">
        <RocketLaunchIcon className="h-5 w-5 text-brand" />
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Video AI</p>
          <h3 className="text-lg font-semibold text-white">Connected Providers</h3>
        </div>
      </header>
      <p className="mt-3 text-xs leading-relaxed text-slate-400">
        Spin up cinematic motion directly from your confirmed storyboard frames using premium video diffusion models.
      </p>

      <div className="mt-4 space-y-3">
        {providers.map((provider) => (
          <article
            key={provider.id}
            className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-4 transition hover:border-brand/60 hover:bg-slate-900/90"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-white">{provider.name}</h4>
                <p className="text-xs text-slate-400">{provider.description}</p>
              </div>
              <span className="rounded-full bg-brand/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand">
                {provider.max_duration_seconds}s
              </span>
            </div>
            <ul className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
              {provider.supported_capabilities.map((capability) => (
                <li key={capability} className="rounded-full bg-slate-900 px-2 py-1 text-[10px] uppercase tracking-widest">
                  {capability}
                </li>
              ))}
            </ul>
          </article>
        ))}
        {providers.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/50 p-6 text-center text-xs text-slate-500">
            Video providers will appear here once configured.
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoProvidersPanel;
