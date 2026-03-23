import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../analyze-job';

function makeReq(body: Record<string, unknown> = {}, method = 'POST'): VercelRequest {
  return { method, body } as unknown as VercelRequest;
}

function makeRes(): { res: VercelResponse; calls: { status?: number; json?: unknown } } {
  const calls: { status?: number; json?: unknown } = {};
  const res = {
    setHeader: vi.fn(),
    status(code: number) {
      calls.status = code;
      return res;
    },
    json(data: unknown) {
      calls.json = data;
      return res;
    },
    end() {
      return res;
    },
  } as unknown as VercelResponse;
  return { res, calls };
}

const validJobSpec = 'We are looking for an AI Strategy Lead to join our team and drive commercial AI adoption across the GTM org.';

describe('api/analyze-job', () => {
  const originalEnv = process.env.ANTHROPIC_API_KEY;

  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = 'test-key-123';
  });

  afterEach(() => {
    process.env.ANTHROPIC_API_KEY = originalEnv;
    vi.restoreAllMocks();
  });

  it('returns 405 for GET requests', async () => {
    const { res, calls } = makeRes();
    await handler(makeReq({}, 'GET'), res);
    expect(calls.status).toBe(405);
  });

  it('returns 400 if jobSpecText is missing', async () => {
    const { res, calls } = makeRes();
    await handler(makeReq({}), res);
    expect(calls.status).toBe(400);
  });

  it('returns 400 if jobSpecText is less than 50 chars', async () => {
    const { res, calls } = makeRes();
    await handler(makeReq({ jobSpecText: 'Too short' }), res);
    expect(calls.status).toBe(400);
  });

  it('returns 500 if ANTHROPIC_API_KEY is missing', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const { res, calls } = makeRes();
    await handler(makeReq({ jobSpecText: validJobSpec }), res);
    expect(calls.status).toBe(500);
  });

  it('truncates jobSpecText to 20000 chars', async () => {
    let capturedBody: Record<string, unknown> = {};
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ text: '{}' }] }),
      status: 200,
    }));

    const longSpec = 'x'.repeat(25000);
    const { res } = makeRes();
    await handler(makeReq({ jobSpecText: longSpec }), res);

    const fetchMock = vi.mocked(globalThis.fetch);
    capturedBody = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    const userMessage = (capturedBody.messages as Array<{ content: string }>)[0].content;
    expect(userMessage.length).toBeLessThan(21000);
    // The spec gets sliced to 20000 chars before being embedded in the message
    expect(userMessage).not.toContain('x'.repeat(20001));
  });

  it('returns 200 with Anthropic response on success', async () => {
    const mockData = { content: [{ text: '{"matchScore":85}' }] };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
      status: 200,
    }));

    const { res, calls } = makeRes();
    await handler(makeReq({ jobSpecText: validJobSpec }), res);

    expect(calls.status).toBe(200);
    expect(calls.json).toEqual(mockData);
  });

  it('returns Anthropic error status on API failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: { message: 'Rate limited' } }),
      status: 429,
    }));

    const { res, calls } = makeRes();
    await handler(makeReq({ jobSpecText: validJobSpec }), res);

    expect(calls.status).toBe(429);
  });

  it('passes system prompt to Anthropic', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ text: '{}' }] }),
      status: 200,
    }));

    const { res } = makeRes();
    await handler(makeReq({ jobSpecText: validJobSpec }), res);

    const fetchMock = vi.mocked(globalThis.fetch);
    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(typeof body.system).toBe('string');
    expect(body.system.length).toBeGreaterThan(100);
  });
});
