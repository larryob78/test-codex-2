import { Suspense } from 'react';
import DashboardOverview from '../../components/dashboard-overview';

export default function DashboardPage(): JSX.Element {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Suspense fallback={<p>Loading metrics...</p>}>
        <DashboardOverview />
      </Suspense>
    </div>
  );
}
