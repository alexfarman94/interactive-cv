import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../chat';

function makeReq(overrides: Partial<VercelRequest> = {}): VercelRequest {
  return {
    method: 'POST',
    body: {
      messages: [{ role: 'user', content: 'Hello' }],
      system: 'You are a helpful assistant',
      max_tokens: 300,
    },
    ...overrides,
  } as unknown as VercelRequest;
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

describe('api/chat', () => {
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
    await handler(makeReq({ method: 'GET' }), res);
    expect(calls.status).toBe(405);
  });

  it('returns 200 for OPTIONS preflight', async () => {
    const { res, calls } = makeRes();
    await handler(makeReq({ method: 'OPTIONS' }), res);
    expect(calls.status).toBe(200);
  });

  it('returns 400 if messages is missing', async () => {
    const { res, calls } = makeRes();
    await handler(makeReq({ body: { system: 'sys' } }), res);
    expect(calls.status).toBe(400);
  });

  it('returns 400 if messages is not an array', async () => {
    const { res, calls } = makeRes();
    await handler(makeReq({ body: { messages: 'not-an-array' } }), res);
    expect(calls.status).toBe(400);
  });

  it('returns 500 if ANTHROPIC_API_KEY is missing', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const { res, calls } = makeRes();
    await handler(makeReq(), res);
    expect(calls.status).toBe(500);
  });

  it('clamps max_tokens to 1000', async () => {
    let capturedBody: Record<string, unknown> = {};
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ text: 'reply' }] }),
      status: 200,
    }));

    const req = makeReq({ body: { messages: [{ role: 'user', content: 'hi' }], max_tokens: 9999 } });
    const { res } = makeRes();
    await handler(req, res);

    const fetchMock = vi.mocked(globalThis.fetch);
    capturedBody = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(capturedBody.max_tokens).toBe(1000);
  });

  it('slices messages to last 10', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ text: 'reply' }] }),
      status: 200,
    }));

    const messages = Array.from({ length: 15 }, (_, i) => ({ role: 'user', content: `msg ${i}` }));
    const req = makeReq({ body: { messages } });
    const { res } = makeRes();
    await handler(req, res);

    const fetchMock = vi.mocked(globalThis.fetch);
    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.messages).toHaveLength(10);
    expect(body.messages[0].content).toBe('msg 5');
  });

  it('truncates system prompt to 8000 chars', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ text: 'reply' }] }),
      status: 200,
    }));

    const longSystem = 'x'.repeat(10000);
    const req = makeReq({ body: { messages: [{ role: 'user', content: 'hi' }], system: longSystem } });
    const { res } = makeRes();
    await handler(req, res);

    const fetchMock = vi.mocked(globalThis.fetch);
    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.system.length).toBe(8000);
  });

  it('sets CORS headers on POST', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ text: 'reply' }] }),
      status: 200,
    }));

    const { res } = makeRes();
    await handler(makeReq(), res);

    expect(vi.mocked(res.setHeader)).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
  });

  it('returns 200 with Anthropic data on success', async () => {
    const mockData = { content: [{ text: 'Hello there!' }] };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
      status: 200,
    }));

    const { res, calls } = makeRes();
    await handler(makeReq(), res);

    expect(calls.status).toBe(200);
    expect(calls.json).toEqual(mockData);
  });

  it('returns Anthropic error status on API failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: { message: 'Overloaded' } }),
      status: 529,
    }));

    const { res, calls } = makeRes();
    await handler(makeReq(), res);

    expect(calls.status).toBe(529);
  });
});
