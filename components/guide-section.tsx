'use client';

import { useState } from 'react';
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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center hover:bg-primary/30 transition-colors"
        aria-label="Help & Guide"
      >
        <HelpCircle className="w-5 h-5 text-primary" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-background border border-border rounded-xl shadow-2xl">
            <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Guide & Pricing
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-muted rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* How it works */}
              <Section title="How it works" icon={<Zap className="w-4 h-4" />}>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li><strong className="text-foreground">Enter API Keys</strong> - Configure your Kie.ai, Mux, and LLM keys (saved locally)</li>
                  <li><strong className="text-foreground">Paste README</strong> - GitHub URL or raw markdown text</li>
                  <li><strong className="text-foreground">Choose Settings</strong> - Style, duration, quality, AI provider</li>
                  <li><strong className="text-foreground">Generate</strong> - AI analyzes README → creates script → generates video scenes</li>
                  <li><strong className="text-foreground">Share</strong> - Get your Mux streaming link or embed code</li>
                </ol>
              </Section>

              {/* Duration & Scenes */}
              <Section title="Duration & Scenes" icon={<Clock className="w-4 h-4" />}>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <div className="font-bold text-foreground">15s</div>
                    <div className="text-muted-foreground text-xs">1 scene</div>
                    <div className="text-muted-foreground text-xs">~2-5 min</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <div className="font-bold text-foreground">30s</div>
                    <div className="text-muted-foreground text-xs">2 scenes</div>
                    <div className="text-muted-foreground text-xs">~5-10 min</div>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                    <div className="font-bold text-amber-400">60s</div>
                    <div className="text-amber-300/70 text-xs">4 scenes</div>
                    <div className="text-amber-300/70 text-xs">~10-20 min</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong className="text-amber-400">Note:</strong> 60s videos work best when running locally.
                  Free hosting (Render/Vercel) may timeout during long generations.
                </p>
              </Section>

              {/* Video Quality & Pricing */}
              <Section title="Video Quality (Kie.ai Sora 2)" icon={<Video className="w-4 h-4" />}>
                <div className="space-y-2 text-sm">
                  <PriceRow
                    name="Standard"
                    desc="720p base quality"
                    price="$0.15"
                    perScene
                  />
                  <PriceRow
                    name="Pro"
                    desc="720p enhanced"
                    price="$1.35"
                    perScene
                    highlight
                  />
                  <PriceRow
                    name="Pro HD"
                    desc="1080p quality"
                    price="$3.15"
                    perScene
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Get your API key at{' '}
                  <a href="https://kie.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    kie.ai <ExternalLink className="w-3 h-3 inline" />
                  </a>
                </p>
              </Section>

              {/* LLM Providers */}
              <Section title="LLM Providers" icon={<Bot className="w-4 h-4" />}>
                <div className="space-y-2 text-sm">
                  <ProviderRow
                    name="OpenRouter"
                    desc="Multi-provider, includes FREE models"
                    free
                    url="https://openrouter.ai/keys"
                  />
                  <ProviderRow
                    name="Google Gemini"
                    desc="Gemini 2.5 Flash/Pro"
                    url="https://aistudio.google.com/apikey"
                  />
                  <ProviderRow
                    name="Anthropic"
                    desc="Claude Sonnet/Opus"
                    url="https://console.anthropic.com"
                  />
                  <ProviderRow
                    name="OpenAI"
                    desc="GPT-4o/4o-mini"
                    url="https://platform.openai.com/api-keys"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong className="text-green-400">Tip:</strong> Use OpenRouter with free models (Gemini 2.0 Flash, Llama 3.3) for $0 LLM cost!
                </p>
              </Section>

              {/* Mux */}
              <Section title="Video Hosting (Mux)" icon={<Sparkles className="w-4 h-4" />}>
                <p className="text-sm text-muted-foreground">
                  Mux provides professional video streaming with adaptive bitrate.
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• <strong className="text-foreground">Encoding:</strong> ~$0.015/min</li>
                  <li>• <strong className="text-foreground">Streaming:</strong> Pay per view</li>
                  <li>• <strong className="text-foreground">Storage:</strong> Free for first 10GB</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  Get credentials at{' '}
                  <a href="https://dashboard.mux.com/settings/access-tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    mux.com <ExternalLink className="w-3 h-3 inline" />
                  </a>
                </p>
              </Section>

              {/* Cost Example */}
              <Section title="Example Costs" icon={<DollarSign className="w-4 h-4" />}>
                <div className="bg-muted/30 rounded-lg p-3 text-sm">
                  <div className="font-medium text-foreground mb-2">30s video (Standard quality):</div>
                  <ul className="space-y-1 text-muted-foreground text-xs">
                    <li>• LLM (OpenRouter free): <span className="text-green-400">$0.00</span></li>
                    <li>• Video (2 scenes × $0.15): <span className="text-foreground">$0.30</span></li>
                    <li>• Mux encoding (~30s): <span className="text-foreground">~$0.01</span></li>
                    <li className="pt-1 border-t border-border font-medium text-foreground">
                      Total: ~$0.31
                    </li>
                  </ul>
                </div>
              </Section>

              {/* BYOK */}
              <Section title="About BYOK" icon={<HelpCircle className="w-4 h-4" />}>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Bring Your Own Keys (BYOK)</strong> means you use your own API keys.
                  Your keys are saved only in your browser's local storage - never sent to our servers for storage.
                  You pay directly to each service provider.
                </p>
              </Section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2 font-medium">
          {icon}
          {title}
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && <div className="p-3">{children}</div>}
    </div>
  );
}

function PriceRow({ name, desc, price, perScene, highlight }: {
  name: string;
  desc: string;
  price: string;
  perScene?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between p-2 rounded-lg ${highlight ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'}`}>
      <div>
        <div className="font-medium text-foreground">{name}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <div className="text-right">
        <div className="font-mono font-bold text-foreground">{price}</div>
        {perScene && <div className="text-xs text-muted-foreground">per scene</div>}
      </div>
    </div>
  );
}

function ProviderRow({ name, desc, url, free }: {
  name: string;
  desc: string;
  url: string;
  free?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
      <div>
        <div className="font-medium text-foreground flex items-center gap-2">
          {name}
          {free && <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">FREE</span>}
        </div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline text-xs flex items-center gap-1"
      >
        Get key <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
