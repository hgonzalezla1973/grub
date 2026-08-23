# Getting a Yelp Fusion API key for Grub

Grub's primary restaurant source is Yelp Fusion — its `vegan` and `vegetarian`
categories are a much better fit for this app than a generic maps API's place
types. (Google Places is kept as an automatic fallback if Yelp is unavailable
— see `README-GOOGLE-PLACES-SETUP.md`.)

## Why this needs a backend

Yelp's API deliberately does not support CORS, specifically so browsers can
never call it directly with an exposed key. That's why this project has a
small Express server (`server/index.js`) — its only real job is holding the
Yelp key server-side and relaying search requests. `npm run dev` starts both
the Vite dev server and this backend together.

## 1. Create a Yelp developer account

1. Go to https://www.yelp.com/developers
2. Sign in (or create a Yelp account) → **Create App** (under "Manage App")
3. Fill in the basic app details — anything reasonable works for a personal project

## 2. Get your API key

After creating the app, Yelp shows you an **API Key**. Copy it — this is a
single bearer token, no OAuth flow needed.

## 3. Add it to the app

In the `grub_app` folder, copy `.env.example` to `.env` if you haven't already:

```
cp .env.example .env
```

Open `.env` and paste your key into the **server-side** variable (no `VITE_`
prefix — this one must never reach the browser bundle):

```
YELP_API_KEY=your_key_here
```

Restart `npm run dev` after adding or changing it.

## Limits & terms

- Free tier: 5,000 calls/day, up to 50 results per search.
- Yelp's API terms require attribution when displaying their data (a "powered
  by Yelp" credit / link back) and restrict how long results can be cached.
  Worth reading https://www.yelp.com/developers/api_terms before using this
  beyond personal testing.

## Once this moves to a native iOS build (Capacitor)

The server still needs to run somewhere reachable over the internet — it
can't ship inside the app bundle the way a client-only key does. Deploy
`server/index.js` (it also serves the built frontend, so it's one thing to
host) and point the app at that URL instead of `localhost`.
