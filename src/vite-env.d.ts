/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANTHROPIC_MODEL?: string
  /** Optional origin for API calls, e.g. `https://your-api.example.com` (no trailing slash). Empty = same origin. */
  readonly VITE_API_BASE?: string
}
