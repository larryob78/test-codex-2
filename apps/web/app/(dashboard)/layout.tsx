import { ReactNode } from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr] bg-slate-950 text-slate-100">
      <aside className="flex flex-col gap-4 border-r border-slate-800 p-6">
        <h2 className="text-xl font-semibold">Adtech</h2>
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/dashboard" className="hover:text-emerald-400">
            Overview
          </Link>
          <Link href="/dashboard/campaigns" className="hover:text-emerald-400">
            Campaigns
          </Link>
          <Link href="/dashboard/analytics" className="hover:text-emerald-400">
            Analytics
          </Link>
          <Link href="/dashboard/settings" className="hover:text-emerald-400">
            Settings
          </Link>
        </nav>
      </aside>
      <section className="p-8">{children}</section>
    </div>
  );
}
