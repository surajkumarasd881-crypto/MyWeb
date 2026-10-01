import { NoteData, UserProfile } from '../types/note';
import { ALL_SAMPLE_NOTES } from './sampleData';

const NOTES_STORAGE_KEY = 'revisekaro_saved_notes_v1';
const USER_STORAGE_KEY = 'revisekaro_user_profile_v1';

export const DEFAULT_USER: UserProfile = {
  id: 'usr_guest_demo',
  name: 'Student Learner',
  email: 'learner@revisekaro.app',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  plan: 'free',
  generationsCount: 1,
  pdfExportCount: 0,
  joinedAt: new Date().toISOString()
};

export const FREE_GENERATION_LIMIT = 5;

export function getSavedNotes(): NoteData[] {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) {
      // Seed with initial sample note so user immediately sees notes
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(ALL_SAMPLE_NOTES));
      return ALL_SAMPLE_NOTES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : ALL_SAMPLE_NOTES;
  } catch (e) {
    console.error('Failed to parse saved notes from localStorage', e);
    return ALL_SAMPLE_NOTES;
  }
}

export function saveNoteToStorage(note: NoteData): NoteData {
  try {
    const current = getSavedNotes();
    const existingIndex = current.findIndex(n => n.id === note.id);
    const updatedNote = { ...note, updatedAt: new Date().toISOString() };
    
    let updatedList: NoteData[];
    if (existingIndex >= 0) {
      updatedList = [...current];
      updatedList[existingIndex] = updatedNote;
    } else {
      updatedList = [updatedNote, ...current];
    }
    
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedList));
    return updatedNote;
  } catch (e) {
    console.error('Failed to save note to localStorage', e);
    return note;
  }
}

export function deleteNoteFromStorage(id: string): boolean {
  try {
    const current = getSavedNotes();
    const filtered = current.filter(n => n.id !== id);
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Failed to delete note', e);
    return false;
  }
}

export function getUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USER;
  }
}

export function updateUserProfile(updates: Partial<UserProfile>): UserProfile {
  try {
    const current = getUserProfile();
    const updated = { ...current, ...updates };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_USER;
  }
}

export function incrementGenerationUsage(): { allowed: boolean; remaining: number } {
  const profile = getUserProfile();
  if (profile.plan === 'pro') {
    updateUserProfile({ generationsCount: profile.generationsCount + 1 });
    return { allowed: true, remaining: 999 };
  }
  
  if (profile.generationsCount >= FREE_GENERATION_LIMIT) {
    return { allowed: false, remaining: 0 };
  }
  
  const newCount = profile.generationsCount + 1;
  updateUserProfile({ generationsCount: newCount });
  return { allowed: true, remaining: FREE_GENERATION_LIMIT - newCount };
}

export function incrementPdfExport(): void {
  const profile = getUserProfile();
  updateUserProfile({ pdfExportCount: profile.pdfExportCount + 1 });
}
