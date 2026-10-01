/**
 * YouTube URL Parser, Validator & Transcript Service
 */

export interface YouTubeVideoInfo {
  videoId: string;
  normalizedUrl: string;
  title?: string;
  author?: string;
  thumbnailUrl: string;
  durationSeconds?: number;
}

export interface TranscriptResult {
  success: boolean;
  transcript?: string;
  title?: string;
  videoId?: string;
  error?: string;
  errorCode?: 'INVALID_URL' | 'VIDEO_UNAVAILABLE' | 'TRANSCRIPT_UNAVAILABLE' | 'FETCH_FAILED';
}

/**
 * Extracts YouTube Video ID from any standard format:
 * - youtube.com/watch?v=...
 * - youtu.be/...
 * - youtube.com/shorts/...
 * - youtube.com/embed/...
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();

  // Pattern matching all variations
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/i,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/live\/([a-zA-Z0-9_-]{11})/i,
    /^[a-zA-Z0-9_-]{11}$/ // Direct 11-char ID
  ];

  for (const regex of patterns) {
    const match = cleanUrl.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Also check URL parameters fallback
  try {
    const parsed = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
    const vParam = parsed.searchParams.get('v');
    if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
      return vParam;
    }
  } catch {
    // Ignore invalid url parse error
  }

  return null;
}

/**
 * Validates and retrieves basic YouTube metadata
 */
export async function getYouTubeMetadata(url: string): Promise<{ valid: boolean; info?: YouTubeVideoInfo; error?: string }> {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    return {
      valid: false,
      error: 'Please paste a valid YouTube video link (e.g. https://www.youtube.com/watch?v=...)'
    };
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    // Attempt to fetch oEmbed metadata for video title
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
          title: data.title || 'YouTube Lecture',
          author: data.author_name || 'Educator',
          thumbnailUrl
        }
      };
    }
  } catch (err) {
    console.warn('oEmbed lookup notice (falling back to standard format):', err);
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
 * Clean and parse transcript xml or json3
 */
function parseTranscriptXml(xmlText: string): string {
  // Extract text within <text ...>content</text>
  const regex = /<text[^>]*>([\s\S]*?)<\/text>/gi;
  const segments: string[] = [];
  let match;

  while ((match = regex.exec(xmlText)) !== null) {
    let clean = match[1]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n/g, ' ')
      .trim();
    if (clean) {
      segments.push(clean);
    }
  }

  return segments.join(' ');
}

/**
 * Retrieves transcript through YouTube caption tracks
 */
export async function fetchYouTubeTranscript(videoId: string): Promise<TranscriptResult> {
  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return {
      success: false,
      errorCode: 'INVALID_URL',
      error: 'Please paste a valid YouTube video link.'
    };
  }

  try {
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await fetch(watchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      return {
        success: false,
        errorCode: 'VIDEO_UNAVAILABLE',
        error: 'This video is unavailable, restricted, or private.'
      };
    }

    const html = await response.text();

    // Check if video is playable
    if (html.includes('class="g-recaptcha"') || html.includes('consent.youtube.com')) {
      return {
        success: false,
        errorCode: 'FETCH_FAILED',
        error: 'YouTube requires verification for this video. You can paste the transcript or notes text directly.'
      };
    }

    // Look for ytInitialPlayerResponse
    const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});(?:\s*var\s|\s*<\/script>)/);
    let playerResponse: any = null;

    if (playerResponseMatch) {
      try {
        playerResponse = JSON.parse(playerResponseMatch[1]);
      } catch (e) {
        // Continue fallback search
      }
    }

    // Extract title if available
    let videoTitle = playerResponse?.videoDetails?.title || 'Lecture Notes';

    // Extract caption tracks
    const captionTracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

    if (!captionTracks || !Array.isArray(captionTracks) || captionTracks.length === 0) {
      return {
        success: false,
        errorCode: 'TRANSCRIPT_UNAVAILABLE',
        title: videoTitle,
        videoId,
        error: "We couldn't access a usable transcript for this video. The creator might not have enabled subtitles/captions."
      };
    }

    // Prefer English track, or fallback to first available
    let selectedTrack = captionTracks.find(
      (track: any) => track.languageCode === 'en' || (track.name && track.name.simpleText?.toLowerCase().includes('english'))
    ) || captionTracks[0];

    if (!selectedTrack?.baseUrl) {
      return {
        success: false,
        errorCode: 'TRANSCRIPT_UNAVAILABLE',
        title: videoTitle,
        videoId,
        error: "We couldn't access a usable transcript for this video."
      };
    }

    // Fetch the caption content
    const captionRes = await fetch(selectedTrack.baseUrl);
    if (!captionRes.ok) {
      return {
        success: false,
        errorCode: 'FETCH_FAILED',
        title: videoTitle,
        videoId,
        error: "Failed to download the caption track from YouTube."
      };
    }

    const captionXml = await captionRes.text();
    const parsedText = parseTranscriptXml(captionXml);

    if (!parsedText || parsedText.trim().length < 50) {
      return {
        success: false,
        errorCode: 'TRANSCRIPT_UNAVAILABLE',
        title: videoTitle,
        videoId,
        error: "The transcript retrieved from the video was too short or empty."
      };
    }

    return {
      success: true,
      transcript: parsedText,
      title: videoTitle,
      videoId
    };

  } catch (err: any) {
    console.error('Error fetching transcript:', err);
    return {
      success: false,
      errorCode: 'FETCH_FAILED',
      error: "We couldn't retrieve the transcript. You can paste the transcript text directly to generate notes."
    };
  }
}
