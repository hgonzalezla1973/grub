# Getting a Google Places API key for Grub

The app searches for real nearby vegan/vegetarian restaurants using Google's
Places API (New). You need your own API key — this only takes a few minutes.

## 1. Create a Google Cloud project

1. Go to https://console.cloud.google.com/
2. Click the project dropdown (top left) → **New Project**
3. Name it anything (e.g. "Grub") → **Create**

## 2. Enable billing

Google requires a billing account attached even for free-tier usage (Places
API gives you a recurring monthly free credit that comfortably covers
personal testing). Go to **Billing** in the left sidebar and attach a card.

## 3. Enable the Places API

1. In the top search bar, search for **"Places API (New)"**
2. Click it → **Enable**

## 4. Create an API key

1. Go to **APIs & Services → Credentials**
2. **Create Credentials → API key**
3. Copy the key it gives you

## 5. Restrict the key (important)

Click into the key you just created:
- Under **API restrictions**, choose "Restrict key" and select only **Places API (New)**.
- Under **Application restrictions**, choose **Websites** and add:
  - `localhost:5173/*` (or whatever port `npm run dev` prints) for local testing
  - your real domain later, once this is deployed somewhere
  
  This actually works for a plain web app (unlike native apps calling a REST
  API directly) — Google checks the browser's `Referer` header, so a key
  restricted this way can't be used from anywhere else. See the security note
  below for what changes once this gets wrapped into an iOS app via Capacitor.
- Optional but recommended: in **APIs & Services → Quotas**, set a daily
  request cap on Places API so a leaked/misused key can't run up a large bill.

## 6. Add it to the app

In the `grub_app` folder, copy `.env.example` to a new file named `.env`:

```
cp .env.example .env
```

Open `.env` and paste your key:

```
VITE_GOOGLE_PLACES_API_KEY=your_key_here
```

`.env` is gitignored — it will never be committed. Restart `npm run dev`
after adding or changing it (env vars are only read at dev-server/build startup).

## Security note

While this runs as a website (`npm run dev`, or deployed to a real domain),
the **Websites** restriction above genuinely locks the key down — a copy of
the key alone isn't useful without also spoofing your domain's `Referer`.

That protection goes away once this is wrapped into a native iOS app via
Capacitor: the app then runs from a `capacitor://` origin with no real
`Referer` header, so the website restriction won't apply and the key ships
readable inside the app bundle. That's fine for your own personal-device
testing, but before distributing an iOS build more widely, the key should
move behind a small backend proxy that the app calls instead of Google
directly — a good thing to revisit when that transition actually happens.
