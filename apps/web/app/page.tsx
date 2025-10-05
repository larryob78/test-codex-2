import Link from 'next/link';

export default function LandingPage(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-10 text-center">
      <h1 className="text-4xl font-bold">Adtech Control Center</h1>
      <p className="max-w-xl text-lg text-slate-300">
        Sign in with your Keycloak advertiser account to manage campaigns, creatives, and analytics.
      </p>
      <Link
        className="rounded bg-emerald-500 px-6 py-3 text-lg font-semibold text-white hover:bg-emerald-400"
        href="/dashboard"
      >
        Enter dashboard
      </Link>
    </main>
  );
}
