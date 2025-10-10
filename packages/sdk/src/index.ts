import EventEmitter from 'eventemitter3';
import { z } from 'zod';

export interface ClientOptions {
  baseUrl: string;
  fetchImpl?: typeof fetch;
}

export interface Workflow {
  id: string;
  name: string;
  graph: {
    nodes: Array<{ id: string; label: string; kind: string; props?: Record<string, unknown>; position?: { x: number; y: number } }>;
    edges: Array<{ id?: string; source: string; target: string }>;
  };
}

const summarySchema = z.object({
  workflows: z.number(),
  activeRuns: z.number(),
  credits: z.number(),
  apps: z.number()
});

const planSchema = z.object({
  id: z.string(),
  name: z.string(),
  monthlyCredits: z.number()
});

const creditSchema = z.object({
  modelCode: z.string(),
  cost: z.number(),
  description: z.string().default('')
});

const runLogSchema = z.array(
  z.object({
    id: z.string(),
    status: z.string(),
    modelCode: z.string().optional()
  })
);

type SummaryResponse = z.infer<typeof summarySchema>;

type Plan = z.infer<typeof planSchema>;

type Credit = z.infer<typeof creditSchema>;

type RunLog = z.infer<typeof runLogSchema>;

export interface Sdk {
  dashboard: {
    summary: () => Promise<SummaryResponse>;
  };
  admin: {
    listPlans: () => Promise<Plan[]>;
    updatePlanCredits: (planId: string, monthlyCredits: number) => Promise<void>;
    listCreditCosts: () => Promise<Credit[]>;
    updateCreditCost: (modelCode: string, cost: number) => Promise<void>;
  };
  workflows: {
    get: (id: string) => Promise<Workflow>;
  };
  runs: {
    list: (workflowId: string) => Promise<RunLog>;
    trigger: (workflowId: string) => Promise<void>;
  };
  events: {
    subscribe: (workflowId: string, handler: (event: RunEvent) => void) => () => void;
  };
}

export type RunEvent = {
  runId: string;
  status: string;
  modelCode?: string;
};

const runEventSchema = z.object({
  runId: z.string(),
  status: z.string(),
  modelCode: z.string().optional()
});

export function createClient(options: ClientOptions): Sdk {
  const fetchImpl = options.fetchImpl ?? fetch;
  const base = options.baseUrl.replace(/\/$/, '');
  const emitter = new EventEmitter();

  async function request<T>(path: string, init?: RequestInit, schema?: z.ZodTypeAny): Promise<T> {
    const response = await fetchImpl(`${base}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
      ...init
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    if (response.status === 204) {
      return undefined as T;
    }
    const json = await response.json();
    return schema ? schema.parse(json) : (json as T);
  }

  return {
    dashboard: {
      summary: () => request('/dashboard/summary', undefined, summarySchema)
    },
    admin: {
      listPlans: () => request('/admin/plans', undefined, z.array(planSchema)),
      updatePlanCredits: (planId, monthlyCredits) =>
        request(`/admin/plans/${planId}`, { method: 'PATCH', body: JSON.stringify({ monthlyCredits }) }),
      listCreditCosts: () => request('/admin/credits', undefined, z.array(creditSchema)),
      updateCreditCost: (modelCode, cost) =>
        request(`/admin/credits/${modelCode}`, { method: 'PATCH', body: JSON.stringify({ cost }) })
    },
    workflows: {
      get: (id) => request(`/workflows/${id}`, undefined, z.custom<Workflow>((value) => value as Workflow))
    },
    runs: {
      list: (workflowId) => request(`/workflows/${workflowId}/runs`, undefined, runLogSchema),
      trigger: (workflowId) => request(`/workflows/${workflowId}/runs`, { method: 'POST' })
    },
    events: {
      subscribe: (workflowId, handler) => {
        emitter.on(workflowId, handler);
        const interval = setInterval(async () => {
          const events = await request<RunEvent[]>(`/workflows/${workflowId}/events`);
          events.forEach((event) => {
            const parsed = runEventSchema.parse(event);
            emitter.emit(workflowId, parsed);
          });
        }, 5000);
        return () => {
          clearInterval(interval);
          emitter.off(workflowId, handler);
        };
      }
    }
  };
}
