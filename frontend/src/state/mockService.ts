import { ProjectDetail, ProjectSummary, Frame, Generation, GenerationSettingsInput, VideoProvider } from './types';

interface MockDatabase {
  projects: ProjectDetail[];
  generations: Record<string, Generation[]>;
  videoProviders: VideoProvider[];
}

const STORAGE_KEY = 'storyboard-ai-mock-db';

const deepClone = <T>(value: T): T => {
  if (typeof globalThis !== 'undefined' && 'structuredClone' in globalThis) {
    return (globalThis as typeof globalThis & { structuredClone: <U>(input: U) => U }).structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
};

const iso = (value: string) => new Date(value).toISOString();

const defaultDatabase: MockDatabase = {
  projects: [
    {
      id: 'demo-reel',
      name: 'Skyward Launch Storyboard',
      description: 'High-energy visual development boards for a sci-fi product reveal trailer.',
      default_prompts: {
        black_and_white: {
          base: 'Cinematic storyboard sketch, graphite pencil on textured paper, dramatic lighting, expressive linework, dynamic perspective, production-ready keyframe, moody shadows, film noir sensibility.',
          user_customization: 'Focus on gesture clarity and leading lines that guide the viewer through the action beat.',
        },
        color: {
          base: 'Stylized cinematic concept art, volumetric lighting, vibrant color script, atmospheric depth, high-end animation still, painterly textures, story-driven composition.',
          user_customization: 'Emphasize neon accents and warm rim light to accent hero moments.',
        },
      },
      frames: [
        {
          id: 'frame-1',
          project_id: 'demo-reel',
          frame_number: 1,
          prompt:
            'The hero surveys the city from a rain-slick rooftop as neon billboards pulse in the distance, cloak whipping in the wind.',
          sketch: {
            image_url: 'https://placehold.co/640x360/020617/38bdf8?text=Sketch+1',
            file_name: 'frame-1-sketch.png',
            uploaded_at: iso('2024-02-05T09:00:00Z'),
          },
          metadata: {
            scene: 'Opening Vista',
            notes: 'Maintain wide lens energy with slow push-in.',
          },
          selected_characters: ['character-nova'],
          selected_locations: ['location-rooftop'],
          selected_props: ['prop-hoverboard'],
          confirmed_image_url: 'https://placehold.co/640x360/0ea5e9/020617?text=Confirmed+Color',
          confirmed_type: 'color',
          confirmed_generation_id: 'gen-color-1',
        },
        {
          id: 'frame-2',
          project_id: 'demo-reel',
          frame_number: 2,
          prompt: 'Close-up on the hero activating a holographic wrist console while rain beads catch the blue light.',
          sketch: {
            image_url: 'https://placehold.co/640x360/020617/7dd3fc?text=Sketch+2',
            file_name: 'frame-2-sketch.png',
            uploaded_at: iso('2024-02-06T15:30:00Z'),
          },
          metadata: {
            scene: 'Mission Briefing',
            notes: 'Highlight hologram glow and reflective rain details.',
          },
          selected_characters: ['character-nova'],
          selected_locations: ['location-command'],
          selected_props: ['prop-console'],
          confirmed_image_url: 'https://placehold.co/640x360/1e293b/d1d5db?text=Confirmed+B%26W',
          confirmed_type: 'blackAndWhite',
          confirmed_generation_id: 'gen-bw-2',
        },
        {
          id: 'frame-3',
          project_id: 'demo-reel',
          frame_number: 3,
          prompt: 'Dynamic chase through aerial traffic as the hero dives between hovering cargo skiffs.',
          sketch: {
            image_url: 'https://placehold.co/640x360/020617/64748b?text=Sketch+3',
            file_name: 'frame-3-sketch.png',
            uploaded_at: iso('2024-02-08T11:10:00Z'),
          },
          metadata: {
            scene: 'Skyway Pursuit',
            notes: 'Use dutch angle and motion blur streaks.',
          },
          selected_characters: ['character-nova', 'character-drone'],
          selected_locations: ['location-skyway'],
          selected_props: ['prop-hoverboard'],
          confirmed_image_url: null,
          confirmed_type: null,
          confirmed_generation_id: null,
        },
      ],
      characters: [
        {
          id: 'character-nova',
          project_id: 'demo-reel',
          name: 'Nova Reyes',
          description: 'Agile pilot leading the launch mission; expressive eyes and confident posture.',
          consistency_prompt: 'Keep Nova in a tactical flight suit with teal accents and short windswept hair.',
          reference_images: ['https://placehold.co/120x160/0f172a/38bdf8?text=Nova+Ref'],
        },
        {
          id: 'character-drone',
          project_id: 'demo-reel',
          name: 'Scout Drone',
          description: 'Companion drone with adaptive LED faceplate and collapsible wings.',
          reference_images: ['https://placehold.co/120x160/1e293b/7dd3fc?text=Drone+Ref'],
        },
      ],
      locations: [
        {
          id: 'location-rooftop',
          project_id: 'demo-reel',
          name: 'Neon Rooftop',
          description: 'Rain-slick rooftop dotted with antenna arrays and holo-billboards.',
          type: 'Exterior',
          reference_images: ['https://placehold.co/160x120/0f172a/38bdf8?text=Rooftop'],
        },
        {
          id: 'location-command',
          project_id: 'demo-reel',
          name: 'Command Balcony',
          description: 'Elevated command balcony overlooking the launch bay.',
          type: 'Interior',
          reference_images: ['https://placehold.co/160x120/1e293b/7dd3fc?text=Command'],
        },
        {
          id: 'location-skyway',
          project_id: 'demo-reel',
          name: 'Skyway Corridor',
          description: 'High-speed air lane lined with cargo skiffs and neon signage.',
          type: 'Exterior',
          reference_images: ['https://placehold.co/160x120/020617/7dd3fc?text=Skyway'],
        },
      ],
      props: [
        {
          id: 'prop-hoverboard',
          project_id: 'demo-reel',
          name: 'Mag-Glide Board',
          description: 'Compact hoverboard with retractable fins and ion thrusters.',
          category: 'Vehicle',
          reference_image: 'https://placehold.co/160x120/0f172a/38bdf8?text=Board',
        },
        {
          id: 'prop-console',
          project_id: 'demo-reel',
          name: 'Holo Console',
          description: 'Wearable holographic interface projected from wrist gauntlet.',
          category: 'Gadget',
          reference_image: 'https://placehold.co/160x120/1e293b/7dd3fc?text=Console',
        },
      ],
      updated_at: iso('2024-02-12T14:30:00Z'),
    },
  ],
  generations: {
    'frame-1': [
      {
        id: 'gen-color-1',
        frame_id: 'frame-1',
        image_url: 'https://placehold.co/1280x720/0ea5e9/020617?text=Color+Keyframe',
        thumbnail_url: 'https://placehold.co/320x180/0ea5e9/020617?text=Color',
        type: 'color',
        prompt:
          'Hero on rain-soaked rooftop at night, neon reflections, sweeping cinematic lighting, volumetric atmosphere, ultrawide lens.',
        settings: {
          mode: 'highFidelity',
          iterations: 4,
          style_strength: 80,
          prompt_weight: 90,
          aspect_ratio: '16:9',
          seed: 1042,
        },
        is_confirmed: true,
      },
      {
        id: 'gen-bw-1',
        frame_id: 'frame-1',
        image_url: 'https://placehold.co/1280x720/1f2937/d1d5db?text=B%26W+Concept',
        thumbnail_url: 'https://placehold.co/320x180/1f2937/d1d5db?text=B%26W',
        type: 'blackAndWhite',
        prompt: 'Noir storyboard sketch of hero overlooking neon city, bold chiaroscuro lighting.',
        settings: {
          mode: 'turbo',
          iterations: 3,
          style_strength: 65,
          prompt_weight: 70,
          aspect_ratio: '16:9',
          seed: 782,
        },
        is_confirmed: false,
      },
    ],
    'frame-2': [
      {
        id: 'gen-bw-2',
        frame_id: 'frame-2',
        image_url: 'https://placehold.co/1280x720/0b1120/d1d5db?text=Story+Beat',
        thumbnail_url: 'https://placehold.co/320x180/0b1120/d1d5db?text=Beat',
        type: 'blackAndWhite',
        prompt: 'Close-up storyboard sketch, rain droplets refracting holographic light, cinematic focus falloff.',
        settings: {
          mode: 'turbo',
          iterations: 3,
          style_strength: 68,
          prompt_weight: 75,
          aspect_ratio: '16:9',
          seed: 334,
        },
        is_confirmed: true,
      },
    ],
    'frame-3': [
      {
        id: 'gen-color-3a',
        frame_id: 'frame-3',
        image_url: 'https://placehold.co/1280x720/38bdf8/020617?text=Action+Beat',
        thumbnail_url: 'https://placehold.co/320x180/38bdf8/020617?text=Action',
        type: 'color',
        prompt: 'Hero weaving through neon traffic, motion blur streaks, cinematic camera tilt, vibrant palette.',
        settings: {
          mode: 'highFidelity',
          iterations: 3,
          style_strength: 82,
          prompt_weight: 88,
          aspect_ratio: '16:9',
          seed: 920,
        },
        is_confirmed: false,
      },
    ],
  },
  videoProviders: [
    {
      id: 'flux-motion',
      name: 'Flux Motion Studio',
      description: 'Fast previz diffusion tuned for interactive storyboards and animatics.',
      supported_capabilities: ['Storyboard Import', 'Camera Pathing', 'Text-to-Motion'],
      max_duration_seconds: 8,
    },
    {
      id: 'aurora-cinematics',
      name: 'Aurora Cinematics',
      description: 'High-fidelity motion diffusion for hero shots and marketing beats.',
      supported_capabilities: ['4K Output', 'Character Consistency', 'Color Script Sync'],
      max_duration_seconds: 12,
    },
  ],
};

let memoryDatabase: MockDatabase = deepClone(defaultDatabase);

const loadDatabase = (): MockDatabase => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return deepClone(memoryDatabase);
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryDatabase));
    return deepClone(memoryDatabase);
  }

  try {
    const parsed = JSON.parse(raw) as MockDatabase;
    memoryDatabase = parsed;
    return deepClone(parsed);
  } catch (error) {
    console.warn('Failed to parse storyboard mock database, restoring defaults.', error);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryDatabase));
    return deepClone(memoryDatabase);
  }
};

