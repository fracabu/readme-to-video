import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { nanoid } from 'nanoid';

const execAsync = promisify(exec);

// Crossfade duration in seconds
const CROSSFADE_DURATION = 0.5;

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
 * Get video duration using FFprobe
 */
export async function getVideoDuration(filePath: string): Promise<number> {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
    );
    return parseFloat(stdout.trim());
  } catch {
    return 15; // Default to 15s if we can't get duration
  }
}

/**
 * Concatenate multiple video files using FFmpeg with crossfade transitions
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

    // Get durations of all videos
    console.log('Getting video durations...');
    const durations: number[] = [];
    for (const file of downloadedFiles) {
      const duration = await getVideoDuration(file);
      durations.push(duration);
    }

    // Build FFmpeg command with xfade and acrossfade
    console.log('Concatenating videos with crossfade transitions...');

    // Build input arguments
    const inputs = downloadedFiles
      .map(f => `-i "${f.replace(/\\/g, '/')}"`)
      .join(' ');

    // Build video filter chain with xfade
    let videoFilter = '';
    let audioFilter = '';

    if (downloadedFiles.length === 2) {
      // Simple case: 2 videos
      const offset = durations[0] - CROSSFADE_DURATION;
      videoFilter = `[0:v][1:v]xfade=transition=fade:duration=${CROSSFADE_DURATION}:offset=${offset}[outv]`;
      audioFilter = `[0:a][1:a]acrossfade=d=${CROSSFADE_DURATION}[outa]`;
    } else {
      // Complex case: 3+ videos - chain xfade filters
      let currentOffset = durations[0] - CROSSFADE_DURATION;

      // Video filter chain
      videoFilter = `[0:v][1:v]xfade=transition=fade:duration=${CROSSFADE_DURATION}:offset=${currentOffset}[v1]`;
      for (let i = 2; i < downloadedFiles.length; i++) {
        currentOffset += durations[i - 1] - CROSSFADE_DURATION;
        const prevLabel = `v${i - 1}`;
        const nextLabel = i === downloadedFiles.length - 1 ? 'outv' : `v${i}`;
        videoFilter += `;[${prevLabel}][${i}:v]xfade=transition=fade:duration=${CROSSFADE_DURATION}:offset=${currentOffset}[${nextLabel}]`;
      }

      // Audio filter chain
      audioFilter = `[0:a][1:a]acrossfade=d=${CROSSFADE_DURATION}[a1]`;
      for (let i = 2; i < downloadedFiles.length; i++) {
        const prevLabel = `a${i - 1}`;
        const nextLabel = i === downloadedFiles.length - 1 ? 'outa' : `a${i}`;
        audioFilter += `;[${prevLabel}][${i}:a]acrossfade=d=${CROSSFADE_DURATION}[${nextLabel}]`;
      }
    }

    const filterComplex = `${videoFilter};${audioFilter}`;
    const ffmpegCommand = `ffmpeg ${inputs} -filter_complex "${filterComplex}" -map "[outv]" -map "[outa]" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 192k "${outputPath}" -y`;

    console.log('Running FFmpeg with crossfade...');

    try {
      const { stderr } = await execAsync(ffmpegCommand, { timeout: 600000 }); // 10 min timeout
      if (stderr && !stderr.includes('frame=')) {
        console.log('FFmpeg output:', stderr.slice(-500));
      }
    } catch (error: unknown) {
      // FFmpeg often writes to stderr even on success, check if output exists
      const fs = await import('fs');
      if (!fs.existsSync(outputPath)) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('FFmpeg error:', errorMessage);

        // Fallback to simple concat without transitions
        console.log('Falling back to simple concatenation...');
        return await concatenateVideosSimple(downloadedFiles, tempDir);
      }
    }

    console.log('Concatenation with crossfade complete!');
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
 * Simple concatenation without transitions (fallback)
 */
async function concatenateVideosSimple(downloadedFiles: string[], tempDir: string): Promise<string> {
  const concatListPath = join(tempDir, 'concat.txt');
  const outputPath = join(tempDir, 'output.mp4');

  // Create concat list file for FFmpeg
  const concatContent = downloadedFiles
    .map(f => `file '${f.replace(/\\/g, '/')}'`)
    .join('\n');
  await writeFile(concatListPath, concatContent);

  const ffmpegCommand = `ffmpeg -f concat -safe 0 -i "${concatListPath}" -c copy "${outputPath}" -y`;

  try {
    await execAsync(ffmpegCommand, { timeout: 300000 });
  } catch (error: unknown) {
    const fs = await import('fs');
    if (!fs.existsSync(outputPath)) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`FFmpeg concatenation failed: ${errorMessage}`);
    }
  }

  console.log('Simple concatenation complete!');
  return outputPath;
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
      const { rm } = await import('fs/promises');
      await rm(dir, { recursive: true, force: true });
    }
  } catch {
    // Ignore cleanup errors
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
