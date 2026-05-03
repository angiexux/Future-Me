import { lazy, Suspense, useState } from 'react'
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

const SessionResults = lazy(() => import('./components/SessionResults'))

function ResultsFallback() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-line)] border-t-[var(--color-accent)]" />
      <p className="mt-6 text-sm text-[var(--color-muted)]">Loading results…</p>
    </div>
  )
}

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
        <Suspense fallback={<ResultsFallback />}>
          <SessionResults
            result={result}
            onExportMarkdown={handleExportMarkdown}
            onNewIntake={handleReset}
          />
        </Suspense>
      )}
    </div>
  )
}
