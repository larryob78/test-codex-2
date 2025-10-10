import { useMemo, useState } from 'react'
import './App.css'
import { ScriptEditor } from './components/ScriptEditor'
import { SoundDesignPanel } from './components/SoundDesignPanel'
import type { FormState, IdeaPrompt, MusicMoodOption, ScriptBeat, ToneOption } from './types'
import {
  countWordsFromHtml,
  createIdeaPrompts,
  createScriptBeats,
  createSoundDesignPlan,
  estimateDurationFromWords,
  htmlToPlainText,
} from './utils/scriptGenerator'

const toneOptions: ToneOption[] = [
  'Bright & Friendly',
  'Confident & Bold',
  'Warm Storytelling',
  'High-Energy Promo',
  'Calm & Reassuring',
]

const musicOptions: MusicMoodOption[] = [
  'Warm Acoustic Glow',
  'Upbeat Indie Pop',
  'Minimal Electro Pulse',
  'Bold Modern Rock',
  'Cinematic Lift',
]

const durationOptions = [10, 15, 20, 30, 40, 50, 60]

const buildInitialForm = (): FormState => ({
  clientName: '',
  brandName: '',
  campaignDate: new Date().toISOString().slice(0, 10),
  duration: 30,
  tone: 'Bright & Friendly',
  objective: 'share something unforgettable',
  keyOffer: 'an exclusive moment your listeners can act on',
  callToAction: '',
  targetAudience: 'listeners',
  musicMood: 'Warm Acoustic Glow',
})

