import OpenAI from 'openai';
import type { ReadmeAnalysis, VideoScript } from '@/types';
import type { LLMProvider, ScriptOptions } from './index';
import { ANALYZE_README_PROMPT, getScriptGenerationPrompt } from './index';

export class OpenRouterProvider implements LLMProvider {
  private client: OpenAI;
  private model: string;

  constructor(model?: string, apiKey?: string) {
    // Use provided API key or fall back to env var (for free models)
    const key = apiKey || process.env.OPENROUTER_API_KEY;
    if (!key) {
      throw new Error('OpenRouter API key is required');
    }
    this.client = new OpenAI({
      apiKey: key,
      baseURL: 'https://openrouter.ai/api/v1',
    });
    this.model = model || 'google/gemini-2.0-flash-exp:free';
  }

  async analyzeReadme(readme: string): Promise<ReadmeAnalysis> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: ANALYZE_README_PROMPT },
        { role: 'user', content: readme },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenRouter');
    }

    try {
      // Handle potential markdown code blocks in response
      const jsonContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      return JSON.parse(jsonContent) as ReadmeAnalysis;
    } catch {
      throw new Error('Failed to parse README analysis response');
    }
  }

  async generateScript(
    analysis: ReadmeAnalysis,
    options: ScriptOptions
  ): Promise<VideoScript> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: 8192,
      messages: [
        { role: 'system', content: getScriptGenerationPrompt(options) },
        { role: 'user', content: JSON.stringify(analysis, null, 2) },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenRouter');
    }

    try {
      // Handle potential markdown code blocks in response
      const jsonContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      return JSON.parse(jsonContent) as VideoScript;
    } catch {
      throw new Error('Failed to parse video script response');
    }
  }
}
