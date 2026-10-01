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
  const [pendingVideoTitle, setPendingVideoTitle] = useState<string | undefined>();
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
  const handleStartGeneration = async (url: string) => {
    setLastAttemptedUrl(url);
    setGenerationError(null);
    setGenerationStep(0);
    setIsGenerating(true);

    // Check usage limits
    const usageCheck = incrementGenerationUsage();
    if (!usageCheck.allowed) {
      setGenerationError(`You have reached the free limit of 5 generations. Upgrade to Pro for unlimited study notes!`);
      return;
    }
    setUser(getUserProfile());

    try {
      // Step 0: Validate YouTube URL
      setGenerationStep(0);
      const valRes = await fetch('/api/validate-youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const valData = await valRes.json();
      if (!valRes.ok || !valData.valid) {
        throw new Error(valData.error || 'Please paste a valid YouTube video link.');
      }

      const videoInfo = valData.info;
      setPendingVideoTitle(videoInfo.title);
      setPendingThumbnail(videoInfo.thumbnailUrl);

      // Step 1: Fetch Available Transcript
      setGenerationStep(1);
      const transRes = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: videoInfo.videoId, url })
      });

      const transData = await transRes.json();
      if (!transRes.ok || !transData.success) {
        throw new Error(transData.error || "We couldn't access a usable transcript for this video. Captions may be disabled.");
      }

      // Step 2 & 3: Understanding & Organizing concepts
      setGenerationStep(2);
      await new Promise(r => setTimeout(r, 600));

      setGenerationStep(3);
      // Step 4: Call AI Engine
      const aiRes = await fetch('/api/generate-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transData.transcript,
          videoTitle: transData.title || videoInfo.title,
          videoId: videoInfo.videoId,
          youtubeUrl: videoInfo.normalizedUrl
        })
      });

      setGenerationStep(4);
      const aiData = await aiRes.json();
      if (!aiRes.ok || !aiData.success) {
        throw new Error(aiData.error || 'The AI note generator encountered an issue. Please try again.');
      }

      // Step 5: Designing Handwritten Notes
      setGenerationStep(5);
      await new Promise(r => setTimeout(r, 500));

      // Step 6: Final schema checks
      setGenerationStep(6);
      await new Promise(r => setTimeout(r, 400));

      // Successfully generated
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
      setGenerationError(err.message || "Failed to generate notes. Please check the video link.");
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
        onRetry={() => {
          if (lastAttemptedUrl) {
            handleStartGeneration(lastAttemptedUrl);
          } else {
            setIsGenerating(false);
          }
        }}
        onOpenManualPaste={() => {
          setIsGenerating(false);
          setIsManualTranscriptOpen(true);
        }}
        videoTitle={pendingVideoTitle}
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
