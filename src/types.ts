export type HorizonYears = 5 | 10 | 20

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
  /** One entry per first three forks — which path each parallel self will live out. */
  parallelAssignments?: ParallelAssignment[]
}

export interface PipelineResult {
  intake: string
  horizonYears: HorizonYears
  extraction: ForkExtractionResult
  trajectories: FutureTrajectory[]
  debateTranscript: string
  cartographer: CartographerOutput
}

export type PipelineStage =
  | 'idle'
  | 'forks'
  | 'futures'
  | 'debate'
  | 'cartographer'
  | 'done'
  | 'error'
