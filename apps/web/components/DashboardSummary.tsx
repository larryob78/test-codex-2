'use client';

import { useQuery } from '@tanstack/react-query';
import { SummaryCard } from './SummaryCard';
import { sdk } from '../lib/sdk';

export function DashboardSummary() {
  const { data } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => sdk.dashboard.summary()
  });

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard label="Workflows" value={data?.workflows ?? 0} />
      <SummaryCard label="Active runs" value={data?.activeRuns ?? 0} />
      <SummaryCard label="Credits" value={data?.credits ?? 0} />
      <SummaryCard label="Published apps" value={data?.apps ?? 0} />
    </section>
  );
}
