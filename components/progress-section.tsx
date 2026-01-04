'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, Loader2, Circle, AlertCircle, FileText } from 'lucide-react';
import type { Session, VideoScript } from '@/types';
import { cn } from '@/lib/utils';
import { VideoGenerationLoader, WaveLoader } from './animated-loader';

interface ProgressSectionProps {
  sessionId: string;
  onComplete: (playbackId: string) => void;
  onError: (error: string) => void;
}

type Step = {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete' | 'error';
};

export function ProgressSection({ sessionId, onComplete, onError }: ProgressSectionProps) {
  const [steps, setSteps] = useState<Step[]>([
    { id: 'analyzing', label: 'Analyzing README', status: 'active' },
    { id: 'scripting', label: 'Generating Script', status: 'pending' },
    { id: 'generating', label: 'Creating Video Scenes', status: 'pending' },
    { id: 'finalizing', label: 'Finalizing Video', status: 'pending' },
  ]);
  const [script, setScript] = useState<VideoScript | null>(null);
  const [sceneProgress, setSceneProgress] = useState<{ [key: number]: string }>({});
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource(`/api/status/${sessionId}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as Session;
        updateFromSession(data);
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [sessionId]);

  const updateFromSession = (session: Session) => {
    // Update steps based on session status
    setSteps((prev) =>
      prev.map((step) => {
        if (session.status === 'error') {
          if (step.status === 'active') {
            return { ...step, status: 'error' };
          }
          return step;
        }

        const statusOrder = ['analyzing', 'scripting', 'generating', 'finalizing', 'ready'];
        const currentIndex = statusOrder.indexOf(session.status);
        const stepIndex = statusOrder.indexOf(step.id);

        if (stepIndex < currentIndex) {
          return { ...step, status: 'complete' };
        } else if (stepIndex === currentIndex) {
          return { ...step, status: 'active' };
        }
        return { ...step, status: 'pending' };
      })
    );

    // Update script
    if (session.script) {
      setScript(session.script);
    }

    // Update scene progress
    if (session.scenes.length > 0) {
      const progress: { [key: number]: string } = {};
      session.scenes.forEach((scene) => {
        progress[scene.sceneNumber] = scene.status;
      });
      setSceneProgress(progress);
    }

    // Calculate overall progress
    let progress = 0;
    if (session.status === 'analyzing') progress = 10;
    else if (session.status === 'scripting') progress = 25;
    else if (session.status === 'generating') {
      const completedScenes = session.scenes.filter((s) => s.status === 'ready').length;
      const totalScenes = session.scenes.length || 1;
      progress = 25 + (completedScenes / totalScenes) * 50;
    } else if (session.status === 'finalizing') progress = 80;
    else if (session.status === 'ready') progress = 100;

    setOverallProgress(progress);

    // Handle completion
    if (session.status === 'ready' && session.muxPlaybackId) {
      onComplete(session.muxPlaybackId);
    }

    // Handle error
    if (session.status === 'error' && session.error) {
      onError(session.error);
    }
  };

  const getStepIcon = (status: Step['status']) => {
    switch (status) {
      case 'complete':
        return <Check className="w-5 h-5 text-neon-green" />;
      case 'active':
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto relative">
      <div className="flex flex-col lg:flex-row gap-6 relative z-10">
        {/* Left: Process Status */}
        <div className="lg:w-80 flex-shrink-0">
          <Card className="glass-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <WaveLoader className="scale-75" />
                <span className="ml-1">Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={overallProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">{Math.round(overallProgress)}% complete</p>

              <div className="space-y-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg transition-colors',
                      step.status === 'active' && 'bg-primary/5',
                      step.status === 'complete' && 'opacity-60'
                    )}
                  >
                    {getStepIcon(step.status)}
                    <span
                      className={cn(
                        'text-sm',
                        step.status === 'active' && 'text-foreground font-medium',
                        step.status === 'pending' && 'text-muted-foreground',
                        step.status === 'complete' && 'text-muted-foreground'
                      )}
                    >
                      {step.label}
                    </span>

                    {step.id === 'generating' &&
                      Object.keys(sceneProgress).length > 0 && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          {Object.values(sceneProgress).filter((s) => s === 'ready').length}/
                          {Object.keys(sceneProgress).length}
                        </span>
                      )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Script Preview */}
        <div className="flex-1 min-w-0">
          <Card className="glass-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Generated Script
              </CardTitle>
            </CardHeader>
            <CardContent>
              {script ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-bold text-foreground">{script.title}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{script.totalDuration}s</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{script.scenes.length} scene{script.scenes.length > 1 ? 's' : ''}</span>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {script.scenes.map((scene) => (
                      <div
                        key={scene.sceneNumber}
                        className={cn(
                          'p-4 rounded-lg border border-border/50 transition-all',
                          sceneProgress[scene.sceneNumber] === 'generating' &&
                            'border-primary/50 bg-primary/5',
                          sceneProgress[scene.sceneNumber] === 'ready' &&
                            'border-[hsl(145,100%,50%,0.5)] bg-[hsl(145,100%,50%,0.05)]'
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-primary font-mono">
                            SCENE {scene.sceneNumber}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {scene.duration}s
                          </span>
                          {sceneProgress[scene.sceneNumber] === 'generating' && (
                            <Loader2 className="w-3 h-3 text-primary animate-spin ml-auto" />
                          )}
                          {sceneProgress[scene.sceneNumber] === 'ready' && (
                            <Check className="w-3 h-3 text-neon-green ml-auto" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {scene.descriptionIt}
                        </p>
                        {scene.narrationText && (
                          <p className="text-xs text-foreground/70 italic border-l-2 border-primary/30 pl-3">
                            "{scene.narrationText}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <VideoGenerationLoader progress={overallProgress} />
                  <p className="text-sm mt-4">Generating script...</p>
                  <p className="text-xs mt-1">Analyzing your README content</p>
                  <WaveLoader className="mt-4" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
