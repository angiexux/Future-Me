import type { ForkExtractionResult } from '../types'

export function ExtractionSummary(props: { extraction: ForkExtractionResult }) {
  const e = props.extraction
  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <h2 className="mb-2 text-left text-xl font-semibold text-[var(--color-ink)]">
        Forks & tension
      </h2>
      <p className="mb-6 max-w-3xl text-left text-sm text-[var(--color-muted)]">
        What you said vs what your habits imply — the gap is where regret likes to hide.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-card)] p-5 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            Stated values vs habits
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink)]">
            {e.statedVsHabitsTension}
          </p>
          {e.suppressedForksNote && (
            <p className="mt-4 border-t border-[var(--color-line)] pt-4 text-sm leading-relaxed text-[var(--color-muted)]">
              <span className="font-medium text-[var(--color-ink)]">Unsaid forks: </span>
              {e.suppressedForksNote}
            </p>
          )}
        </div>

        <ul className="space-y-3 text-left">
          {e.forks.map((f) => (
            <li
              key={f.id}
              className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-card)] p-4"
            >
              <p className="font-medium text-[var(--color-ink)]">{f.label}</p>
              <p className="mt-2 text-xs uppercase text-[var(--color-muted)]">Path A</p>
              <p className="text-sm text-[var(--color-ink)]">{f.pathA}</p>
              <p className="mt-2 text-xs uppercase text-[var(--color-muted)]">Path B</p>
              <p className="text-sm text-[var(--color-ink)]">{f.pathB}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
