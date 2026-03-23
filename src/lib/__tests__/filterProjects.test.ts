import { describe, it, expect } from 'vitest';
import { filterAndSortProjects } from '../filterProjects';
import type { Project } from '../types';

const makeProject = (id: string, tags: string[], priority: number): Project => ({
  id,
  title: `Project ${id}`,
  context: 'Context',
  impact: [],
  tags,
  priority,
});

const projects: Project[] = [
  makeProject('a', ['ai', 'gtm'], 3),
  makeProject('b', ['ai', 'sales'], 1),
  makeProject('c', ['enablement', 'gtm'], 2),
  makeProject('d', ['revops'], 4),
  makeProject('e', ['ai', 'enablement', 'gtm'], 5),
];

describe('filterAndSortProjects', () => {
  it('with no filters, returns all projects sorted by priority ascending', () => {
    const result = filterAndSortProjects(projects, []);
    const ids = result.map(p => p.id);
    expect(ids).toEqual(['b', 'c', 'a', 'd', 'e']);
  });

  it('with single filter, returns all projects with matching projects first', () => {
    const result = filterAndSortProjects(projects, ['ai']);
    // projects with 'ai': b(score=1,pri=1), a(score=1,pri=3), e(score=1,pri=5)
    // projects without: c(score=0,pri=2), d(score=0,pri=4)
    const ids = result.map(p => p.id);
    expect(ids[0]).toBe('b');
    // a and e both score 1 — sorted by priority asc
    expect(ids).toEqual(['b', 'a', 'e', 'c', 'd']);
  });

  it('with multiple filters, scores by number of matching tags', () => {
    const result = filterAndSortProjects(projects, ['ai', 'gtm']);
    // e: tags=[ai,enablement,gtm], score=2, priority=5
    // a: tags=[ai,gtm],           score=2, priority=3  → higher priority (lower number) wins tiebreak
    // c: tags=[enablement,gtm],   score=1, priority=2
    // b: tags=[ai,sales],         score=1, priority=1
    // d: tags=[revops],           score=0, priority=4
    const ids = result.map(p => p.id);
    expect(ids[0]).toBe('a'); // score=2, priority=3 beats e(score=2,priority=5)
    expect(ids[1]).toBe('e');
    expect(ids[2]).toBe('b'); // score=1, priority=1
    expect(ids[3]).toBe('c'); // score=1, priority=2
    expect(ids[4]).toBe('d'); // score=0
  });

  it('returns all projects even when no tags match (score=0)', () => {
    const result = filterAndSortProjects(projects, ['nonexistent']);
    expect(result).toHaveLength(projects.length);
  });

  it('tiebreaker: equal score projects sorted by priority ascending', () => {
    const tied = [
      makeProject('x', ['ai'], 10),
      makeProject('y', ['ai'], 5),
      makeProject('z', ['ai'], 1),
    ];
    const result = filterAndSortProjects(tied, ['ai']);
    expect(result.map(p => p.id)).toEqual(['z', 'y', 'x']);
  });
});
