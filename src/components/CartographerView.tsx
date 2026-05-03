import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { CartographerOutput } from '../types'

const DIMENSIONS = [
  'peace',
  'accomplishment',
  'surprise',
  'integration',
  'vitality',
] as const

const COLORS = ['#a78bfa', '#38bdf8', '#f472b6', '#34d399', '#fbbf24']

export function CartographerView(props: { output: CartographerOutput }) {
  const radarRows = DIMENSIONS.map((dim) => {
    const row: Record<string, string | number> = {
      dimension: dim.charAt(0).toUpperCase() + dim.slice(1),
    }
    props.output.selves.forEach((s, i) => {
      row[`self_${i}`] = s.scores[dim]
    })
    return row
  })

  const labels = props.output.selves.map((s) => s.shortLabel)

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="mb-2 text-left text-xl font-semibold text-[var(--color-ink)]">
        The Cartographer
      </h2>
      <p className="mb-8 max-w-3xl text-left text-sm text-[var(--color-muted)]">
        A landscape, not a podium — tradeoffs across peace, accomplishment, surprise,
        integration, and vitality. Scores are comparative prompts for reflection, not grades.
      </p>

      <div className="grid gap-10 lg:grid-cols-5 lg:items-start">
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-card)] p-4 lg:col-span-3">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
            Regret landscape (relative scores)
          </p>
          <div
            className={`w-full ${props.output.selves.length > 3 ? 'h-[380px]' : 'h-[340px]'}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarRows} cx="50%" cy="52%" outerRadius="78%">
                <PolarGrid stroke="var(--color-line)" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: '#9a90a8', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: '#14121a',
                    border: '1px solid #2a2533',
                    borderRadius: 12,
                    color: '#e8e4ef',
                  }}
                />
                {props.output.selves.map((_, i) => (
                  <Radar
                    key={labels[i]}
                    name={labels[i]}
                    dataKey={`self_${i}`}
                    stroke={COLORS[i % COLORS.length]}
                    fill={COLORS[i % COLORS.length]}
                    fillOpacity={0.15}
                  />
                ))}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <NarrativeCard title="Most at peace" body={props.output.narrative.mostAtPeace} />
          <NarrativeCard
            title="Most accomplished"
            body={props.output.narrative.mostAccomplished}
          />
          <NarrativeCard
            title="Most surprised"
            body={props.output.narrative.mostSurprised}
          />
          <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-accent-dim)] p-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
              Tradeoffs
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]">
              {props.output.tradeoffSummary}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function NarrativeCard(props: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-card)] p-5 text-left">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        {props.title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]">{props.body}</p>
    </div>
  )
}
