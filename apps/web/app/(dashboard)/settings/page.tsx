export default function SettingsPage(): JSX.Element {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-sm text-slate-300">
        Configure organization level defaults, connect data sources, and manage AI provider API keys.
      </p>
      <div className="rounded border border-slate-800 bg-slate-900 p-4 text-sm text-slate-200">
        <p>AI providers are mocked when API keys are not set. Add secrets in the .env file or Kubernetes Secret.</p>
      </div>
    </div>
  );
}
