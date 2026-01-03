import { NextResponse } from 'next/server';
import {
  findSessionByTaskId,
  updateSceneStatus,
  updateSessionStatus,
} from '@/lib/session-store';
import type { KieCallbackPayload } from '@/types';

/**
 * DEPRECATED: This webhook callback route is not compatible with BYOK mode.
 * The app now uses polling for video completion instead of webhooks.
 *
 * With BYOK (Bring Your Own Keys), we don't have access to user API keys
 * in webhook callbacks, so finalization must happen in the polling flow.
 *
 * This endpoint is kept for backwards compatibility but only updates scene status.
 */
export async function POST(request: Request) {
  try {
    const payload: KieCallbackPayload = await request.json();
    console.log('Kie.ai callback received (BYOK mode - limited functionality):', payload);

    const { taskId, status, output, error } = payload;

    // Find the session and scene for this task
    const result = findSessionByTaskId(taskId);
    if (!result) {
      console.warn(`Session not found for taskId: ${taskId}`);
      return NextResponse.json({ message: 'OK' });
    }

    const { session, sceneNumber } = result;

    if (status === 'succeed' && output?.videoUrl) {
      // Mark scene as ready - finalization happens in the polling flow
      updateSceneStatus(session.id, sceneNumber, 'ready', output.videoUrl);
      console.log(`Scene ${sceneNumber} marked as ready via callback. Finalization will occur in polling flow.`);
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
