'use client';

import clsx from 'clsx';
import { Button } from '@weaverboard/ui';

export function Toolbar({ className }: { className?: string }) {
  return (
    <div className={clsx('flex items-center justify-between rounded border border-slate-800 bg-slate-900/40 p-3', className)}>
      <div className="flex items-center gap-2 text-xs text-slate-300">
        <span>⌘Z Undo</span>
        <span>⇧⌘Z Redo</span>
        <span>⌘D Duplicate</span>
        <span>⌘G Group</span>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm">Zoom to fit</Button>
        <Button size="sm" variant="secondary">
          Publish app
        </Button>
      </div>
    </div>
  );
}
