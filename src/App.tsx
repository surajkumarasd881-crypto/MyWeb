import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustElements } from './components/TrustElements';
import { HowItWorks } from './components/HowItWorks';
import { SubjectBadges } from './components/SubjectBadges';
import { SampleNoteShowcase } from './components/SampleNoteShowcase';
import { PricingSection } from './components/PricingSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { NoteWorkspace } from './components/NoteWorkspace';
import { GenerationProgressModal } from './components/GenerationProgressModal';
import { ManualTranscriptModal } from './components/ManualTranscriptModal';
import { MyNotesModal } from './components/MyNotesModal';
import { ApiStatusModal } from './components/ApiStatusModal';
import { NoteData, UserProfile } from './types/note';
import { extractYouTubeVideoId } from './utils/youtube';
import { 
  getSavedNotes, 
  saveNoteToStorage, 
  deleteNoteFromStorage, 
  getUserProfile, 
  updateUserProfile,
  incrementGenerationUsage
} from './services/storage';
import { SAMPLE_PHYSICS_NOTE } from './services/sampleData';
import confetti from 'canvas-confetti';

export default function App() {
  // Application View
  const [activeView, setActiveView] = useState<'home' | 'note'>('home');
  const [currentNote, setCurrentNote] = useState<NoteData>(SAMPLE_PHYSICS_NOTE);
  const [savedNotes, setSavedNotes] = useState<NoteData[]>([]);
  const [user, setUser] = useState<UserProfile>(getUserProfile());

  // Generation Modal State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationErrorCode, setGenerationErrorCode] = useState<string | null>(null);
  const [pendingVideoTitle, setPendingVideoTitle] = useState<string | undefined>();
  const [pendingVideoId, setPendingVideoId] = useState<string | undefined>();
  const [pendingThumbnail, setPendingThumbnail] = useState<string | undefined>();
  const [lastAttemptedUrl, setLastAttemptedUrl] = useState<string>('');

  // Auxiliary Modals
  const [isMyNotesOpen, setIsMyNotesOpen] = useState(false);
  const [isManualTranscriptOpen, setIsManualTranscriptOpen] = useState(false);
  const [isApiStatusOpen, setIsApiStatusOpen] = useState(false);

  // Initialize saved notes from storage
  useEffect(() => {
    const loadedNotes = getSavedNotes();
    setSavedNotes(loadedNotes);
    setUser(getUserProfile());
  }, []);

  // Update a note
  const handleUpdateNote = (updated: NoteData) => {
    setCurrentNote(updated);
    saveNoteToStorage(updated);
    setSavedNotes(getSavedNotes());
  };

  // Open note in workspace
  const handleOpenNote = (noteToOpen: NoteData) => {
    setCurrentNote(noteToOpen);
    setActiveView('note');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete note
  const handleDeleteNote = (id: string) => {
    deleteNoteFromStorage(id);
    const updated = getSavedNotes();
    setSavedNotes(updated);
    if (currentNote.id === id && updated.length > 0) {
      setCurrentNote(updated[0]);
    }
  };

  // Upgrade Plan
  const handleUpgradeToPro = () => {
    const updated = updateUserProfile({ plan: 'pro' });
    setUser(updated);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });
    alert('Congratulations! You are now upgraded to ReviseKaro Pro with unlimited generations and all themes!');
  };

  // Core YouTube Generation Flow
  const handleStartGeneration = async (url: string, explicitVideoId?: string) => {
    setLastAttemptedUrl(url);
    setGenerationError(null);
    setGenerationErrorCode(null);

    // 1. URL validation & VIDEO_ID extraction
    const videoId = explicitVideoId || extractYouTubeVideoId(url);
    if (!videoId) {
      setGenerationError('Please enter a valid YouTube video URL.');
      setGenerationErrorCode('INVALID_URL');
      setIsGenerating(true);
      return;
    }

    // Set confirmed video details
    setPendingVideoId(videoId);
    setPendingThumbnail(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
    setPendingVideoTitle('YouTube Educational Lecture');
    setGenerationStep(0); // "Analyzing video..."
    setIsGenerating(true);

    // Check usage limits
    const usageCheck = incrementGenerationUsage();
    if (!usageCheck.allowed) {
      setGenerationError(`You have reached the free limit of 5 generations. Upgrade to Pro for unlimited study notes!`);
      return;
    }
    setUser(getUserProfile());

    try {
      // Step 0: Analyzing video and metadata
      fetch('/api/validate-youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
        .then(res => res.json())
        .then(data => {
          if (data?.info?.title) {
            setPendingVideoTitle(data.info.title);
          }
        })
        .catch(() => {});

      // Step 1: Extracting content... (Captions or Speech-to-Text Fallback)
      setGenerationStep(1);
      const transRes = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, url })
      });

      const transData = await transRes.json();
      if (!transRes.ok || !transData.success || !transData.transcript) {
        if (transData.errorCode === 'VIDEO_UNAVAILABLE') {
          setGenerationErrorCode('VIDEO_UNAVAILABLE');
          setGenerationError('Video could not be accessed. Please check that the YouTube video is public and the link is correct.');
          return;
        } else {
          setGenerationErrorCode('FETCH_FAILED');
          setGenerationError("We couldn't process this video right now. Please try again.");
          return;
        }
      }

      const verifiedTitle = transData.title || pendingVideoTitle || 'YouTube Lecture Notes';
      setPendingVideoTitle(verifiedTitle);

      // Step 2: Creating your notes...
      setGenerationStep(2);
      const aiRes = await fetch('/api/generate-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transData.transcript,
          videoTitle: verifiedTitle,
          videoId,
          youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`
        })
      });

      const aiData = await aiRes.json();
      if (!aiRes.ok || !aiData.success) {
        setGenerationErrorCode('AI_FAILED');
        setGenerationError("We couldn't process this video right now. Please try again.");
        return;
      }

      // Successfully generated notes
      const generatedNote: NoteData = {
        ...aiData.notes,
        theme: 'classic',
        font: 'kalam'
      };

      saveNoteToStorage(generatedNote);
      setSavedNotes(getSavedNotes());
      setCurrentNote(generatedNote);
      setIsGenerating(false);
      setActiveView('note');

      // Celebration
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.7 }
      });

    } catch (err: any) {
      console.error('Generation process error:', err);
      setGenerationErrorCode('FETCH_FAILED');
      setGenerationError("We couldn't process this video right now. Please try again.");
    }
  };

  // Custom manual transcript submission
  const handleManualTranscriptSubmit = async (data: { transcript: string; title: string; subjectHint?: string }) => {
    setIsManualTranscriptOpen(false);
    setGenerationError(null);
    setGenerationStep(2);
    setIsGenerating(true);
    setPendingVideoTitle(data.title);
    setPendingThumbnail(undefined);

    try {
      setGenerationStep(3);
      const aiRes = await fetch('/api/generate-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: data.transcript,
          videoTitle: data.title,
          subjectHint: data.subjectHint
        })
      });

      setGenerationStep(4);
      const aiData = await aiRes.json();
      if (!aiRes.ok || !aiData.success) {
        throw new Error(aiData.error || 'The AI note generator encountered an issue.');
      }

      setGenerationStep(5);
      await new Promise(r => setTimeout(r, 400));
      setGenerationStep(6);

      const generatedNote: NoteData = {
        ...aiData.notes,
        theme: 'classic',
        font: 'kalam'
      };

      saveNoteToStorage(generatedNote);
      setSavedNotes(getSavedNotes());
      setCurrentNote(generatedNote);
      setIsGenerating(false);
      setActiveView('note');

      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.7 }
      });
    } catch (err: any) {
      setGenerationError(err.message || 'Failed to generate notes.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950">
      
      {/* Navbar (visible on all views) */}
      <Navbar
        user={user}
        savedCount={savedNotes.length}
        onOpenMyNotes={() => setIsMyNotesOpen(true)}
        onOpenPricing={() => {
          if (activeView !== 'home') setActiveView('home');
          setTimeout(() => {
            const el = document.getElementById('pricing');
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onOpenApiStatus={() => setIsApiStatusOpen(true)}
        onLoadSample={() => handleOpenNote(SAMPLE_PHYSICS_NOTE)}
        activeView={activeView}
        onNavigateHome={() => setActiveView('home')}
      />

      {/* Main View Router */}
      {activeView === 'note' ? (
        <NoteWorkspace
          note={currentNote}
          onUpdateNote={handleUpdateNote}
          onBack={() => setActiveView('home')}
          onOpenMyNotes={() => setIsMyNotesOpen(true)}
        />
      ) : (
        <main className="flex-1">
          {/* Hero Section */}
          <Hero
            onStartGeneration={handleStartGeneration}
            onOpenManualTranscript={() => setIsManualTranscriptOpen(true)}
            onLoadSample={() => handleOpenNote(SAMPLE_PHYSICS_NOTE)}
            isLoading={isGenerating}
            errorMessage={generationError}
          />

          {/* Trust Elements ("Why ReviseKaro?") */}
          <TrustElements />

          {/* Interactive Sample Note Showcase */}
          <SampleNoteShowcase
            onOpenSampleInEditor={(sampleNote) => handleOpenNote(sampleNote)}
          />

          {/* 4-Step How It Works */}
          <HowItWorks />

          {/* Supported Subjects Showcase */}
          <SubjectBadges />

          {/* Freemium Pricing Section */}
          <PricingSection
            user={user}
            onUpgradeToPro={handleUpgradeToPro}
          />

          {/* FAQ Section */}
          <FaqSection />
        </main>
      )}

      {/* Footer (on home view) */}
      {activeView === 'home' && (
        <Footer
          onNavigateHome={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPricing={() => {
            const el = document.getElementById('pricing');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Generation Progress Modal */}
      <GenerationProgressModal
        isOpen={isGenerating}
        onClose={() => setIsGenerating(false)}
        currentStepIndex={generationStep}
        error={generationError}
        errorCode={generationErrorCode}
        onRetry={() => {
          if (lastAttemptedUrl) {
            handleStartGeneration(lastAttemptedUrl, pendingVideoId);
          } else {
            setIsGenerating(false);
          }
        }}
        onOpenManualPaste={() => {
          setIsGenerating(false);
          setIsManualTranscriptOpen(true);
        }}
        onTryAnotherVideo={() => {
          setIsGenerating(false);
          setGenerationError(null);
          setGenerationErrorCode(null);
        }}
        videoTitle={pendingVideoTitle}
        videoId={pendingVideoId}
        thumbnailUrl={pendingThumbnail}
      />

      {/* Manual Transcript Fallback Modal */}
      <ManualTranscriptModal
        isOpen={isManualTranscriptOpen}
        onClose={() => setIsManualTranscriptOpen(false)}
        onSubmit={handleManualTranscriptSubmit}
        initialTitle={pendingVideoTitle}
      />

      {/* My Notes Library / Dashboard Modal */}
      <MyNotesModal
        isOpen={isMyNotesOpen}
        onClose={() => setIsMyNotesOpen(false)}
        notes={savedNotes}
        onOpenNote={handleOpenNote}
        onDeleteNote={handleDeleteNote}
        onDownloadNote={(noteToDl) => handleOpenNote(noteToDl)}
      />

      {/* Backend & AI Health Inspector Modal */}
      <ApiStatusModal
        isOpen={isApiStatusOpen}
        onClose={() => setIsApiStatusOpen(false)}
      />

    </div>
  );
}
