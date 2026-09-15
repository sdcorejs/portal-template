import { PAGE_PATTERNS } from './pattern-registry';
import { PATTERN_LOADERS } from './pattern-loaders';
describe('CASE-CATALOG — discoverable patterns', () => {
  it('maps all 12 unique IDs to a renderer and versioned data contract', () => {
    expect(PAGE_PATTERNS.length).toBe(14);
    expect(new Set(PAGE_PATTERNS.map(x => x.id)).size).toBe(14);
    expect(Object.keys(PATTERN_LOADERS).sort()).toEqual(PAGE_PATTERNS.map(x => x.id).sort());
    expect(PAGE_PATTERNS.every(x => x.coreVersion === '22.2.8' && x.suitableWhen && x.avoidWhen)).toBeTrue();
  });
});
