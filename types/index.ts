// LLM Provider Types
export type AIProvider = 'anthropic' | 'openai' | 'openrouter' | 'gemini';

export interface AIProviderConfig {
  provider: AIProvider;
  model?: string;
  apiKey?: string;
}

// README Analysis
export interface ReadmeAnalysis {
  projectName: string;
  tagline: string;
  problem: string;
  solution: string;
  features: string[];
  techStack: string[];
  targetAudience: string;
}

// Video Script
export interface Scene {
  sceneNumber: number;
  duration: number;
  description: string; // Scene description in English
  narrationText?: string; // What the narrator says (for audio generation)
  prompt: string; // English prompt for Sora 2 (includes narration instructions)
}

export interface VideoScript {
  title: string;
  totalDuration: number;
  scenes: Scene[];
}

// Session Management
export type SessionStatus =
  | 'analyzing'
  | 'scripting'
  | 'generating'
  | 'finalizing'
  | 'ready'
  | 'error';

export type SceneStatus = 'pending' | 'generating' | 'ready' | 'failed';

export interface SceneProgress {
  sceneNumber: number;
  taskId: string;
  status: SceneStatus;
  videoUrl?: string;
}

export interface Session {
  id: string;
  status: SessionStatus;
  readme: string;
  analysis?: ReadmeAnalysis;
  script?: VideoScript;
  scenes: SceneProgress[];
  finalVideoUrl?: string;
  muxPlaybackId?: string;
  error?: string;
  createdAt: Date;
}

// API Request/Response Types
export type VideoQuality = 'base' | 'pro' | 'pro-hd';

// BYOK (Bring Your Own Keys) - User-provided API keys
export interface UserApiKeys {
  kieApiKey: string;
  muxTokenId: string;
  muxTokenSecret: string;
  llmApiKey: string; // Required: OpenRouter (free), Anthropic, OpenAI, or Gemini
}

export interface GenerateRequest {
  source: 'url' | 'text';
  content: string;
  style: 'tech' | 'minimal' | 'energetic';
  duration: 15 | 30 | 60;
  quality: VideoQuality;
  provider?: AIProvider;
  model?: string;
  // BYOK: User-provided API keys
  apiKeys: UserApiKeys;
}

export const VIDEO_QUALITY_INFO: Record<VideoQuality, { name: string; description: string; price: string }> = {
  'base': { name: 'Standard', description: '720p - Best value', price: '$0.15/scene' },
  'pro': { name: 'Pro', description: '720p enhanced', price: '$1.35/scene' },
  'pro-hd': { name: 'Pro HD', description: '1080p quality', price: '$3.15/scene' },
};

export interface GenerateResponse {
  sessionId: string;
  message: string;
}

// SSE Event Types
export interface SSEStatusEvent {
  step: SessionStatus;
  message: string;
}

export interface SSEScriptEvent {
  script: VideoScript;
}

export interface SSESceneEvent {
  sceneNumber: number;
  status: SceneStatus;
  videoUrl?: string;
}

export interface SSECompleteEvent {
  playbackId: string;
  streamUrl: string;
}

export interface SSEErrorEvent {
  message: string;
}

// Kie.ai Types
export interface KieTaskRequest {
  model: string;
  callBackUrl?: string;
  input: {
    prompt: string;
    aspect_ratio?: 'landscape' | 'portrait' | 'square';
    n_frames?: string;
    remove_watermark?: boolean;
  };
}

export interface KieTaskResponse {
  code: number;
  message: string;
  data: {
    taskId: string;
  };
}

export interface KieTaskStatus {
  code: number;
  message: string;
  data: {
    taskId: string;
    status: 'pending' | 'processing' | 'succeed' | 'failed';
    output?: {
      videoUrl?: string;
    };
    error?: string;
  };
}

export interface KieCallbackPayload {
  taskId: string;
  status: 'succeed' | 'failed';
  output?: {
    videoUrl?: string;
  };
  error?: string;
}

// Available Models
export const DEFAULT_MODELS: Record<AIProvider, string> = {
  anthropic: 'claude-sonnet-4-5-20250929',
  openai: 'gpt-5.2',
  openrouter: 'google/gemini-2.0-flash-exp:free',
  gemini: 'gemini-2.5-flash',
};

export const AVAILABLE_MODELS: Record<AIProvider, { id: string; name: string }[]> = {
  anthropic: [
    { id: 'claude-opus-4-5-20251124', name: 'Claude Opus 4.5' },
    { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5' },
    { id: 'claude-opus-4-1-20250805', name: 'Claude Opus 4.1' },
    { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4' },
  ],
  openai: [
    { id: 'gpt-5.2', name: 'GPT-5.2' },
    { id: 'gpt-5.1', name: 'GPT-5.1' },
    { id: 'gpt-5', name: 'GPT-5' },
    { id: 'gpt-4.1', name: 'GPT-4.1' },
    { id: 'o4-mini', name: 'o4-mini (Fast Reasoning)' },
  ],
  openrouter: [
    { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (FREE)' },
    { id: 'deepseek/deepseek-r1-0528:free', name: 'DeepSeek R1 (FREE)' },
    { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (FREE)' },
    { id: 'mistralai/devstral-2512:free', name: 'Devstral (FREE)' },
    { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
    { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
    { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4' },
    { id: 'anthropic/claude-opus-4', name: 'Claude Opus 4' },
    { id: 'openai/gpt-4o', name: 'GPT-4o' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini' },
    { id: 'deepseek/deepseek-v3.2', name: 'DeepSeek V3.2' },
    { id: 'meta-llama/llama-4-maverick', name: 'Llama 4 Maverick' },
  ],
  gemini: [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash Preview' },
    { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro Preview' },
  ],
};

export const PROVIDER_INFO: Record<AIProvider, { name: string; description: string }> = {
  anthropic: { name: 'Anthropic', description: 'Claude AI models' },
  openai: { name: 'OpenAI', description: 'GPT models' },
  openrouter: { name: 'OpenRouter', description: 'Multi-provider (includes free models)' },
  gemini: { name: 'Google', description: 'Gemini models' },
};
