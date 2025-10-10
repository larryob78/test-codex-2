export type ToneOption =
  | 'Bright & Friendly'
  | 'Confident & Bold'
  | 'Warm Storytelling'
  | 'High-Energy Promo'
  | 'Calm & Reassuring'

export type MusicMoodOption =
  | 'Warm Acoustic Glow'
  | 'Upbeat Indie Pop'
  | 'Minimal Electro Pulse'
  | 'Bold Modern Rock'
  | 'Cinematic Lift'

export interface FormState {
  clientName: string
  brandName: string
  campaignDate: string
  duration: number
  tone: ToneOption
  objective: string
  keyOffer: string
  callToAction: string
  targetAudience: string
  musicMood: MusicMoodOption
}

export interface ScriptBeat {
  id: string
  label: string
  content: string
  ratio: number
  pace: 'relaxed' | 'steady' | 'energetic'
  highlight: string
}

export interface IdeaPrompt {
  title: string
  detail: string
}

export interface TimelineCue {
  id: string
  label: string
  start: number
  end: number
  focus: string
  sfx: string
  music: string
  mixNote: string
}

export interface SoundDesignPlan {
  mood: string
  tempo: string
  instrumentation: string[]
  voiceGuidance: string
  textureTips: string[]
  cues: TimelineCue[]
}
