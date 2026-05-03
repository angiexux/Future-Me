import { useState } from 'react'
import type { FutureTrajectory } from '../types'

export function FuturePanels(props: { trajectories: FutureTrajectory[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="mb-2 text-left text-xl font-semibold text-[var(--color-ink)]">
        Parallel futures
      </h2>
      <p className="mb-8 max-w-3xl text-left text-sm text-[var(--color-muted)]">
        {props.trajectories.length} imagined selves — same roots, different forks. Each voice
        ties back to what you wrote; none is declared better. Let reactions surface without
        rushing to choose.
      </p>
      <div
        className={`grid gap-6 ${
          props.trajectories.length >= 5
            ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-5'
            : 'md:grid-cols-3'
        }`}
      >
        {props.trajectories.map((t) => (
          <TrajectoryCard key={`${t.forkId}-${t.chosenPath}`} trajectory={t} />
        ))}
      </div>
    </section>
  )
}

function TrajectoryCard(props: { trajectory: FutureTrajectory }) {
  const [open, setOpen] = useState(false)
  const t = props.trajectory
  return (
    <article className="flex flex-col rounded-2xl border border-[var(--color-line)] bg-[var(--color-card)] p-5 text-left shadow-[0_20px_40px_-28px_rgba(0,0,0,0.75)]">
      <h3 className="text-base font-semibold text-[var(--color-ink)]">{t.label}</h3>
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
        Chosen path
      </p>
      <p className="mt-1 text-sm text-[var(--color-ink)]">{t.chosenPath}</p>
      <p className="mt-4 text-xs text-[var(--color-muted)]">
        Not taken: <span className="text-[var(--color-ink)]">{t.unchosenPath}</span>
      </p>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mt-4 text-left text-sm font-medium text-[var(--color-accent)] hover:underline"
      >
        {open ? 'Hide timeline' : 'Year-by-year'}
      </button>

      {open && (
        <ul className="mt-3 space-y-3 border-t border-[var(--color-line)] pt-3">
          {t.years.map((y) => (
            <li key={y.year}>
              <p className="text-xs font-semibold text-[var(--color-muted)]">
                Year {y.year}
              </p>
              <p className="mt-1 text-sm text-[var(--color-ink)]">{y.summary}</p>
              <p className="mt-1 text-xs italic text-[var(--color-muted)]">{y.voice}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-1 flex-col gap-3 border-t border-[var(--color-line)] pt-4">
        <div>
          <p className="text-xs font-medium uppercase text-[var(--color-muted)]">
            End state
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink)]">{t.endState}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-[var(--color-muted)]">
            Regrets
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink)]">{t.regrets}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-[var(--color-muted)]">
            Unexpected gains
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink)]">{t.unexpectedGains}</p>
        </div>
      </div>
    </article>
  )
}
