import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import useProjects from '../hooks/useProjects';

const DashboardPage = () => {
  const { data } = useProjects();
  const projects = useMemo(() => data ?? [], [data]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">Storyboard AI</p>
          <h1 className="text-3xl font-semibold">Project Dashboard</h1>
        </div>
        <button className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark">
          New Project
        </button>
      </header>

      <section>
        <h2 className="text-lg font-semibold text-slate-200">Recent Projects</h2>
        <p className="text-sm text-slate-400">Jump back into your latest storyboard sequences.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-brand hover:bg-slate-900"
            >
              <div className="mb-3 aspect-video rounded-lg bg-gradient-to-br from-brand/40 via-brand-dark/40 to-slate-900" />
              <h3 className="text-lg font-semibold text-white group-hover:text-brand-light">{project.name}</h3>
              <p className="mt-1 text-sm text-slate-400 line-clamp-2">{project.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>{project.frames?.length ?? 0} frames</span>
                <span>{new Date(project.updated_at).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
          {projects.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
              No storyboard projects yet. Create one to get started.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
