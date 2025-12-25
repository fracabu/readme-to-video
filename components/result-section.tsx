'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, Code, Check, Plus, Info } from 'lucide-react';
import MuxPlayer from '@mux/mux-player-react';

interface ResultSectionProps {
  playbackId: string;
  onReset: () => void;
}

export function ResultSection({ playbackId, onReset }: ResultSectionProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const shareUrl = `https://player.mux.com/${playbackId}`;
  const embedCode = `<iframe src="https://player.mux.com/${playbackId}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`;

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Video Player */}
        <div className="flex-1 min-w-0">
          <Card className="glass-card overflow-hidden h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-green-500">Video Ready</span>
              </CardTitle>
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
        </div>

        {/* Actions Panel */}
        <div className="lg:w-72 flex flex-col gap-4">
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

          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-200">
              This video is now available in your Mux account under Assets.
            </p>
          </div>

          <Button
            variant="default"
            className="h-auto py-4 mt-auto"
            onClick={onReset}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Video
          </Button>
        </div>
      </div>
    </div>
  );
}
