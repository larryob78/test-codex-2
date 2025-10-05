'use client';

import { useQuery } from '@tanstack/react-query';
import { FetchApiClient } from '@adtech/shared-types';

const apiClient = new FetchApiClient({ baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000' });

interface MetricTileProps {
  label: string;
  value: string;
}

function MetricTile({ label, value }: MetricTileProps): JSX.Element {
  return (
    <div className="rounded border border-slate-800 bg-slate-900 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

export default function DashboardOverview(): JSX.Element {
  const { data } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => apiClient.getCampaigns()
  });

  const active = data?.length ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <MetricTile label="Active campaigns" value={active.toString()} />
      <MetricTile label="Total spend today" value="$123.45" />
      <MetricTile label="Avg CTR" value="2.4%" />
    </div>
  );
}
