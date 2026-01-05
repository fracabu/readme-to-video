import type { VideoQuality } from '@/types';

const KIE_API_BASE = 'https://api.kie.ai/api/v1/jobs';

// Model mapping for different quality levels
const QUALITY_MODELS: Record<VideoQuality, { model: string; size?: string }> = {
  'base': { model: 'sora-2-text-to-video' },
  'pro': { model: 'sora-2-pro-text-to-video', size: 'standard' },
  'pro-hd': { model: 'sora-2-pro-text-to-video', size: 'high' },
};

/**
 * Create a video generation task with Kie.ai Sora 2
 * @param prompt - The video generation prompt
 * @param apiKey - User-provided Kie.ai API key (BYOK)
 * @param quality - Video quality tier
 * @param callbackUrl - Optional webhook URL
 */
export async function createVideoTask(
  prompt: string,
  apiKey: string,
  quality: VideoQuality = 'base',
  callbackUrl?: string
): Promise<string> {
  if (!apiKey) {
    throw new Error('Kie.ai API key is required');
  }

  const qualityConfig = QUALITY_MODELS[quality];

  const payload: Record<string, unknown> = {
    model: qualityConfig.model,
    input: {
      prompt,
      aspect_ratio: 'landscape',
      n_frames: '15',
      remove_watermark: true,
      ...(qualityConfig.size && { size: qualityConfig.size }),
    },
  };

  if (callbackUrl) {
    payload.callBackUrl = callbackUrl;
  }

  console.log('Creating Kie.ai task with prompt:', prompt.substring(0, 100) + '...');

  const response = await fetch(`${KIE_API_BASE}/createTask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Kie.ai API error: ${response.status} - ${error}`);
  }

  const result = await response.json();
  console.log('Kie.ai createTask response:', JSON.stringify(result, null, 2));

  // Handle different response formats (based on working Python code)
  const taskId = result.taskId || result.task_id || result.id || result.data?.taskId;

  if (!taskId) {
    throw new Error(`No taskId in response: ${JSON.stringify(result)}`);
  }

  return taskId;
}

/**
 * Check the status of a video generation task using recordInfo endpoint
 * @param taskId - The task ID to check
 * @param apiKey - User-provided Kie.ai API key (BYOK)
 */
export async function getTaskStatus(taskId: string, apiKey: string): Promise<{
  state: string;
  videoUrl?: string;
  error?: string;
}> {
  if (!apiKey) {
    throw new Error('Kie.ai API key is required');
  }

  // Use GET with query parameter (from documentation)
  const response = await fetch(`${KIE_API_BASE}/recordInfo?taskId=${taskId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Kie.ai API error: ${response.status} - ${error}`);
  }

  const result = await response.json();

  // Debug: log full response
  console.log(`[Kie.ai] Full recordInfo response for ${taskId}:`, JSON.stringify(result, null, 2));

  const data = result.data || result;

  // Parse state - check multiple possible fields
  const rawState = data.state || data.status || '';
  const state = rawState.toLowerCase();

  console.log(`[Kie.ai] Task ${taskId} - rawState: "${rawState}", state: "${state}", has resultJson: ${!!data.resultJson}`);

  // Parse video URL from resultJson if success
  let videoUrl: string | undefined;

  // Check for success state (handle variations)
  const isSuccess = state === 'success' || state === 'succeed' || state === 'completed' || state === 'complete';

  if (isSuccess) {
    // Try multiple ways to get video URL
    if (data.resultJson) {
      try {
        const resultData = typeof data.resultJson === 'string'
          ? JSON.parse(data.resultJson)
          : data.resultJson;
        console.log(`[Kie.ai] Parsed resultJson:`, JSON.stringify(resultData, null, 2));
        const urls = resultData.resultUrls || resultData.result_urls || resultData.video_urls || [];
        videoUrl = urls[0] || resultData.videoUrl || resultData.video_url;
        console.log(`[Kie.ai] Extracted videoUrl from resultJson: ${videoUrl}`);
      } catch (e) {
        console.error('[Kie.ai] Error parsing resultJson:', e, 'Raw:', data.resultJson);
      }
    }

    // Fallback: check other possible fields for video URL
    if (!videoUrl) {
      videoUrl = data.videoUrl || data.video_url || data.output?.videoUrl || data.output?.video_url;
      if (videoUrl) {
        console.log(`[Kie.ai] Found videoUrl in fallback field: ${videoUrl}`);
      }
    }

    // If success but no video URL, log warning
    if (!videoUrl) {
      console.warn(`[Kie.ai] Task ${taskId} is ${state} but no videoUrl found! Full data:`, JSON.stringify(data, null, 2));
    }
  }

  return {
    state: isSuccess ? 'success' : state, // Normalize success states
    videoUrl,
    error: data.failMsg || data.error || data.fail_msg,
  };
}

/**
 * Poll for task completion
 * @param taskId - The task ID to poll
 * @param apiKey - User-provided Kie.ai API key (BYOK)
 * @param maxAttempts - Maximum polling attempts
 * @param intervalMs - Polling interval in milliseconds
 */
export async function waitForTaskCompletion(
  taskId: string,
  apiKey: string,
  maxAttempts: number = 60,
  intervalMs: number = 10000
): Promise<string> {
  console.log(`Waiting for task ${taskId} to complete...`);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await getTaskStatus(taskId, apiKey);
    console.log(`Task ${taskId} status: ${status.state} (attempt ${attempt + 1}/${maxAttempts})`);

    if (status.state === 'success' && status.videoUrl) {
      return status.videoUrl;
    }

    if (status.state === 'fail' || status.state === 'failed') {
      throw new Error(`Video generation failed: ${status.error || 'Unknown error'}`);
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error('Video generation timed out');
}
