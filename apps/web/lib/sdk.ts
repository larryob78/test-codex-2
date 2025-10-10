import { createClient } from '@weaverboard/sdk';

export const sdk = createClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
});
