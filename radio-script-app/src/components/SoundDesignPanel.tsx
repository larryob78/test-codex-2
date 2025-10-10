import { useEffect, useMemo, useState } from 'react'
import type { SoundDesignPlan } from '../types'

interface SoundDesignPanelProps {
  plan: SoundDesignPlan | null
  scriptText: string
}

export function SoundDesignPanel({ plan, scriptText }: SoundDesignPanelProps) {
  const [apiKey, setApiKey] = useState('')
  const [voiceId, setVoiceId] = useState('')
  const [stability, setStability] = useState(0.45)
  const [style, setStyle] = useState(0.3)
  const [similarityBoost, setSimilarityBoost] = useState(0.75)
  const [useSpeakerBoost, setUseSpeakerBoost] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const scriptPreview = useMemo(() => {
    if (!scriptText) return ''
    const collapsed = scriptText.replace(/\s+/g, ' ').trim()
    return collapsed.length > 260 ? `${collapsed.slice(0, 260)}…` : collapsed
  }, [scriptText])

  const curlSnippet = useMemo(() => {
    const voice = voiceId || '<voice-id>'
    const keyPlaceholder = apiKey ? '<your-api-key>' : 'YOUR_API_KEY'
    const text = scriptPreview || '<your-script-text>'
    return [
      `curl -X POST https://api.elevenlabs.io/v1/text-to-speech/${voice} \\`,
      `  -H 'xi-api-key: ${keyPlaceholder}' \\`,
      `  -H 'Content-Type: application/json' \\`,
      `  -H 'Accept: audio/mpeg' \\`,
      `  -d '{`,
      `    "text": "${text.replace(/"/g, '\\"')}",`,
      `    "model_id": "eleven_turbo_v2",`,
      `    "voice_settings": {`,
      `      "stability": ${stability.toFixed(2)},`,
      `      "similarity_boost": ${similarityBoost.toFixed(2)},`,
      `      "style": ${style.toFixed(2)},`,
      `      "use_speaker_boost": ${useSpeakerBoost}`,
      `    }`,
      `  }`,
    ].join('\n')
  }, [apiKey, voiceId, scriptPreview, stability, similarityBoost, style, useSpeakerBoost])

  const handleGeneratePreview = async () => {
    if (!voiceId) {
      setError('Provide an ElevenLabs voice ID to generate audio.')
      return
    }
    if (!apiKey) {
      setError('An ElevenLabs API key is required to request audio.')
      return
    }
    if (!scriptText) {
      setError('Generate a script before requesting an audio preview.')
      return
    }

    setIsLoading(true)
    setError(null)
    setAudioUrl(null)

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: scriptText,
          model_id: 'eleven_turbo_v2',
          voice_settings: {
            stability,
            similarity_boost: similarityBoost,
            style,
            use_speaker_boost: useSpeakerBoost,
          },
          generation_config: {
            chunk_length_schedule: [120, 180, 220],
          },
        }),
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Voice generation request failed')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  return (
    <section className="panel sound-design-panel">
      <header className="panel-header">
        <div>
          <h2>Sound design & ElevenLabs handoff</h2>
          <p className="panel-subtitle">
            Shape the audio blueprint and send it straight into an ElevenLabs workflow.
          </p>
        </div>
      </header>

      {plan ? (
        <div className="sound-plan-grid">
          <div className="sound-card">
            <h3>Music direction</h3>
            <p className="sound-highlight">{plan.mood}</p>
            <p className="sound-tempo">{plan.tempo}</p>
            <ul>
              {plan.instrumentation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="sound-card">
            <h3>Voice guidance</h3>
            <p>{plan.voiceGuidance}</p>
            <h4>Texture moves</h4>
            <ul>
              {plan.textureTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
          <div className="sound-card sound-card--timeline">
            <h3>Timeline cues</h3>
            <ul className="timeline-list">
              {plan.cues.map((cue) => (
                <li key={cue.id}>
                  <div className="timeline-row">
                    <span className="timeline-time">
                      {cue.start.toFixed(1)}s – {cue.end.toFixed(1)}s
                    </span>
                    <span className="timeline-label">{cue.label}</span>
                  </div>
                  <p className="timeline-focus">{cue.focus}</p>
                  <p className="timeline-detail">
                    <strong>SFX:</strong> {cue.sfx}
                  </p>
                  <p className="timeline-detail">
                    <strong>Music:</strong> {cue.music}
                  </p>
                  <p className="timeline-detail mix-note">
                    <strong>Mix:</strong> {cue.mixNote}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="empty-state">Generate a script to unlock the sound design roadmap.</p>
      )}

      <div className="elevenlabs-panel">
        <h3>ElevenLabs preview</h3>
        <p className="panel-subtitle">
          Paste your secure API key and a voice ID to request a private MP3 preview directly from ElevenLabs.
        </p>
        <div className="form-grid">
          <label>
            <span>API key</span>
            <input
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value.trim())}
              placeholder="sk_..."
              autoComplete="off"
            />
          </label>
          <label>
            <span>Voice ID</span>
            <input
              type="text"
              value={voiceId}
              onChange={(event) => setVoiceId(event.target.value.trim())}
              placeholder="e.g. 21m00Tcm4TlvDq8ikWAM"
            />
          </label>
          <label>
            <span>Stability</span>
            <input
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={stability}
              onChange={(event) => setStability(Number(event.target.value))}
            />
          </label>
          <label>
            <span>Style</span>
            <input
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={style}
              onChange={(event) => setStyle(Number(event.target.value))}
            />
          </label>
          <label>
            <span>Similarity boost</span>
            <input
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={similarityBoost}
              onChange={(event) => setSimilarityBoost(Number(event.target.value))}
            />
          </label>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={useSpeakerBoost}
              onChange={(event) => setUseSpeakerBoost(event.target.checked)}
            />
            <span>Use speaker boost</span>
          </label>
        </div>
        <button type="button" className="primary-button" onClick={handleGeneratePreview} disabled={isLoading}>
          {isLoading ? 'Requesting preview…' : 'Generate ElevenLabs preview'}
        </button>
        {error ? <p className="error-text">{error}</p> : null}
        {audioUrl ? (
          <div className="audio-preview">
            <audio controls src={audioUrl} />
            <button
              type="button"
              className="ghost-button"
              onClick={() => {
                if (!audioUrl) return
                const link = document.createElement('a')
                link.href = audioUrl
                link.download = 'radio-script-preview.mp3'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }}
            >
              Download MP3
            </button>
          </div>
        ) : null}
        <details className="curl-block">
          <summary>Command-line handoff</summary>
          <pre>
            <code>{curlSnippet}</code>
          </pre>
        </details>
      </div>
    </section>
  )
}

export default SoundDesignPanel
