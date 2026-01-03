'use client';

import { useState } from 'react';
import { InputSection } from '@/components/input-section';
import { ProgressSection } from '@/components/progress-section';
import { ResultSection } from '@/components/result-section';
import { Github, AlertCircle, ExternalLink, Video, Sparkles, Bot } from 'lucide-react';
import type { GenerateRequest } from '@/types';

type AppState = 'input' | 'processing' | 'result' | 'error';

export default function Home() {
  const [state, setState] = useState<AppState>('input');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [playbackId, setPlaybackId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (request: GenerateRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to start generation');
      }

      const data = await response.json();
      setSessionId(data.sessionId);
      setState('processing');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setState('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = (id: string) => {
    setPlaybackId(id);
    setState('result');
  };

  const handleError = (message: string) => {
    setError(message);
    setState('error');
  };

  const handleReset = () => {
    setState('input');
    setSessionId(null);
    setPlaybackId(null);
    setError(null);
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo: circle outside, square cutout inside with R2V */}
            <div className="w-14 h-14 rounded-full border-2 border-primary/40 flex items-center justify-center">
              <div className="w-11 h-11 bg-gradient-to-br from-primary to-orange-500 rounded-full flex items-center justify-center">
                <div className="w-[31px] h-[31px] bg-background flex items-center justify-center">
                  <span className="text-primary font-bold text-xs font-mono">R2V</span>
                </div>
              </div>
            </div>
            <span className="font-bold tracking-tight">README2Video</span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-4 md:py-8 flex items-start md:items-center justify-center overflow-y-auto">
        {state === 'input' && (
          <InputSection onGenerate={handleGenerate} isLoading={isLoading} />
        )}

        {state === 'processing' && sessionId && (
          <ProgressSection
            sessionId={sessionId}
            onComplete={handleComplete}
            onError={handleError}
          />
        )}

        {state === 'result' && playbackId && (
          <ResultSection playbackId={playbackId} onReset={handleReset} />
        )}

        {state === 'error' && (
          <div className="w-full max-w-2xl mx-auto">
            <div className="glass-card p-8 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
              <h2 className="text-xl font-semibold">Something went wrong</h2>
              <p className="text-muted-foreground">{error}</p>
              <button
                onClick={handleReset}
                className="text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-3">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground space-y-2">
          <p className="flex items-center justify-center gap-1">
            Developed with love by{' '}
            <a
              href="https://github.com/fracabu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-foreground font-medium hover:text-primary transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              fracabu
            </a>
            {' '}&amp;{' '}
            <span className="inline-flex items-center gap-1 text-foreground font-medium">
              <Bot className="w-3.5 h-3.5" />
              Claude Opus 4.5
            </span>
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span>Powered by</span>
            <a
              href="https://mux.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-foreground font-medium hover:text-primary transition-colors"
            >
              <Video className="w-3.5 h-3.5" />
              Mux
            </a>
            <a
              href="https://kie.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-foreground font-medium hover:text-primary transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Kie AI Sora 2
            </a>
            <a
              href="https://openrouter.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-foreground font-medium hover:text-primary transition-colors"
            >
              <Bot className="w-3.5 h-3.5" />
              OpenRouter
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
