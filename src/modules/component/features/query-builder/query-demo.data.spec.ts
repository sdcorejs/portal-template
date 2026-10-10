import { pauseQueryDemoProjects, QUERY_DEMO_PROJECTS, queryDemoPreset, selectQueryDemoProjects } from './query-demo.data';

describe('Query Builder demo data handoff', () => {
  it('evaluates AND, OR and nested groups against the same fictional records', () => {
    expect(selectQueryDemoProjects(QUERY_DEMO_PROJECTS, queryDemoPreset('and')).map(row => row.id)).toEqual(['PRJ-01', 'PRJ-04']);
    expect(selectQueryDemoProjects(QUERY_DEMO_PROJECTS, queryDemoPreset('or')).map(row => row.id)).toEqual(['PRJ-02', 'PRJ-03', 'PRJ-05']);
    expect(selectQueryDemoProjects(QUERY_DEMO_PROJECTS, queryDemoPreset('nested')).map(row => row.id)).toEqual([
      'PRJ-02',
      'PRJ-04',
      'PRJ-06',
    ]);
  });
  it('uses field comparisons, dates and search without mutating the seed', () => {
    expect(selectQueryDemoProjects(QUERY_DEMO_PROJECTS, queryDemoPreset('field')).map(row => row.id)).toEqual(['PRJ-02', 'PRJ-04']);
    expect(selectQueryDemoProjects(QUERY_DEMO_PROJECTS, queryDemoPreset('date')).length).toBe(3);
    expect(selectQueryDemoProjects(QUERY_DEMO_PROJECTS, null, ' nova ')).toEqual([QUERY_DEMO_PROJECTS[0]]);
  });
  it('rejects malformed filters instead of quietly showing all rows', () => {
    expect(() => selectQueryDemoProjects(QUERY_DEMO_PROJECTS, { field: 'budget', operator: 'IN', data: 80 } as never)).toThrow();
  });
  it('ignores stale IDs, preserves already paused rows and leaves seed data resettable', () => {
    const changed = pauseQueryDemoProjects(QUERY_DEMO_PROJECTS, ['PRJ-01', 'PRJ-03', 'missing']);
    expect(changed[0].active).toBeFalse();
    expect(changed[2]).toBe(QUERY_DEMO_PROJECTS[2]);
    expect(QUERY_DEMO_PROJECTS[0].active).toBeTrue();
  });
});
