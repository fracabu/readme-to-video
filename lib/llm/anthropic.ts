import Anthropic from '@anthropic-ai/sdk';
import type { ReadmeAnalysis, VideoScript, DEFAULT_MODELS } from '@/types';
import type { LLMProvider, ScriptOptions } from './index';
import { ANALYZE_README_PROMPT, getScriptGenerationPrompt } from './index';

export class AnthropicProvider implements LLMProvider {
  private client: Anthropic;
  private model: string;

  constructor(model?: string) {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.model = model || 'claude-sonnet-4-5-20250929';
  }

  async analyzeReadme(readme: string): Promise<ReadmeAnalysis> {
    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 2048,
      system: ANALYZE_README_PROMPT,
      messages: [
        {
          role: 'user',
          content: readme,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic');
    }

    try {
      return JSON.parse(content.text) as ReadmeAnalysis;
    } catch {
      throw new Error('Failed to parse README analysis response');
    }
  }

  async generateScript(
    analysis: ReadmeAnalysis,
    options: ScriptOptions
  ): Promise<VideoScript> {
    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: getScriptGenerationPrompt(options),
      messages: [
        {
          role: 'user',
          content: JSON.stringify(analysis, null, 2),
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic');
    }

    try {
      return JSON.parse(content.text) as VideoScript;
    } catch {
      throw new Error('Failed to parse video script response');
    }
  }
}
