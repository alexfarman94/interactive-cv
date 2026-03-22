import type { VercelRequest, VercelResponse } from '@vercel/node';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { fileBase64, mimeType } = req.body;

  if (!fileBase64 || !mimeType) {
    return res.status(400).json({ error: 'Missing fileBase64 or mimeType' });
  }

  const buffer = Buffer.from(fileBase64, 'base64');

  if (buffer.byteLength > MAX_FILE_SIZE_BYTES) {
    return res.status(400).json({ error: 'File too large (max 5MB)' });
  }

  try {
    let text = '';

    if (mimeType === 'text/plain') {
      text = buffer.toString('utf-8');
    } else if (mimeType === 'application/pdf') {
      const pdfParse = (await import('pdf-parse')).default;
      const result = await pdfParse(buffer);
      text = result.text;
    } else if (mimeType.includes('wordprocessingml') || mimeType.includes('docx')) {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 50) {
      return res.status(400).json({ error: 'Could not extract sufficient text from the file' });
    }

    return res.status(200).json({ text: trimmed });
  } catch (err) {
    console.error('File parse error:', err);
    return res.status(500).json({ error: 'Failed to read file', detail: String(err) });
  }
}
