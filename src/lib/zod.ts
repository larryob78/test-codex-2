import { z } from "zod";

export const rowSchema = z.object({
  title_text: z.string().min(1),
  subtitle_text: z.string().optional().default(""),
  body_text: z.string().optional().default(""),
  image_url: z.string().url().optional(),
  video_clip_url: z.string().url().optional(),
  logo_url: z.string().url().optional(),
  brand_color_hex: z.string().regex(/^#?[0-9A-Fa-f]{6}$/).optional(),
  music_url: z.string().url().optional(),
  duration_hint_seconds: z.coerce.number().int().positive().max(120).optional(),
  output_preset: z.enum(["1080x1920", "1920x1080"]).default("1080x1920")
});

export const csvRowSchema = rowSchema.strict();
