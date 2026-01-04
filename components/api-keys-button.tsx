'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Key, X, Save, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const STORAGE_KEY = 'readme2video_api_keys';

export function ApiKeysButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [kieApiKey, setKieApiKey] = useState('');
  const [muxTokenId, setMuxTokenId] = useState('');
  const [muxTokenSecret, setMuxTokenSecret] = useState('');
  const [llmApiKey, setLlmApiKey] = useState('');
  const [saveKeys, setSaveKeys] = useState(true);
  const [keysLoaded, setKeysLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (!keysLoaded) return;
    if (saveKeys) {
      const keys = { kieApiKey, muxTokenId, muxTokenSecret, llmApiKey };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [kieApiKey, muxTokenId, muxTokenSecret, llmApiKey, saveKeys, keysLoaded]);

  const hasAllKeys = kieApiKey && muxTokenId && muxTokenSecret && llmApiKey;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative text-muted-foreground hover:text-primary transition-colors"
      >
        <Key className="w-5 h-5" />
        {hasAllKeys ? (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full" />
        ) : (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {mounted && isOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/70 overflow-y-auto"
          onClick={() => setIsOpen(false)}
        >
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border bg-background">
              <h2 className="text-lg font-aldrich font-bold tracking-wide flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                API Keys
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-sans">BYOK</span>
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-muted rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Bring Your Own Keys - stored locally in your browser.
              </p>

              <div className="space-y-1.5">
                <Label className="text-sm flex items-center justify-between">
                  <span>Kie.ai API Key <span className="text-red-500">*</span></span>
                  <a href="https://kie.ai" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                    Get key <ExternalLink className="w-3 h-3" />
                  </a>
                </Label>
                <Input
                  type="password"
                  placeholder="Enter your Kie.ai API key"
                  value={kieApiKey}
                  onChange={(e) => setKieApiKey(e.target.value)}
                  className="font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm flex items-center justify-between">
                  <span>Mux Credentials <span className="text-red-500">*</span></span>
                  <a href="https://dashboard.mux.com/settings/access-tokens" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                    Get keys <ExternalLink className="w-3 h-3" />
                  </a>
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="password" placeholder="Token ID" value={muxTokenId} onChange={(e) => setMuxTokenId(e.target.value)} className="font-mono" />
                  <Input type="password" placeholder="Token Secret" value={muxTokenSecret} onChange={(e) => setMuxTokenSecret(e.target.value)} className="font-mono" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm flex items-center justify-between">
                  <span>LLM API Key <span className="text-red-500">*</span></span>
                  <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                    Get free key <ExternalLink className="w-3 h-3" />
                  </a>
                </Label>
                <Input
                  type="password"
                  placeholder="OpenRouter / Anthropic / OpenAI / Gemini"
                  value={llmApiKey}
                  onChange={(e) => setLlmApiKey(e.target.value)}
                  className="font-mono"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-3 border-t border-border">
                <input type="checkbox" checked={saveKeys} onChange={(e) => setSaveKeys(e.target.checked)} className="w-4 h-4" />
                <Save className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Save keys in browser</span>
              </label>

              <div className={`p-3 rounded-lg text-sm ${hasAllKeys ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {hasAllKeys ? '✓ All keys configured' : '• Please fill in all required keys'}
              </div>
            </div>

            <div className="p-4 border-t border-border">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
              >
                Done
              </button>
            </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
