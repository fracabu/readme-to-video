import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchReadmeFromGitHub, isValidGitHubUrl } from '@/lib/github';
import { createLLMProvider } from '@/lib/llm';
import { createVideoTask, waitForTaskCompletion } from '@/lib/kie';
import { createAssetFromUrl, createAssetFromFile, waitForAssetReady } from '@/lib/mux';
import { concatenateVideos, cleanupTempFiles } from '@/lib/ffmpeg';
import {
  createSession,
  updateSessionStatus,
  setSessionAnalysis,
  setSessionScript,
  setSceneTaskId,
  updateSceneStatus,
  setSessionResult,
} from '@/lib/session-store';
import type { AIProvider, VideoQuality } from '@/types';

const requestSchema = z.object({
  source: z.enum(['url', 'text']),
  content: z.string().min(1),
  style: z.enum(['tech', 'minimal', 'energetic']),
  duration: z.union([z.literal(15), z.literal(30), z.literal(60)]),
  quality: z.enum(['base', 'pro', 'pro-hd']).optional(),
  provider: z.enum(['anthropic', 'openai', 'openrouter', 'gemini']).optional(),
  model: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = requestSchema.parse(body);

    // Get README content
    let readme: string;
    if (data.source === 'url') {
      if (!isValidGitHubUrl(data.content)) {
        return NextResponse.json(
          { error: 'Invalid GitHub URL' },
          { status: 400 }
        );
      }
      readme = await fetchReadmeFromGitHub(data.content);
    } else {
      readme = data.content;
    }

    // Create session
    const session = createSession(readme);

    // Start async processing
    processVideo(
      session.id,
      readme,
      data.style,
      data.duration,
      data.quality || 'base',
      data.provider || (process.env.DEFAULT_LLM_PROVIDER as AIProvider) || 'openrouter',
      data.model
    ).catch((error) => {
      console.error('Video processing error:', error);
      updateSessionStatus(session.id, 'error', error.message);
    });

    return NextResponse.json({
      sessionId: session.id,
      message: 'Video generation started',
    });
  } catch (error) {
    console.error('Generate API error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to start video generation' },
      { status: 500 }
    );
  }
}

async function processVideo(
  sessionId: string,
  readme: string,
  style: 'tech' | 'minimal' | 'energetic',
  duration: 15 | 30 | 60,
  quality: VideoQuality,
  provider: AIProvider,
  model?: string
) {
  // Step 1: Analyze README
  console.log(`[${sessionId}] Step 1: Analyzing README...`);
  updateSessionStatus(sessionId, 'analyzing');
  const llm = createLLMProvider(provider, model);
  const analysis = await llm.analyzeReadme(readme);
  setSessionAnalysis(sessionId, analysis);
  console.log(`[${sessionId}] Analysis complete:`, analysis.projectName);

  // Step 2: Generate script
  console.log(`[${sessionId}] Step 2: Generating script...`);
  updateSessionStatus(sessionId, 'scripting');
  const script = await llm.generateScript(analysis, { style, duration });
  setSessionScript(sessionId, script);
  console.log(`[${sessionId}] Script generated: ${script.scenes.length} scenes`);

  // Step 3: Generate videos for each scene (using polling, not callbacks)
  console.log(`[${sessionId}] Step 3: Generating videos...`);
  updateSessionStatus(sessionId, 'generating');

  // Create all tasks first
  const tasks: { sceneNumber: number; taskId: string }[] = [];
  for (const scene of script.scenes) {
    console.log(`[${sessionId}] Creating task for scene ${scene.sceneNumber} with quality: ${quality}...`);
    const taskId = await createVideoTask(scene.prompt, quality);
    setSceneTaskId(sessionId, scene.sceneNumber, taskId);
    tasks.push({ sceneNumber: scene.sceneNumber, taskId });
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Wait for all videos to complete (polling)
  const videoUrls: string[] = [];
  for (const task of tasks) {
    console.log(`[${sessionId}] Waiting for scene ${task.sceneNumber} (task: ${task.taskId})...`);
    try {
      const videoUrl = await waitForTaskCompletion(task.taskId);
      updateSceneStatus(sessionId, task.sceneNumber, 'ready', videoUrl);
      videoUrls.push(videoUrl);
      console.log(`[${sessionId}] Scene ${task.sceneNumber} ready!`);
    } catch (error) {
      console.error(`[${sessionId}] Scene ${task.sceneNumber} failed:`, error);
      updateSceneStatus(sessionId, task.sceneNumber, 'failed');
      throw error;
    }
  }

  // Step 4: Concatenate videos if multiple scenes
  console.log(`[${sessionId}] Step 4: Processing videos...`);
  updateSessionStatus(sessionId, 'finalizing');

  let finalVideoPath: string | null = null;
  let assetId: string;
  let playbackId: string;

  try {
    if (videoUrls.length > 1) {
      // Multiple scenes - concatenate with FFmpeg
      console.log(`[${sessionId}] Concatenating ${videoUrls.length} videos with FFmpeg...`);
      finalVideoPath = await concatenateVideos(videoUrls);
      console.log(`[${sessionId}] Concatenation complete: ${finalVideoPath}`);

      // Upload concatenated video to Mux
      console.log(`[${sessionId}] Uploading concatenated video to Mux...`);
      const result = await createAssetFromFile(finalVideoPath);
      assetId = result.assetId;
      playbackId = result.playbackId;
    } else {
      // Single scene - upload directly from URL
      console.log(`[${sessionId}] Uploading single video to Mux...`);
      const result = await createAssetFromUrl(videoUrls[0]);
      assetId = result.assetId;
      playbackId = result.playbackId;
    }

    console.log(`[${sessionId}] Mux asset created: ${assetId}`);

    // Wait for Mux to process
    await waitForAssetReady(assetId);
    console.log(`[${sessionId}] Mux asset ready!`);

    // Done!
    setSessionResult(sessionId, playbackId, videoUrls[0]);
    console.log(`[${sessionId}] Complete! Playback ID: ${playbackId}`);
  } finally {
    // Cleanup temp files
    if (finalVideoPath) {
      await cleanupTempFiles(finalVideoPath);
    }
  }
}
