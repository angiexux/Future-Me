import type {
  DebateRoundCount,
  HorizonYears,
  ParallelSelfCount,
  PipelineResult,
  RunConfig,
} from '../types'

const DEFAULT_RUN: RunConfig = {
  parallelSelfCount: 3,
  debateRounds: 2,
}

export function buildDemoResult(
  intake: string,
  horizonYears: HorizonYears,
  partial?: Partial<RunConfig>,
): PipelineResult {
  const parallelSelfCount: ParallelSelfCount =
    partial?.parallelSelfCount ?? DEFAULT_RUN.parallelSelfCount
  const debateRounds: DebateRoundCount =
    partial?.debateRounds ?? DEFAULT_RUN.debateRounds

  const runConfig: RunConfig = { parallelSelfCount, debateRounds }

  if (parallelSelfCount === 5) {
    return demoFive(intake, horizonYears, runConfig)
  }
  return demoThree(intake, horizonYears, runConfig)
}

function demoThree(
  intake: string,
  horizonYears: HorizonYears,
  runConfig: RunConfig,
): PipelineResult {
  return {
    intake,
    horizonYears,
    runConfig,
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
      parallelAssignments: [
        {
          forkId: 'stay_course',
          explorePath: 'A',
          rationale:
            'Anchors one simulation in continuity so contrast with optionality-heavy paths stays vivid.',
        },
        {
          forkId: 'relationship_risk',
          explorePath: 'B',
          rationale:
            'Spreads emotional posture — solitude here balances the “stay” self’s rootedness.',
        },
        {
          forkId: 'visibility',
          explorePath: 'B',
          rationale:
            'Keeps accomplishment narratives from aligning on external prestige alone.',
        },
      ],
    },
    trajectories: [
      trajStay(horizonYears),
      trajPartner(horizonYears),
      trajQuiet(horizonYears),
    ],
    debateTranscript: debateThreeStub,
    cartographer: cartographerThree,
  }
}

function demoFive(
  intake: string,
  horizonYears: HorizonYears,
  runConfig: RunConfig,
): PipelineResult {
  return {
    intake,
    horizonYears,
    runConfig,
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
        {
          id: 'body_energy',
          label: 'Burn bright vs protect baseline health',
          pathA: 'Intensity now — prove capacity through grind',
          pathB: 'Sleep, movement, and nervous-system hygiene first',
        },
        {
          id: 'money_security',
          label: 'Optimize earnings vs enoughness',
          pathA: 'Maximize runway and optionality through income',
          pathB: 'Lower burn and redefine enough — trade prestige for margin',
        },
      ],
      statedVsHabitsTension:
        'Ambition and restoration pull in different directions; neither is dishonest — they compete for the same calendar.',
      horizonYears,
      suppressedForksNote:
        'Whether “later” is a real season or a polite way to say never.',
      parallelAssignments: [
        {
          forkId: 'stay_course',
          explorePath: 'A',
          rationale: 'Ground one timeline in place so other selves can diverge harder.',
        },
        {
          forkId: 'relationship_risk',
          explorePath: 'A',
          rationale: 'Tests intimacy without merging identities.',
        },
        {
          forkId: 'visibility',
          explorePath: 'B',
          rationale: 'Contrasts with partnership visibility — craft without applause.',
        },
        {
          forkId: 'body_energy',
          explorePath: 'B',
          rationale: 'Adds a physiology-bound storyline versus hustle-first arcs.',
        },
        {
          forkId: 'money_security',
          explorePath: 'B',
          rationale: 'Enoughness narrative balances income-max selves elsewhere.',
        },
      ],
    },
    trajectories: [
      trajStay(horizonYears),
      trajPartner(horizonYears),
      trajQuiet(horizonYears),
      trajBody(horizonYears),
      trajMoney(horizonYears),
    ],
    debateTranscript: debateFiveStub,
    cartographer: cartographerFive,
  }
}

function trajStay(horizonYears: HorizonYears) {
  return {
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
  }
}

function trajPartner(horizonYears: HorizonYears) {
  return {
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
  }
}

function trajQuiet(horizonYears: HorizonYears) {
  return {
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
  }
}

function trajBody(horizonYears: HorizonYears) {
  return {
    forkId: 'body_energy',
    label: 'Burn bright vs protect baseline health',
    chosenPath: 'Sleep, movement, and nervous-system hygiene first',
    unchosenPath: 'Intensity now — prove capacity through grind',
    years: [
      {
        year: 1,
        summary:
          'Slower launches; fewer heroic weeks — fewer crashes. Boring wins accumulate.',
        voice: 'I stopped treating exhaustion like proof of seriousness.',
      },
      {
        year: 4,
        summary:
          'Baseline mood steadier; ambition reframed as reps, not spikes.',
        voice: 'Energy became something I budget like money.',
      },
      {
        year: horizonYears,
        summary:
          'Fewer trophies; more Tuesdays that feel survivable. Chronic pain episodes rare.',
        voice: 'Vitality is the quiet plot twist.',
      },
    ],
    endState:
      'Capacity is lower on paper, higher in practice — fewer boom-bust cycles.',
    regrets:
      'Sometimes envy people who still mythologize hustle — even when it hurt them.',
    unexpectedGains:
      'Attention span for relationships and creative depth went up when uptime went down.',
  }
}

