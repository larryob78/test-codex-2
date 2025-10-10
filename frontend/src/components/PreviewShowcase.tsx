import { Fragment } from 'react';
import { Link } from 'react-router-dom';

const demoProjects = [
  {
    id: 'preview-001',
    name: 'Nebula Heist',
    description: 'Sci-fi thriller heist across orbital casinos. Focus on neon lighting and kinetic framing.',
    updatedAt: '2024-02-12T11:42:00Z',
    frameCount: 24,
    thumbnail: '/demo/neon-heist.png',
  },
  {
    id: 'preview-002',
    name: 'Myth of the Azure Temple',
    description: 'Mystical adventure that blends painterly matte backgrounds with moody torch-lit interiors.',
    updatedAt: '2024-01-28T08:15:00Z',
    frameCount: 36,
    thumbnail: '/demo/azure-temple.png',
  },
  {
    id: 'preview-003',
    name: 'Skatepark Summer',
    description: 'Energetic coming-of-age short with vibrant daylight palettes and character-driven moments.',
    updatedAt: '2024-03-04T18:27:00Z',
    frameCount: 18,
    thumbnail: '/demo/skatepark.png',
  },
];

const demoFrames = [
  {
    id: 'frame-01',
    number: 12,
    sketchUrl: '/demo/sketch-01.png',
    prompt:
      'The crew sprints across the catwalk as sparks rain from the damaged reactor core. Capture wide cinematic depth.',
    characters: ['Nova', 'Cipher'],
    location: 'Orbital Foundry - Observation Deck',
    status: 'confirmed',
    bwUrl: '/demo/bw-01.png',
    colorUrl: '/demo/color-01.png',
  },
  {
    id: 'frame-02',
    number: 13,
    sketchUrl: '/demo/sketch-02.png',
    prompt:
      'Close-up on Nova recalibrating her gauntlet HUD with reflections of neon signage dancing across her visor.',
    characters: ['Nova'],
    location: 'Catwalk Overlook',
    status: 'in-progress',
    bwUrl: '/demo/bw-02.png',
    colorUrl: '',
  },
  {
    id: 'frame-03',
    number: 14,
    sketchUrl: '/demo/sketch-03.png',
    prompt:
      'Drone POV soaring through the maintenance shafts to reveal the vault entrance guarded by two sentry mechs.',
    characters: ['Cipher'],
    location: 'Maintenance Shaft',
    status: 'draft',
    bwUrl: '',
    colorUrl: '',
  },
];

const demoGenerations = [
  {
    id: 'gen-01',
    title: 'Final Color Selection',
    url: '/demo/color-01.png',
    timestamp: 'Confirmed · 12 Mar 2024 · Seed 4471',
  },
  {
    id: 'gen-02',
    title: 'High Fidelity Pass',
    url: '/demo/color-01b.png',
    timestamp: 'High Fidelity · 11 Mar 2024 · Seed 4470',
  },
  {
    id: 'gen-03',
    title: 'Turbo Exploration',
    url: '/demo/color-01c.png',
    timestamp: 'Turbo · 11 Mar 2024 · Seed 4469',
  },
];

