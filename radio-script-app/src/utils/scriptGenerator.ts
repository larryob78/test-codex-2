import { format, isValid, parseISO } from 'date-fns'
import type {
  FormState,
  IdeaPrompt,
  MusicMoodOption,
  ScriptBeat,
  SoundDesignPlan,
  TimelineCue,
  ToneOption,
} from '../types'

const tonePalettes: Record<
  ToneOption,
  {
    descriptor: string
    greeting: string
    sfxIntro: string
    sfxTransition: string
    sfxCTA: string
    voiceColor: string
    musicTexture: string
    mixNotes: string[]
  }
> = {
  'Bright & Friendly': {
    descriptor: 'bright and optimistic',
    greeting: 'Hey there',
    sfxIntro: 'Sparkling chimes burst into a gentle pop beat',
    sfxTransition: 'Soft woosh that lands on the music bed',
    sfxCTA: 'Logo shimmer with light percussion lift',
    voiceColor: 'smile-through-the-words energy',
    musicTexture: 'Acoustic pop with handclaps and light synth pads',
    mixNotes: ['Keep vocals forward and smiley', 'Let the bed breathe during key lines'],
  },
  'Confident & Bold': {
    descriptor: 'bold and modern',
    greeting: 'Attention',
    sfxIntro: 'Strong percussive hit and reverse sweep',
    sfxTransition: 'Rhythmic riser punctuated by a sub hit',
    sfxCTA: 'Signature sting with tight delay',
    voiceColor: 'confident, low-mid presence',
    musicTexture: 'Modern drums, pulsing bass, and a bold synth lead',
    mixNotes: ['Add tasteful compression on the VO', 'Punch the CTA with a wider stereo image'],
  },
  'Warm Storytelling': {
    descriptor: 'warm and human',
    greeting: 'Picture this',
    sfxIntro: 'Soft guitar strum with gentle ambiance',
    sfxTransition: 'Cinematic swell with subtle heartbeat percussion',
    sfxCTA: 'Acoustic resolve with subtle vocal pad',
    voiceColor: 'inviting storyteller warmth',
    musicTexture: 'Organic guitars, piano, and light percussion',
    mixNotes: ['Let pauses breathe', 'Layer in subtle room tone beneath voice'],
  },
  'High-Energy Promo': {
    descriptor: 'high-energy and urgent',
    greeting: 'Alright, let’s move',
    sfxIntro: 'Fast sweep into energetic beat drop',
    sfxTransition: 'Drum fill into a rhythmic hit',
    sfxCTA: 'Big impact hit and rising synth logo',
    voiceColor: 'amped-up announcer with crisp diction',
    musicTexture: 'Driving electronic bass with percussion loops',
    mixNotes: ['Keep the beat hot but duck under dialogue', 'Stack extra excitement in the final five seconds'],
  },
  'Calm & Reassuring': {
    descriptor: 'calm and reassuring',
    greeting: 'Take a breath',
    sfxIntro: 'Soft inhale leading into gentle piano bed',
    sfxTransition: 'Airy swell with subtle chime tail',
    sfxCTA: 'Warm piano resolve with soft pad',
    voiceColor: 'steady, reassuring tone with soft edges',
    musicTexture: 'Delicate piano, subtle strings, and ambient textures',
    mixNotes: ['Allow longer natural pauses', 'Keep SFX gentle and supportive'],
  },
}

const musicPalette: Record<
  MusicMoodOption,
  { tempo: string; instrumentation: string[]; textureTips: string[] }
> = {
  'Warm Acoustic Glow': {
    tempo: '96 BPM relaxed groove',
    instrumentation: ['Acoustic guitar', 'Brush kit', 'Ambient pads'],
    textureTips: ['Layer subtle crowd noise for authenticity', 'Use reverb tails to smooth transitions'],
  },
  'Upbeat Indie Pop': {
    tempo: '120 BPM feel-good pocket',
    instrumentation: ['Plucky guitars', 'Claps & snaps', 'Synth bass'],
    textureTips: ['Accent beat 1 and 3 for bounce', 'Add a filter sweep into the CTA'],
  },
  'Minimal Electro Pulse': {
    tempo: '110 BPM with side-chained pads',
    instrumentation: ['Deep kick', 'Airy arpeggios', 'Wide pads'],
    textureTips: ['Automate low-pass filters to build sections', 'Use delays to widen transitions'],
  },
  'Bold Modern Rock': {
    tempo: '140 BPM driving rhythm',
    instrumentation: ['Crunch guitars', 'Big drums', 'Bass drone'],
    textureTips: ['Punch the downbeat of each section', 'Drop instruments for a beat before the CTA'],
  },
  'Cinematic Lift': {
    tempo: '100 BPM evolving swell',
    instrumentation: ['Piano ostinato', 'String quartet', 'Organic percussion'],
    textureTips: ['Introduce strings gradually', 'Hit a crescendo right before the CTA'],
  },
}

