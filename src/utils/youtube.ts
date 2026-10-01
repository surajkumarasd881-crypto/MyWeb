/**
 * Centralized YouTube URL validator and VIDEO_ID extractor for ReviseKaro
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID (with any query params like &t=..., &list=..., feature=...)
 * - https://youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID (with query params like ?si=..., ?t=...)
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * - m.youtube.com and youtube-nocookie.com variants
 * - Direct 11-char IDs
 * - Leading/trailing whitespace
 */
export function extractYouTubeVideoId(input: string | null | undefined): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  // 1. Direct 11-character video ID check
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // 2. Prepend protocol if missing so URL constructor works reliably
  const urlWithProtocol = /^[a-zA-Z]+:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(urlWithProtocol);
    const hostname = parsed.hostname.toLowerCase().replace(/^(?:www\.|m\.)/, '');

    // Case A: youtu.be/<VIDEO_ID>
    if (hostname === 'youtu.be') {
      const pathname = parsed.pathname.replace(/^\/+/, '');
      const possibleId = pathname.split('/')[0];
      if (possibleId && /^[a-zA-Z0-9_-]{11}$/.test(possibleId)) {
        return possibleId;
      }
    }

    // Case B: youtube.com or youtube-nocookie.com
    if (hostname === 'youtube.com' || hostname === 'youtube-nocookie.com') {
      // 1. Standard query parameter: ?v=VIDEO_ID (anywhere in query string)
      const vParam = parsed.searchParams.get('v');
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
        return vParam;
      }

      // 2. Path-based: /shorts/<VIDEO_ID>, /embed/<VIDEO_ID>, /live/<VIDEO_ID>, /v/<VIDEO_ID>
      const segments = parsed.pathname.split('/').filter(Boolean);
      if (segments.length >= 2) {
        const route = segments[0].toLowerCase();
        const candidateId = segments[1];
        if (['shorts', 'embed', 'live', 'v'].includes(route)) {
          if (candidateId && /^[a-zA-Z0-9_-]{11}$/.test(candidateId)) {
            return candidateId;
          }
        }
      }

      // 3. Path-based /watch/<VIDEO_ID> (legacy)
      if (segments.length >= 2 && segments[0].toLowerCase() === 'watch') {
        const candidateId = segments[1];
        if (candidateId && /^[a-zA-Z0-9_-]{11}$/.test(candidateId)) {
          return candidateId;
        }
      }
    }
  } catch {
    // If standard URL parsing throws, fallback to regex
  }

  // 3. Fallback regex patterns for unusual or malformed URLs
  const fallbackPatterns = [
    // youtu.be/VIDEO_ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/i,
    // youtube.com/(embed|shorts|live|v)/VIDEO_ID
    /youtube\.com\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/i,
    // youtube.com/watch?v=VIDEO_ID with any preceding or subsequent params
    /youtube\.com\/watch\?(?:[^#\s]*&)?v=([a-zA-Z0-9_-]{11})/i,
    // youtube.com/watch/VIDEO_ID
    /youtube\.com\/watch\/([a-zA-Z0-9_-]{11})/i
  ];

  for (const regex of fallbackPatterns) {
    const match = trimmed.match(regex);
    if (match && match[1] && /^[a-zA-Z0-9_-]{11}$/.test(match[1])) {
      return match[1];
    }
  }

  return null;
}

/**
 * Validates whether an input string is a valid YouTube URL format
 */
export function isValidYouTubeUrl(input: string | null | undefined): boolean {
  return extractYouTubeVideoId(input) !== null;
}
