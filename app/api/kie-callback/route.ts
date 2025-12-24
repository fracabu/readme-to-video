import { NextResponse } from 'next/server';
import {
  findSessionByTaskId,
  updateSceneStatus,
  areAllScenesReady,
  getSceneVideoUrls,
  updateSessionStatus,
  setSessionResult,
} from '@/lib/session-store';
import { createAssetFromUrl, waitForAssetReady } from '@/lib/mux';
import type { KieCallbackPayload } from '@/types';

export async function POST(request: Request) {
  try {
    const payload: KieCallbackPayload = await request.json();
    console.log('Kie.ai callback received:', payload);

    const { taskId, status, output, error } = payload;

    // Find the session and scene for this task
    const result = findSessionByTaskId(taskId);
    if (!result) {
      console.warn(`Session not found for taskId: ${taskId}`);
      return NextResponse.json({ message: 'OK' });
    }

    const { session, sceneNumber } = result;

    if (status === 'succeed' && output?.videoUrl) {
      // Mark scene as ready
      updateSceneStatus(session.id, sceneNumber, 'ready', output.videoUrl);

      // Check if all scenes are ready
      if (areAllScenesReady(session.id)) {
        // Start finalization
        finalizeVideo(session.id).catch((err) => {
          console.error('Finalization error:', err);
          updateSessionStatus(session.id, 'error', err.message);
        });
      }
    } else if (status === 'failed') {
      updateSceneStatus(session.id, sceneNumber, 'failed');
      updateSessionStatus(session.id, 'error', error || 'Video generation failed');
    }

    return NextResponse.json({ message: 'OK' });
  } catch (error) {
    console.error('Kie callback error:', error);
    return NextResponse.json({ message: 'Error processing callback' }, { status: 500 });
  }
}

async function finalizeVideo(sessionId: string) {
  updateSessionStatus(sessionId, 'finalizing');

  const videoUrls = getSceneVideoUrls(sessionId);
  if (videoUrls.length === 0) {
    throw new Error('No video URLs available');
  }

  // For MVP, we'll use the first video or concatenate them
  // In production, use FFmpeg to properly concatenate
  // For now, just upload the first video to Mux
  // TODO: Implement proper video concatenation

  // Use the first video for now (or implement concatenation)
  const mainVideoUrl = videoUrls[0];

  // Upload to Mux
  const { assetId, playbackId } = await createAssetFromUrl(mainVideoUrl);

  // Wait for Mux to process
  await waitForAssetReady(assetId);

  // Mark session as ready
  setSessionResult(sessionId, playbackId, mainVideoUrl);
}
