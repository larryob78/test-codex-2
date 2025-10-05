import { describe, expect, it } from 'vitest';
import { CampaignSummarySchema } from './index';

describe('CampaignSummarySchema', () => {
  it('validates campaign summary', () => {
    const parsed = CampaignSummarySchema.parse({
      id: 'cmp_1',
      name: 'Test',
      status: 'ACTIVE',
      spentTodayCents: 100,
      spentTotalCents: 200,
      goal: 'CLICKS'
    });
    expect(parsed.name).toBe('Test');
  });
});
