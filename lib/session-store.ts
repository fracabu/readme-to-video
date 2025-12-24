import { nanoid } from 'nanoid';
import type { Session, SessionStatus, SceneProgress, ReadmeAnalysis, VideoScript } from '@/types';

// Use globalThis to persist across Next.js hot reloads
declare global {
  // eslint-disable-next-line no-var
  var __sessions: Map<string, Session> | undefined;
  // eslint-disable-next-line no-var
  var __sessionListeners: Map<string, Set<SessionListener>> | undefined;
}

type SessionListener = (session: Session) => void;

// In-memory session store with globalThis for Next.js compatibility
const sessions = globalThis.__sessions ?? new Map<string, Session>();
globalThis.__sessions = sessions;

const sessionListeners = globalThis.__sessionListeners ?? new Map<string, Set<SessionListener>>();
globalThis.__sessionListeners = sessionListeners;

/**
 * Create a new session
 */
export function createSession(readme: string): Session {
  const session: Session = {
    id: nanoid(12),
    status: 'analyzing',
    readme,
    scenes: [],
    createdAt: new Date(),
  };

  sessions.set(session.id, session);
  return session;
}

/**
 * Get a session by ID
 */
export function getSession(id: string): Session | undefined {
  return sessions.get(id);
}

/**
 * Update session status
 */
export function updateSessionStatus(id: string, status: SessionStatus, error?: string): void {
  const session = sessions.get(id);
  if (!session) return;

  session.status = status;
  if (error) {
    session.error = error;
  }

  sessions.set(id, session);
  notifyListeners(id, session);
}

/**
 * Set session analysis result
 */
export function setSessionAnalysis(id: string, analysis: ReadmeAnalysis): void {
  const session = sessions.get(id);
  if (!session) return;

  session.analysis = analysis;
  sessions.set(id, session);
  notifyListeners(id, session);
}

/**
 * Set session script
 */
export function setSessionScript(id: string, script: VideoScript): void {
  const session = sessions.get(id);
  if (!session) return;

  session.script = script;

  // Initialize scenes from script
  session.scenes = script.scenes.map((scene) => ({
    sceneNumber: scene.sceneNumber,
    taskId: '',
    status: 'pending' as const,
  }));

  sessions.set(id, session);
  notifyListeners(id, session);
}

/**
 * Update a scene's task ID
 */
export function setSceneTaskId(id: string, sceneNumber: number, taskId: string): void {
  const session = sessions.get(id);
  if (!session) return;

  const scene = session.scenes.find((s) => s.sceneNumber === sceneNumber);
  if (scene) {
    scene.taskId = taskId;
    scene.status = 'generating';
  }

  sessions.set(id, session);
  notifyListeners(id, session);
}

/**
 * Update a scene's status
 */
export function updateSceneStatus(
  id: string,
  sceneNumber: number,
  status: SceneProgress['status'],
  videoUrl?: string
): void {
  const session = sessions.get(id);
  if (!session) return;

  const scene = session.scenes.find((s) => s.sceneNumber === sceneNumber);
  if (scene) {
    scene.status = status;
    if (videoUrl) {
      scene.videoUrl = videoUrl;
    }
  }

  sessions.set(id, session);
  notifyListeners(id, session);
}

/**
 * Find session by task ID (for webhook callbacks)
 */
export function findSessionByTaskId(taskId: string): { session: Session; sceneNumber: number } | undefined {
  for (const session of sessions.values()) {
    const scene = session.scenes.find((s) => s.taskId === taskId);
    if (scene) {
      return { session, sceneNumber: scene.sceneNumber };
    }
  }
  return undefined;
}

/**
 * Set final video result
 */
export function setSessionResult(id: string, playbackId: string, videoUrl?: string): void {
  const session = sessions.get(id);
  if (!session) return;

  session.status = 'ready';
  session.muxPlaybackId = playbackId;
  if (videoUrl) {
    session.finalVideoUrl = videoUrl;
  }

  sessions.set(id, session);
  notifyListeners(id, session);
}

/**
 * Check if all scenes are ready
 */
export function areAllScenesReady(id: string): boolean {
  const session = sessions.get(id);
  if (!session || session.scenes.length === 0) return false;

  return session.scenes.every((scene) => scene.status === 'ready');
}

/**
 * Get all scene video URLs
 */
export function getSceneVideoUrls(id: string): string[] {
  const session = sessions.get(id);
  if (!session) return [];

  return session.scenes
    .sort((a, b) => a.sceneNumber - b.sceneNumber)
    .map((scene) => scene.videoUrl)
    .filter((url): url is string => !!url);
}

// SSE Listener Management

/**
 * Subscribe to session updates
 */
export function subscribeToSession(id: string, listener: SessionListener): () => void {
  if (!sessionListeners.has(id)) {
    sessionListeners.set(id, new Set());
  }

  sessionListeners.get(id)!.add(listener);

  // Return unsubscribe function
  return () => {
    const listeners = sessionListeners.get(id);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        sessionListeners.delete(id);
      }
    }
  };
}

/**
 * Notify all listeners of a session update
 */
function notifyListeners(id: string, session: Session): void {
  const listeners = sessionListeners.get(id);
  if (listeners) {
    for (const listener of listeners) {
      try {
        listener(session);
      } catch (error) {
        console.error('Error notifying session listener:', error);
      }
    }
  }
}

/**
 * Clean up old sessions (call periodically)
 */
export function cleanupOldSessions(maxAgeMs: number = 3600000): void {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.createdAt.getTime() > maxAgeMs) {
      sessions.delete(id);
      sessionListeners.delete(id);
    }
  }
}
