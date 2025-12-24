import { getSession, subscribeToSession } from '@/lib/session-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;
  const session = getSession(sessionId);

  if (!session) {
    return new Response('Session not found', { status: 404 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial state
      const sendEvent = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Send current session state
      sendEvent(session);

      // If already complete or error, close immediately
      if (session.status === 'ready' || session.status === 'error') {
        controller.close();
        return;
      }

      // Subscribe to updates
      const unsubscribe = subscribeToSession(sessionId, (updatedSession) => {
        sendEvent(updatedSession);

        // Close stream when done
        if (updatedSession.status === 'ready' || updatedSession.status === 'error') {
          unsubscribe();
          controller.close();
        }
      });

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        unsubscribe();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
