import { useState } from 'react'
import { CartographerView } from './components/CartographerView'
import { DebateSection } from './components/DebateSection'
import { ExtractionSummary } from './components/ExtractionSummary'
import { FuturePanels } from './components/FuturePanels'
import { IntakeForm } from './components/IntakeForm'
import { PipelineLoading } from './components/PipelineLoading'
import { StageIndicator } from './components/StageIndicator'
import { buildDemoResult } from './lib/demo'
import { downloadMarkdown, pipelineResultToMarkdown } from './lib/export'
import { clearLastRun, loadLastRun, saveLastRun } from './lib/lastRun'
import { runPipeline } from './lib/pipeline'
import type {
  DebateRoundCount,
  HorizonYears,
  ParallelSelfCount,
  PipelineResult,
  PipelineStage,
} from './types'

export default function App() {
  const [intake, setIntake] = useState('')
  const [horizonYears, setHorizonYears] = useState<HorizonYears>(10)
  const [parallelSelfCount, setParallelSelfCount] =
    useState<ParallelSelfCount>(3)
  const [debateRounds, setDebateRounds] = useState<DebateRoundCount>(2)
  const [stage, setStage] = useState<PipelineStage>('idle')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PipelineResult | null>(null)
  const [savedRun, setSavedRun] = useState<PipelineResult | null>(() => loadLastRun())

  const showResults = result && stage === 'done'

  async function handleRun() {
    setError(null)
    setResult(null)
    setBusy(true)
    setStage('forks')
    try {
      const out = await runPipeline(intake, horizonYears, {
        parallelSelfCount,
        debateRounds,
        onProgress: setStage,
      })
      setResult(out)
      setStage('done')
      saveLastRun(out)
      setSavedRun(out)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
      setStage('error')
    } finally {
      setBusy(false)
    }
  }

  function handleDemo() {
    setError(null)
    setBusy(false)
    setStage('done')
    const demo = buildDemoResult(
      intake.trim() || 'Demo intake — add your own story later.',
      horizonYears,
      { parallelSelfCount, debateRounds },
    )
    setResult(demo)
    saveLastRun(demo)
    setSavedRun(demo)
  }

  function handleReset() {
    setResult(null)
    setError(null)
    setStage('idle')
  }

  function resumeSaved() {
    if (!savedRun) return
    setResult(savedRun)
    setStage('done')
    setError(null)
  }

  function dismissSaved() {
    clearLastRun()
    setSavedRun(null)
  }

  function handleExportMarkdown() {
    if (!result) return
    const md = pipelineResultToMarkdown(result)
    const stamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    downloadMarkdown(`future-self-session-${stamp}.md`, md)
  }

  return (
    <div className="min-h-svh">
      <PipelineLoading active={busy} stage={stage} />
      <StageIndicator stage={stage} />

      {!showResults && savedRun && (
        <div className="mx-auto max-w-3xl px-4 pt-6">
          <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-card)] px-4 py-3 text-left sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--color-muted)]">
              You have a saved map from this browser
              {savedRun.runConfig ? (
                <>
                  {' '}
                  (
                  <span className="text-[var(--color-ink)]">
                    {savedRun.runConfig.parallelSelfCount} selves ·{' '}
                    {savedRun.runConfig.debateRounds} debate rounds ·{' '}
                    {savedRun.horizonYears}-year horizon
                  </span>
                  )
                </>
              ) : (
                <>
                  {' '}
                  (
                  <span className="text-[var(--color-ink)]">
                    {savedRun.horizonYears}-year horizon
                  </span>
                  )
                </>
              )}
              .
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={resumeSaved}
                className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-canvas)] hover:brightness-110"
              >
                Open saved map
              </button>
              <button
                type="button"
                onClick={dismissSaved}
                className="rounded-lg border border-[var(--color-line)] px-4 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-accent-dim)]"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {!showResults && (
        <IntakeForm
          value={intake}
          horizonYears={horizonYears}
          parallelSelfCount={parallelSelfCount}
          debateRounds={debateRounds}
          disabled={busy}
          onChangeText={setIntake}
          onChangeHorizon={setHorizonYears}
          onChangeParallelSelfCount={setParallelSelfCount}
          onChangeDebateRounds={setDebateRounds}
          onSubmit={handleRun}
          onDemo={handleDemo}
        />
      )}

      {error && (
        <div className="mx-auto max-w-3xl px-4 pb-6">
          <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 px-4 py-3 text-left text-sm text-rose-100">
            {error}
          </div>
        </div>
      )}

      {showResults && result && (
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
                onClick={handleExportMarkdown}
                className="rounded-xl border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-card)]"
              >
                Export Markdown
              </button>
              <button
                type="button"
                onClick={handleReset}
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
              If you may hurt yourself or are in immediate danger, contact local emergency
              services or a crisis line. In the U.S. and Canada you can call or text{' '}
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
      )}
    </div>
  )
}
