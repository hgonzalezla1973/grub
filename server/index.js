import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load .env for local dev; in production the host injects real env vars directly.
try {
  process.loadEnvFile();
} catch {
  // No .env file present (e.g. in production) — fine, env vars come from the host instead.
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const YELP_API_KEY = process.env.YELP_API_KEY;

const app = express();
app.use(cors());

const YELP_PAGE_SIZE = 50;
const YELP_MAX_RESULTS = 200; // safety cap: at most 4 upstream calls per search

function buildYelpSearchUrl(lat, lng, offset) {
  const url = new URL('https://api.yelp.com/v3/businesses/search');
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lng));
  url.searchParams.set('categories', 'vegan,vegetarian');
  url.searchParams.set('radius', '16000'); // meters, ~10 mi, Yelp's max is 40000
  url.searchParams.set('limit', String(YELP_PAGE_SIZE));
  url.searchParams.set('offset', String(offset));
  url.searchParams.set('sort_by', 'best_match');
  return url;
}

/**
 * Yelp Fusion's API deliberately does not support CORS (to keep API keys out of
 * client-side bundles), so browsers can never call it directly. This route is the
 * only thing standing between the client and Yelp: it holds the key server-side
 * and pages through Yelp's own results so the client gets everything Yelp knows
 * about nearby (up to a safety cap), not just the first 50.
 */
app.get('/api/yelp/search', async (req, res) => {
  if (!YELP_API_KEY) {
    return res.status(500).json({ error: 'YELP_API_KEY is not configured on the server.' });
  }

  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng query params are required.' });
  }

  try {
    const businesses = [];
    let total = Infinity;

    for (let offset = 0; offset < YELP_MAX_RESULTS && offset < total; offset += YELP_PAGE_SIZE) {
      const yelpRes = await fetch(buildYelpSearchUrl(lat, lng, offset), {
        headers: { Authorization: `Bearer ${YELP_API_KEY}` },
      });
      const data = await yelpRes.json();

      if (!yelpRes.ok) {
        // If we already have results from earlier pages, return those rather than
        // failing the whole request over a later page erroring out.
        if (businesses.length > 0) break;
        return res.status(yelpRes.status).json({ error: data?.error?.description || 'Yelp API error' });
      }

      businesses.push(...(data.businesses ?? []));
      total = typeof data.total === 'number' ? data.total : businesses.length;
      if (!data.businesses || data.businesses.length < YELP_PAGE_SIZE) break; // last page
    }

    res.json({ businesses, total });
  } catch (e) {
    console.error('[yelp proxy] request failed', e);
    res.status(502).json({ error: 'Failed to reach Yelp.' });
  }
});

// In production, this same server also serves the built Vite app so there's only
// one thing to deploy and no cross-origin calls between the site and its own API.
const distDir = path.join(__dirname, '..', 'dist');
app.use(express.static(distDir));
app.get(/^(?!\/api\/).*/, (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Not built yet — run `npm run build` first, or use `npm run dev` for local development.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
  if (!YELP_API_KEY) {
    console.warn('[server] YELP_API_KEY not set — /api/yelp/search will return 500 until it is.');
  }
});
