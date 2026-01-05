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
    <div className="fixed inset-0 top-14 bottom-10 flex justify-center gap-3 p-3 overflow-hidden">
      {/* Video Player */}
      <div className="flex-1 max-w-3xl">
        <Card className="glass-card h-full overflow-hidden flex flex-col">
          <CardHeader className="py-1 px-3 flex-shrink-0">
            <CardTitle className="text-sm text-green-500">Video Ready</CardTitle>
          </CardHeader>
          <CardContent className="p-2 flex-1 flex items-center justify-center">
            <div className="w-full max-h-full aspect-video bg-black rounded overflow-hidden">
              <MuxPlayer
                playbackId={playbackId}
                accentColor="#f97316"
                metadata={{ video_title: 'README Promo Video', viewer_user_id: 'anonymous' }}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Previews */}
      <div className="w-72 flex flex-col gap-2 flex-shrink-0">
        {/* Thumbnail Preview */}
        <Card className="glass-card flex-1">
          <CardHeader className="py-1 px-2">
            <CardTitle className="text-[11px] flex items-center gap-1">
              <Image className="w-3 h-3" /> Thumbnail
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0 space-y-1">
            <div className="h-28 bg-black rounded overflow-hidden">
              <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-muted-foreground">{thumbnailTime}s</span>
              <Slider value={[thumbnailTime]} onValueChange={(v) => setThumbnailTime(v[0])} min={0} max={15} step={1} className="flex-1" />
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(thumbnailUrl, 'thumbnail')}>
                {copied === 'thumbnail' ? <Check className="w-3 h-3 text-green-500" /> : <Link className="w-3 h-3" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* GIF Preview */}
        <Card className="glass-card flex-1">
          <CardHeader className="py-1 px-2">
            <CardTitle className="text-[11px] flex items-center gap-1">
              <Film className="w-3 h-3" /> GIF Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0 space-y-1">
            <div className="h-28 bg-black rounded overflow-hidden cursor-pointer" onClick={() => setShowGif(!showGif)}>
              {showGif ? (
                <img src={gifUrl} alt="GIF" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">Click to load</div>
              )}
            </div>
            <Button variant="ghost" size="sm" className="w-full h-6 text-[10px]" onClick={() => copyToClipboard(gifUrl, 'gif')}>
              {copied === 'gif' ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Link className="w-3 h-3 mr-1" />}
              Copy URL
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons - Vertical */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <Button variant="outline" className="h-12 w-12 flex-col gap-1 p-1" onClick={() => copyToClipboard(shareUrl, 'share')}>
          {copied === 'share' ? <Check className="w-4 h-4 text-green-500" /> : <Link className="w-4 h-4" />}
          <span className="text-[9px]">Share</span>
        </Button>
        <Button variant="outline" className="h-12 w-12 flex-col gap-1 p-1" onClick={() => copyToClipboard(embedCode, 'embed')}>
          {copied === 'embed' ? <Check className="w-4 h-4 text-green-500" /> : <Code className="w-4 h-4" />}
          <span className="text-[9px]">Embed</span>
        </Button>
        <Button variant="default" className="h-12 w-12 flex-col gap-1 p-1 bg-primary" asChild>
          <a href={mp4Url} download target="_blank" rel="noopener noreferrer">
            <Download className="w-4 h-4" />
            <span className="text-[9px]">MP4</span>
          </a>
        </Button>
        <Button variant="outline" className="h-12 w-12 flex-col gap-1 p-1" onClick={onReset}>
          <Plus className="w-4 h-4" />
          <span className="text-[9px]">New</span>
        </Button>
      </div>
    </div>
  );
}
