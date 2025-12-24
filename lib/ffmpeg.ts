import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { nanoid } from 'nanoid';

const execAsync = promisify(exec);

/**
 * Download a video from URL to a local file
 */
async function downloadVideo(url: string, filePath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  await writeFile(filePath, Buffer.from(buffer));
}

/**
 * Concatenate multiple video files using FFmpeg
 * @param videoUrls Array of video URLs to concatenate
 * @returns Path to the concatenated video file
 */
export async function concatenateVideos(videoUrls: string[]): Promise<string> {
  if (videoUrls.length === 0) {
    throw new Error('No videos to concatenate');
  }

  if (videoUrls.length === 1) {
    // Single video, just download and return
    const outputPath = join(tmpdir(), `video_${nanoid(8)}.mp4`);
    await downloadVideo(videoUrls[0], outputPath);
    return outputPath;
  }

  // Create temp directory for this operation
  const tempDir = join(tmpdir(), `ffmpeg_${nanoid(8)}`);
  await mkdir(tempDir, { recursive: true });

  const downloadedFiles: string[] = [];
  const concatListPath = join(tempDir, 'concat.txt');
  const outputPath = join(tempDir, 'output.mp4');

  try {
    // Download all videos
    console.log(`Downloading ${videoUrls.length} videos for concatenation...`);
    for (let i = 0; i < videoUrls.length; i++) {
      const filePath = join(tempDir, `video_${i}.mp4`);
      console.log(`Downloading video ${i + 1}/${videoUrls.length}...`);
      await downloadVideo(videoUrls[i], filePath);
      downloadedFiles.push(filePath);
    }

    // Create concat list file for FFmpeg
    // Use forward slashes and escape for FFmpeg on Windows
    const concatContent = downloadedFiles
      .map(f => `file '${f.replace(/\\/g, '/')}'`)
      .join('\n');
    await writeFile(concatListPath, concatContent);

    // Run FFmpeg concat
    console.log('Concatenating videos with FFmpeg...');
    const ffmpegCommand = `ffmpeg -f concat -safe 0 -i "${concatListPath}" -c copy "${outputPath}" -y`;

    try {
      const { stdout, stderr } = await execAsync(ffmpegCommand, { timeout: 300000 }); // 5 min timeout
      if (stderr && !stderr.includes('frame=')) {
        console.log('FFmpeg stderr:', stderr);
      }
    } catch (error: unknown) {
      // FFmpeg often writes to stderr even on success, check if output exists
      const fs = await import('fs');
      if (!fs.existsSync(outputPath)) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`FFmpeg concatenation failed: ${errorMessage}`);
      }
    }

    console.log('Concatenation complete!');
    return outputPath;
  } catch (error) {
    // Cleanup on error
    for (const file of downloadedFiles) {
      try {
        await unlink(file);
      } catch {
        // Ignore cleanup errors
      }
    }
    throw error;
  }
}

/**
 * Cleanup temporary files after upload
 */
export async function cleanupTempFiles(filePath: string): Promise<void> {
  try {
    await unlink(filePath);
    // Also try to remove the parent temp directory if it's our temp dir
    const { dirname } = await import('path');
    const dir = dirname(filePath);
    if (dir.includes('ffmpeg_')) {
      const { rmdir } = await import('fs/promises');
      await rmdir(dir, { recursive: true } as never);
    }
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Get video duration using FFmpeg
 */
export async function getVideoDuration(filePath: string): Promise<number> {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
    );
    return parseFloat(stdout.trim());
  } catch {
    return 0;
  }
}

/**
 * Concatenate videos and return as a readable stream for upload
 */
export async function concatenateAndStream(videoUrls: string[]): Promise<{
  filePath: string;
  cleanup: () => Promise<void>;
}> {
  const outputPath = await concatenateVideos(videoUrls);

  return {
    filePath: outputPath,
    cleanup: () => cleanupTempFiles(outputPath),
  };
}
