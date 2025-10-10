'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sdk } from '../../lib/sdk';
import { Card, Input, Label } from '@weaverboard/ui';
import { useState } from 'react';

type EditableCredit = {
  modelCode: string;
  cost: number;
};

export function CreditTable() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ['credits-map'], queryFn: () => sdk.admin.listCreditCosts() });
  const [draft, setDraft] = useState<Record<string, number>>({});

  const mutation = useMutation({
    mutationFn: (payload: EditableCredit) => sdk.admin.updateCreditCost(payload.modelCode, payload.cost),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['credits-map'] })
  });

  const rows = data ?? [];

  return (
    <Card className="flex flex-col gap-4 border border-slate-800 bg-slate-900/40 p-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Credit map</h2>
        <p className="text-sm text-slate-300">
          Configure credit costs per model. Generative nodes consume credits using this map.
        </p>
      </div>
      <div className="space-y-3">
        {rows.map((row) => {
          const value = draft[row.modelCode] ?? row.cost;
          return (
            <div key={row.modelCode} className="flex items-center justify-between gap-4">
              <div>
                <Label>{row.modelCode}</Label>
                <p className="text-xs text-slate-400">{row.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  value={value}
                  onChange={(event) =>
                    setDraft((previous) => ({ ...previous, [row.modelCode]: Number(event.target.value) }))
                  }
                  className="w-24"
                />
                <button
                  className="rounded bg-indigo-500 px-3 py-1 text-xs font-medium text-white"
                  onClick={() =>
                    mutation.mutate({ modelCode: row.modelCode, cost: draft[row.modelCode] ?? row.cost })
                  }
                >
                  Save
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
