'use client';

import { useState } from 'react';
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
import { Link2, FileText, Sparkles, Loader2 } from 'lucide-react';
import type { AIProvider, GenerateRequest } from '@/types';
import { PROVIDER_INFO, AVAILABLE_MODELS } from '@/types';

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
  const [provider, setProvider] = useState<AIProvider>('openrouter');
  const [model, setModel] = useState<string>('');

  const handleSubmit = async () => {
    const content = source === 'url' ? url : text;
    if (!content.trim()) return;

    await onGenerate({
      source,
      content,
      style,
      duration,
      provider,
      model: model || undefined,
    });
  };

  const isValid = source === 'url' ? url.trim().length > 0 : text.trim().length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="text-gradient">README</span>
          <span className="text-foreground">2Video</span>
        </h1>
        <p className="text-muted-foreground">
          Transform your GitHub README into a professional promo video
        </p>
      </div>

      <div className="glass-card p-5 space-y-4">
        <Tabs value={source} onValueChange={(v) => setSource(v as 'url' | 'text')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url" className="gap-2">
              <Link2 className="w-4 h-4" />
              GitHub URL
            </TabsTrigger>
            <TabsTrigger value="text" className="gap-2">
              <FileText className="w-4 h-4" />
              Paste README
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="mt-3">
            <Input
              placeholder="https://github.com/username/repository"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="text-base font-mono"
            />
          </TabsContent>

          <TabsContent value="text" className="mt-3">
            <Textarea
              placeholder="Paste your README.md content here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px] text-base"
            />
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Style</Label>
            <Select value={style} onValueChange={(v) => setStyle(v as typeof style)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tech">Tech / Futuristic</SelectItem>
                <SelectItem value="minimal">Minimal / Clean</SelectItem>
                <SelectItem value="energetic">Energetic / Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Duration</Label>
            <Select value={String(duration)} onValueChange={(v) => setDuration(Number(v) as 15 | 30 | 60)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">~15 sec (1 scene)</SelectItem>
                <SelectItem value="30">~30 sec (2 scenes)</SelectItem>
                <SelectItem value="60">~60 sec (4 scenes)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-muted-foreground">AI Provider</Label>
            <Select value={provider} onValueChange={(v) => {
              setProvider(v as AIProvider);
              setModel(''); // Reset model when provider changes
            }}>
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label className="text-muted-foreground">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
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
          <span className="front font-mono uppercase tracking-wider w-full">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Video
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
