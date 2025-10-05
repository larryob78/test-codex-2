import { z } from 'zod';

export const RoleSchema = z.enum(['ADMIN', 'ADVERTISER', 'ANALYST']);
export type Role = z.infer<typeof RoleSchema>;

export const CreativeKindSchema = z.enum(['TEXT', 'IMAGE', 'VIDEO']);
export type CreativeKind = z.infer<typeof CreativeKindSchema>;

export const CampaignGoalSchema = z.enum(['CLICKS', 'CONVERSIONS', 'REACH']);
export type CampaignGoal = z.infer<typeof CampaignGoalSchema>;

export const CreateCampaignInputSchema = z.object({
  name: z.string().min(1),
  startAt: z.string(),
  endAt: z.string(),
  dailyBudgetCents: z.number().min(0),
  totalBudgetCents: z.number().min(0),
  goal: CampaignGoalSchema,
  lineItems: z.array(
    z.object({
      countryCodes: z.array(z.string()),
      devices: z.array(z.string()),
      contexts: z.array(z.string()),
      segments: z.array(z.string())
    })
  )
});
export type CreateCampaignInput = z.infer<typeof CreateCampaignInputSchema>;

export const CampaignSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  spentTodayCents: z.number(),
  spentTotalCents: z.number(),
  goal: CampaignGoalSchema
});
export type CampaignSummary = z.infer<typeof CampaignSummarySchema>;

export const AnalyticsSummarySchema = z.object({
  impressions: z.number(),
  clicks: z.number(),
  conversions: z.number(),
  spendCents: z.number(),
  revenueCents: z.number()
});
export type AnalyticsSummary = z.infer<typeof AnalyticsSummarySchema>;

export const AnalyticsTimeseriesPointSchema = z.object({
  ts: z.string(),
  impressions: z.number(),
  clicks: z.number(),
  conversions: z.number(),
  spendCents: z.number(),
  revenueCents: z.number()
});
export type AnalyticsTimeseriesPoint = z.infer<typeof AnalyticsTimeseriesPointSchema>;

export interface OpenRTBBidResponse {
  id: string;
  seatbid: Array<{
    bid: Array<{
      id: string;
      impid: string;
      price: number;
      adm: string;
      crid: string;
      nurl: string;
    }>;
  }>;
  cur: string;
}

export const PrivacyExportRequestSchema = z.object({
  userKey: z.string()
});
export type PrivacyExportRequest = z.infer<typeof PrivacyExportRequestSchema>;

export interface PrivacyErasureResult {
  userKey: string;
  postgresAnonymized: boolean;
  redisAnonymized: boolean;
  clickhouseAnonymized: boolean;
}

export const AiCopyRequestSchema = z.object({
  productName: z.string(),
  tone: z.string().default('neutral')
});
export type AiCopyRequest = z.infer<typeof AiCopyRequestSchema>;

export const AiImageRequestSchema = z.object({
  prompt: z.string(),
  width: z.number().default(1200),
  height: z.number().default(628)
});
export type AiImageRequest = z.infer<typeof AiImageRequestSchema>;

export const AiVideoRequestSchema = z.object({
  concept: z.string(),
  durationSeconds: z.number().default(6)
});
export type AiVideoRequest = z.infer<typeof AiVideoRequestSchema>;

export const ApiClientConfigSchema = z.object({
  baseUrl: z.string().url()
});
export type ApiClientConfig = z.infer<typeof ApiClientConfigSchema>;

export interface ApiClient {
  getCampaigns(): Promise<CampaignSummary[]>;
  createCampaign(input: CreateCampaignInput): Promise<CampaignSummary>;
}

export class FetchApiClient implements ApiClient {
  private readonly baseUrl: string;

  public constructor(config: ApiClientConfig) {
    const parsed = ApiClientConfigSchema.parse(config);
    this.baseUrl = parsed.baseUrl;
  }

  public async getCampaigns(): Promise<CampaignSummary[]> {
    const res = await fetch(`${this.baseUrl}/v1/campaigns`, {
      credentials: 'include'
    });
    if (!res.ok) {
      throw new Error(`Failed to load campaigns: ${res.status}`);
    }
    const json = await res.json();
    return z.array(CampaignSummarySchema).parse(json);
  }

  public async createCampaign(input: CreateCampaignInput): Promise<CampaignSummary> {
    const payload = CreateCampaignInputSchema.parse(input);
    const res = await fetch(`${this.baseUrl}/v1/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`Failed to create campaign: ${res.status}`);
    }
    const json = await res.json();
    return CampaignSummarySchema.parse(json);
  }
}
