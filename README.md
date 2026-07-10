# Slovenglish

Type English, read Slovenian, hear it spoken. Built because Google Translate has no
Slovenian voice — Google's TTS stack simply doesn't ship one. Apple's does (she's called
**Tina**), so this app leans on the phone's own speech engine.

## How it works

- **Translation** — DeepL (`EN` → `SL`), called from a SvelteKit server route so the API
  key never reaches the browser.
- **Speech** — the browser's built-in `speechSynthesis`, using the device's Slovenian
  voice. Free, instant, works offline, no API key.

## Setup

1. Get a DeepL API key — the free tier gives 500k characters/month, far more than you'll
   ever type: https://www.deepl.com/pro-api

2. Create `.env`:

   ```sh
   cp .env.example .env
   ```

   Paste your key into `DEEPL_API_KEY`. Free-tier keys end in `:fx`; the server detects
   this and routes to `api-free.deepl.com` automatically.

3. Run it:

   ```sh
   pnpm install
   pnpm run dev
   ```

## On your iPhone

Install the Slovenian voice once, or Tina won't exist and the app will read Slovenian text
with an English voice (which sounds wrong):

**Settings → Accessibility → Spoken Content → Voices → Slovenian**

The app detects a missing voice and says so on screen.

Then open the deployed URL in Safari and **Share → Add to Home Screen**. It installs as a
standalone app with its own icon.

## Deploying to Vercel

Push to a git repo, import it in Vercel, and add `DEEPL_API_KEY` under
Settings → Environment Variables. The Vercel adapter is already configured.
