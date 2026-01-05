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
import { Link2, FileText, Sparkles, Loader2, AlertTriangle, Clock, Key } from 'lucide-react';
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

  // API Keys from localStorage
  const [apiKeys, setApiKeys] = useState<UserApiKeys>({
    kieApiKey: '',
    muxTokenId: '',
    muxTokenSecret: '',
    llmApiKey: '',
  });
  const [keysLoaded, setKeysLoaded] = useState(false);

  // Load API keys from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const keys = JSON.parse(saved);
        setApiKeys({
          kieApiKey: keys.kieApiKey || '',
          muxTokenId: keys.muxTokenId || '',
          muxTokenSecret: keys.muxTokenSecret || '',
          llmApiKey: keys.llmApiKey || '',
        });
      }
    } catch (e) {
      console.error('Failed to load API keys:', e);
    }
    setKeysLoaded(true);
  }, []);

  // Listen for localStorage changes (when user updates keys in the modal)
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const keys = JSON.parse(saved);
          setApiKeys({
            kieApiKey: keys.kieApiKey || '',
            muxTokenId: keys.muxTokenId || '',
            muxTokenSecret: keys.muxTokenSecret || '',
            llmApiKey: keys.llmApiKey || '',
          });
        }
      } catch (e) {
        console.error('Failed to load API keys:', e);
      }
    };

    // Check for changes periodically (storage event doesn't fire in same tab)
    const interval = setInterval(handleStorageChange, 1000);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleSubmit = async () => {
    const content = source === 'url' ? url : text;
    if (!content.trim()) return;

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

  // Validate API keys are provided
  const hasRequiredApiKeys =
    apiKeys.kieApiKey.trim().length > 0 &&
    apiKeys.muxTokenId.trim().length > 0 &&
    apiKeys.muxTokenSecret.trim().length > 0 &&
    apiKeys.llmApiKey.trim().length > 0;

  const hasContent = source === 'url' ? url.trim().length > 0 : text.trim().length > 0;
  const isValid = hasContent && hasRequiredApiKeys;

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-4">
        <h1 className="text-2xl md:text-3xl font-aldrich tracking-wide mb-1">
          <span className="text-foreground">README</span>
          <span className="text-primary">2Video</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Transform your GitHub README into a professional promo video
        </p>
      </div>

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
              className="min-h-[80px] text-sm"
            />
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
          <p className="text-xs text-center text-destructive flex items-center justify-center gap-1">
            <Key className="w-3 h-3" />
            Click the key icon in header to configure API keys
          </p>
        )}
      </div>
    </div>
  );
}
