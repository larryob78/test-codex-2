import { Card } from '@weaverboard/ui';

type SummaryCardProps = {
  label: string;
  value: number;
};

export function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <Card className="border border-slate-800 bg-slate-900/40 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </Card>
  );
}
