import Mux from '@mux/mux-node';

// Mux credentials type for BYOK
export interface MuxCredentials {
  tokenId: string;
  tokenSecret: string;
}

/**
 * Create a Mux client with user-provided credentials (BYOK)
 */
function createMuxClient(credentials: MuxCredentials): Mux {
  if (!credentials.tokenId || !credentials.tokenSecret) {
    throw new Error('Mux Token ID and Token Secret are required');
  }
  return new Mux({
    tokenId: credentials.tokenId,
    tokenSecret: credentials.tokenSecret,
  });
}

/**
 * Create a Mux asset from a video URL
 * @param videoUrl - URL of the video to create asset from
 * @param credentials - User-provided Mux credentials (BYOK)
 */
export async function createAssetFromUrl(
  videoUrl: string,
  credentials: MuxCredentials
): Promise<{
  assetId: string;
  playbackId: string;
}> {
  const mux = createMuxClient(credentials);
  const asset = await mux.video.assets.create({
    input: [{ url: videoUrl }],
    playback_policy: ['public'],
    video_quality: 'basic',
  });

  const playbackId = asset.playback_ids?.[0]?.id;
  if (!playbackId) {
    throw new Error('Failed to get playback ID from Mux');
  }

  return {
    assetId: asset.id,
    playbackId,
  };
}

/**
 * Wait for a Mux asset to be ready
 * @param assetId - The asset ID to wait for
 * @param credentials - User-provided Mux credentials (BYOK)
 * @param maxAttempts - Maximum polling attempts
 * @param intervalMs - Polling interval in milliseconds
 */
export async function waitForAssetReady(
  assetId: string,
  credentials: MuxCredentials,
  maxAttempts: number = 60,
  intervalMs: number = 3000
): Promise<void> {
  const mux = createMuxClient(credentials);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const asset = await mux.video.assets.retrieve(assetId);

    if (asset.status === 'ready') {
      return;
    }

    if (asset.status === 'errored') {
      throw new Error('Mux asset processing failed');
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error('Mux asset processing timed out');
}

/**
 * Get the stream URL for a playback ID
 */
export function getStreamUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}

/**
 * Get the thumbnail URL for a playback ID
 */
export function getThumbnailUrl(
  playbackId: string,
  options?: {
    width?: number;
    height?: number;
    time?: number;
    format?: 'jpg' | 'png' | 'webp';
  }
): string {
  const { width = 640, height = 360, time = 0, format = 'webp' } = options || {};
  return `https://image.mux.com/${playbackId}/thumbnail.${format}?width=${width}&height=${height}&time=${time}&fit_mode=smartcrop`;
}

/**
 * Delete a Mux asset
 * @param assetId - The asset ID to delete
 * @param credentials - User-provided Mux credentials (BYOK)
 */
export async function deleteAsset(assetId: string, credentials: MuxCredentials): Promise<void> {
  const mux = createMuxClient(credentials);
  await mux.video.assets.delete(assetId);
}

/**
 * Create a direct upload URL (for future use)
 * @param credentials - User-provided Mux credentials (BYOK)
 * @param corsOrigin - Optional CORS origin
 */
export async function createUploadUrl(
  credentials: MuxCredentials,
  corsOrigin?: string
): Promise<{
  uploadId: string;
  uploadUrl: string;
}> {
  const mux = createMuxClient(credentials);
  const origin = corsOrigin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const upload = await mux.video.uploads.create({
    new_asset_settings: {
      playback_policy: ['public'],
      video_quality: 'basic',
    },
    cors_origin: origin,
  });

  return {
    uploadId: upload.id,
    uploadUrl: upload.url,
  };
}

/**
 * Create a Mux asset from a local file path using direct upload
 * @param filePath - Path to the video file
 * @param credentials - User-provided Mux credentials (BYOK)
 */
export async function createAssetFromFile(
  filePath: string,
  credentials: MuxCredentials
): Promise<{
  assetId: string;
  playbackId: string;
}> {
  const mux = createMuxClient(credentials);

  // Create a direct upload URL
  const upload = await mux.video.uploads.create({
    new_asset_settings: {
      playback_policy: ['public'],
      video_quality: 'basic',
    },
    cors_origin: '*',
  });

  // Upload the file
  const fs = await import('fs');
  const fileBuffer = fs.readFileSync(filePath);

  const uploadResponse = await fetch(upload.url, {
    method: 'PUT',
    body: fileBuffer,
    headers: {
      'Content-Type': 'video/mp4',
    },
  });

  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload to Mux: ${uploadResponse.status}`);
  }

  // Wait for the upload to be processed and get the asset
  let asset = null;
  const maxAttempts = 60;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const uploadStatus = await mux.video.uploads.retrieve(upload.id);

    if (uploadStatus.asset_id) {
      asset = await mux.video.assets.retrieve(uploadStatus.asset_id);
      break;
    }

    if (uploadStatus.status === 'errored') {
      throw new Error('Mux upload failed');
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  if (!asset) {
    throw new Error('Mux upload timed out');
  }

  const playbackId = asset.playback_ids?.[0]?.id;
  if (!playbackId) {
    throw new Error('Failed to get playback ID from Mux');
  }

  return {
    assetId: asset.id,
    playbackId,
  };
}

