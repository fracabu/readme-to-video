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
    <div className="fixed inset-0 top-14 bottom-10 flex gap-2 p-2 overflow-hidden">
      {/* Video Player */}
      <div className="flex-1 min-w-0">
        <Card className="glass-card h-full overflow-hidden flex flex-col">
          <CardHeader className="py-1 px-3 flex-shrink-0">
            <CardTitle className="text-sm text-green-500">Video Ready</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 bg-black">
            <MuxPlayer
              playbackId={playbackId}
              accentColor="#f97316"
              metadata={{ video_title: 'README Promo Video', viewer_user_id: 'anonymous' }}
              style={{ width: '100%', height: '100%' }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Right Panel */}
      <div className="w-64 flex flex-col gap-2 flex-shrink-0">
        {/* Thumbnail + GIF side by side */}
        <div className="flex gap-2">
          {/* Thumbnail */}
          <Card className="glass-card flex-1">
            <CardContent className="p-2">
              <div className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1">
                <Image className="w-3 h-3" /> Thumbnail
              </div>
              <div className="h-16 bg-black rounded overflow-hidden mb-1">
                <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-muted-foreground">{thumbnailTime}s</span>
                <Slider value={[thumbnailTime]} onValueChange={(v) => setThumbnailTime(v[0])} min={0} max={15} step={1} className="flex-1" />
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => copyToClipboard(thumbnailUrl, 'thumbnail')}>
                  {copied === 'thumbnail' ? <Check className="w-3 h-3 text-green-500" /> : <Link className="w-3 h-3" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* GIF */}
          <Card className="glass-card flex-1">
            <CardContent className="p-2">
              <div className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1">
                <Film className="w-3 h-3" /> GIF
              </div>
              <div className="h-16 bg-black rounded overflow-hidden cursor-pointer mb-1" onClick={() => setShowGif(!showGif)}>
                {showGif ? (
                  <img src={gifUrl} alt="GIF" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[9px]">Click</div>
                )}
              </div>
              <Button variant="ghost" size="sm" className="w-full h-5 text-[9px]" onClick={() => copyToClipboard(gifUrl, 'gif')}>
                {copied === 'gif' ? <Check className="w-3 h-3 text-green-500" /> : <Link className="w-3 h-3" />}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="h-8" onClick={() => copyToClipboard(shareUrl, 'share')}>
            {copied === 'share' ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Link className="w-3 h-3 mr-1" />}
            <span className="text-[10px]">Share</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8" onClick={() => copyToClipboard(embedCode, 'embed')}>
            {copied === 'embed' ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Code className="w-3 h-3 mr-1" />}
            <span className="text-[10px]">Embed</span>
          </Button>
          <Button variant="default" size="sm" className="h-8 bg-primary" asChild>
            <a href={mp4Url} download target="_blank" rel="noopener noreferrer">
              <Download className="w-3 h-3 mr-1" />
              <span className="text-[10px]">MP4</span>
            </a>
          </Button>
          <Button variant="outline" size="sm" className="h-8" onClick={onReset}>
            <Plus className="w-3 h-3 mr-1" />
            <span className="text-[10px]">New</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
