# e2e-ai-chat

A support chat that answers with a real model through the AI SDK and the Vercel AI Gateway, used as an example of end-to-end testing AI answers with [e2e](https://www.npmjs.com/package/e2e).

## How it works

The e2e Store's support assistant answers questions about shipping, returns, and sizes, and looks up orders with a tool. Its replies stream from a real model, so their words change from run to run: the tests judge what a reply means instead of matching its text.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### AI Gateway key

The chat's model and the e2e agent both go through the Vercel AI Gateway. Create a key under [AI Gateway → API keys](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai-gateway%2Fapi-keys&title=AI+Gateway+API+Keys) in the Vercel dashboard, copy `.env.example` to `.env.local`, and set `AI_GATEWAY_API_KEY`.

Or link a Vercel project and run `vercel env pull .env.local`, which writes a `VERCEL_OIDC_TOKEN` that lasts 12 hours.

The chat runs on `reflection/beam-free`, a free model, so trying it costs nothing. The e2e agent's model isn't free: the AI Gateway charges the provider's list price, and its free monthly credit covers only [some models](https://vercel.com/ai-gateway/models?freeTier=true).

## End-to-end tests

`tests/home.e2e.ts` checks the page with exact locators and needs no key. With the dev server running:

```bash
npm run test:e2e
```

To test a different URL, set `APP_URL`. Configuration lives in `e2e.config.ts`.

## Scripts

| Command            | Description          |
| ------------------ | -------------------- |
| `npm run dev`      | Start the dev server |
| `npm run build`    | Build for production |
| `npm run lint`     | Run ESLint           |
| `npm run format`   | Format with Prettier |
| `npm run test:e2e` | Run the e2e tests    |
