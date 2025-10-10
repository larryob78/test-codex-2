'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { sdk } from '../../lib/sdk';
import { Button, Card, Input, Label } from '@weaverboard/ui';

export function PlanEditor() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ['plans'], queryFn: () => sdk.admin.listPlans() });
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [monthlyCredits, setMonthlyCredits] = useState<number>(0);

  const mutation = useMutation({
    mutationFn: (payload: { planId: string; monthlyCredits: number }) =>
      sdk.admin.updatePlanCredits(payload.planId, payload.monthlyCredits),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    }
  });

  const plans = data ?? [];
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];

  return (
    <Card className="flex flex-col gap-4 border border-slate-800 bg-slate-900/40 p-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Plans</h2>
        <p className="text-sm text-slate-300">Update monthly credit allocations.</p>
      </div>
      <select
        className="rounded border border-slate-700 bg-slate-800 p-2 text-sm text-white"
        value={selectedPlan?.id ?? ''}
        onChange={(e) => {
          const id = e.target.value;
          setSelectedPlanId(id);
          const plan = plans.find((p) => p.id === id);
          if (plan) {
            setMonthlyCredits(plan.monthlyCredits);
          }
        }}
      >
        {plans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.name}
          </option>
        ))}
      </select>
      <div className="space-y-2">
        <Label htmlFor="credits">Monthly credits</Label>
        <Input
          id="credits"
          type="number"
          min={0}
          value={monthlyCredits}
          onChange={(event) => setMonthlyCredits(Number(event.target.value))}
        />
      </div>
      <Button
        onClick={() => {
          if (!selectedPlan) return;
          mutation.mutate({ planId: selectedPlan.id, monthlyCredits });
        }}
      >
        Save
      </Button>
    </Card>
  );
}
