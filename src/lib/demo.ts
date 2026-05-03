import type { HorizonYears, PipelineResult } from '../types'

export function buildDemoResult(intake: string, horizonYears: HorizonYears): PipelineResult {
  return {
    intake,
    horizonYears,
    extraction: {
      forks: [
        {
          id: 'stay_course',
          label: 'Commit deeply vs keep exits open',
          pathA: 'Double down on current domain / city',
          pathB: 'Design life for optionality (portfolio moves)',
        },
        {
          id: 'relationship_risk',
          label: 'Lean into intimacy vs protect autonomy',
          pathA: 'Invest in one partnership thread',
          pathB: 'Prioritize solitude and creative freedom',
        },
        {
          id: 'visibility',
          label: 'Be seen vs build quietly',
          pathA: 'Named presence (career / community)',
          pathB: 'Craft + skill behind the scenes',
        },
      ],
      statedVsHabitsTension:
        'You say growth matters, but your habits protect recovery time — that tension is doing real work; neither side is fake.',
      horizonYears,
      suppressedForksNote:
        'A quieter fork: whether you ask for help before resentment compounds.',
    },
    trajectories: [
      {
        forkId: 'stay_course',
        label: 'Commit deeply vs keep exits open',
        chosenPath: 'Double down on current domain / city',
        unchosenPath: 'Design life for optionality (portfolio moves)',
        years: [
          {
            year: 1,
            summary:
              'Initial grief over closed doors; surprising friendships in the same zip code.',
            voice:
              'I thought staying meant shrinking — instead it meant stopping the audition.',
          },
          {
            year: 3,
            summary:
              'Credential drift corrected; local reputation compounds faster than expected.',
            voice: 'I stopped scanning flight deals every Sunday.',
          },
          {
            year: horizonYears,
            summary:
              'Grounded, occasionally restless; conflict skills improved because stakes are human-sized.',
            voice: 'Peace isn’t quiet — it’s fewer mirrors.',
          },
        ],
        endState:
          'Still here — tied to place and craft in a way that feels chosen, not trapped.',
        regrets:
          'Missed one international fellowship that would have flattered my ego more than my nervous system.',
        unexpectedGains:
          'Depth with neighbors, mentor-like ties at work, body learns one climate.',
      },
      {
        forkId: 'relationship_risk',
        label: 'Lean into intimacy vs protect autonomy',
        chosenPath: 'Invest in one partnership thread',
        unchosenPath: 'Prioritize solitude and creative freedom',
        years: [
          {
            year: 1,
            summary:
              'Negotiating closeness without merger; weekly rituals replace grand gestures.',
            voice:
              'Love feels less cinematic — more like sharing the spreadsheet of life.',
          },
          {
            year: 3,
            summary:
              'Collaborative decisions slow certain career pivots; warmth anchors risk-taking.',
            voice: 'I argue cleaner because leaving hurts more.',
          },
          {
            year: horizonYears,
            summary:
              'Integrated partnership without fusion; creative work happens in protected blocks.',
            voice: 'Autonomy became a practice inside intimacy, not its opposite.',
          },
        ],
        endState:
          'Partnered with clearer boundaries than my younger self believed possible.',
        regrets:
          'Less spontaneous travel; some friendships cooled through neglect, not drama.',
        unexpectedGains:
          'Someone notices early when I’m spiraling — earlier than I do.',
      },
      {
        forkId: 'visibility',
        label: 'Be seen vs build quietly',
        chosenPath: 'Craft + skill behind the scenes',
        unchosenPath: 'Named presence (career / community)',
        years: [
          {
            year: 1,
            summary:
              'External recognition flat; internal momentum sharp — imposter curve inverted.',
            voice:
              'Nobody claps yet — which exposes whether I actually want the work.',
          },
          {
            year: 3,
            summary:
              'Small circles reference my work accurately; weird invitations arrive sideways.',
            voice: 'Reputation became texture, not tally.',
          },
          {
            year: horizonYears,
            summary:
              'Quiet portfolio funds bolder choices later; fewer trophies, sharper taste.',
            voice: 'Surprise: obscurity had stamina.',
          },
        ],
        endState:
          'Known deeply by few; invisible to many — integrity between values and hours feels high.',
        regrets:
          'Some deserved funding/exposure missed because I refused performance rituals.',
        unexpectedGains:
          'Skills compound privately; peers eventually orbit without social climbing.',
      },
    ],
    debateTranscript: `### Round 1

**Staying** steelmans **quiet-building**: “Your obscurity isn’t cowardice — it protects the work from premature classification.” Then argues for staying: depth needs continuity; exits can be an addiction to reinvention.

**Partnership** steelmans **staying**: “Place-rooted craft gave you nervous-system sobriety — that’s what made intimacy possible.” Then argues leaning in reduced background hum of loneliness that fueled procrastination.

**Quiet-building** steelmans **partnership**: “Being witnessed daily teaches rigor — less performance for strangers, more truth at home.” Then argues visibility-as-stage inflates false timelines; backstage builds transferable nerve.

### Round 2

**Staying** admits envy of anonymous reinvention; names cost as slower identity drift correction.

**Partnership** admits resentment during crunch weeks; names gain as emotional insulation against cynicism.

**Quiet-building** admits delayed recognition hurts hiring leverage; names gain as autonomy over narrative.`,
    cartographer: {
      selves: [
        {
          selfId: 'stay_course',
          shortLabel: 'Stay / deepen',
          scores: {
            peace: 82,
            accomplishment: 68,
            surprise: 54,
            integration: 86,
            vitality: 71,
          },
        },
        {
          selfId: 'relationship_risk',
          shortLabel: 'Lean in',
          scores: {
            peace: 74,
            accomplishment: 72,
            surprise: 61,
            integration: 79,
            vitality: 76,
          },
        },
        {
          selfId: 'visibility',
          shortLabel: 'Build quiet',
          scores: {
            peace: 77,
            accomplishment: 63,
            surprise: 84,
            integration: 88,
            vitality: 69,
          },
        },
      ],
      narrative: {
        mostAtPeace:
          'The self most at peace got there by stopping the perpetual audition for elsewhere — trading novelty spikes for repairable relationships with place.',
        mostAccomplished:
          'The self most accomplished sacrificed some anonymity and rest — saying yes to friction that came with being reliably accountable to someone else’s calendar and heart.',
        mostSurprised:
          'The self most surprised discovered that obscurity wasn’t absence of ambition but a different tempo of proof — satisfaction lagged prestige by years, then overtook it.',
      },
      tradeoffSummary:
        'Peace clusters with integration when continuity is chosen consciously; accomplishment rises where relational stakes sharpen discipline; surprise blooms where predictions were deliberately withheld from an audience. No quadrant owns the good life — each path pays in different currencies.',
    },
  }
}
