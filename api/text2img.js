// api/text2img.js
// Vercel Serverless Function — runs server-side only.
// The client never sees this file or the upstream URL below;
// it only ever calls our own /api/text2img endpoint.

const UPSTREAM = 'https://api-faa.my.id/faa/ai-text2img-pro';

module.exports = async (req, res) => {
  const prompt = (req.query && req.query.prompt) || '';

  if (!prompt || !String(prompt).trim()) {
    res.status(400).json({ error: 'Missing prompt' });
    return;
  }

  try {
    const upstreamUrl = `${UPSTREAM}?prompt=${encodeURIComponent(String(prompt).trim())}`;
    const upstreamRes = await fetch(upstreamUrl);

    if (!upstreamRes.ok) {
      res.status(502).json({ error: `Upstream error (${upstreamRes.status})` });
      return;
    }

    const contentType = upstreamRes.headers.get('content-type') || 'image/png';
    const arrayBuffer = await upstreamRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(buffer);
  } catch (err) {
    console.error('text2img proxy error:', err);
    res.status(500).json({ error: 'Server error while generating image' });
  }
};

