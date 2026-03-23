import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../parse-file';

// base64 encode a string for use as fileBase64
function toBase64(str: string): string {
  return Buffer.from(str).toString('base64');
}

// generate a base64 string that decodes to N bytes
function base64OfSize(bytes: number): string {
  return Buffer.alloc(bytes, 'A').toString('base64');
}

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

describe('api/parse-file', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 405 for GET requests', async () => {
    const { res, calls } = makeRes();
    await handler(makeReq({}, 'GET'), res);
    expect(calls.status).toBe(405);
  });

  it('returns 400 if fileBase64 is missing', async () => {
    const { res, calls } = makeRes();
    await handler(makeReq({ mimeType: 'text/plain' }), res);
    expect(calls.status).toBe(400);
  });

  it('returns 400 if mimeType is missing', async () => {
    const { res, calls } = makeRes();
    await handler(makeReq({ fileBase64: toBase64('hello') }), res);
    expect(calls.status).toBe(400);
  });

  it('returns 400 if file exceeds 5MB', async () => {
    const { res, calls } = makeRes();
    // 5MB + 1 byte
    const bigBase64 = base64OfSize(5 * 1024 * 1024 + 1);
    await handler(makeReq({ fileBase64: bigBase64, mimeType: 'text/plain' }), res);
    expect(calls.status).toBe(400);
    expect((calls.json as { error: string }).error).toMatch(/too large/i);
  });

  it('returns 400 for unsupported MIME type', async () => {
    const { res, calls } = makeRes();
    await handler(makeReq({ fileBase64: toBase64('some content here'), mimeType: 'image/png' }), res);
    expect(calls.status).toBe(400);
    expect((calls.json as { error: string }).error).toMatch(/unsupported/i);
  });

  it('returns 400 if extracted text is less than 50 chars', async () => {
    const { res, calls } = makeRes();
    await handler(makeReq({ fileBase64: toBase64('short'), mimeType: 'text/plain' }), res);
    expect(calls.status).toBe(400);
    expect((calls.json as { error: string }).error).toMatch(/sufficient text/i);
  });

  it('parses text/plain correctly', async () => {
    const text = 'This is a plain text file with more than fifty characters in it for sure.';
    const { res, calls } = makeRes();
    await handler(makeReq({ fileBase64: toBase64(text), mimeType: 'text/plain' }), res);
    expect(calls.status).toBe(200);
    expect((calls.json as { text: string }).text).toBe(text);
  });

  it('returns 500 if pdf-parse throws', async () => {
    vi.doMock('pdf-parse', () => {
      return { default: vi.fn().mockRejectedValue(new Error('PDF parse failure')) };
    });

    const { res, calls } = makeRes();
    // Use a small buffer but with pdf mime — it will throw
    await handler(makeReq({ fileBase64: toBase64('fake pdf content'), mimeType: 'application/pdf' }), res);
    expect(calls.status).toBe(500);
  });

  it('returns 500 if mammoth throws', async () => {
    vi.doMock('mammoth', () => {
      return { extractRawText: vi.fn().mockRejectedValue(new Error('DOCX parse failure')) };
    });

    const { res, calls } = makeRes();
    await handler(makeReq({ fileBase64: toBase64('fake docx content'), mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), res);
    expect(calls.status).toBe(500);
  });
});
