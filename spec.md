# Future Self Negotiator — Product & Engineering Spec

**Version:** 0.1 (MVP path)  
**Last updated:** 2026-05-02  
**Repo:** [angiexux/Future-Me](https://github.com/angiexux/Future-Me)

---

## 1. Product thesis

**Non-winner framing:** The system does not pick a “best” life. It simulates parallel futures, lets them debate with honesty constraints, then **maps** tradeoffs across dimensions—not who won.

**Core insight:** Regret often lives in the gap between stated values and habits. Fork extraction must surface *suppressed* forks (implied by fears, avoidance, routines), not only the fork the user names first.

**“Wedge” moment (validation):** A user reads something like “the self most at peace…” and realizes **that isn’t the path they would have guessed**. If everyone only cares about “most accomplished,” the visualization/narrative isn’t doing the work.

---

## 2. Mental model & stages

### Stage 1 — Intake & fork identification

**Input (free text + optional structured fields):**

- Current situation, goals, fears, habits, decisions weighing on them.

**Single LLM call — fork extraction:**

- Output **3–5 fork points** that feel *real* (not toy dichotomies).
- **Core values vector:** what they say matters vs what habits imply matters; note explicit **divergence** where regret clusters.
- **Time horizon:** `5yr` | `10yr` | `20yr` (fork-dependent; system may assign per fork or global default).

**Quality bar:** Prompt explicitly asks what the user is *not* saying—forks implied by fear, shame, or repetition.

### Stage 2 — Parallel futures

**MVP:** **3** parallel future selves (full product: **5**).

Each agent:

- System role: *You are [User], N years from now. At fork [X], you chose [Y] over [Z].*
- Instruct: simulate **year-by-year** (or summarized intervals for long horizons); **not** optimizing—**living**.
- Surface: surprises, grief, unexpected love, costs.

**Anti-generic rule:** Each trajectory must **reference ≥3 concrete details** from intake (habit, fear, person, place, specific decision).

**Execution:** Parallel requests (`Promise.all`). Structured output: milestones per year/phase, internal monologue snippets, end-state, regrets, unexpected gains.

### Stage 3 — Convening (debate)

**MVP:** **2 rounds** (full: **3–4**).

- All trajectories + fork context fed into a multi-turn debate.
- **Hard constraint:** Each future-self must **steelman** at least one other path before defending their own.
- Goal: legible tradeoffs, not five LinkedIn narrators.

**v1 orchestration:** Sequential or batched Claude calls with explicit “round” field in messages. **v2:** LangGraph (or similar) for debate state machine.

### Stage 4 — The Cartographer (synthesis)

**Single LLM call** with full debate transcript + trajectories.

**Output (structured + narrative):**

| Dimension   | Meaning (guide for model) |
|------------|----------------------------|
| **Peace**  | Internal coherence, absence of chronic regret |
| **Accomplishment** | External markers the user said they care about |
| **Surprise** | Distance from what this self predicted at “year 0” |
| **Integration** | Alignment between values and daily life |
| **Vitality** | Energy, relationships, health |

**Cartographer rules (non-negotiable):**

- **Do not** rank futures as “best.”
- **Do not** recommend a single path as *the* answer.
- **Do not** “resolve” the user’s tension with a tidy verdict.

**Do:** Narrative lines such as: “The self most at peace got there by ___.” “The self most accomplished sacrificed ___.” “The self most surprised discovered ___.”

**UI:** Radar chart (e.g. Recharts) over the five dimensions **per future self**, plus short narrative cards—**map, not trophy**.

---

## 3. MVP scope (4-hour–weekend slice)

| Item | MVP | Full vision |
|------|-----|-------------|
| Parallel selves | 3 | 5 |
| Debate rounds | 2 | 3–4 |
| Horizons | One chosen at intake (e.g. 10yr) | Per-fork tuning |
| Memory | Stateless | Mem0 / return visits |
| Persistence | Optional localStorage demo | Supabase |
| Cartographer | JSON + narrative | Same, richer |

**Out of MVP:** Auth, billing, Mem0, LangGraph—stub or omit.

---

## 4. Technical architecture

**This repository (MVP):** the Anthropic key is read only in Vite’s dev server via `loadEnv` and forwarded through a small `POST /api/llm` proxy (see `vite.config.ts`). Production requires a real backend or serverless route—`npm run build` static assets alone cannot call Anthropic without exposing the key.

### Stack (aligned with spec)

- **Frontend:** React, Tailwind CSS, Vite.
- **Charts:** Recharts (radar / regret landscape).
- **LLM:** Anthropic API (Claude Sonnet). Keys **only** server-side or local env—never commit.
- **Orchestration v1:** Plain async/await + `Promise.all`; optional small `api/` server folder for proxying Anthropic.
- **Artifacts / hackathon:** Optional “API-in-Artifacts” pattern for demo; repo ships as a normal web app.

### Suggested repo layout

```
├── spec.md                 # This document
├── package.json
├── vite.config.ts
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/         # IntakeForm, FuturePanels, DebateTranscript, CartographerView, RadarLandscape
│   ├── lib/
│   │   ├── prompts.ts      # Centralized prompt strings (fork, future self, debate, cartographer)
│   │   └── anthropic.ts    # Client wrapper (browser calls backend route in prod)
│   └── types.ts            # Fork, Trajectory, DebateRound, CartographerOutput
├── server/                 # Optional: Express/Fetch handler for /api/chat
└── .env.example            # ANTHROPIC_API_KEY=
```

### API boundaries

- **Development:** Frontend may call a minimal `/api/*` dev proxy or a tiny Node script.
- **Production:** Never expose API key; use serverless or small backend.

---

## 5. Prompt design (implementation checklist)

Three prompts carry quality:

1. **Fork extraction** — Push past stated forks; ask for suppressed forks tied to fears/habits; output strict JSON for forks + values tension + horizon.
2. **Future-self** — Embodied, specific, anti-LinkedIn; mandatory citation of intake details; structured trajectory schema.
3. **Cartographer** — Neutral cartography only; forbidden words/behaviors list (no “you should,” “the best path,” ranked winner).

*Detailed prompt text lives in `src/lib/prompts.ts` and should be iterated with user testing.*

---

## 6. UX outline

1. **Intake** — Long-form text + submit.
2. **Loading** — Stages: extracting forks → simulating 3 futures → debate rounds → cartographer.
3. **Results** — Three columns (or carousel on mobile) for parallel futures; then debate transcript (collapsible); then **radar chart** comparing selves on five dimensions; narrative cards from Cartographer.

---

## 7. Ethics & safety (minimal)

- Copy: frames exploration, not prediction or medical/legal advice.
- If intake mentions self-harm or severe crisis, **do not** rely on the model alone—surface crisis resources (locale-specific list configurable).

---

## 8. Product defaults (aligned with builder interview)

- **Voice:** Therapy-adjacent journaling — descriptive, compassionate, non-clinical; prompts and UI state this explicitly.
- **Language:** English for UI and model output (v1).
- **Horizon:** Default **10 years**; the simulation depth follows the user’s selected chip (5 / 10 / 20), not a conflicting model guess.
- **Parallel branches:** Fork extraction returns **`parallelAssignments`** (path A or B per fork + short rationale) so three futures diversify emotionally; pipeline falls back + dedupes if the model omits or repeats everything.
- **Persistence:** **localStorage** optional resume (“saved map”) only — no Supabase/Mem0 until validation.
- **Safety:** Footer disclaimer + **988** (U.S./Canada) + [findahelpline.com](https://findahelpline.com); not crisis routing logic inside the model.

---

## 9. Success metrics (early)

- Qualitative: “Oh—that’s not who I thought I’d root for” (non-winner insight).
- Optional: time on results page, scroll depth on debate, return rate if persistence added later.

---

## 10. References

- Repo: [https://github.com/angiexux/Future-Me](https://github.com/angiexux/Future-Me)
