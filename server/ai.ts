import { GoogleGenAI } from '@google/genai';

export interface GenerateNotesRequest {
  transcript: string;
  videoTitle?: string;
  videoId?: string;
  youtubeUrl?: string;
  subjectHint?: string;
}

export interface GeneratedNotesResponse {
  success: boolean;
  notes?: any;
  error?: string;
  errorCode?: string;
}

/**
 * Validates and repairs JSON strings if needed
 */
function safeParseJson(rawText: string): any {
  let cleanText = rawText.trim();
  // Strip markdown code fences if model wrapped response in ```json ... ```
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  }

  try {
    return JSON.parse(cleanText);
  } catch (err) {
    // Attempt basic recovery: find first '{' and last '}'
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const extracted = cleanText.substring(firstBrace, lastBrace + 1);
      return JSON.parse(extracted);
    }
    throw err;
  }
}

/**
 * Splits extra-long transcripts into chunks (approx 12,000 words each)
 */
function chunkTranscript(text: string, maxChunkLength = 35000): string[] {
  if (text.length <= maxChunkLength) return [text];

  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    let endIndex = startIndex + maxChunkLength;
    if (endIndex < text.length) {
      // Find sentence or space boundary
      const lastPeriod = text.lastIndexOf('. ', endIndex);
      if (lastPeriod > startIndex + maxChunkLength * 0.7) {
        endIndex = lastPeriod + 1;
      }
    }
    chunks.push(text.substring(startIndex, endIndex));
    startIndex = endIndex;
  }

  return chunks;
}

export async function generateStudyNotes(req: GenerateNotesRequest): Promise<GeneratedNotesResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      errorCode: 'API_KEY_NOT_CONFIGURED',
      error: 'GEMINI_API_KEY is not configured in the server environment. Please set GEMINI_API_KEY in your secrets or .env.'
    };
  }

  if (!req.transcript || req.transcript.trim().length < 40) {
    return {
      success: false,
      errorCode: 'EMPTY_TRANSCRIPT',
      error: 'Transcript content is too short or empty to generate comprehensive study notes.'
    };
  }

  const ai = new GoogleGenAI();
  const chunks = chunkTranscript(req.transcript);

  // If multi-chunk, summarize and combine
  let contentToProcess = req.transcript;
  if (chunks.length > 1) {
    try {
      const chunkSummaries: string[] = [];
      for (let i = 0; i < chunks.length; i++) {
        const intermediate = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are an expert educational note extractor. Summarize the following lecture transcript section (${i + 1}/${chunks.length}), preserving all core facts, formulas, steps, dates, and definitions:\n\n${chunks[i]}`
        });
        if (intermediate.text) {
          chunkSummaries.push(intermediate.text);
        }
      }
      contentToProcess = chunkSummaries.join('\n\n--- NEXT SEGMENT ---\n\n');
    } catch (chunkErr) {
      console.warn('Long video chunking warning, falling back to first 40,000 chars:', chunkErr);
      contentToProcess = req.transcript.substring(0, 40000);
    }
  }

  const systemInstruction = `You are ReviseKaro's Master Educational Note Generator.
Your mission is to turn lecture transcripts into world-class, structured, revision-ready study notes that students can directly study and revise from.

CRITICAL RULES:
1. STRICT TRUTHFULNESS: Never invent facts, formulas, examples, citations, or data unsupported by the source transcript. If a fact is unclear or missing, state "Not clearly explained in the source."
2. SUBJECT AWARENESS:
   - For Mathematics/Physics/Chemistry: Output formal equations, variables, units, formula cards, and step-by-step logic.
   - For History/Geography/Polity: Highlight chronology, timelines, key figures, causes, effects, and comparisons.
   - For Biology: Highlight definitions, biological functions, and processes.
   - For Competitive Exams: Emphasize exam-important facts, short mnemonics/tricks, and concept comparisons.
3. OUTPUT FORMAT: Respond ONLY with valid JSON conforming to the requested schema. No conversational preamble, no markdown outer text.

JSON Schema:
{
  "title": "Clean, descriptive lecture topic title",
  "subject": "Mathematics | Physics | Chemistry | Biology | History | Geography | Polity | Economics | General Science | English | Reasoning | UPSC / Competitive | Other",
  "difficulty": "Beginner | Intermediate | Advanced",
  "introduction": "2-4 concise, high-impact lines framing the core concept",
  "summary": "1-2 sentence high-level overview",
  "sections": [
    {
      "id": "sec-1",
      "title": "Section Title",
      "content": "Detailed educational explanation in clear student-friendly prose.",
      "key_points": ["Point 1", "Point 2", "Point 3"],
      "formula": "optional mathematical or scientific formula string if relevant, else null",
      "example": "optional illustrative real-world example from lecture if relevant, else null",
      "doodle_type": "atom | flask | chart | bulb | dna | book | math | check | star"
    }
  ],
  "formulas": [
    {
      "name": "Formula Name",
      "formula": "e.g. F = m * a",
      "where": "Explanation of each variable",
      "units": "SI units"
    }
  ],
  "definitions": [
    {
      "term": "Key Concept / Term",
      "definition": "Precise, exam-friendly definition"
    }
  ],
  "examples": [
    {
      "problem": "Problem statement or question presented in lecture",
      "solution": "Step-by-step worked out solution",
      "takeaway": "Key takeaway lesson"
    }
  ],
  "important_points": [
    "Crucial fact 1",
    "Crucial fact 2",
    "Crucial fact 3"
  ],
  "exam_important": [
    {
      "topic": "Concept name",
      "probability": "Very High | High | Medium",
      "tip": "Revision tip / common pitfall to avoid in exams"
    }
  ],
  "quick_revision": [
    "Ultra-short 1-liner bullet 1",
    "Ultra-short 1-liner bullet 2",
    "Ultra-short 1-liner bullet 3",
    "Ultra-short 1-liner bullet 4"
  ],
  "questions": [
    {
      "question": "Clear self-test question strictly from source material",
      "answer": "Accurate, concise model answer",
      "type": "concept | numerical | recall"
    }
  ],
  "final_revision": "A compact final synthesis paragraph tying the entire lecture together for quick pre-exam review."
}`;

  const prompt = `Video Title: ${req.videoTitle || 'Educational Lecture'}
${req.subjectHint ? `Subject Hint: ${req.subjectHint}\n` : ''}
Transcript Content:
${contentToProcess}

Generate the complete structured JSON study notes according to the specification.`;

  const candidateModels = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const responseText = response.text;
      if (!responseText) {
        continue;
      }

      const parsedJson = safeParseJson(responseText);

      // Validate essential keys
      if (!parsedJson.title || !parsedJson.sections || !Array.isArray(parsedJson.sections)) {
        continue;
      }

      // Attach metadata
      const finalNotes = {
        id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        videoId: req.videoId || '',
        youtubeUrl: req.youtubeUrl || '',
        theme: 'classic',
        font: 'kalam',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...parsedJson
      };

      return {
        success: true,
        notes: finalNotes
      };
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${modelName} attempt warning:`, err?.message || err);
      // Brief wait before fallback
      await new Promise(res => setTimeout(res, 600));
    }
  }

  console.error('All AI Model attempts failed:', lastError);
  return {
    success: false,
    errorCode: 'AI_GENERATION_FAILED',
    error: lastError?.message || 'An error occurred while generating study notes. Please check the lecture transcript and try again.'
  };
}
