import type { PipelineResult } from '../types'

function fmtScores(s: PipelineResult['cartographer']['selves'][0]['scores']): string {
  return `peace ${s.peace} · accomplishment ${s.accomplishment} · surprise ${s.surprise} · integration ${s.integration} · vitality ${s.vitality}`
}

export function pipelineResultToMarkdown(result: PipelineResult): string {
  const cfg = result.runConfig
  const meta = [
    `# Future Self Negotiator — session export`,
    ``,
    `_Exported ${new Date().toISOString().slice(0, 19)}Z_`,
    cfg
      ? `- Parallel selves: **${cfg.parallelSelfCount}** · Debate rounds: **${cfg.debateRounds}** · Horizon: **${result.horizonYears} years**`
      : `- Horizon: **${result.horizonYears} years**`,
    ``,
    `## Intake`,
    ``,
    result.intake.trim() || '_(empty)_',
    ``,
    `## Values vs habits`,
    ``,
    result.extraction.statedVsHabitsTension,
    ``,
  ]

  if (result.extraction.suppressedForksNote) {
    meta.push(`### Also in the room`, ``, result.extraction.suppressedForksNote, ``)
  }

  meta.push(`## Forks`, ``)

  for (const f of result.extraction.forks) {
    const a = result.extraction.parallelAssignments?.find((x) => x.forkId === f.id)
    meta.push(`### ${f.label}`, ``)
    if (a) {
      meta.push(
        `_Simulated branch ${a.explorePath}_${a.rationale ? ` — ${a.rationale}` : ''}`,
        ``,
      )
    }
    meta.push(`- **Path A:** ${f.pathA}`, `- **Path B:** ${f.pathB}`, ``)
  }

  meta.push(`## Parallel futures`, ``)

  for (const t of result.trajectories) {
    meta.push(
      `### ${t.label}`,
      ``,
      `- **Chosen:** ${t.chosenPath}`,
      `- **Not taken:** ${t.unchosenPath}`,
      ``,
      `#### Timeline`,
      ``,
    )
    for (const y of t.years) {
      meta.push(`- **Year ${y.year}** — ${y.summary}`, `  - _${y.voice}_`, ``)
    }
    meta.push(
      `#### End state`,
      ``,
      t.endState,
      ``,
      `#### Regrets`,
      ``,
      t.regrets,
      ``,
      `#### Unexpected gains`,
      ``,
      t.unexpectedGains,
      ``,
    )
  }

  meta.push(`## Convening (debate)`, ``, result.debateTranscript.trim(), ``)

  meta.push(`## Cartographer`, ``)

  for (const s of result.cartographer.selves) {
    meta.push(`### ${s.shortLabel}`, ``, fmtScores(s.scores), ``)
  }

  meta.push(
    `### Narrative`,
    ``,
    `- **Most at peace:** ${result.cartographer.narrative.mostAtPeace}`,
    `- **Most accomplished:** ${result.cartographer.narrative.mostAccomplished}`,
    `- **Most surprised:** ${result.cartographer.narrative.mostSurprised}`,
    ``,
    `### Tradeoffs`,
    ``,
    result.cartographer.tradeoffSummary,
    ``,
    `---`,
    ``,
    `_Not therapy or clinical advice. Exploratory journaling._`,
  )

  return meta.join('\n')
}

export function downloadMarkdown(filename: string, body: string): void {
  const blob = new Blob([body], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  a.click()
  URL.revokeObjectURL(url)
}
