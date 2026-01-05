'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, Code, Check, Plus, Info, Image, Film, Download } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import MuxPlayer from '@mux/mux-player-react';

interface ResultSectionProps {
  playbackId: string;
  onReset: () => void;
}

export function ResultSection({ playbackId, onReset }: ResultSectionProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [thumbnailTime, setThumbnailTime] = useState(5);
  const [showGif, setShowGif] = useState(false);

  const shareUrl = `https://player.mux.com/${playbackId}`;
  const embedCode = `<iframe src="https://player.mux.com/${playbackId}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`;

  // Mux Image & Video URLs
  const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.png?time=${thumbnailTime}`;
  const gifUrl = `https://image.mux.com/${playbackId}/animated.gif?start=0&end=8&width=480`;
  const mp4Url = `https://stream.mux.com/${playbackId}/medium.mp4`;

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="w-full px-4 h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        {/* Video Player */}
        <div className="flex-1 min-w-0 flex flex-col">
          <Card className="glass-card overflow-hidden flex-1 flex flex-col">
            <CardHeader className="py-2 px-4">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="text-green-500">Video Ready</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
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
        <div className="lg:w-80 flex flex-col gap-3">
          {/* Dynamic Thumbnail */}
          <Card className="glass-card">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-xs flex items-center gap-2">
                <Image className="w-3 h-3" />
                Thumbnail Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-0 space-y-2">
              <div className="aspect-video bg-black rounded overflow-hidden">
                <img
                  src={thumbnailUrl}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-8">{thumbnailTime}s</span>
                <Slider
                  value={[thumbnailTime]}
                  onValueChange={(v) => setThumbnailTime(v[0])}
                  min={0}
                  max={15}
                  step={1}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-[10px]"
                  onClick={() => copyToClipboard(thumbnailUrl, 'thumbnail')}
                >
                  {copied === 'thumbnail' ? <Check className="w-3 h-3 text-green-500" /> : <Link className="w-3 h-3" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Animated GIF Preview */}
          <Card className="glass-card">
            <CardHeader className="py-2 px-3">
              <CardTitle className="text-xs flex items-center gap-2">
                <Film className="w-3 h-3" />
                GIF Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-0 space-y-2">
              <div
                className="aspect-video bg-black rounded overflow-hidden cursor-pointer"
                onClick={() => setShowGif(!showGif)}
              >
                {showGif ? (
                  <img src={gifUrl} alt="Animated preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">
                    Click to load
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-6 text-[10px]"
                onClick={() => copyToClipboard(gifUrl, 'gif')}
              >
                {copied === 'gif' ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Link className="w-3 h-3 mr-1" />}
                {copied === 'gif' ? 'Copied!' : 'Copy URL'}
              </Button>
            </CardContent>
          </Card>

          {/* Actions Row */}
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 flex-col gap-0.5 px-1"
              onClick={() => copyToClipboard(shareUrl, 'share')}
            >
              {copied === 'share' ? <Check className="w-3 h-3 text-green-500" /> : <Link className="w-3 h-3" />}
              <span className="text-[9px]">{copied === 'share' ? 'Copied!' : 'Share'}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-9 flex-col gap-0.5 px-1"
              onClick={() => copyToClipboard(embedCode, 'embed')}
            >
              {copied === 'embed' ? <Check className="w-3 h-3 text-green-500" /> : <Code className="w-3 h-3" />}
              <span className="text-[9px]">{copied === 'embed' ? 'Copied!' : 'Embed'}</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              className="h-9 flex-col gap-0.5 px-1 bg-primary hover:bg-primary/90"
              asChild
            >
              <a href={mp4Url} download target="_blank" rel="noopener noreferrer">
                <Download className="w-3 h-3" />
                <span className="text-[9px]">MP4</span>
              </a>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-9 flex-col gap-0.5 px-1"
              onClick={onReset}
            >
              <Plus className="w-3 h-3" />
              <span className="text-[9px]">New</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
