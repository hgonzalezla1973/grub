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
- Under **Application restrictions**: leave this as **None** for now. The
  "restrict to iOS app" option only works with Google's native iOS SDK — it
  does nothing for the plain HTTPS calls this app makes, and Expo Go (not
  your app) is what iOS sees during testing anyway. There's currently no way
  to fully lock this key down for a backend-less mobile app making direct
  API calls — see the security note below.
- Optional but recommended: in **APIs & Services → Quotas**, set a daily
  request cap on Places API so a leaked/misused key can't run up a large bill.

## 6. Add it to the app

In the `grub_app` folder, copy `.env.example` to a new file named `.env`:

```
cp .env.example .env
```

Open `.env` and paste your key:

```
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_key_here
```

`.env` is gitignored — it will never be committed. Restart `npx expo start`
after adding it (env vars are only read at bundler startup).

## Security note

Because this app has no backend, the key ships inside the JS bundle on every
device that runs the app. Anyone with the app could technically extract it
and use your quota. That's an acceptable tradeoff for **personal testing**,
but do not publish or widely distribute a build with a real key embedded —
if you want to ship this publicly, the key needs to move behind a small
backend proxy that the app calls instead of Google directly.
