import type { PipelineStage } from '../types'

const COPY: Partial<
  Record<Exclude<PipelineStage, 'idle' | 'done' | 'error'>, { title: string; detail: string }>
> = {
  forks: {
    title: 'Finding forks',
    detail:
      'Naming decisions you’re circling — including ones hiding in fears and habits. Takes a moment.',
  },
  futures: {
    title: 'Living parallel futures',
    detail:
      'Each future-self walks year by year. Several requests run at once; this is usually the longest step.',
  },
  debate: {
    title: 'Convening',
    detail: 'Future selves steelman each other, then argue with honesty — no winner framing.',
  },
  cartographer: {
    title: 'Drawing the map',
    detail:
      'Mapping peace, accomplishment, surprise, integration, and vitality — tradeoffs, not a verdict.',
  },
}

export function PipelineLoading(props: { active: boolean; stage: PipelineStage }) {
  if (
    !props.active ||
    props.stage === 'idle' ||
    props.stage === 'done' ||
    props.stage === 'error'
  ) {
    return null
  }

  const block = COPY[props.stage]
  if (!block) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--color-canvas)]/85 px-4 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="max-w-md rounded-2xl border border-[var(--color-line)] bg-[var(--color-card)] p-8 text-center shadow-xl shadow-black/40">
        <div
          className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-line)] border-t-[var(--color-accent)]"
          aria-hidden
        />
        <p className="text-lg font-semibold text-[var(--color-ink)]">{block.title}</p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{block.detail}</p>
        <p className="mt-6 text-xs text-[var(--color-muted)]">Safe to leave this tab open.</p>
      </div>
    </div>
  )
}
