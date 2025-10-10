# Broadcast Blueprint Studio

Broadcast Blueprint Studio is a focused workspace for crafting copyright-safe radio spots in the 10, 15, 20, 30, 40, 50, and 60
second formats. Feed the experience a client, brand, desired air date, duration, and creative direction — the app builds a
script blueprint, pacing prompts, sound design cues, and an ElevenLabs hand-off so you can move from copy to audio quickly.

## Highlights

- ✍️ **Full script workspace** – Generate a beat-by-beat script, edit it inline with a lightweight rich-text toolbar, and keep an
eyes-on runtime estimate as you tweak copy.
- 🧭 **Creative guidance** – Automatic ideas for tone, pacing, and listener focus tailored to the selected duration and tone.
- 🔊 **Sound & music planning** – A production-ready timeline that calls out SFX moves, music textures, and mix notes matched to
the selected tone and music mood.
- 🎙️ **ElevenLabs bridge** – Paste an API key and voice ID to request an MP3 preview directly from ElevenLabs or grab the
pre-built cURL command for a DAW-friendly workflow.

## Getting started

```bash
# install dependencies
npm install

# start the development server
npm run dev

# create a production build
npm run build
```

The dev server will print a local URL (default `http://localhost:5173`).

## ElevenLabs integration

The ElevenLabs panel is optional. If you provide an API key and voice ID, the app POSTs the current script to the
`/v1/text-to-speech/{voiceId}` endpoint using the `eleven_turbo_v2` model and your requested voice settings. Successful
responses stream back as an MP3 preview that can be played or downloaded. Errors (authentication, rate limits, etc.) are
surfaced in the UI so you can retry without losing your script.

If you prefer to run requests outside the browser, expand **Command-line handoff** to copy a ready-to-run `curl` snippet with
your current script preview and tuning values.

## Project structure

- `src/App.tsx` – Main layout, campaign form, runtime estimator, and wiring between the editor, idea prompts, and sound design
modules.
- `src/components/ScriptEditor.tsx` – Content-editable script surface with formatting shortcuts for SFX, music, and voice cues.
- `src/components/SoundDesignPanel.tsx` – Sound palette, ElevenLabs controls, and timeline display.
- `src/utils/scriptGenerator.ts` – Deterministic script, idea, and sound design generation utilities.

## Notes

- Clipboard access requires a secure context. If you run into a “Clipboard unavailable” message, select the script area and use
`⌘/Ctrl + C` manually.
- The ElevenLabs request will fail without valid credentials; the panel keeps the error message visible so you can adjust values
and retry instantly.
- All copy is generated locally — there are no third-party AI calls in the script generation process.