const saveDatabase = (database: MockDatabase) => {
  memoryDatabase = deepClone(database);
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryDatabase));
};

const ensureFrameContext = (database: MockDatabase, frameId: string) => {
  for (const project of database.projects) {
    const frame = project.frames.find((item) => item.id === frameId);
    if (frame) {
      return { project, frame } as { project: ProjectDetail; frame: Frame };
    }
  }

  return null;
};

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `id-${Math.random().toString(16).slice(2)}`;
};

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

export const ensureMockData = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  if (!window.localStorage.getItem(STORAGE_KEY)) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryDatabase));
  }
};

export const listProjectSummaries = async (): Promise<ProjectSummary[]> => {
  await delay();
  const database = loadDatabase();

  return database.projects
    .slice()
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      frames: project.frames.map((frame) => frame.id),
      updated_at: project.updated_at,
    }));
};

export const getProjectDetail = async (projectId: string): Promise<ProjectDetail> => {
  await delay();
  const database = loadDatabase();
  const project = database.projects.find((item) => item.id === projectId);

  if (!project) {
    throw new Error('Project not found');
  }

  return deepClone(project);
};

export const listGenerations = async (frameId: string): Promise<Generation[]> => {
  await delay();
  const database = loadDatabase();
  const items = database.generations[frameId] ?? [];
  return deepClone(items);
};

