import { useState } from 'react'
import { CartographerView } from './components/CartographerView'
import { DebateSection } from './components/DebateSection'
import { ExtractionSummary } from './components/ExtractionSummary'
import { FuturePanels } from './components/FuturePanels'
import { IntakeForm } from './components/IntakeForm'
import { StageIndicator } from './components/StageIndicator'
import { buildDemoResult } from './lib/demo'
import { runPipeline } from './lib/pipeline'
import type { HorizonYears, PipelineResult, PipelineStage } from './types'

export default function App() {
  const [intake, setIntake] = useState('')
  const [horizonYears, setHorizonYears] = useState<HorizonYears>(10)
  const [stage, setStage] = useState<PipelineStage>('idle')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PipelineResult | null>(null)

  const showResults = result && stage === 'done'

  async function handleRun() {
    setError(null)
    setResult(null)
    setBusy(true)
    setStage('forks')
    try {
      const out = await runPipeline(intake, horizonYears, {
        onProgress: setStage,
      })
      setResult(out)
      setStage('done')
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
    setResult(buildDemoResult(intake.trim() || 'Demo intake — add your own story later.', horizonYears))
  }

  function handleReset() {
    setResult(null)
    setError(null)
    setStage('idle')
  }

  return (
    <div className="min-h-svh">
      <StageIndicator stage={stage} />

      {!showResults && (
        <IntakeForm
          value={intake}
          horizonYears={horizonYears}
          disabled={busy}
          onChangeText={setIntake}
          onChangeHorizon={setHorizonYears}
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
              Horizon: <span className="text-[var(--color-ink)]">{result.horizonYears} years</span>
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-card)]"
            >
              New intake
            </button>
          </div>

          <ExtractionSummary extraction={result.extraction} />
          <FuturePanels trajectories={result.trajectories} />
          <DebateSection transcript={result.debateTranscript} />
          <CartographerView output={result.cartographer} />

          <footer className="mx-auto max-w-4xl px-4 pb-16 pt-4 text-center text-xs text-[var(--color-muted)]">
            Spec & architecture: see{' '}
            <code className="text-[var(--color-accent)]">spec.md</code>. Not therapy or
            prediction — exploratory fiction grounded in your words.
          </footer>
        </>
      )}
    </div>
  )
}
