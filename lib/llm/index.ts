import type { AIProvider, ReadmeAnalysis, VideoScript } from '@/types';
import { AnthropicProvider } from './anthropic';
import { OpenAIProvider } from './openai';
import { GeminiProvider } from './gemini';
import { OpenRouterProvider } from './openrouter';

export interface ScriptOptions {
  style: 'tech' | 'minimal' | 'energetic';
  duration: 15 | 30 | 60;
}

export interface LLMProvider {
  analyzeReadme(readme: string): Promise<ReadmeAnalysis>;
  generateScript(analysis: ReadmeAnalysis, options: ScriptOptions): Promise<VideoScript>;
}

/**
 * Create an LLM provider instance
 * @param type - The provider type
 * @param model - Optional model override
 * @param apiKey - Optional user-provided API key (BYOK)
 */
export function createLLMProvider(type: AIProvider, model?: string, apiKey?: string): LLMProvider {
  switch (type) {
    case 'anthropic':
      return new AnthropicProvider(model, apiKey);
    case 'openai':
      return new OpenAIProvider(model, apiKey);
    case 'gemini':
      return new GeminiProvider(model, apiKey);
    case 'openrouter':
      return new OpenRouterProvider(model, apiKey);
    default:
      throw new Error(`Unknown provider: ${type}`);
  }
}

// Prompts for README analysis and script generation
export const ANALYZE_README_PROMPT = `Analyze this README and extract structured information for creating a promotional video.

Return a JSON object with this exact structure:
{
  "projectName": "Name of the project",
  "tagline": "A catchy one-line description (max 10 words)",
  "problem": "The problem this project solves (1-2 sentences)",
  "solution": "How the project solves it (1-2 sentences)",
  "features": ["Feature 1", "Feature 2", "Feature 3"] (max 5 key features),
  "techStack": ["Tech1", "Tech2"] (main technologies used),
  "targetAudience": "Who would benefit from this project"
}

Only return valid JSON, no markdown formatting or explanation.`;

export function getScriptGenerationPrompt(options: ScriptOptions): string {
  // Calculate number of scenes based on duration (15s per scene)
  const sceneDuration = 15;
  const numScenes = Math.ceil(options.duration / sceneDuration); // 2 scenes for 30s, 4 scenes for 60s

  const styleGuide = {
    tech: {
      visual: 'Dynamic tech-focused visuals: sleek interfaces on screens, futuristic holographic displays, abstract data visualizations, clean modern aesthetics with blue and purple tones.',
      narrator: 'A confident tech-savvy narrator with clear, enthusiastic voice explaining the app features.',
      audio: 'Modern electronic ambient music, subtle tech sound effects, keyboard clicks, notification sounds.'
    },
    minimal: {
      visual: 'Clean, minimalist visuals: bright white spaces, elegant smooth animations, soft gradients, calm and professional atmosphere.',
      narrator: 'A calm, professional narrator with warm, reassuring voice describing the simplicity and elegance.',
      audio: 'Soft piano or acoustic background music, gentle ambient sounds, peaceful atmosphere.'
    },
    energetic: {
      visual: 'Vibrant, high-energy visuals: bold colors, dynamic camera movements, exciting transitions, celebratory and inspiring atmosphere.',
      narrator: 'An energetic, excited narrator with dynamic voice showcasing amazing features.',
      audio: 'Upbeat electronic music, exciting sound effects, dynamic whooshes and impacts.'
    },
  };

  const style = styleGuide[options.style];

  // Build scene structure for JSON
  const sceneStructure = Array.from({ length: numScenes }, (_, i) => `    {
      "sceneNumber": ${i + 1},
      "duration": ${sceneDuration},
      "descriptionIt": "Descrizione in italiano di cosa accade nella scena ${i + 1}",
      "narrationText": "What the narrator says in scene ${i + 1} (2-3 sentences)",
      "prompt": "Detailed prompt for scene ${i + 1} with narration and audio"
    }`).join(',\n');

  // Define narrative arc based on number of scenes
  let narrativeArc: string;
  if (numScenes === 1) {
    narrativeArc = `Scene 1 (COMPLETE): Create a compelling 15-second overview that hooks attention, briefly introduces the problem, presents the app as the solution, and ends with a strong call-to-action. Pack maximum impact into this single scene.`;
  } else if (numScenes === 2) {
    narrativeArc = `Scene 1 (HOOK + PROBLEM): Grab attention, introduce the problem the app solves, show pain points.
Scene 2 (SOLUTION + CTA): Present the app as the solution, highlight key features, end with inspiring call-to-action.`;
  } else {
    narrativeArc = `Scene 1 (HOOK): Grab attention with a striking opening, introduce the core concept.
Scene 2 (PROBLEM): Present the problem/challenge that users face, build tension.
Scene 3 (SOLUTION): Introduce the app as the solution, show how it works visually.
Scene 4 (FEATURES + CTA): Highlight 2-3 key features, end with inspiring call-to-action and emotional payoff.`;
  }

  return `Create a promotional and explanatory video script based on the project analysis provided.

PURPOSE: Create a video that BOTH promotes the app AND explains its key features. The video must have:
1. A NARRATOR speaking throughout, explaining the app
2. Visual demonstrations of the concepts
3. Background music and sound effects
4. A clear NARRATIVE ARC across all scenes

Requirements:
- Create exactly ${numScenes} scenes (each ~${sceneDuration} seconds)
- Total duration: approximately ${options.duration} seconds
- Visual Style: ${style.visual}
- Narration Style: ${style.narrator}
- Audio Atmosphere: ${style.audio}

NARRATIVE ARC (follow this structure):
${narrativeArc}

Return a JSON object with this exact structure:
{
  "title": "Video title",
  "totalDuration": ${options.duration},
  "scenes": [
${sceneStructure}
  ]
}

CRITICAL - Each scene's prompt MUST include these AUDIO elements:
1. A NARRATOR/PRESENTER describing the app (describe their voice, tone, what they're saying)
2. Background MUSIC style (electronic, orchestral, ambient, etc.) - CONSISTENT across all scenes
3. Sound EFFECTS that match the visuals (clicks, whooshes, notifications, etc.)

Example prompt structure:
"A professional narrator with a warm, confident voice explains [concept] while [visual description]. The narrator says: '[actual narration text]'. Background features [music type] with [sound effects]. Camera [movement]. Lighting is [description]."

IMPORTANT for multi-scene coherence:
- Use the SAME narrator voice style across all scenes
- Keep the SAME music style/mood throughout (builds intensity toward the end)
- Each scene should flow naturally into the next
- The narration should tell a COMPLETE STORY across all scenes
- Visual style should be consistent but each scene has unique content

For each prompt:
- Be specific and descriptive (80-120 words)
- ALWAYS include narrator speaking and what they say
- Include camera movement (slow zoom, pan, tracking shot)
- Describe lighting and atmosphere
- Specify the music mood and sound effects
- Do NOT include on-screen text or typography
- Use abstract/metaphorical visuals to represent app concepts

CRITICAL - Content Policy (to avoid AI video generation rejection):
- NEVER mention brand names, company names, or product names in visuals
- NEVER reference copyrighted characters, logos, or intellectual property
- NEVER describe specific real-world products or interfaces
- Use generic terms: "smartphone" not "iPhone", "laptop" not "MacBook"
- The narrator CAN mention the app name, but visuals must be abstract
- Avoid references to movies, games, TV shows, or celebrities
- Use generic descriptions: "developer working", "abstract data flow", "futuristic dashboard"

Only return valid JSON, no markdown formatting or explanation.`;
}
