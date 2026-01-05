'use client';

import { useState } from 'react';
import { InputSection } from '@/components/input-section';
import { ProgressSection } from '@/components/progress-section';
import { ResultSection } from '@/components/result-section';
import { GuideButton } from '@/components/guide-section';
import { ApiKeysButton } from '@/components/api-keys-button';
import { FloatingParticles } from '@/components/animated-loader';
import { Github, AlertCircle, ExternalLink, Video, Sparkles, Bot, Heart } from 'lucide-react';
import type { GenerateRequest } from '@/types';

type AppState = 'input' | 'processing' | 'result' | 'error';

const NEON_COLORS = [
  'from-primary to-orange-500',           // default
  'from-[hsl(145,100%,50%)] to-[hsl(180,100%,50%)]',  // green-cyan
  'from-[hsl(300,100%,60%)] to-[hsl(330,100%,60%)]',  // magenta-pink
  'from-[hsl(210,100%,60%)] to-[hsl(180,100%,50%)]',  // blue-cyan
];

export default function Home() {
  const [state, setState] = useState<AppState>('input');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [playbackId, setPlaybackId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logoColorIndex, setLogoColorIndex] = useState(0);
  const [logoSpin, setLogoSpin] = useState(false);

  const handleLogoClick = () => {
    setLogoSpin(true);
    setLogoColorIndex((prev) => (prev + 1) % NEON_COLORS.length);
    setTimeout(() => setLogoSpin(false), 500);
  };

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
    <main className="min-h-screen flex flex-col relative">
      {/* Animated gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-3xl animate-blob"
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-orange-500/15 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-primary/10 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: '4s' }}
        />
      </div>
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo: click for Easter egg! */}
            <button
              onClick={handleLogoClick}
              className={`logo-3d w-14 h-14 rounded-full border-2 border-primary/40 flex items-center justify-center hover:border-primary ${logoSpin ? 'animate-spin' : ''}`}
              style={{
                boxShadow: '0 4px 15px rgba(0,0,0,0.3), 0 8px 25px rgba(255,107,53,0.2), inset 0 -2px 5px rgba(0,0,0,0.2)',
              }}
              title="Click me!"
            >
              <div
                className={`w-11 h-11 bg-gradient-to-br ${NEON_COLORS[logoColorIndex]} rounded-full flex items-center justify-center transition-all duration-300`}
                style={{
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                <div
                  className="w-[31px] h-[31px] bg-background flex items-center justify-center"
                  style={{
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4), inset 0 -1px 3px rgba(255,255,255,0.1)',
                  }}
                >
                  <span className="text-primary font-aldrich text-[10px] font-bold drop-shadow-[0_0_3px_rgba(255,107,53,0.5)]">R2V</span>
                </div>
              </div>
            </button>
            <span className="font-aldrich text-lg tracking-wide hidden sm:inline">
              <span className="text-foreground uppercase">README</span>
              <span className="text-primary">2</span>
              <span className="text-primary lowercase">video</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ApiKeysButton />
            <GuideButton />
            <a
              href="https://github.com/fracabu/readme-to-video"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-5 h-5 hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </header>

      {/* Animated floating particles - behind content */}
      <FloatingParticles />

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-4 md:py-8 flex items-start md:items-center justify-center overflow-y-auto relative z-10">
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
      <footer className="fixed bottom-0 left-0 right-0 border-t border-border/50 py-2 z-10 bg-background/90 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-aldrich flex-wrap px-4">
          <span className="flex items-center gap-1">
            Developed with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by
          </span>
          <a href="https://github.com/fracabu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors">
            <Github className="w-3 h-3" /> fracabu
          </a>
          <span>&</span>
          <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors">
            <Bot className="w-3 h-3" /> Claude
          </a>
          <span className="text-border">|</span>
          <span>Powered by</span>
          <a href="https://mux.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors">
            <Video className="w-3 h-3" /> Mux
          </a>
          <a href="https://kie.ai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors">
            <Sparkles className="w-3 h-3" /> Kie AI
          </a>
          <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors">
            <Bot className="w-3 h-3" /> OpenRouter
          </a>
        </div>
      </footer>
    </main>
  );
}
