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
        <div className="lg:w-80 flex flex-col gap-4">
          {/* Dynamic Thumbnail */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Image className="w-4 h-4" />
                Thumbnail Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="aspect-video bg-black rounded-md overflow-hidden">
                <img
                  src={thumbnailUrl}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Time: {thumbnailTime}s</span>
                  <span>0-15s</span>
                </div>
                <Slider
                  value={[thumbnailTime]}
                  onValueChange={(v) => setThumbnailTime(v[0])}
                  min={0}
                  max={15}
                  step={1}
                  className="w-full"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => copyToClipboard(thumbnailUrl, 'thumbnail')}
              >
                {copied === 'thumbnail' ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Link className="w-4 h-4 mr-2" />}
                {copied === 'thumbnail' ? 'Copied!' : 'Copy Thumbnail URL'}
              </Button>
            </CardContent>
          </Card>

          {/* Animated GIF Preview */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Film className="w-4 h-4" />
                Animated GIF Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                className="aspect-video bg-black rounded-md overflow-hidden cursor-pointer"
                onClick={() => setShowGif(!showGif)}
              >
                {showGif ? (
                  <img src={gifUrl} alt="Animated preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    Click to load GIF
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => copyToClipboard(gifUrl, 'gif')}
              >
                {copied === 'gif' ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Link className="w-4 h-4 mr-2" />}
                {copied === 'gif' ? 'Copied!' : 'Copy GIF URL'}
              </Button>
            </CardContent>
          </Card>

          {/* Download & Share Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="h-auto py-3 flex-col gap-1"
              onClick={() => copyToClipboard(shareUrl, 'share')}
            >
              {copied === 'share' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Link className="w-4 h-4" />
              )}
              <span className="text-xs">{copied === 'share' ? 'Copied!' : 'Share Link'}</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-3 flex-col gap-1"
              onClick={() => copyToClipboard(embedCode, 'embed')}
            >
              {copied === 'embed' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Code className="w-4 h-4" />
              )}
              <span className="text-xs">{copied === 'embed' ? 'Copied!' : 'Embed Code'}</span>
            </Button>
          </div>

          {/* Download MP4 Button */}
          <Button
            variant="default"
            className="h-auto py-3 bg-primary hover:bg-primary/90"
            asChild
          >
            <a href={mp4Url} download target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4 mr-2" />
              Download MP4
            </a>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-3"
            onClick={onReset}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Video
          </Button>
        </div>
      </div>
    </div>
  );
}
