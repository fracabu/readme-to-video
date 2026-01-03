'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link2, FileText, Sparkles, Loader2, Key, ChevronDown, ChevronUp, Save, AlertTriangle, Clock } from 'lucide-react';
import type { AIProvider, GenerateRequest, VideoQuality, UserApiKeys } from '@/types';
import { PROVIDER_INFO, AVAILABLE_MODELS, VIDEO_QUALITY_INFO } from '@/types';

const STORAGE_KEY = 'readme2video_api_keys';

interface InputSectionProps {
  onGenerate: (request: GenerateRequest) => Promise<void>;
  isLoading: boolean;
}

export function InputSection({ onGenerate, isLoading }: InputSectionProps) {
  const [source, setSource] = useState<'url' | 'text'>('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [style, setStyle] = useState<'tech' | 'minimal' | 'energetic'>('tech');
  const [duration, setDuration] = useState<15 | 30 | 60>(15);
  const [quality, setQuality] = useState<VideoQuality>('base');
  const [provider, setProvider] = useState<AIProvider>('openrouter');
  const [model, setModel] = useState<string>('');

  // BYOK: API Keys state - collapsed by default to save space
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [kieApiKey, setKieApiKey] = useState('');
  const [muxTokenId, setMuxTokenId] = useState('');
  const [muxTokenSecret, setMuxTokenSecret] = useState('');
  const [llmApiKey, setLlmApiKey] = useState('');
  const [saveKeys, setSaveKeys] = useState(true);
  const [keysLoaded, setKeysLoaded] = useState(false);

  // Load saved API keys from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const keys = JSON.parse(saved);
        if (keys.kieApiKey) setKieApiKey(keys.kieApiKey);
        if (keys.muxTokenId) setMuxTokenId(keys.muxTokenId);
        if (keys.muxTokenSecret) setMuxTokenSecret(keys.muxTokenSecret);
        if (keys.llmApiKey) setLlmApiKey(keys.llmApiKey);
      }
    } catch (e) {
      console.error('Failed to load saved API keys:', e);
    }
    setKeysLoaded(true);
  }, []);

  // Save API keys to localStorage when they change
  useEffect(() => {
    if (!keysLoaded) return; // Don't save before loading

    if (saveKeys) {
      const keys = { kieApiKey, muxTokenId, muxTokenSecret, llmApiKey };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [kieApiKey, muxTokenId, muxTokenSecret, llmApiKey, saveKeys, keysLoaded]);

  const handleSubmit = async () => {
    const content = source === 'url' ? url : text;
    if (!content.trim()) return;

    // Prepare API keys (all required for full BYOK)
    const apiKeys: UserApiKeys = {
      kieApiKey,
      muxTokenId,
      muxTokenSecret,
      llmApiKey,
    };

    await onGenerate({
      source,
      content,
      style,
      duration,
      quality,
      provider,
      model: model || undefined,
      apiKeys,
    });
  };

  // Validate API keys are provided (all required for full BYOK)
  const hasRequiredApiKeys = kieApiKey.trim().length > 0 &&
    muxTokenId.trim().length > 0 &&
    muxTokenSecret.trim().length > 0 &&
    llmApiKey.trim().length > 0;

  const isValid = (source === 'url' ? url.trim().length > 0 : text.trim().length > 0) && hasRequiredApiKeys;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-3">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          <span className="text-gradient">README</span>
          <span className="text-foreground">2Video</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Transform your GitHub README into a professional promo video
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Left Column: API Keys */}
        <div className="glass-card p-4">
          <button
            type="button"
            onClick={() => setShowApiKeys(!showApiKeys)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              <span className="font-semibold">API Keys</span>
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">BYOK</span>
              {hasRequiredApiKeys ? (
                <span className="text-xs text-green-500 font-medium">Ready</span>
              ) : (
                <span className="text-xs text-destructive font-medium">* Required</span>
              )}
            </div>
            {showApiKeys ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {showApiKeys && (
            <div className="mt-3 pt-3 border-t border-border space-y-3">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-sm">
                  Kie.ai API Key <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="password"
                  placeholder="Enter your Kie.ai API key"
                  value={kieApiKey}
                  onChange={(e) => setKieApiKey(e.target.value)}
                  className="font-mono h-9 text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  <a href="https://kie.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">kie.ai</a> - Sora 2 video
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-sm">
                    Mux Token ID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="password"
                    placeholder="Token ID"
                    value={muxTokenId}
                    onChange={(e) => setMuxTokenId(e.target.value)}
                    className="font-mono h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-sm">
                    Mux Secret <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="password"
                    placeholder="Token Secret"
                    value={muxTokenSecret}
                    onChange={(e) => setMuxTokenSecret(e.target.value)}
                    className="font-mono h-9 text-sm"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                <a href="https://dashboard.mux.com/settings/access-tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mux.com</a> - Video hosting
              </p>

              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-sm">
                  LLM API Key <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="password"
                  placeholder="OpenRouter / Anthropic / OpenAI / Gemini"
                  value={llmApiKey}
                  onChange={(e) => setLlmApiKey(e.target.value)}
                  className="font-mono h-9 text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">openrouter.ai</a> (free key, free models)
                </p>
              </div>

              {/* Save keys checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-border">
                <input
                  type="checkbox"
                  checked={saveKeys}
                  onChange={(e) => setSaveKeys(e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <Save className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Save keys locally</span>
              </label>
            </div>
          )}

          {!showApiKeys && !hasRequiredApiKeys && (
            <p className="text-xs text-muted-foreground mt-2">
              Click to configure your API keys
            </p>
          )}
        </div>

        {/* Right Column: Video Settings */}
        <div className="glass-card p-4 space-y-3">
          <Tabs value={source} onValueChange={(v) => setSource(v as 'url' | 'text')}>
            <TabsList className="grid w-full grid-cols-2 h-9">
              <TabsTrigger value="url" className="gap-1.5 text-sm">
                <Link2 className="w-3.5 h-3.5" />
                GitHub URL
              </TabsTrigger>
              <TabsTrigger value="text" className="gap-1.5 text-sm">
                <FileText className="w-3.5 h-3.5" />
                Paste README
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="mt-2">
              <Input
                placeholder="https://github.com/username/repository"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="font-mono h-9"
              />
            </TabsContent>

            <TabsContent value="text" className="mt-2">
              <Textarea
                placeholder="Paste your README.md content here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[60px] text-sm"
              />
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Style</Label>
              <Select value={style} onValueChange={(v) => setStyle(v as typeof style)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="energetic">Energetic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Duration</Label>
              <Select value={String(duration)} onValueChange={(v) => setDuration(Number(v) as 15 | 30 | 60)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15s</SelectItem>
                  <SelectItem value="30">30s</SelectItem>
                  <SelectItem value="60">60s</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Quality</Label>
              <Select value={quality} onValueChange={(v) => setQuality(v as VideoQuality)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(VIDEO_QUALITY_INFO).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      {info.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration info banner */}
          {duration === 60 && (
            <div className="flex items-start gap-2 p-2 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-amber-200">
                <strong>60s videos</strong> generate 4 scenes (~10-20 min). On free hosting they may timeout.
                For best results use <strong>15-30s</strong>, or run locally for 60s.
              </div>
            </div>
          )}

          {duration !== 60 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{duration === 15 ? '1 scene • ~2-5 min' : '2 scenes • ~5-10 min'}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">AI Provider</Label>
              <Select value={provider} onValueChange={(v) => {
                setProvider(v as AIProvider);
                setModel('');
              }}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PROVIDER_INFO).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      {info.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_MODELS[provider].map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <button
            className="pushable w-full"
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
          >
            <span className="shadow"></span>
            <span className="edge"></span>
            <span className="front font-mono uppercase tracking-wider w-full text-sm">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Video
                </>
              )}
            </span>
          </button>

          {!hasRequiredApiKeys && (
            <p className="text-xs text-center text-destructive">
              Configure API keys first
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
