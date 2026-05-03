import type {
  DebateRoundCount,
  HorizonYears,
  ParallelSelfCount,
} from '../types'

const horizons: { value: HorizonYears; label: string }[] = [
  { value: 5, label: '5 years' },
  { value: 10, label: '10 years' },
  { value: 20, label: '20 years' },
]

const selvesOptions: { value: ParallelSelfCount; label: string }[] = [
  { value: 3, label: '3 selves' },
  { value: 5, label: '5 selves' },
]

const roundsOptions: { value: DebateRoundCount; label: string }[] = [
  { value: 2, label: '2 rounds' },
  { value: 3, label: '3 rounds' },
  { value: 4, label: '4 rounds' },
]

export function IntakeForm(props: {
  value: string
  horizonYears: HorizonYears
  parallelSelfCount: ParallelSelfCount
  debateRounds: DebateRoundCount
  disabled?: boolean
  onChangeText: (v: string) => void
  onChangeHorizon: (v: HorizonYears) => void
  onChangeParallelSelfCount: (v: ParallelSelfCount) => void
  onChangeDebateRounds: (v: DebateRoundCount) => void
  onSubmit: () => void
  onDemo: () => void
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Future Self Negotiator
          </p>
          <span className="rounded-full bg-[var(--color-card)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--color-muted)] ring-1 ring-[var(--color-line)]">
            English · UI & output
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)] md:text-4xl">
          Map forks — don’t crown a winner
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--color-muted)]">
          A quiet space for therapy-adjacent journaling: say where you are, what you want,
          what scares you, and habits that might not match the story you tell. The
          Cartographer sketches tradeoffs across imagined futures — not a verdict.
        </p>
      </header>

      <label className="block text-left">
        <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
          Intake
        </span>
        <textarea
          className="min-h-48 w-full resize-y rounded-xl border border-[var(--color-line)] bg-[var(--color-card)] px-4 py-3 text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/25 disabled:opacity-50"
          placeholder="Situation, goals, fears, habits, decisions weighing on you…"
          value={props.value}
          disabled={props.disabled}
          onChange={(e) => props.onChangeText(e.target.value)}
        />
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <span className="text-sm text-[var(--color-muted)]">
          Simulation depth <span className="text-[var(--color-ink)]">(default 10 years)</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {horizons.map((h) => (
            <button
              key={h.value}
              type="button"
              disabled={props.disabled}
              onClick={() => props.onChangeHorizon(h.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                props.horizonYears === h.value
                  ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/40'
                  : 'bg-[var(--color-card)] text-[var(--color-muted)] ring-1 ring-[var(--color-line)] hover:text-[var(--color-ink)]'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-[var(--color-line)] pt-8">
        <p className="mb-4 text-left text-sm font-medium text-[var(--color-ink)]">
          Run shape
        </p>
        <p className="mb-4 max-w-2xl text-left text-xs text-[var(--color-muted)]">
          More parallel selves and debate rounds mean more API calls and latency — useful when
          you want fuller multiplicity or a longer convening.
        </p>

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <span className="text-sm text-[var(--color-muted)]">Parallel selves</span>
          <div className="flex flex-wrap gap-2">
            {selvesOptions.map((s) => (
              <button
                key={s.value}
                type="button"
                disabled={props.disabled}
                onClick={() => props.onChangeParallelSelfCount(s.value)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  props.parallelSelfCount === s.value
                    ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/40'
                    : 'bg-[var(--color-card)] text-[var(--color-muted)] ring-1 ring-[var(--color-line)] hover:text-[var(--color-ink)]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm text-[var(--color-muted)]">Debate rounds</span>
          <div className="flex flex-wrap gap-2">
            {roundsOptions.map((r) => (
              <button
                key={r.value}
                type="button"
                disabled={props.disabled}
                onClick={() => props.onChangeDebateRounds(r.value)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  props.debateRounds === r.value
                    ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/40'
                    : 'bg-[var(--color-card)] text-[var(--color-muted)] ring-1 ring-[var(--color-line)] hover:text-[var(--color-ink)]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={props.disabled || !props.value.trim()}
          onClick={props.onSubmit}
          className="rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-canvas)] shadow-lg shadow-black/20 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Run negotiation (API)
        </button>
        <button
          type="button"
          disabled={props.disabled}
          onClick={props.onDemo}
          className="rounded-xl border border-[var(--color-line)] bg-transparent px-6 py-3 text-sm font-medium text-[var(--color-ink)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent-dim)] disabled:opacity-40"
        >
          Load demo (no API)
        </button>
      </div>

      <p className="mt-6 text-left text-xs leading-relaxed text-[var(--color-muted)]">
        For local development, add{' '}
        <code className="text-[var(--color-accent)]">ANTHROPIC_API_KEY</code> to{' '}
        <code className="text-[var(--color-accent)]">.env</code>. The dev server proxies requests
        so your key never ships in the browser bundle.
      </p>
    </section>
  )
}
