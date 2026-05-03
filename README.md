# Future Self Negotiator

React + Vite + Tailwind front-end for parallel future selves, debate, and Cartographer synthesis. See **[spec.md](./spec.md)** for product and architecture details.

## Local development

```bash
cp .env.example .env   # add ANTHROPIC_API_KEY
npm install
npm run dev
```

Then open **http://localhost:5173** (Vite default). The dev server proxies `POST /api/llm` to Anthropic so the API key stays off the client bundle.

### `ERR_CONNECTION_REFUSED`

That means **no dev server is running** or you’re using the **wrong port**:

| Command | URL | When |
|--------|-----|------|
| `npm run dev` | http://localhost:**5173** | Active development (use this first) |
| `npm run preview` | http://localhost:**4173** | After `npm run build`; same proxy as dev |
| `npm start` | http://localhost:**4173** | After `npm run build`; Node serves `dist/` + proxy |

Do not open the app until you’ve started one of these in a terminal and it prints “ready” / the listening URL. If 5173 is busy, Vite may pick the next free port — read the terminal output for the exact link.

## Production-style run (static build + Node proxy)

After `npm run build`, serve `dist/` and the same `/api/llm` route with:

```bash
npm start
```

Or one shot:

```bash
npm run serve
```

Defaults to **http://localhost:4173** (`PORT` overrides). Set `ANTHROPIC_API_KEY` in `.env` or the environment.

### Split hosting (optional)

If the UI is on a CDN and the proxy lives elsewhere, build with `VITE_API_BASE=https://your-api.example.com` so the browser calls that origin for `/api/llm` (path is appended; no trailing slash on the env value).

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Vite + dev proxy |
| `npm run build` | Typecheck + production bundle |
| `npm start` | Serve `dist/` + proxy (run after build) |
| `npm run serve` | `build` then `start` |
| `npm run preview` | Vite preview only (no Anthropic proxy unless configured separately) |