function trajMoney(horizonYears: HorizonYears) {
  return {
    forkId: 'money_security',
    label: 'Optimize earnings vs enoughness',
    chosenPath: 'Lower burn and redefine enough — trade prestige for margin',
    unchosenPath: 'Maximize runway and optionality through income',
    years: [
      {
        year: 2,
        summary:
          'Smaller apartment; smaller identity hit than expected. Margin feels like oxygen.',
        voice: 'Enough stopped sounding like settling.',
      },
      {
        year: 5,
        summary:
          'Turned down two ladder moves; invested slack into relationships and skill depth.',
        voice: 'Optionality became emotional, not just financial.',
      },
      {
        year: horizonYears,
        summary:
          'Net worth not maximal — inner volatility lower; fewer “prove it” spirals.',
        voice: 'Security lives in the gap between bills and shame.',
      },
    ],
    endState:
      'Life looks modest outside; feels spacious inside — still occasional money panic.',
    regrets:
      'Slowed wealth accumulation versus peers on prestige tracks.',
    unexpectedGains:
      'Room to say no to misaligned work without negotiating self-worth hourly.',
  }
}

const debateThreeStub = `### Round 1

**Staying** steelmans **quiet-building**: “Your obscurity isn’t cowardice — it protects the work from premature classification.” Then argues for staying: depth needs continuity; exits can be an addiction to reinvention.

**Partnership** steelmans **staying**: “Place-rooted craft gave you nervous-system sobriety — that’s what made intimacy possible.” Then argues leaning in reduced background hum of loneliness that fueled procrastination.

**Quiet-building** steelmans **partnership**: “Being witnessed daily teaches rigor — less performance for strangers, more truth at home.” Then argues visibility-as-stage inflates false timelines; backstage builds transferable nerve.

### Round 2

**Staying** admits envy of anonymous reinvention; names cost as slower identity drift correction.

**Partnership** admits resentment during crunch weeks; names gain as emotional insulation against cynicism.

**Quiet-building** admits delayed recognition hurts hiring leverage; names gain as autonomy over narrative.`

const debateFiveStub = `### Round 1

**Staying** steelmans **quiet-building**, then argues continuity repaired something restless in the intake.

**Partnership** steelmans **body**, then argues love reduced ambient loneliness that looked like laziness.

**Quiet-building** steelmans **money**, then argues obscurity protected taste from premature branding.

**Body** steelmans **partnership**, then argues baseline health changed what “effort” meant.

**Money** steelmans **staying**, then argues enoughness lowered the volume on competitive suffering.

### Round 2

Each voice admits one cost: slower novelty (stay), slower solo freedom (partner), slower public upside (quiet), slower traditional promotion (body), slower wealth curve (money).

### Round 3

Cross-talk on envy: who envies whose metric — visibility, partnership warmth, vitality, bank account, depth.

### Round 4

No synthesis — only sharper tradeoffs on what kind of tiredness each path sells you.`

const cartographerThree = {
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
}

const cartographerFive = {
  selves: [
    cartographerThree.selves[0],
    cartographerThree.selves[1],
    cartographerThree.selves[2],
    {
      selfId: 'body_energy',
      shortLabel: 'Baseline first',
      scores: {
        peace: 80,
        accomplishment: 62,
        surprise: 58,
        integration: 84,
        vitality: 92,
      },
    },
    {
      selfId: 'money_security',
      shortLabel: 'Enoughness',
      scores: {
        peace: 78,
        accomplishment: 60,
        surprise: 66,
        integration: 85,
        vitality: 74,
      },
    },
  ],
  narrative: {
    mostAtPeace:
      'The self most at peace got there by shrinking the gap between stated values and weekly recovery — less convincing the mirror, more repeatable Tuesdays.',
    mostAccomplished:
      'The self most accomplished sacrificed some purity of rest — investing friction where accountability to others sharpened output.',
    mostSurprised:
      'The self most surprised discovered that modest living quietly rewrote shame about speed — enoughness wasn’t absence of hunger, but less ambient panic.',
  },
  tradeoffSummary:
      'Five currencies: place, bond, craft, body, margin. Raising one often drafts from another; the map shows where your intake implied you already borrow.',
}
