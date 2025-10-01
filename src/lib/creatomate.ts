import axios from "axios";

const CM_BASE = "https://api.creatomate.com/v1";

export type RenderPayload = {
  template_id: string,
  modifications: Record<string, unknown>,
  output_format?: string,
  watermark?: unknown,
  callback_url?: string
};

export async function creatomateRender(payload: RenderPayload, apiKey = process.env.CREATOMATE_API_KEY as string) {
  if (!apiKey) throw new Error("Missing CREATOMATE_API_KEY");
  const { data } = await axios.post(`${CM_BASE}/renders`, payload, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  return data as { id: string };
}

export async function getRender(id: string, apiKey = process.env.CREATOMATE_API_KEY as string) {
  if (!apiKey) throw new Error("Missing CREATOMATE_API_KEY");
  const { data } = await axios.get(`${CM_BASE}/renders/${id}`, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  return data as { id: string, status: string, url?: string, error?: string };
}
