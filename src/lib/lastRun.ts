import type { PipelineResult } from '../types'

const KEY = 'fsn_v1_last_run'

export function saveLastRun(result: PipelineResult): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(result))
  } catch {
    /* ignore quota / private mode */
  }
}

export function loadLastRun(): PipelineResult | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PipelineResult
    if (!parsed?.trajectories?.length || !parsed?.cartographer?.selves) return null
    return parsed
  } catch {
    return null
  }
}

export function clearLastRun(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
