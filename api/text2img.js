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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const upstreamUrl = `${UPSTREAM}?prompt=${encodeURIComponent(String(prompt).trim())}`;
    const upstreamRes = await fetch(upstreamUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'image/*,*/*;q=0.8',
        'Referer': 'https://api-faa.my.id/'
      }
    });

    clearTimeout(timeout);

    if (!upstreamRes.ok) {
      const bodyText = await upstreamRes.text().catch(() => '');
      console.error('text2img upstream non-OK:', upstreamRes.status, bodyText.slice(0, 500));
      res.status(502).json({
        error: `Upstream error (${upstreamRes.status})`,
        detail: bodyText.slice(0, 300) || null
      });
      return;
    }

    const contentType = upstreamRes.headers.get('content-type') || 'image/png';

    if (!contentType.startsWith('image/')) {
      const bodyText = await upstreamRes.text().catch(() => '');
      console.error('text2img upstream returned non-image:', contentType, bodyText.slice(0, 500));
      res.status(502).json({
        error: 'Upstream did not return an image',
        contentType,
        detail: bodyText.slice(0, 300) || null
      });
      return;
    }

    const arrayBuffer = await upstreamRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(buffer);
  } catch (err) {
    clearTimeout(timeout);
    const isAbort = err && err.name === 'AbortError';
    console.error('text2img proxy error:', err);
    res.status(isAbort ? 504 : 500).json({
      error: isAbort ? 'Upstream timed out' : 'Server error while generating image',
      detail: String(err && err.message ? err.message : err)
    });
  }
};

