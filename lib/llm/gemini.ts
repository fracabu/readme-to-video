import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ReadmeAnalysis, VideoScript } from '@/types';
import type { LLMProvider, ScriptOptions } from './index';
import { ANALYZE_README_PROMPT, getScriptGenerationPrompt } from './index';

export class GeminiProvider implements LLMProvider {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor(model?: string, apiKey?: string) {
    const key = apiKey || process.env.GOOGLE_AI_API_KEY;
    if (!key) {
      throw new Error('Google AI API key is required');
    }
    this.genAI = new GoogleGenerativeAI(key);
    this.modelName = model || 'gemini-2.5-flash';
  }

  async analyzeReadme(readme: string): Promise<ReadmeAnalysis> {
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: ANALYZE_README_PROMPT,
    });

    const result = await model.generateContent(readme);
    const response = result.response;
    const text = response.text();

    try {
      return JSON.parse(text) as ReadmeAnalysis;
    } catch {
      throw new Error('Failed to parse README analysis response');
    }
  }

  async generateScript(
    analysis: ReadmeAnalysis,
    options: ScriptOptions
  ): Promise<VideoScript> {
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: getScriptGenerationPrompt(options),
    });

    const result = await model.generateContent(JSON.stringify(analysis, null, 2));
    const response = result.response;
    const text = response.text();

    try {
      return JSON.parse(text) as VideoScript;
    } catch {
      throw new Error('Failed to parse video script response');
    }
  }
}
