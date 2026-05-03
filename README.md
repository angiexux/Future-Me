# Future Self Negotiator

React + Vite + Tailwind front-end for parallel future selves, debate, and Cartographer synthesis. See **[spec.md](./spec.md)** for product and architecture details.

```bash
cp .env.example .env   # add ANTHROPIC_API_KEY
npm install
npm run dev
```

The dev server proxies `/api/llm` to Anthropic so the API key is not embedded in the client bundle. For production, replace this with a hosted API route.