const statusLabel: Record<string, { label: string; tone: string }> = {
  confirmed: { label: 'Confirmed', tone: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' },
  'in-progress': { label: 'In Progress', tone: 'bg-amber-500/10 text-amber-300 border border-amber-500/30' },
  draft: { label: 'Draft', tone: 'bg-slate-500/10 text-slate-300 border border-slate-500/30' },
};

const PreviewShowcase = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <header className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3rem] text-brand-light">Storyboard AI Preview</p>
            <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Cinematic storytelling, orchestrated by AI</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">
              Explore the core UX moments of the storyboard creation experience. Navigate the dashboard, inspect the frame
              workspace, and review generation history with production-ready styling.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm text-slate-300">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-widest text-slate-500">Quick Links</p>
              <div className="mt-3 grid gap-2">
                <Link className="text-brand-light hover:text-brand" to="/">Back to live dashboard</Link>
                <Link className="text-brand-light hover:text-brand" to="/projects/preview">Open interactive workspace</Link>
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-widest text-slate-500">Design Tokens</p>
              <ul className="mt-3 space-y-1 text-xs text-slate-400">
                <li>
                  <span className="font-semibold text-slate-200">Brand</span> · #7C3AED → #22D3EE gradients
                </li>
                <li>
                  <span className="font-semibold text-slate-200">Surface</span> · Slate-900/950 layered panels
                </li>
                <li>
                  <span className="font-semibold text-slate-200">Typography</span> · Inter + JetBrains Mono
                </li>
              </ul>
            </div>
          </div>
        </header>

        <section className="mt-16">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3rem] text-slate-500">01 · Project Control Center</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Dashboard overview</h2>
            </div>
            <span className="text-xs uppercase tracking-[0.3rem] text-slate-500">Grid · Search · Quick Actions</span>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-8 shadow-2xl shadow-brand/10">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {demoProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-brand hover:shadow-lg hover:shadow-brand/20"
                  >
                    <div className="relative mb-3 aspect-video overflow-hidden rounded-lg">
                      <div className="absolute inset-0 bg-gradient-to-tr from-brand/40 via-transparent to-brand-light/40 opacity-70" />
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-slate-950/60 px-3 py-2 text-[0.7rem] uppercase tracking-widest text-slate-400">
                        <span>{project.frameCount} Frames</span>
                        <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-brand-light">{project.name}</h3>
                    <p className="mt-2 text-sm text-slate-400 line-clamp-3">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3rem] text-slate-500">Timeline</h3>
                <ol className="mt-4 space-y-4 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand" />
                    <div>
                      <p className="font-medium text-white">Art Director approved Nebula Heist frames 12-14</p>
                      <p className="text-xs text-slate-500">12 Mar 2024 · Feedback loop closed</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-light" />
                    <div>
                      <p className="font-medium text-white">Turbo explorations queued for Azure Temple sequence</p>
                      <p className="text-xs text-slate-500">11 Mar 2024 · 6 variations pending</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-600" />
                    <div>
                      <p className="font-medium text-white">Storyboard export delivered to Frame.io</p>
                      <p className="text-xs text-slate-500">09 Mar 2024 · Presentation layout</p>
                    </div>
                  </li>
                </ol>
              </div>
              <div className="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3rem] text-slate-500">Keyboard Flow</h3>
                <dl className="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-400">
                  <div>
                    <dt className="font-semibold text-slate-200">G</dt>
                    <dd>Generate B&amp;W</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-200">Shift + G</dt>
                    <dd>Generate Color</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-200">C</dt>
                    <dd>Confirm Selection</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-200">⌘ + Shift + E</dt>
                    <dd>Export Project</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3rem] text-slate-500">02 · Frame Workspace</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Production pipeline view</h2>
            </div>
            <span className="text-xs uppercase tracking-[0.3rem] text-slate-500">Sketch · Prompt · Outputs</span>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-8 shadow-2xl shadow-brand/10">
            <div className="grid grid-cols-[3.5rem_1fr_1.1fr_1.1fr_8rem] items-center border-b border-slate-800 pb-4 text-[0.75rem] font-semibold uppercase tracking-widest text-slate-500">
              <span>#</span>
              <span>Sketch</span>
              <span>Prompt</span>
              <span>AI Outputs</span>
              <span>Status</span>
            </div>

            <div className="divide-y divide-slate-800">
              {demoFrames.map((frame) => (
                <div key={frame.id} className="grid grid-cols-[3.5rem_1fr_1.1fr_1.1fr_8rem] items-stretch gap-6 py-6">
                  <div>
                    <div className="flex h-full items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 font-mono text-sm text-slate-400">
                      {frame.number}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="h-32 rounded-lg border border-slate-800 bg-slate-900/60" />
                    <button className="inline-flex w-max items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-300 transition hover:border-brand hover:text-brand-light">
                      <span>Upload Sketch</span>
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="text-sm leading-relaxed text-slate-300">{frame.prompt}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {frame.characters.map((character) => (
                        <span key={character} className="rounded-full bg-brand/10 px-3 py-1 text-brand-light">
                          {character}
                        </span>
                      ))}
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">{frame.location}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-slate-800 bg-slate-900/60">
                      <div className="h-24 rounded-t-lg bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />
                      <div className="px-3 py-2 text-xs text-slate-400">B&amp;W</div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900/60">
                      <div className="h-24 rounded-t-lg bg-gradient-to-br from-brand/20 via-transparent to-brand-light/40" />
                      <div className="px-3 py-2 text-xs text-slate-400">Color</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusLabel[frame.status]?.tone}`}>
                      {statusLabel[frame.status]?.label ?? 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3rem] text-slate-500">03 · Generation Review</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Variant comparisons &amp; confirmation</h2>
            </div>
            <span className="text-xs uppercase tracking-[0.3rem] text-slate-500">History · Ratings · Confirmation</span>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div className="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-8 shadow-2xl shadow-brand/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3rem] text-slate-500">High Fidelity · Seed 4471</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Frame 12 · Confirmed Color</h3>
                </div>
                <div className="flex gap-2 text-xs">
                  <button className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-slate-300 transition hover:border-brand hover:text-brand-light">
                    Regenerate
                  </button>
                  <button className="rounded-full border border-brand/40 bg-brand px-3 py-1 font-medium text-slate-950 transition hover:bg-brand-light">
                    Confirm
                  </button>
                </div>
              </div>
              <div className="mt-6 aspect-video rounded-xl border border-slate-800 bg-gradient-to-br from-brand/20 via-transparent to-brand-light/40" />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                  <p className="text-xs uppercase tracking-[0.3rem] text-slate-500">Prompt</p>
                  <p className="mt-2 text-sm text-slate-300">
                    "Ultra-wide cinematic composition featuring the entire crew racing across the catwalk. Neon lighting spills from the reactor core while sparks scatter in the air."
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                  <p className="text-xs uppercase tracking-[0.3rem] text-slate-500">Settings</p>
                  <dl className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <div>
                      <dt className="font-semibold text-slate-200">Mode</dt>
                      <dd>High Fidelity</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-200">Style Strength</dt>
                      <dd>65%</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-200">Prompt Weight</dt>
                      <dd>80%</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-200">Aspect</dt>
                      <dd>2.39:1</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-6">
                <p className="text-xs uppercase tracking-[0.3rem] text-slate-500">Version History</p>
                <div className="mt-4 space-y-3">
                  {demoGenerations.map((gen, index) => (
                    <Fragment key={gen.id}>
                      <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                        <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-brand/30 via-transparent to-brand-light/40" />
                        <div>
                          <p className="text-sm font-semibold text-white">{gen.title}</p>
                          <p className="text-xs text-slate-500">{gen.timestamp}</p>
                        </div>
                      </div>
                      {index < demoGenerations.length - 1 && (
                        <div className="ml-8 h-6 border-l border-dashed border-slate-700" />
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-6">
                <p className="text-xs uppercase tracking-[0.3rem] text-slate-500">Collaboration</p>
                <div className="mt-4 flex items-start gap-3 text-sm text-slate-300">
                  <div className="flex -space-x-3">
                    {['AC', 'JD', 'ML'].map((initials) => (
                      <span
                        key={initials}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 font-medium text-white"
                      >
                        {initials}
                      </span>
                    ))}
                  </div>
                  <div>
                    <p className="font-medium text-white">Live collaboration enabled</p>
                    <p className="text-xs text-slate-500">3 users reviewing · Comments synced via Supabase realtime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PreviewShowcase;