function seededIndex(seed: string, length: number): number {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 2_147_483_647
  }
  return length === 0 ? 0 : Math.abs(hash) % length
}

function pickSeeded<T>(options: T[], seed: string): T {
  const index = seededIndex(seed, options.length)
  return options[Math.max(0, Math.min(options.length - 1, index))]
}

function ensureTrailingPeriod(text: string): string {
  if (!text) return ''
  return /[.!?]$/.test(text.trim()) ? text.trim() : `${text.trim()}.`
}

function describeObjective(rawObjective: string, brandName: string): string {
  const trimmed = rawObjective.trim()
  if (!trimmed) {
    return `share why ${brandName} matters right now`
  }

  const normalized = trimmed.replace(/[.!?]$/, '')
  if (/^to\s+/i.test(normalized)) {
    return normalized.replace(/^to\s+/i, '')
  }

  return normalized
}

function inferCallToAction(form: FormState, brandName: string): string {
  const raw = form.callToAction.trim()
  if (raw) {
    return ensureTrailingPeriod(raw)
  }

  const slug = brandName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .replace(/(^-+|-+$)/g, '')

  if (slug) {
    return `Visit ${slug}.com today.`
  }

  return 'Find out more today.'
}

function formatCampaignDate(date: string): string | null {
  if (!date) {
    return null
  }
  try {
    const parsed = parseISO(date)
    if (!isValid(parsed)) {
      return null
    }
    return format(parsed, 'EEEE, MMMM d')
  } catch {
    return null
  }
}

function wrapDirection(content: string): string {
  return `<span class="direction">${content}</span>`
}

function wrapLeadIn(content: string): string {
  return `<span class="lead">${content}</span>`
}

function buildHookContent(
  seed: string,
  palette: (typeof tonePalettes)[ToneOption],
  {
    audience,
    clientName,
    brandName,
    objectivePhrase,
    formattedDate,
    offer,
  }: {
    audience: string
    clientName: string
    brandName: string
    objectivePhrase: string
    formattedDate: string | null
    offer: string
  },
): string {
  const greetings = [
    `${palette.greeting}, ${audience}!`,
    `${palette.greeting}! ${audience.charAt(0).toUpperCase()}${audience.slice(1)} — lean in for a moment.`,
    `${audience.charAt(0).toUpperCase()}${audience.slice(1)}, ${palette.descriptor} news just dropped.`,
  ]

  const frames = [
    `${clientName} is teaming up with ${brandName} so you can ${objectivePhrase}.`,
    `${brandName} knows you are ready for ${offer}.`,
    `Here’s how ${brandName} makes it easy to ${objectivePhrase}.`,
  ]

  const timeline = formattedDate
    ? `It’s ${formattedDate}, and ${clientName} wants this on your radar.`
    : `${clientName} wants this on your radar today.`

  const lead = pickSeeded(greetings, `${seed}-greeting`)
  const frame = pickSeeded(frames, `${seed}-frame`)

  const paragraphs = [
    `${wrapDirection(`[SFX: ${palette.sfxIntro}]`)} ${lead}`,
    `${wrapLeadIn(palette.voiceColor)} ${frame}`,
    timeline,
  ]

  return paragraphs.map((text) => `<p>${text}</p>`).join('')
}

function buildStoryContent(
  seed: string,
  palette: (typeof tonePalettes)[ToneOption],
  {
    audience,
    objectivePhrase,
    offer,
  }: {
    audience: string
    objectivePhrase: string
    offer: string
  },
): string {
  const challenges = [
    `${audience} juggle a lot — and carving out time for this matters.`,
    `You told us staying on top of this can be a challenge.`,
    `Maybe you’ve been thinking about how to ${objectivePhrase}, but it keeps slipping down the list.`,
  ]

  const empathy = [
    `We get it. That’s why this story is built around you.`,
    `That’s the friction we’re smoothing out today.`,
    `You deserve a version that was designed with you in mind.`,
  ]

  const proof = [
    `${offer} means you can start faster than ever.`,
    `From the first moment, you’ll feel how streamlined it is.`,
    `The experience was shaped alongside real ${audience}.`,
  ]

  return [
    `<p>${wrapDirection(`[MUSIC: ${palette.musicTexture} stays under voice]`)} ${pickSeeded(challenges, `${seed}-challenge`)}</p>`,
    `<p>${pickSeeded(empathy, `${seed}-empathy`)}</p>`,
    `<p>${pickSeeded(proof, `${seed}-proof`)}</p>`,
  ].join('')
}

