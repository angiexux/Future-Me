import type { PipelineStage } from '../types'

const stages: { id: PipelineStage; label: string }[] = [
  { id: 'idle', label: 'Intake' },
  { id: 'forks', label: 'Forks' },
  { id: 'futures', label: 'Parallel futures' },
  { id: 'debate', label: 'Convening' },
  { id: 'cartographer', label: 'Cartographer' },
  { id: 'done', label: 'Map' },
]

function stageIndex(s: PipelineStage): number {
  const order: PipelineStage[] = [
    'idle',
    'forks',
    'futures',
    'debate',
    'cartographer',
    'done',
    'error',
  ]
  const i = order.indexOf(s)
  return i === -1 ? 0 : i
}

export function StageIndicator(props: { stage: PipelineStage }) {
  const active =
    props.stage === 'error' ? (
      <span className="text-rose-400">Error — check console / network</span>
    ) : (
      stages.find((x) => x.id === props.stage)?.label ?? props.stage
    )

  const idx = stageIndex(props.stage === 'error' ? 'idle' : props.stage)

  return (
    <div className="border-b border-[var(--color-line)] bg-[var(--color-card)]/60 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Pipeline
        </p>
        <div className="flex flex-wrap gap-2">
          {stages.slice(1, -1).map((st, i) => (
            <span
              key={st.id}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                i + 1 <= idx
                  ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)]'
                  : 'bg-transparent text-[var(--color-muted)] ring-1 ring-[var(--color-line)]'
              }`}
            >
              {st.label}
            </span>
          ))}
        </div>
        <p className="text-sm text-[var(--color-ink)] md:text-right">
          Now: <span className="font-semibold text-[var(--color-accent)]">{active}</span>
        </p>
      </div>
    </div>
  )
}
