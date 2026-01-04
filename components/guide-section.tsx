'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  HelpCircle,
  X,
  Sparkles,
  Video,
  Bot,
  DollarSign,
  Clock,
  Zap,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function GuideButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {mounted && isOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/70 overflow-y-auto"
          onClick={() => setIsOpen(false)}
        >
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="shrink-0 bg-background border-b border-border p-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-lg font-aldrich font-bold tracking-wide flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Guide & Pricing
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-muted rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto">
              {/* How it works - full width */}
              <div className="mb-4">
                <Section title="How it works" icon={<Zap className="w-4 h-4" />}>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                    {[
                      { step: '1', title: 'API Keys', desc: 'Configure keys' },
                      { step: '2', title: 'README', desc: 'Paste URL/text' },
                      { step: '3', title: 'Settings', desc: 'Style & quality' },
                      { step: '4', title: 'Generate', desc: 'AI creates video' },
                      { step: '5', title: 'Share', desc: 'Get Mux link' },
                    ].map((item) => (
                      <div key={item.step} className="p-2 rounded-lg bg-muted/30 text-center">
                        <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center mx-auto mb-1">{item.step}</div>
                        <div className="font-medium text-xs">{item.title}</div>
                        <div className="text-muted-foreground text-xs">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>

              {/* Two column layout */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Section title="Duration & Scenes" icon={<Clock className="w-4 h-4" />}>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="p-2 rounded-lg bg-muted/50 text-center">
                        <div className="font-bold">15s</div>
                        <div className="text-muted-foreground text-xs">1 scene</div>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50 text-center">
                        <div className="font-bold">30s</div>
                        <div className="text-muted-foreground text-xs">2 scenes</div>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                        <div className="font-bold text-amber-400">60s</div>
                        <div className="text-amber-300/70 text-xs">4 scenes</div>
                      </div>
                    </div>
                  </Section>

                  <Section title="Video Quality" icon={<Video className="w-4 h-4" />}>
                    <div className="space-y-1.5 text-sm">
                      <PriceRow name="Standard" desc="720p" price="$0.15" />
                      <PriceRow name="Pro" desc="720p+" price="$1.35" highlight />
                      <PriceRow name="Pro HD" desc="1080p" price="$3.15" />
                    </div>
                  </Section>

                  <Section title="Example Cost" icon={<DollarSign className="w-4 h-4" />}>
                    <div className="bg-muted/30 rounded-lg p-2 text-sm">
                      <div className="font-medium mb-1 text-xs">30s video (Standard):</div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>LLM + Video + Mux</span>
                        <span className="font-medium text-foreground">~$0.31</span>
                      </div>
                    </div>
                  </Section>
                </div>

                <div className="space-y-4">
                  <Section title="LLM Providers" icon={<Bot className="w-4 h-4" />}>
                    <div className="space-y-1.5 text-sm">
                      <ProviderRow name="OpenRouter" desc="FREE models" url="https://openrouter.ai/keys" free />
                      <ProviderRow name="Gemini" desc="Flash/Pro" url="https://aistudio.google.com/apikey" />
                      <ProviderRow name="Anthropic" desc="Claude" url="https://console.anthropic.com" />
                      <ProviderRow name="OpenAI" desc="GPT-4o" url="https://platform.openai.com/api-keys" />
                    </div>
                  </Section>

                  <Section title="Mux Hosting" icon={<Sparkles className="w-4 h-4" />}>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex justify-between"><span>Encoding</span><span>~$0.015/min</span></div>
                      <div className="flex justify-between"><span>Storage</span><span>Free 10GB</span></div>
                      <div className="flex justify-between"><span>Streaming</span><span>Pay per view</span></div>
                    </div>
                    <a href="https://dashboard.mux.com/settings/access-tokens" target="_blank" className="text-xs text-primary hover:underline mt-2 inline-block">
                      Get credentials →
                    </a>
                  </Section>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-3 flex items-center justify-between bg-muted/30 hover:bg-muted/50">
        <div className="flex items-center gap-2 font-aldrich font-medium tracking-wide">{icon}{title}</div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && <div className="p-3">{children}</div>}
    </div>
  );
}

function PriceRow({ name, desc, price, highlight }: { name: string; desc: string; price: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between p-2 rounded-lg ${highlight ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'}`}>
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <div className="font-mono font-bold">{price}<span className="text-xs font-normal text-muted-foreground">/scene</span></div>
    </div>
  );
}

function ProviderRow({ name, desc, url, free }: { name: string; desc: string; url: string; free?: boolean }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
      <div>
        <div className="font-medium flex items-center gap-2">
          {name}
          {free && <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">FREE</span>}
        </div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <a href={url} target="_blank" className="text-primary hover:underline text-xs flex items-center gap-1">
        Get key <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
