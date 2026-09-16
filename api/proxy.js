export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let endpoint = req.query.endpoint || '';
  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint query parameter' });
  }

  // Preserve any additional query parameters passed to /api/proxy
  const extraParams = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key !== 'endpoint') {
      extraParams.append(key, value);
    }
  }
  const extraQs = extraParams.toString();
  if (extraQs) {
    endpoint += (endpoint.includes('?') ? '&' : '?') + extraQs;
  }

  const targetUrl = `https://draftoutmc.com/api/${endpoint}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 DraftoutOverlay/2.0',
      },
    });
    clearTimeout(timer);

    if (!response.ok) {
      return res.status(response.status).json({ error: `Draftout API status ${response.status}` });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=60');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Failed to fetch from Draftout', details: err.message });
  }
}