function buildSolutionContent(
  seed: string,
  palette: (typeof tonePalettes)[ToneOption],
  {
    brandName,
    offer,
    objectivePhrase,
  }: {
    brandName: string
    offer: string
    objectivePhrase: string
  },
): string {
  const benefits = [
    `${brandName} wraps it all in a clear path so you can ${objectivePhrase} without the stress.`,
    `Every touchpoint with ${brandName} is tuned to feel effortless.`,
    `${brandName} built this to deliver ${offer.toLowerCase()}.`,
  ]

  const differentiators = [
    `It’s the details — the onboarding, the follow-through, the care — that make the difference.`,
    `There’s a real team behind this, guiding you at every beat.`,
    `It’s fast, it’s modern, and it respects your time.`,
  ]

  const reassurance = [
    `So while the music carries you forward, let this solution carry your day.`,
    `This is how ${brandName} keeps promises — in every second you hear.`,
    `Let this be the moment it all feels aligned.`,
  ]

  return [
    `<p>${wrapDirection(`[SFX: ${palette.sfxTransition}]`)} ${pickSeeded(benefits, `${seed}-benefits`)}</p>`,
    `<p>${pickSeeded(differentiators, `${seed}-diff`)}</p>`,
    `<p>${pickSeeded(reassurance, `${seed}-reassure`)}</p>`,
  ].join('')
}

function buildCTAContent(
  seed: string,
  palette: (typeof tonePalettes)[ToneOption],
  {
    brandName,
    callToAction,
    offer,
  }: {
    brandName: string
    callToAction: string
    offer: string
  },
): string {
  const recaps = [
    `${brandName}. ${offer}. Ready when you are.`,
    `${offer} — made possible by ${brandName}.`,
    `${brandName} is set to meet you right where you are.`,
  ]

  const urgency = [
    `Lock it in now while the momentum’s rolling.`,
    `Don’t let today pass without taking that first step.`,
    `Keep that energy — take it with you into the next beat.`,
  ]

  return [
    `<p>${wrapDirection(`[SFX: ${palette.sfxCTA}]`)} ${pickSeeded(recaps, `${seed}-recap`)}</p>`,
    `<p><strong>${callToAction}</strong></p>`,
    `<p>${pickSeeded(urgency, `${seed}-urgency`)}</p>`,
  ].join('')
}

export function createScriptBeats(form: FormState): ScriptBeat[] {
  const palette = tonePalettes[form.tone]
  const brandName = form.brandName.trim() || 'your brand'
  const clientName = form.clientName.trim() || brandName
  const audienceRaw = form.targetAudience.trim() || 'listeners'
  const audience = audienceRaw.replace(/^the\s+/i, '').trim() || 'listeners'
  const objectivePhrase = describeObjective(form.objective, brandName)
  const offer = form.keyOffer.trim() || `a special offer from ${brandName}`
  const callToAction = inferCallToAction(form, brandName)
  const formattedDate = formatCampaignDate(form.campaignDate)
  const seedBase = `${form.clientName}-${form.brandName}-${form.duration}-${form.tone}`

  const blueprint: (Omit<ScriptBeat, 'content' | 'highlight'> & { highlight: string })[] = [
    {
      id: 'hook',
      label: 'Hook & Scene Set',
      ratio: 0.22,
      pace: 'energetic',
      highlight: 'Punch the intro with personality',
    },
    {
      id: 'story',
      label: 'Audience Story',
      ratio: 0.24,
      pace: 'steady',
      highlight: 'Reflect the listener’s world',
    },
    {
      id: 'solution',
      label: 'Brand Solution',
      ratio: 0.30,
      pace: 'steady',
      highlight: `Spotlight why ${brandName} wins`,
    },
    {
      id: 'cta',
      label: 'Call to Action',
      ratio: 0.24,
      pace: 'energetic',
      highlight: 'Hit the CTA clean and clear',
    },
  ]

  return blueprint.map((beat) => {
    const beatSeed = `${seedBase}-${beat.id}`
    let content = ''
    switch (beat.id) {
      case 'hook':
        content = buildHookContent(beatSeed, palette, {
          audience,
          clientName,
          brandName,
          objectivePhrase,
          formattedDate,
          offer,
        })
        break
      case 'story':
        content = buildStoryContent(beatSeed, palette, {
          audience,
          objectivePhrase,
          offer,
        })
        break
      case 'solution':
        content = buildSolutionContent(beatSeed, palette, {
          brandName,
          offer,
          objectivePhrase,
        })
        break
      case 'cta':
        content = buildCTAContent(beatSeed, palette, {
          brandName,
          callToAction,
          offer,
        })
        break
      default:
        content = ''
    }

    return {
      ...beat,
      content,
      highlight: beat.highlight,
    }
  })
}

