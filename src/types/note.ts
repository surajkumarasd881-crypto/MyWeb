export type NoteTheme = 'classic' | 'clean' | 'graph' | 'dark' | 'colorful';

export type NoteFont = 'kalam' | 'caveat' | 'patrick';

export interface NoteSection {
  id: string;
  title: string;
  content: string;
  key_points: string[];
  formula?: string | null;
  example?: string | null;
  doodle_type?: 'atom' | 'flask' | 'chart' | 'bulb' | 'dna' | 'book' | 'math' | 'check' | 'star' | null;
}

export interface NoteFormula {
  name: string;
  formula: string;
  where?: string;
  units?: string;
}

export interface NoteDefinition {
  term: string;
  definition: string;
}

export interface NoteExample {
  problem: string;
  solution: string;
  takeaway?: string;
}

export interface ExamImportantItem {
  topic: string;
  probability: 'Very High' | 'High' | 'Medium';
  tip: string;
}

export interface NoteQuestion {
  question: string;
  answer: string;
  type: 'concept' | 'numerical' | 'recall';
}

export interface NoteData {
  id: string;
  title: string;
  youtubeUrl: string;
  videoId: string;
  subject: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  introduction: string;
  summary?: string;
  sections: NoteSection[];
  formulas: NoteFormula[];
  definitions: NoteDefinition[];
  examples: NoteExample[];
  important_points: string[];
  exam_important: ExamImportantItem[];
  quick_revision: string[];
  questions: NoteQuestion[];
  final_revision: string;
  theme: NoteTheme;
  font: NoteFont;
  createdAt: string;
  updatedAt: string;
  isCustomOrSample?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  plan: 'free' | 'pro';
  generationsCount: number;
  pdfExportCount: number;
  joinedAt: string;
}

export interface GenerationStage {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

export const SUPPORTED_SUBJECTS = [
  { name: 'Mathematics', icon: 'Calculator', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { name: 'Physics', icon: 'Atom', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { name: 'Chemistry', icon: 'FlaskConical', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { name: 'Biology', icon: 'Dna', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  { name: 'History', icon: 'Clock', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { name: 'Geography', icon: 'Globe', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  { name: 'Polity', icon: 'Landmark', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { name: 'Economics', icon: 'TrendingUp', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { name: 'General Science', icon: 'Sparkles', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  { name: 'English', icon: 'BookOpen', color: 'bg-lime-100 text-lime-700 border-lime-200' },
  { name: 'Reasoning', icon: 'Brain', color: 'bg-violet-100 text-violet-700 border-violet-200' },
  { name: 'Competitive Exams (UPSC/SSC/State)', icon: 'GraduationCap', color: 'bg-amber-100 text-amber-800 border-amber-300' },
] as const;
