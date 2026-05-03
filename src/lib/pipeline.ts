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

function assignForkPlans(
  forks: Fork[],
  assignments: ParallelAssignment[] | undefined,
): ForkPlan[] {
  const top = forks.slice(0, 3)
  const plans: ForkPlan[] = top.map((f, i) => {
    const id = f.id || slugId(f.label, i)
    const match =
      assignments?.find((a) => a.forkId === id) ?? assignments?.[i]
    let taken: 'A' | 'B'
    if (match?.explorePath === 'B') taken = 'B'
    else if (match?.explorePath === 'A') taken = 'A'
    else taken = (['A', 'B', 'A'] as const)[i % 3]

    return { ...f, id, takenPath: taken }
  })

  if (
    plans.length === 3 &&
    plans[0]!.takenPath === plans[1]!.takenPath &&
    plans[1]!.takenPath === plans[2]!.takenPath
  ) {
    plans[1] = {
      ...plans[1]!,
      takenPath: plans[1]!.takenPath === 'A' ? 'B' : 'A',
    }
  }
  return plans
}

async function extractForks(
  intake: string,
  horizonHint: HorizonYears,
): Promise<ForkExtractionResult> {
  const userMsg = forkExtractionPrompt(intake, horizonHint)
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

  const firstThree = parsed.forks.slice(0, 3)
  if (parsed.parallelAssignments?.length) {
    parsed.parallelAssignments = firstThree.map((f, i) => {
      const prev = parsed.parallelAssignments![i]
      const byId = parsed.parallelAssignments!.find((a) => a.forkId === f.id)
      const base = byId ?? prev
      if (!base) {
        return { forkId: f.id, explorePath: (['A', 'B', 'A'] as const)[i % 3] }
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
): Promise<string> {
  const res = await createMessage({
    model: MODEL,
    max_tokens: 8192,
    messages: [
      {
        role: 'user',
        content: debatePrompt(intake, JSON.stringify(trajectories, null, 2), rounds),
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
    max_tokens: 4096,
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
    debateRounds?: number
    onProgress?: (stage: PipelineStage) => void
  },
): Promise<PipelineResult> {
  const debateRounds = options?.debateRounds ?? 2
  const onProgress = options?.onProgress

  onProgress?.('forks')
  const extraction = await extractForks(intake, horizonHint)
  const horizonYears = horizonHint
  const plans = assignForkPlans(
    extraction.forks,
    extraction.parallelAssignments,
  )

  onProgress?.('futures')
  const trajectories = await Promise.all(
    plans.map((p) => simulateTrajectory(intake, p, horizonYears)),
  )

  onProgress?.('debate')
  const debateTranscript = await runDebate(intake, trajectories, debateRounds)

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
  }
}
