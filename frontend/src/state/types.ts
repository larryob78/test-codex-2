export interface ProjectSummary {
  id: string;
  name: string;
  description?: string;
  frames?: string[];
  updated_at: string;
}

export interface Frame {
  id: string;
  project_id: string;
  frame_number: number;
  prompt: string;
  sketch?: {
    image_url?: string | null;
    file_name?: string | null;
    uploaded_at?: string | null;
  };
  metadata: {
    scene?: string;
    take?: number;
    notes?: string;
  };
  selected_characters?: string[];
  selected_locations?: string[];
  selected_props?: string[];
  confirmed_image_url?: string | null;
  confirmed_type?: 'blackAndWhite' | 'color' | null;
  confirmed_generation_id?: string | null;
}

export interface PromptTemplate {
  base: string;
  user_customization: string;
}

export interface DefaultPrompts {
  black_and_white: PromptTemplate;
  color: PromptTemplate;
}

export interface Character {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  consistency_prompt?: string;
  reference_images: string[];
}

export interface Location {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  type?: string;
  consistency_prompt?: string;
  reference_images: string[];
}

export interface Prop {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  category?: string;
  consistency_prompt?: string;
  reference_image?: string | null;
}

export interface GenerationSettingsInput {
  mode: 'turbo' | 'highFidelity' | 'confirmed';
  iterations?: number;
}

export interface Generation {
  id: string;
  frame_id: string;
  image_url: string;
  thumbnail_url?: string;
  type: 'blackAndWhite' | 'color';
  prompt: string;
  settings: {
    mode: string;
    iterations: number;
    style_strength: number;
    prompt_weight: number;
    aspect_ratio: string;
    seed?: number | null;
  };
  is_confirmed: boolean;
}

export interface ProjectDetail {
  id: string;
  name: string;
  description?: string;
  default_prompts: DefaultPrompts;
  frames: Frame[];
  characters: Character[];
  locations: Location[];
  props: Prop[];
  updated_at: string;
}

export interface VideoProvider {
  id: string;
  name: string;
  description: string;
  supported_capabilities: string[];
  max_duration_seconds: number;
}

export interface VideoGenerationJob {
  id: string;
  project_id: string;
  provider_id: string;
  prompt: string;
  aspect_ratio: string;
  status: string;
  preview_url?: string;
  created_at: string;
  updated_at: string;
}
