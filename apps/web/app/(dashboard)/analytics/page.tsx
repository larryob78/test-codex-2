export default function AnalyticsPage(): JSX.Element {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Live analytics</h1>
      <p className="text-sm text-slate-300">
        Timeseries charts are populated by the analytics API and auto refresh every 30 seconds.
      </p>
      <div className="h-64 w-full rounded border border-slate-800 bg-slate-900" />
    </div>
  );
}
