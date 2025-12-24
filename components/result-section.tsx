'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Link, Code, Check, RefreshCw } from 'lucide-react';
import MuxPlayer from '@mux/mux-player-react';

interface ResultSectionProps {
  playbackId: string;
  onReset: () => void;
}

export function ResultSection({ playbackId, onReset }: ResultSectionProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const streamUrl = `https://stream.mux.com/${playbackId}.m3u8`;
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}?v=${playbackId}`
    : '';
  const embedCode = `<iframe src="https://player.mux.com/${playbackId}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`;

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <Card className="glass-card overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-green-500">Video Ready</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onReset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              New Video
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="aspect-video bg-black">
            <MuxPlayer
              playbackId={playbackId}
              accentColor="#f97316"
              metadata={{
                video_title: 'README Promo Video',
                viewer_user_id: 'anonymous',
              }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="h-auto py-4 flex-col gap-2"
          asChild
        >
          <a href={streamUrl} download target="_blank" rel="noopener noreferrer">
            <Download className="w-5 h-5" />
            <span>Download Video</span>
          </a>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-4 flex-col gap-2"
          onClick={() => copyToClipboard(shareUrl, 'share')}
        >
          {copied === 'share' ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Link className="w-5 h-5" />
          )}
          <span>{copied === 'share' ? 'Copied!' : 'Copy Share Link'}</span>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-4 flex-col gap-2"
          onClick={() => copyToClipboard(embedCode, 'embed')}
        >
          {copied === 'embed' ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Code className="w-5 h-5" />
          )}
          <span>{copied === 'embed' ? 'Copied!' : 'Copy Embed Code'}</span>
        </Button>
      </div>
    </div>
  );
}
