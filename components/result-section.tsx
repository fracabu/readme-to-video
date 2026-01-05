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
    <div className="fixed inset-0 top-14 bottom-10 flex justify-center gap-4 p-4 overflow-hidden">
      {/* Video Player - Reduced size */}
      <div className="w-[55%] max-w-3xl">
        <Card className="glass-card h-full overflow-hidden flex flex-col">
          <CardHeader className="py-2 px-4 flex-shrink-0">
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

      {/* Right Panel - Wider */}
      <div className="w-96 flex flex-col gap-3 flex-shrink-0">
        {/* Thumbnail Preview */}
        <Card className="glass-card">
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-xs flex items-center gap-2">
              <Image className="w-4 h-4" /> Thumbnail Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            <div className="aspect-video bg-black rounded overflow-hidden">
              <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-6">{thumbnailTime}s</span>
              <Slider value={[thumbnailTime]} onValueChange={(v) => setThumbnailTime(v[0])} min={0} max={15} step={1} className="flex-1" />
              <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => copyToClipboard(thumbnailUrl, 'thumbnail')}>
                {copied === 'thumbnail' ? <Check className="w-4 h-4 text-green-500" /> : <Link className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* GIF Preview */}
        <Card className="glass-card">
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-xs flex items-center gap-2">
              <Film className="w-4 h-4" /> GIF Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            <div className="aspect-video bg-black rounded overflow-hidden cursor-pointer" onClick={() => setShowGif(!showGif)}>
              {showGif ? (
                <img src={gifUrl} alt="GIF" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Click to load</div>
              )}
            </div>
            <Button variant="ghost" size="sm" className="w-full h-7" onClick={() => copyToClipboard(gifUrl, 'gif')}>
              {copied === 'gif' ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Link className="w-4 h-4 mr-2" />}
              <span className="text-xs">{copied === 'gif' ? 'Copied!' : 'Copy URL'}</span>
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="h-10" onClick={() => copyToClipboard(shareUrl, 'share')}>
            {copied === 'share' ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Link className="w-4 h-4 mr-2" />}
            Share
          </Button>
          <Button variant="outline" className="h-10" onClick={() => copyToClipboard(embedCode, 'embed')}>
            {copied === 'embed' ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Code className="w-4 h-4 mr-2" />}
            Embed
          </Button>
          <Button variant="default" className="h-10 bg-primary" asChild>
            <a href={mp4Url} download target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4 mr-2" /> MP4
            </a>
          </Button>
          <Button variant="outline" className="h-10" onClick={onReset}>
            <Plus className="w-4 h-4 mr-2" /> New
          </Button>
        </div>
      </div>
    </div>
  );
}
