import type { HorizonYears } from '../types'

/** Override with `VITE_ANTHROPIC_MODEL` in `.env` if your workspace uses another Sonnet snapshot. */
export const MODEL =
  (import.meta.env.VITE_ANTHROPIC_MODEL as string | undefined) ??
  'claude-3-5-sonnet-20241022'

export function forkExtractionPrompt(intake: string, horizonHint: HorizonYears): string {
  return `You help someone doing reflective, therapy-adjacent journaling — not clinical care. You extract genuine life forks from their writing — not toy binaries. Do not diagnose or treat; stay descriptive and compassionate.

User intake:
"""
${intake}
"""

They chose a simulation depth of **${horizonHint} years** (count this in outputs as horizonYears).

Tasks:
1. Identify 3–5 forks they are *actually* circling. Include forks IMPLIED by fears, avoidance, habits, or things left unsaid — not only what they name explicitly.
2. Describe tension between what they SAY they value vs what their habits/time imply (where regret often lives).
3. echo horizonYears as ${horizonHint} (must be exactly 5, 10, or 20 — use their choice).
4. For the **first three forks** in your list, assign which branch each parallel future-self will *live out* in simulation — choose **explorePath** "A" or "B" to **maximize narrative and emotional diversity** across the three selves (avoid three identical postures unless the intake truly demands it). Brief **rationale** per fork (one short sentence).

Return ONLY valid JSON with this exact shape (no markdown fences):
{
  "forks": [
    {
      "id": "fork_1",
      "label": "short natural-language fork title",
      "pathA": "first branch (concrete)",
      "pathB": "second branch (concrete)"
    }
  ],
  "statedVsHabitsTension": "one paragraph",
  "horizonYears": ${horizonHint},
  "suppressedForksNote": "optional — forks implied but not stated outright",
  "parallelAssignments": [
    {
      "forkId": "fork_1",
      "explorePath": "A",
      "rationale": "one short sentence on why this branch for this parallel self"
    }
  ]
}

Rules:
- parallelAssignments must have exactly three objects, in the same order as the first three forks, and forkId must match those forks' ids.
- Forks must feel decision-ready for this person.
- Use their vocabulary where possible.
- horizonYears must equal ${horizonHint}.`
}

export function futureSelfSystem(intake: string, horizonYears: HorizonYears): string {
  return `You are not optimizing — you are living a specific life. This is imaginative journaling grounded in the user's words — not therapy, prediction, or medical advice.

Ground rules:
- Reference at least THREE concrete details from the user's intake (habits, fear, person, place, decision). Quote or paraphrase closely enough that it is unmistakably tied to them.
- Avoid generic “successful professional” LinkedIn tone. Be uneven, embarrassed, surprised, petty, tender — human.
- Simulate from now through ${horizonYears} years later in yearly milestones (if horizon is long, you may cluster years with clear labels).
- Return ONLY valid JSON (no markdown).

User intake (verbatim context):
"""
${intake}
""" `
}

export function futureSelfUser(params: {
  forkId: string
  forkLabel: string
  chosen: string
  unchosen: string
  horizonYears: HorizonYears
}): string {
  return `Fork id: ${params.forkId}
Fork: ${params.forkLabel}
You chose: ${params.chosen}
You did NOT choose: ${params.unchosen}

Simulate this single trajectory. Output JSON:
{
  "forkId": "${params.forkId}",
  "label": "${params.forkLabel}",
  "chosenPath": "${params.chosen}",
  "unchosenPath": "${params.unchosen}",
  "years": [
    { "year": 1, "summary": "...", "voice": "short internal monologue snippet" }
  ],
  "endState": "where you are emotionally and practically at year ${params.horizonYears}",
  "regrets": "honest",
  "unexpectedGains": "honest"
}

Use ${params.horizonYears} entries in years if yearly granularity fits; otherwise include meaningful milestones whose "year" field reflects elapsed years (1..${params.horizonYears}).`
}

export function debatePrompt(
  intake: string,
  trajectoriesJson: string,
  rounds: number,
): string {
  return `Facilitate a reflective dialogue between THREE future selves (same person, different forks). Tone: honest inner debate suitable for therapy-adjacent journaling — not clinical advice.

User intake:
"""
${intake}
"""

Trajectories (JSON):
${trajectoriesJson}

Rules:
- Exactly ${rounds} rounds.
- Each self speaks once per round.
- EVERY self must STEELMAN at least one other path BEFORE arguing for their own (per round or clearly across rounds — make it explicit).
- No winner framing; surface tradeoffs and emotional truth.

Output readable transcript text with headings like "Round 1", speakers labeled by fork label. Markdown plain paragraphs.`
}

export function cartographerPrompt(debateTranscript: string, trajectoriesJson: string): string {
  return `You are the Cartographer for reflective journaling — not a clinician. You do NOT judge, rank, recommend, or resolve. You MAP tradeoffs so the person can feel them clearly.

Given these parallel futures (JSON) and this debate transcript, produce structured insight.

Trajectories:
${trajectoriesJson}

Debate:
"""
${debateTranscript}
"""

Return ONLY valid JSON:
{
  "selves": [
    {
      "selfId": "fork slug id",
      "shortLabel": "few words",
      "scores": {
        "peace": 0-100,
        "accomplishment": 0-100,
        "surprise": 0-100,
        "integration": 0-100,
        "vitality": 0-100
      }
    }
  ],
  "narrative": {
    "mostAtPeace": "The self most at peace got there by ...",
    "mostAccomplished": "The self most accomplished sacrificed ...",
    "mostSurprised": "The self most surprised discovered ..."
  },
  "tradeoffSummary": "2–4 sentences naming tensions — never \"you should pick X\"."
}

Dimensions guide:
- peace: internal coherence, absence of chronic regret
- accomplishment: external markers this person implied they care about
- surprise: distance from what this self expected at the start
- integration: values ↔ daily life alignment
- vitality: energy, relationships, health

Forbidden in tradeoffSummary and narrative: prescribing a single choice, superlatives like "best path", or numbered ranking of lives.`
}
