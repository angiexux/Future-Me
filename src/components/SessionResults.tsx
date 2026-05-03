import { CartographerView } from './CartographerView'
import { DebateSection } from './DebateSection'
import { ExtractionSummary } from './ExtractionSummary'
import { FuturePanels } from './FuturePanels'
import type { PipelineResult } from '../types'

export default function SessionResults(props: {
  result: PipelineResult
  onExportMarkdown: () => void
  onNewIntake: () => void
}) {
  const { result } = props

  return (
    <>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 pt-8">
        <p className="text-sm text-[var(--color-muted)]">
          Horizon{' '}
          <span className="text-[var(--color-ink)]">{result.horizonYears} years</span>
          {result.runConfig && (
            <>
              {' · '}
              <span className="text-[var(--color-ink)]">
                {result.runConfig.parallelSelfCount} selves
              </span>
              {' · '}
              <span className="text-[var(--color-ink)]">
                {result.runConfig.debateRounds} debate rounds
              </span>
            </>
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={props.onExportMarkdown}
            className="rounded-xl border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-card)]"
          >
            Export Markdown
          </button>
          <button
            type="button"
            onClick={props.onNewIntake}
            className="rounded-xl border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-card)]"
          >
            New intake
          </button>
        </div>
      </div>

      <ExtractionSummary extraction={result.extraction} />
      <FuturePanels trajectories={result.trajectories} />
      <DebateSection transcript={result.debateTranscript} />
      <CartographerView output={result.cartographer} />

      <footer className="mx-auto max-w-4xl px-4 pb-16 pt-8 text-left text-xs leading-relaxed text-[var(--color-muted)]">
        <p>
          This is not therapy, diagnosis, or crisis care — exploratory journaling with AI.
          If you may hurt yourself or are in immediate danger, contact local emergency services
          or a crisis line. In the U.S. and Canada you can call or text{' '}
          <span className="text-[var(--color-ink)]">988</span>. Elsewhere, see{' '}
          <a
            href="https://findahelpline.com"
            className="text-[var(--color-accent)] underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            https://findahelpline.com
          </a>
          .
        </p>
        <p className="mt-4">
          Spec: <code className="text-[var(--color-accent)]">spec.md</code>. Outputs stay in
          English for this version.
        </p>
      </footer>
    </>
  )
}