export function createIdeaPrompts(form: FormState, beats: ScriptBeat[]): IdeaPrompt[] {
  const duration = form.duration
  const paceTip =
    duration <= 15
      ? 'Keep lines under eight words and land one clear benefit.'
      : duration <= 30
        ? 'Aim for two sentences per beat with purposeful pauses.'
        : 'Build micro-scenes — layer detail without losing pace.'

  const beatHighlights = beats.map((beat) => beat.highlight)

  const palette = tonePalettes[form.tone]

  return [
    {
      title: 'Pacing',
      detail: paceTip,
    },
    {
      title: 'Tone',
      detail: `Deliver with ${palette.voiceColor}. Let the music feel ${palette.descriptor}.`,
    },
    {
      title: 'Moments to Land',
      detail: beatHighlights.join(' → '),
    },
    {
      title: 'Sound Layering',
      detail: `Start with ${palette.sfxIntro.toLowerCase()}, pivot with ${palette.sfxTransition.toLowerCase()}, and resolve using ${palette.sfxCTA.toLowerCase()}.`,
    },
  ]
}

function toSeconds(value: number, _total: number, duration: number): number {
  return Math.round(value * duration * 10) / 10
}

function createTimeline(beats: ScriptBeat[], form: FormState, palette: (typeof tonePalettes)[ToneOption]): TimelineCue[] {
  let elapsed = 0
  return beats.map((beat) => {
    const start = toSeconds(elapsed, 1, form.duration)
    elapsed += beat.ratio
    const end = Math.min(form.duration, toSeconds(elapsed, 1, form.duration))

    const sfx =
      beat.id === 'hook'
        ? palette.sfxIntro
        : beat.id === 'cta'
          ? palette.sfxCTA
          : palette.sfxTransition

    const musicFocus =
      beat.id === 'story'
        ? 'Thin the bed and let the narrative breathe'
        : beat.id === 'solution'
          ? 'Layer rhythmic pulse or light percussion to lift energy'
          : 'Let the full motif ride, ride automation for dynamics'

    const mixNote = pickSeeded(palette.mixNotes, `${beat.id}-${form.musicMood}-${form.brandName}`)

    return {
      id: beat.id,
      label: beat.label,
      start,
      end,
      focus: beat.highlight,
      sfx,
      music: musicFocus,
      mixNote,
    }
  })
}

export function createSoundDesignPlan(form: FormState, beats: ScriptBeat[]): SoundDesignPlan {
  const palette = tonePalettes[form.tone]
  const music = musicPalette[form.musicMood]

  return {
    mood: `${form.musicMood} — ${palette.descriptor}`,
    tempo: music.tempo,
    instrumentation: music.instrumentation,
    voiceGuidance: `Voice talent: ${palette.voiceColor}. Support it with ${palette.musicTexture.toLowerCase()}.`,
    textureTips: music.textureTips,
    cues: createTimeline(beats, form, palette),
  }
}

export function htmlToPlainText(html: string): string {
  if (!html) return ''
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  return doc.body.textContent?.replace(/\s+\n/g, '\n').replace(/\n{2,}/g, '\n\n').trim() ?? ''
}

export function countWordsFromHtml(html: string): number {
  const text = htmlToPlainText(html)
  if (!text) return 0
  return text
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean).length
}

export function estimateDurationFromWords(words: number): number {
  if (!words) return 0
  const seconds = words / 2.5
  return Math.round(seconds)
}
