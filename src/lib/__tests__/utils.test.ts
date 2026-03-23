import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn', () => {
  it('returns a single class unchanged', () => {
    expect(cn('foo')).toBe('foo');
  });

  it('joins multiple classes with a space', () => {
    expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz');
  });

  it('filters out undefined values', () => {
    expect(cn('foo', undefined, 'bar')).toBe('foo bar');
  });

  it('filters out null values', () => {
    expect(cn('foo', null, 'bar')).toBe('foo bar');
  });

  it('filters out false values (conditional classes)', () => {
    const active = false;
    expect(cn('base', active && 'active')).toBe('base');
  });

  it('includes truthy conditional classes', () => {
    const active = true;
    expect(cn('base', active && 'active')).toBe('base active');
  });

  it('filters out 0', () => {
    expect(cn('foo', 0, 'bar')).toBe('foo bar');
  });

  it('returns empty string when all values are falsy', () => {
    expect(cn(undefined, null, false)).toBe('');
  });
});
