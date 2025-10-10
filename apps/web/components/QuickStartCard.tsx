import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@weaverboard/ui';

type QuickStartCardProps = {
  title: string;
  description: string;
  href: string;
};

export function QuickStartCard({ title, description, href }: QuickStartCardProps) {
  return (
    <Card className="flex h-full flex-col justify-between border border-slate-800 bg-slate-900/40 p-4">
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-300 hover:text-indigo-100"
      >
        Open <ArrowRight size={16} />
      </Link>
    </Card>
  );
}
