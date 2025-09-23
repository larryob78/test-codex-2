export const API_BASE_URL = typeof __API_BASE_URL__ !== 'undefined' ? __API_BASE_URL__ : 'http://localhost:4000';

export async function generateCreatives(payload) {
  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail.error || 'Failed to generate creative.');
  }

  return response.json();
}

export async function fetchPresets() {
  const response = await fetch(`${API_BASE_URL}/api/presets`);
  if (!response.ok) {
    throw new Error('Unable to load size presets.');
  }
  return response.json();
}
