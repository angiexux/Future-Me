import {
  cartographerPrompt,
  debatePrompt,
  forkExtractionPrompt,
  futureSelfSystem,
  futureSelfUser,
  MODEL,
} from './prompts'
import { createMessage, messageText, parseJsonFromModel } from './anthropic'
import type {
  CartographerOutput,
  Fork,
  ForkExtractionResult,
  ForkPlan,
  FutureTrajectory,
  HorizonYears,
  ParallelAssignment,
  ParallelSelfCount,
  DebateRoundCount,
  PipelineResult,
  PipelineStage,
} from '../types'

function slugId(label: string, idx: number): string {
  const base = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 40)
  return base || `fork_${idx}`
}

function dedupeUniformPaths(plans: ForkPlan[]): void {
  if (plans.length < 3) return
  const first = plans[0]!.takenPath
  if (!plans.every((p) => p.takenPath === first)) return
  const mid = Math.floor(plans.length / 2)
  const p = plans[mid]!
  plans[mid] = {
    ...p,
    takenPath: p.takenPath === 'A' ? 'B' : 'A',
  }
}

function assignForkPlans(
  forks: Fork[],
  assignments: ParallelAssignment[] | undefined,
  count: ParallelSelfCount,
): ForkPlan[] {
  const top = forks.slice(0, count)
  if (top.length < count) {
    throw new Error(
      `Need at least ${count} forks from extraction; got ${forks.length}. Add detail to your intake or reduce parallel selves.`,
    )
  }

  const cycle: ('A' | 'B')[] =
    count === 5 ? ['A', 'B', 'A', 'B', 'A'] : ['A', 'B', 'A']

  const plans: ForkPlan[] = top.map((f, i) => {
    const id = f.id || slugId(f.label, i)
    const match =
      assignments?.find((a) => a.forkId === id) ?? assignments?.[i]
    let taken: 'A' | 'B'
    if (match?.explorePath === 'B') taken = 'B'
    else if (match?.explorePath === 'A') taken = 'A'
    else taken = cycle[i % cycle.length]!

    return { ...f, id, takenPath: taken }
  })

  dedupeUniformPaths(plans)
  return plans
}

async function extractForks(
  intake: string,
  horizonHint: HorizonYears,
  parallelSelfCount: ParallelSelfCount,
): Promise<ForkExtractionResult> {
  const userMsg = forkExtractionPrompt(intake, horizonHint, parallelSelfCount)
  const res = await createMessage({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: 'user', content: userMsg }],
  })
  const text = messageText(res)
  const parsed = parseJsonFromModel<ForkExtractionResult>(text)
  if (!parsed.forks?.length) {
    throw new Error('Fork extraction returned no forks.')
  }
  parsed.horizonYears = horizonHint
  parsed.forks = parsed.forks.map((f, i) => ({
    ...f,
    id: f.id || slugId(f.label, i),
  }))

  const firstN = parsed.forks.slice(0, parallelSelfCount)
  if (firstN.length < parallelSelfCount) {
    throw new Error(
      `Fork extraction returned only ${parsed.forks.length} fork(s); need at least ${parallelSelfCount}. Try richer intake or fewer parallel selves.`,
    )
  }

  if (parsed.parallelAssignments?.length) {
    parsed.parallelAssignments = firstN.map((f, i) => {
      const prev = parsed.parallelAssignments![i]
      const byId = parsed.parallelAssignments!.find((a) => a.forkId === f.id)
      const base = byId ?? prev
      if (!base) {
        const fb =
          parallelSelfCount === 5
            ? (['A', 'B', 'A', 'B', 'A'] as const)[i % 5]
            : (['A', 'B', 'A'] as const)[i % 3]
        return { forkId: f.id, explorePath: fb }
      }
      return {
        forkId: f.id,
        explorePath: base.explorePath === 'B' ? 'B' : 'A',
        rationale: base.rationale,
      } satisfies ParallelAssignment
    })
  }

  return parsed
}

async function simulateTrajectory(
  intake: string,
  plan: ForkPlan,
  horizonYears: HorizonYears,
): Promise<FutureTrajectory> {
  const chosen =
    plan.takenPath === 'A' ? plan.pathA : plan.pathB
  const unchosen =
    plan.takenPath === 'A' ? plan.pathB : plan.pathA

  const res = await createMessage({
    model: MODEL,
    max_tokens: 8192,
    system: futureSelfSystem(intake, horizonYears),
    messages: [
      {
        role: 'user',
        content: futureSelfUser({
          forkId: plan.id,
          forkLabel: plan.label,
          chosen,
          unchosen,
          horizonYears,
        }),
      },
    ],
  })
  const text = messageText(res)
  const parsed = parseJsonFromModel<
    FutureTrajectory & { forkId?: string }
  >(text)
  return {
    forkId: parsed.forkId || plan.id,
    label: parsed.label || plan.label,
    chosenPath: parsed.chosenPath || chosen,
    unchosenPath: parsed.unchosenPath || unchosen,
    years: parsed.years || [],
    endState: parsed.endState || '',
    regrets: parsed.regrets || '',
    unexpectedGains: parsed.unexpectedGains || '',
  }
}

async function runDebate(
  intake: string,
  trajectories: FutureTrajectory[],
  rounds: number,
  parallelSelfCount: ParallelSelfCount,
): Promise<string> {
  const res = await createMessage({
    model: MODEL,
    max_tokens: 12288,
    messages: [
      {
        role: 'user',
        content: debatePrompt(
          intake,
          JSON.stringify(trajectories, null, 2),
          rounds,
          parallelSelfCount,
        ),
      },
    ],
  })
  return messageText(res)
}

async function runCartographer(
  debateTranscript: string,
  trajectories: FutureTrajectory[],
): Promise<CartographerOutput> {
  const res = await createMessage({
    model: MODEL,
    max_tokens: trajectories.length > 3 ? 8192 : 4096,
    messages: [
      {
        role: 'user',
        content: cartographerPrompt(
          debateTranscript,
          JSON.stringify(trajectories, null, 2),
        ),
      },
    ],
  })
  const text = messageText(res)
  return parseJsonFromModel<CartographerOutput>(text)
}

export async function runPipeline(
  intake: string,
  horizonHint: HorizonYears,
  options?: {
    debateRounds?: DebateRoundCount
    parallelSelfCount?: ParallelSelfCount
    onProgress?: (stage: PipelineStage) => void
  },
): Promise<PipelineResult> {
  const debateRounds: DebateRoundCount = options?.debateRounds ?? 2
  const parallelSelfCount = options?.parallelSelfCount ?? 3
  const onProgress = options?.onProgress

  const runConfig = { parallelSelfCount, debateRounds }

  onProgress?.('forks')
  const extraction = await extractForks(intake, horizonHint, parallelSelfCount)
  const horizonYears = horizonHint
  const plans = assignForkPlans(
    extraction.forks,
    extraction.parallelAssignments,
    parallelSelfCount,
  )

  onProgress?.('futures')
  const trajectories = await Promise.all(
    plans.map((p) => simulateTrajectory(intake, p, horizonYears)),
  )

  onProgress?.('debate')
  const debateTranscript = await runDebate(
    intake,
    trajectories,
    debateRounds,
    parallelSelfCount,
  )

  onProgress?.('cartographer')
  const cartographer = await runCartographer(debateTranscript, trajectories)

  onProgress?.('done')
  return {
    intake,
    horizonYears,
    extraction,
    trajectories,
    debateTranscript,
    cartographer,
    runConfig,
  }
}