export const createFrame = async (projectId: string): Promise<Frame> => {
  await delay();
  const database = loadDatabase();
  const project = database.projects.find((item) => item.id === projectId);

  if (!project) {
    throw new Error('Project not found');
  }

  const newFrame: Frame = {
    id: createId(),
    project_id: projectId,
    frame_number: project.frames.length + 1,
    prompt: 'Describe the action in the scene.',
    sketch: {},
    metadata: {
      scene: 'New Story Beat',
      notes: '',
    },
    selected_characters: [],
    selected_locations: [],
    selected_props: [],
    confirmed_image_url: null,
    confirmed_type: null,
    confirmed_generation_id: null,
  };

  project.frames.push(newFrame);
  database.generations[newFrame.id] = [];
  project.updated_at = new Date().toISOString();

  saveDatabase(database);
  return deepClone(newFrame);
};

export const generateForFrame = async (
  frameId: string,
  settings: GenerationSettingsInput,
): Promise<Generation> => {
  await delay(320);
  const database = loadDatabase();
  const context = ensureFrameContext(database, frameId);

  if (!context) {
    throw new Error('Frame not found');
  }

  const { frame, project } = context;
  const mode = settings.mode;
  const iterations = settings.iterations ?? (mode === 'turbo' ? 4 : 2);
  const type = mode === 'highFidelity' ? 'color' : 'blackAndWhite';
  const seed = Math.floor(Math.random() * 10000);
  const encodedLabel = encodeURIComponent(`${type === 'color' ? 'Color' : 'B&W'} Draft ${seed}`);
  const imageUrl =
    type === 'color'
      ? `https://placehold.co/1280x720/0ea5e9/020617?text=${encodedLabel}`
      : `https://placehold.co/1280x720/1f2937/d1d5db?text=${encodedLabel}`;

  const generation: Generation = {
    id: createId(),
    frame_id: frameId,
    image_url: imageUrl,
    type,
    prompt:
      type === 'color'
        ? `High fidelity color render for frame ${frame.frame_number}, neon accents and cinematic depth.`
        : `Graphite storyboard pass for frame ${frame.frame_number}, bold contrast and clean silhouettes.`,
    settings: {
      mode,
      iterations,
      style_strength: mode === 'turbo' ? 65 : 80,
      prompt_weight: mode === 'turbo' ? 72 : 88,
      aspect_ratio: '16:9',
      seed,
    },
    is_confirmed: false,
  };

  if (!database.generations[frameId]) {
    database.generations[frameId] = [];
  }

  database.generations[frameId].unshift(generation);
  project.updated_at = new Date().toISOString();

  saveDatabase(database);
  return deepClone(generation);
};

