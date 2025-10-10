import { CreditTable } from '../../components/admin/CreditTable';
import { PlanEditor } from '../../components/admin/PlanEditor';

export default function AdminPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-10">
      <header>
        <h1 className="text-2xl font-semibold text-white">Admin</h1>
        <p className="text-sm text-slate-300">Manage plans and credit mappings.</p>
      </header>
      <section className="grid gap-8 md:grid-cols-2">
        <PlanEditor />
        <CreditTable />
      </section>
    </main>
  );
}