function App() {
  const [form, setForm] = useState<FormState>(() => buildInitialForm())
  const [scriptHtml, setScriptHtml] = useState('')
  const [scriptBeats, setScriptBeats] = useState<ScriptBeat[]>([])
  const [ideas, setIdeas] = useState<IdeaPrompt[]>([])
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const [lastGeneratedAt, setLastGeneratedAt] = useState<Date | null>(null)
  const [soundPlan, setSoundPlan] = useState<ReturnType<typeof createSoundDesignPlan> | null>(null)

  const wordCount = useMemo(() => countWordsFromHtml(scriptHtml), [scriptHtml])
  const estimatedSeconds = useMemo(() => estimateDurationFromWords(wordCount), [wordCount])
  const plainText = useMemo(() => htmlToPlainText(scriptHtml), [scriptHtml])
  const targetWordGoal = Math.round(form.duration * 2.5)

  const pacingDelta = estimatedSeconds ? form.duration - estimatedSeconds : form.duration

  const handleFormChange = <Key extends keyof FormState>(key: Key, value: FormState[Key]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const resetWorkspace = () => {
    setForm(buildInitialForm())
    setScriptHtml('')
    setScriptBeats([])
    setIdeas([])
    setSoundPlan(null)
    setCopyStatus(null)
    setLastGeneratedAt(null)
  }

  const handleGenerateScript = () => {
    const beats = createScriptBeats(form)
    setScriptBeats(beats)
    const html = beats
      .map(
        (beat) => `
          <section class="script-beat" data-beat="${beat.id}">
            <header>
              <h3>${beat.label}</h3>
              <span class="beat-meta">${Math.round(beat.ratio * 100)}% • ${beat.pace}</span>
            </header>
            ${beat.content}
          </section>
        `,
      )
      .join('')
    setScriptHtml(html)
    const promptIdeas = createIdeaPrompts(form, beats)
    setIdeas(promptIdeas)
    const plan = createSoundDesignPlan(form, beats)
    setSoundPlan(plan)
    setLastGeneratedAt(new Date())
    setCopyStatus(null)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plainText)
      setCopyStatus('Script copied to clipboard')
      setTimeout(() => setCopyStatus(null), 2200)
    } catch (error) {
      console.error('Clipboard unavailable', error)
      setCopyStatus('Clipboard unavailable. Press ⌘/Ctrl + A, then copy manually.')
    }
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <span className="badge">Radio builder</span>
          <h1>Broadcast Blueprint Studio</h1>
          <p>
            Generate polished 10–60 second radio spots with a creative blueprint, sonic guidance, and an
            ElevenLabs-ready handoff — all in one beautiful workspace.
          </p>
        </div>
        <button type="button" className="primary-button hero-action" onClick={handleGenerateScript}>
          Generate script
        </button>
      </header>

      <main className="layout-grid">
        <div className="left-column">
          <section className="panel">
            <header className="panel-header">
              <div>
                <h2>Campaign inputs</h2>
                <p className="panel-subtitle">Tell the studio who we’re speaking for and how long we have.</p>
              </div>
            </header>
            <div className="form-grid">
              <label>
                <span>Client name</span>
                <input
                  type="text"
                  value={form.clientName}
                  onChange={(event) => handleFormChange('clientName', event.target.value)}
                  placeholder="Production company or agency partner"
                />
              </label>
              <label>
                <span>Brand name</span>
                <input
                  type="text"
                  value={form.brandName}
                  onChange={(event) => handleFormChange('brandName', event.target.value)}
                  placeholder="What brand is on-air?"
                />
              </label>
              <label>
                <span>Target air date</span>
                <input
                  type="date"
                  value={form.campaignDate}
                  onChange={(event) => handleFormChange('campaignDate', event.target.value)}
                />
              </label>
              <label>
                <span>Audience focus</span>
                <input
                  type="text"
                  value={form.targetAudience}
                  onChange={(event) => handleFormChange('targetAudience', event.target.value)}
                  placeholder="e.g. busy parents, morning commuters"
                />
              </label>
              <label>
                <span>Campaign goal</span>
                <input
                  type="text"
                  value={form.objective}
                  onChange={(event) => handleFormChange('objective', event.target.value)}
                  placeholder="e.g. drive in-store visits"
                />
              </label>
              <label>
                <span>Key offer or proof</span>
                <input
                  type="text"
                  value={form.keyOffer}
                  onChange={(event) => handleFormChange('keyOffer', event.target.value)}
                  placeholder="Limited-time upgrade, free trial, expert guidance..."
                />
              </label>
              <label className="full-width">
                <span>Call to action</span>
                <input
                  type="text"
                  value={form.callToAction}
                  onChange={(event) => handleFormChange('callToAction', event.target.value)}
                  placeholder="Visit brand.com, text keyword, stop by the studio..."
                />
              </label>
              <label>
                <span>Script tone</span>
                <select value={form.tone} onChange={(event) => handleFormChange('tone', event.target.value as ToneOption)}>
                  {toneOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Music energy</span>
                <select
                  value={form.musicMood}
                  onChange={(event) => handleFormChange('musicMood', event.target.value as MusicMoodOption)}
                >
                  {musicOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <fieldset className="duration-fieldset">
              <legend>Duration</legend>
              <div className="duration-options">
                {durationOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={option === form.duration ? 'duration-button duration-button--active' : 'duration-button'}
                    onClick={() => handleFormChange('duration', option)}
                  >
                    {option}s
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="panel-actions">
              <button type="button" className="primary-button" onClick={handleGenerateScript}>
                Build script structure
              </button>
              <button type="button" className="ghost-button" onClick={resetWorkspace}>
                Reset form
              </button>
            </div>
          </section>

          <section className="panel">
            <header className="panel-header">
              <div>
                <h2>Creative guardrails</h2>
                <p className="panel-subtitle">Quick prompts to keep the copy sharp and on-brand.</p>
              </div>
            </header>
            {ideas.length ? (
              <ul className="idea-list">
                {ideas.map((idea) => (
                  <li key={idea.title}>
                    <h3>{idea.title}</h3>
                    <p>{idea.detail}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">Generate a script to receive pacing, tone, and sound cues.</p>
            )}
          </section>

          <section className="panel">
            <header className="panel-header">
              <div>
                <h2>Structure timeline</h2>
                <p className="panel-subtitle">Understand where each beat lands before you record.</p>
              </div>
            </header>
            {scriptBeats.length ? (
              <ol className="beat-list">
                {scriptBeats.map((beat) => (
                  <li key={beat.id}>
                    <header>
                      <span className="beat-title">{beat.label}</span>
                      <span className="beat-duration">{Math.round(beat.ratio * form.duration)}s focus</span>
                    </header>
                    <p className="beat-highlight">{beat.highlight}</p>
                    <div className="beat-preview" dangerouslySetInnerHTML={{ __html: beat.content }} />
                  </li>
                ))}
              </ol>
            ) : (
              <p className="empty-state">Build a script to visualise the hook, story, solution, and CTA beats.</p>
            )}
          </section>
        </div>

        <div className="right-column">
          <ScriptEditor
            value={scriptHtml}
            onChange={setScriptHtml}
            onCopy={handleCopy}
            wordCount={wordCount}
            estimatedSeconds={estimatedSeconds || form.duration}
            lastGeneratedAt={lastGeneratedAt}
          />
          {copyStatus ? <p className="copy-status">{copyStatus}</p> : null}
          <div className="runtime-card">
            <h3>Runtime check</h3>
            <p>
              Target: <strong>{form.duration}s</strong> ({targetWordGoal} words) · Current script:{' '}
              <strong>{estimatedSeconds || 0}s</strong>
            </p>
            <p className={pacingDelta >= 0 ? 'runtime-success' : 'runtime-warning'}>
              {pacingDelta >= 0
                ? `${pacingDelta.toFixed(1)}s of headroom for dramatic pauses and SFX.`
                : `${Math.abs(pacingDelta).toFixed(1)}s over target — tighten language or trim a beat.`}
            </p>
          </div>
          <SoundDesignPanel plan={soundPlan} scriptText={plainText} />
        </div>
      </main>
    </div>
  )
}

export default App
