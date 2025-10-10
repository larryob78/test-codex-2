import { describe, expect, it } from 'vitest';
import { createClient } from './index';

describe('createClient', () => {
  it('strips trailing slash from base URL', () => {
    const client = createClient({ baseUrl: 'http://localhost:3001/' });
    expect(client).toBeTruthy();
  });
});
