import { Router, Request, Response } from 'express';
import { extractYouTubeVideoId, getYouTubeMetadata, fetchYouTubeTranscript } from './youtube';
import { generateStudyNotes } from './ai';

const router = Router();

// In-memory rate limiting map: ip -> timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15; // generous for dev/preview while preventing floods

function checkRateLimit(req: Request): boolean {
  const ip = req.ip || req.socket.remoteAddress || 'client';
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return true;
}

/**
 * Check backend configuration status
 */
router.get('/config-status', (req: Request, res: Response) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  const hasYoutubeKey = Boolean(process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_API_KEY.trim().length > 0);

  res.json({
    status: 'ok',
    services: {
      ai: {
        provider: 'Google Gemini (gemini-3.8-flash)',
        configured: hasGeminiKey,
        notice: hasGeminiKey ? 'Ready' : 'GEMINI_API_KEY not configured in environment'
      },
      youtubeTranscript: {
        provider: 'Direct Caption Tracks & TimedText Parser',
        configured: true,
        hasApiKey: hasYoutubeKey
      },
      export: {
        pdf: 'High-res Vector Canvas & Multi-page A4 PDF',
        print: 'Direct Window Print with media print styling'
      }
    }
  });
});

/**
 * Validate YouTube URL
 */
router.post('/validate-youtube', async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ valid: false, error: 'Please enter a valid YouTube video URL.' });
  }

  const result = await getYouTubeMetadata(url);
  if (!result.valid) {
    return res.status(400).json(result);
  }

  return res.json(result);
});

/**
 * Fetch YouTube transcript
 */
router.post('/transcript', async (req: Request, res: Response) => {
  if (!checkRateLimit(req)) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please wait a few moments before trying again.'
    });
  }

  const { videoId, url } = req.body;
  let targetId = videoId;

  if (!targetId && url) {
    targetId = extractYouTubeVideoId(url);
  }

  if (!targetId) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a valid YouTube video URL.'
    });
  }

  const result = await fetchYouTubeTranscript(targetId);
  return res.json(result);
});

/**
 * Generate Structured Notes from Transcript
 */
router.post('/generate-notes', async (req: Request, res: Response) => {
  if (!checkRateLimit(req)) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please wait a few moments before trying again.'
    });
  }

  const { transcript, videoTitle, videoId, youtubeUrl, subjectHint } = req.body;

  if (!transcript || typeof transcript !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Transcript content is required.'
    });
  }

  const result = await generateStudyNotes({
    transcript,
    videoTitle,
    videoId,
    youtubeUrl,
    subjectHint
  });

  if (!result.success) {
    return res.status(result.errorCode === 'API_KEY_NOT_CONFIGURED' ? 503 : 500).json(result);
  }

  return res.json(result);
});

export default router;
