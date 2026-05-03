export type HorizonYears = 5 | 10 | 20

/** How many parallel future selves to simulate (full spec uses five). */
export type ParallelSelfCount = 3 | 5

export type DebateRoundCount = 2 | 3 | 4

export interface RunConfig {
  parallelSelfCount: ParallelSelfCount
  debateRounds: DebateRoundCount
}

export interface Fork {
  id: string
  label: string
  pathA: string
  pathB: string
}

export interface ForkPlan extends Fork {
  /** Branch this parallel self embodies */
  takenPath: 'A' | 'B'
}

export interface FutureTrajectory {
  forkId: string
  label: string
  chosenPath: string
  unchosenPath: string
  years: { year: number; summary: string; voice: string }[]
  endState: string
  regrets: string
  unexpectedGains: string
}

export interface CartographerScores {
  peace: number
  accomplishment: number
  surprise: number
  integration: number
  vitality: number
}

export interface SelfMap {
  selfId: string
  shortLabel: string
  scores: CartographerScores
}

export interface CartographerOutput {
  selves: SelfMap[]
  narrative: {
    mostAtPeace: string
    mostAccomplished: string
    mostSurprised: string
  }
  tradeoffSummary: string
}

/** Which branch the parallel self explores for this fork (chosen by the model for diversity). */
export interface ParallelAssignment {
  forkId: string
  explorePath: 'A' | 'B'
  rationale?: string
}

export interface ForkExtractionResult {
  forks: Fork[]
  statedVsHabitsTension: string
  horizonYears: HorizonYears
  suppressedForksNote?: string
  /** One entry per simulated fork (same count as parallel selves) — branch each self explores. */
  parallelAssignments?: ParallelAssignment[]
}

export interface PipelineResult {
  intake: string
  horizonYears: HorizonYears
  extraction: ForkExtractionResult
  trajectories: FutureTrajectory[]
  debateTranscript: string
  cartographer: CartographerOutput
  /** Present on runs after this field was added; older saved maps may omit it. */
  runConfig?: RunConfig
}

export type PipelineStage =
  | 'idle'
  | 'forks'
  | 'futures'
  | 'debate'
  | 'cartographer'
  | 'done'
  | 'error'
