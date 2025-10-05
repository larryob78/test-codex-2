'use client';

import { useState } from 'react';
import { AiCopyRequestSchema, AiImageRequestSchema, AiVideoRequestSchema } from '@adtech/shared-types';

export default function CampaignCreator(): JSX.Element {
  const [name, setName] = useState('Demo campaign');
  const [copy, setCopy] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  async function handleGenerateCopy(): Promise<void> {
    const payload = AiCopyRequestSchema.parse({ productName: name, tone: 'friendly' });
    const res = await fetch('/api/ai/copy', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    setCopy(data.copy);
  }

  async function handleGenerateImage(): Promise<void> {
    const payload = AiImageRequestSchema.parse({ prompt: name });
    const res = await fetch('/api/ai/image', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    setImageUrl(data.url);
  }

  async function handleGenerateVideo(): Promise<void> {
    const payload = AiVideoRequestSchema.parse({ concept: name });
    const res = await fetch('/api/ai/video', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    setVideoUrl(data.url);
  }

  return (
    <div className="grid gap-4 rounded border border-slate-800 bg-slate-900 p-6">
      <label className="grid gap-2">
        <span className="text-sm text-slate-400">Campaign name</span>
        <input
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <button onClick={handleGenerateCopy} className="rounded bg-emerald-500 px-3 py-2 text-sm font-semibold text-white">
        Generate copy
      </button>
      {copy && <p className="rounded bg-slate-800 p-3 text-sm">{copy}</p>}
      <button onClick={handleGenerateImage} className="rounded bg-emerald-500 px-3 py-2 text-sm font-semibold text-white">
        Generate image
      </button>
      {imageUrl && <img src={imageUrl} alt="Generated creative" className="h-32 w-full rounded object-cover" />}
      <button onClick={handleGenerateVideo} className="rounded bg-emerald-500 px-3 py-2 text-sm font-semibold text-white">
        Generate teaser video
      </button>
      {videoUrl && (
        <video controls className="h-48 w-full rounded">
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
