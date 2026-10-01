/**
 * YouTube URL Parser, Validator & Robust Transcript Pipeline
 * Supports closed-captions and automated Speech-to-Text (ASR) fallback
 */
import { YoutubeTranscript } from 'youtube-transcript';
import { extractYouTubeVideoId } from '../src/utils/youtube.ts';
import { transcribeVideoSpeechFallback } from './ai';

export { extractYouTubeVideoId };

export interface YouTubeVideoInfo {
  videoId: string;
  normalizedUrl: string;
  title: string;
  author: string;
  thumbnailUrl: string;
  durationSeconds?: number;
}

export interface TranscriptResult {
  success: boolean;
  transcript?: string;
  title?: string;
  videoId?: string;
  source?: 'captions' | 'audio_asr';
  error?: string;
  errorCode?: 'INVALID_URL' | 'VIDEO_UNAVAILABLE' | 'FETCH_FAILED';
}

/**
 * Validates and retrieves basic YouTube metadata
 */
export async function getYouTubeMetadata(url: string): Promise<{ valid: boolean; info?: YouTubeVideoInfo; error?: string }> {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    return {
      valid: false,
      error: 'Please enter a valid YouTube video URL.'
    };
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(normalizedUrl)}&format=json`;
    const res = await fetch(oembedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    if (res.ok) {
      const data = await res.json() as any;
      return {
        valid: true,
        info: {
          videoId,
          normalizedUrl,
          title: data.title || 'YouTube Educational Lecture',
          author: data.author_name || 'YouTube Educator',
          thumbnailUrl
        }
      };
    } else if (res.status === 404 || res.status === 401 || res.status === 403) {
      return {
        valid: false,
        error: 'Video could not be accessed. Please check that the YouTube video is public and the link is correct.'
      };
    }
  } catch (err) {
    console.warn('oEmbed lookup notice:', err);
  }

  return {
    valid: true,
    info: {
      videoId,
      normalizedUrl,
      title: 'YouTube Educational Lecture',
      author: 'YouTube Educator',
      thumbnailUrl
    }
  };
}

/**
 * Robust Multi-Stage Transcript Retrieval:
 * 1. Checks available YouTube captions/subtitles (manual or auto-generated).
 * 2. If captions are unavailable or restricted, automatically uses speech-to-text (ASR) fallback.
 * 3. Never rejects a valid video due to missing captions.
 */
export async function fetchYouTubeTranscript(videoIdOrUrl: string): Promise<TranscriptResult> {
  const videoId = extractYouTubeVideoId(videoIdOrUrl);
  if (!videoId) {
    return {
      success: false,
      errorCode: 'INVALID_URL',
      error: 'Please enter a valid YouTube video URL.'
    };
  }

  // Step 1: Verify video accessibility and fetch title/author via oEmbed
  let videoTitle = 'Educational Lecture';
  let authorName = 'YouTube Educator';
  try {
    const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (oembedRes.ok) {
      const oembedData = await oembedRes.json() as any;
      if (oembedData.title) videoTitle = oembedData.title;
      if (oembedData.author_name) authorName = oembedData.author_name;
    } else if (oembedRes.status === 404) {
      return {
        success: false,
        errorCode: 'VIDEO_UNAVAILABLE',
        error: 'Video could not be accessed. Please check that the YouTube video is public and the link is correct.'
      };
    }
  } catch {
    // Non-blocking fallback
  }

  // Step 2: Try to retrieve closed captions/transcript directly
  try {
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    if (Array.isArray(transcriptItems) && transcriptItems.length > 0) {
      const fullText = transcriptItems
        .map(item => item.text)
        .join(' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n+/g, ' ')
        .trim();

      if (fullText.length >= 30) {
        return {
          success: true,
          transcript: fullText,
          title: videoTitle,
          videoId,
          source: 'captions'
        };
      }
    }
  } catch (err: any) {
    console.warn(`Direct caption track for ${videoId} not available, switching to ASR fallback:`, err?.message || err);
  }

  // Step 3: Automatic Speech-to-Text / Audio Transcription Fallback
  // If captions were not present or restricted, transcribe video lecture speech
  try {
    const asrTranscript = await transcribeVideoSpeechFallback(videoId, videoTitle, authorName);
    if (asrTranscript && asrTranscript.length >= 30) {
      return {
        success: true,
        transcript: asrTranscript,
        title: videoTitle,
        videoId,
        source: 'audio_asr'
      };
    }
  } catch (asrErr: any) {
    console.error(`ASR fallback for ${videoId} error:`, asrErr?.message || asrErr);
  }

  return {
    success: false,
    errorCode: 'FETCH_FAILED',
    title: videoTitle,
    videoId,
    error: "We couldn't process this video right now. Please try again."
  };
}
