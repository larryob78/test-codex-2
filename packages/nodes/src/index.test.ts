import { describe, expect, it } from 'vitest';
import { builtInNodes, createRegistry } from './index';

describe('builtInNodes', () => {
  it('registers all node ids uniquely', () => {
    const ids = builtInNodes.map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('createRegistry composes nodes without duplicates', () => {
    const registry = createRegistry();
    expect(Object.keys(registry).length).toBe(builtInNodes.length);
  });
});
