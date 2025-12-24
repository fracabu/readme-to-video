import OpenAI from 'openai';
import type { ReadmeAnalysis, VideoScript } from '@/types';
import type { LLMProvider, ScriptOptions } from './index';
import { ANALYZE_README_PROMPT, getScriptGenerationPrompt } from './index';

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;
  private model: string;

  constructor(model?: string) {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = model || 'gpt-5.2';
  }

  async analyzeReadme(readme: string): Promise<ReadmeAnalysis> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: 2048,
      messages: [
        { role: 'system', content: ANALYZE_README_PROMPT },
        { role: 'user', content: readme },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    try {
      return JSON.parse(content) as ReadmeAnalysis;
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
      max_tokens: 4096,
      messages: [
        { role: 'system', content: getScriptGenerationPrompt(options) },
        { role: 'user', content: JSON.stringify(analysis, null, 2) },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    try {
      return JSON.parse(content) as VideoScript;
    } catch {
      throw new Error('Failed to parse video script response');
    }
  }
}