export const confirmGeneration = async (generationId: string): Promise<Generation> => {
  await delay(220);
  const database = loadDatabase();
  let matchedGeneration: Generation | null = null;
  let matchedFrameId: string | null = null;

  for (const [frameId, items] of Object.entries(database.generations)) {
    const match = items.find((item) => item.id === generationId);
    if (match) {
      matchedGeneration = match;
      matchedFrameId = frameId;
      match.is_confirmed = true;
      break;
    }
  }

  if (!matchedGeneration || !matchedFrameId) {
    throw new Error('Generation not found');
  }

  const context = ensureFrameContext(database, matchedFrameId);
  if (context) {
    context.frame.confirmed_image_url = matchedGeneration.image_url;
    context.frame.confirmed_type = matchedGeneration.type;
    context.frame.confirmed_generation_id = matchedGeneration.id;
    context.project.updated_at = new Date().toISOString();
  }

  saveDatabase(database);
  return deepClone(matchedGeneration);
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read sketch file'));
    reader.readAsDataURL(file);
  });

export const uploadSketch = async (projectId: string, frameId: string, file: File): Promise<Frame> => {
  await delay(260);
  const database = loadDatabase();
  const fileData = await readFileAsDataUrl(file);
  const project = database.projects.find((item) => item.id === projectId);

  if (!project) {
    throw new Error('Project not found');
  }

  const frame = project.frames.find((item) => item.id === frameId);

  if (!frame) {
    throw new Error('Frame not found');
  }

  frame.sketch = {
    image_url: fileData,
    file_name: file.name,
    uploaded_at: new Date().toISOString(),
  };

  project.updated_at = new Date().toISOString();
  saveDatabase(database);

  return deepClone(frame);
};

export const listVideoProviders = async (): Promise<VideoProvider[]> => {
  await delay();
  const database = loadDatabase();
  return deepClone(database.videoProviders);
};
