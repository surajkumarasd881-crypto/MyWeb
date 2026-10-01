import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Download, Printer, Copy, FileText, Check, 
  Palette, Type, Plus, Trash2, ArrowUp, ArrowDown, Sparkles, 
  Share2, Save, Undo2, Redo2, Highlighter, HelpCircle, 
  ChevronRight, Bookmark, BookOpen, ExternalLink, RefreshCw
} from 'lucide-react';
import { NoteData, NoteTheme, NoteFont, NoteSection } from '../types/note';
import { NoteDoodle } from './NoteDoodles';
import { exportToPdf, printNotes, exportAsMarkdown, exportAsPlainText } from '../services/pdfExport';
import confetti from 'canvas-confetti';

interface NoteWorkspaceProps {
  note: NoteData;
  onUpdateNote: (updated: NoteData) => void;
  onBack: () => void;
  onOpenMyNotes: () => void;
}

export const NoteWorkspace: React.FC<NoteWorkspaceProps> = ({
  note,
  onUpdateNote,
  onBack,
  onOpenMyNotes
}) => {
  // Current working state
  const [currentNote, setCurrentNote] = useState<NoteData>(note);
  const [history, setHistory] = useState<NoteData[]>([note]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // UI state
  const [isSaved, setIsSaved] = useState(true);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'sections' | 'style'>('preview');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [selectedHighlightColor, setSelectedHighlightColor] = useState<'yellow' | 'green' | 'pink' | 'blue'>('yellow');
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(null);

  // New section modal
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionContent, setNewSectionContent] = useState('');

  // Notebook DOM ref for high-res PDF generation
  const notebookRef = useRef<HTMLDivElement>(null);

  // Synchronize when note prop changes
  useEffect(() => {
    setCurrentNote(note);
  }, [note.id]);

  // Push state to history for Undo/Redo
  const pushChange = (newNoteState: NoteData) => {
    const updated = { ...newNoteState, updatedAt: new Date().toISOString() };
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(updated);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setCurrentNote(updated);
    setIsSaved(false);

    // Debounced autosave
    onUpdateNote(updated);
    setTimeout(() => {
      setIsSaved(true);
    }, 600);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentNote(prev);
      onUpdateNote(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentNote(next);
      onUpdateNote(next);
    }
  };

  // Theme configuration
  const themes: { id: NoteTheme; name: string; bgClass: string; textColor: string; cardBorder: string; accentColor: string }[] = [
    { id: 'classic', name: 'Classic Notebook', bgClass: 'bg-lined-paper', textColor: 'text-stone-900', cardBorder: 'border-stone-300', accentColor: 'border-red-400' },
    { id: 'clean', name: 'Clean White', bgClass: 'bg-clean-white', textColor: 'text-stone-900', cardBorder: 'border-stone-200', accentColor: 'border-stone-400' },
    { id: 'graph', name: 'Graph Paper', bgClass: 'bg-graph-paper', textColor: 'text-stone-900', cardBorder: 'border-sky-300/60', accentColor: 'border-sky-500' },
    { id: 'dark', name: 'Dark Study', bgClass: 'bg-dark-paper', textColor: 'text-stone-100', cardBorder: 'border-stone-700', accentColor: 'border-amber-500' },
    { id: 'colorful', name: 'Colorful Revision', bgClass: 'bg-colorful-paper', textColor: 'text-stone-900', cardBorder: 'border-amber-300', accentColor: 'border-amber-400' },
  ];

  const fonts: { id: NoteFont; label: string; fontClass: string }[] = [
    { id: 'kalam', label: 'Kalam (Neat Pen)', fontClass: 'font-kalam' },
    { id: 'caveat', label: 'Caveat (Fluid Ink)', fontClass: 'font-caveat' },
    { id: 'patrick', label: 'Patrick Hand (Print)', fontClass: 'font-patrick' },
  ];

  const currentTheme = themes.find(t => t.id === currentNote.theme) || themes[0];
  const currentFont = fonts.find(f => f.id === currentNote.font) || fonts[0];

  // Section manipulation
  const handleUpdateSectionTitle = (id: string, newTitle: string) => {
    const updatedSections = currentNote.sections.map(s => s.id === id ? { ...s, title: newTitle } : s);
    pushChange({ ...currentNote, sections: updatedSections });
  };

  const handleUpdateSectionContent = (id: string, newContent: string) => {
    const updatedSections = currentNote.sections.map(s => s.id === id ? { ...s, content: newContent } : s);
    pushChange({ ...currentNote, sections: updatedSections });
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentNote.sections.length) return;

    const sections = [...currentNote.sections];
    const temp = sections[index];
    sections[index] = sections[targetIndex];
    sections[targetIndex] = temp;

    pushChange({ ...currentNote, sections });
  };

  const handleDeleteSection = (id: string) => {
    if (currentNote.sections.length <= 1) {
      alert('A note must contain at least one section.');
      return;
    }
    const updatedSections = currentNote.sections.filter(s => s.id !== id);
    pushChange({ ...currentNote, sections: updatedSections });
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;

    const newSec: NoteSection = {
      id: 'sec_' + Date.now(),
      title: newSectionTitle.trim(),
      content: newSectionContent.trim() || 'Add notes, examples or key concepts here...',
      key_points: ['Key observation or formula takeaway'],
      doodle_type: 'star'
    };

    pushChange({
      ...currentNote,
      sections: [...currentNote.sections, newSec]
    });

    setNewSectionTitle('');
    setNewSectionContent('');
    setShowAddSectionModal(false);
  };

  // PDF Export
  const handleExportPdf = async () => {
    if (!notebookRef.current) return;
    setIsExportingPdf(true);
    try {
      const success = await exportToPdf({
        element: notebookRef.current,
        title: currentNote.title,
        subject: currentNote.subject,
        theme: currentNote.theme,
        font: currentNote.font
      });

      if (success) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Copy Actions
  const handleCopyMarkdown = () => {
    const md = exportAsMarkdown(currentNote);
    navigator.clipboard.writeText(md);
    setCopyFeedback('Markdown copied!');
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const handleCopyPlainText = () => {
    const text = exportAsPlainText(currentNote);
    navigator.clipboard.writeText(text);
    setCopyFeedback('Plain text copied!');
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      
      {/* Top Application Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-stone-200 px-4 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
        
        {/* Left: Back button & Note Title */}
        <div className="flex items-center gap-3 overflow-hidden">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors shrink-0"
            title="Back to Landing Page"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                {currentNote.subject}
              </span>
              <span className="text-xs text-stone-500 hidden sm:inline">•</span>
              <input
                type="text"
                value={currentNote.title}
                onChange={(e) => pushChange({ ...currentNote, title: e.target.value })}
                className="font-bold text-sm sm:text-base text-stone-900 bg-transparent hover:bg-stone-50 focus:bg-white px-2 py-0.5 rounded border border-transparent focus:border-amber-400 focus:outline-none truncate max-w-xs sm:max-w-md"
              />
            </div>
          </div>
        </div>

        {/* Center: Save indicator & Undo/Redo */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Check className="w-3.5 h-3.5" />
            <span>Saved ✓</span>
          </div>

          <div className="h-4 w-px bg-stone-200 mx-1"></div>

          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Export & Actions */}
        <div className="flex items-center gap-2">
          {copyFeedback && (
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              {copyFeedback}
            </span>
          )}

          <button
            onClick={printNotes}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
            title="Direct Print"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            {isExportingPdf ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-stone-900 border-t-transparent rounded-full animate-spin"></span>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sidebar with Table of Contents & Structure (Desktop) */}
        <div className="hidden lg:block lg:col-span-3 space-y-4">
          
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
              <span className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Table of Contents</span>
              </span>
              <button
                onClick={() => setShowAddSectionModal(true)}
                className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
              <a
                href="#sec-intro"
                className="block text-xs font-semibold text-stone-700 hover:text-amber-600 hover:bg-amber-50/50 p-2 rounded-lg transition-colors truncate"
              >
                0. Introduction & Scope
              </a>

              {currentNote.sections.map((s, idx) => (
                <div key={s.id} className="group flex items-center justify-between p-1.5 rounded-lg hover:bg-stone-50 transition-colors">
                  <a
                    href={`#${s.id}`}
                    className="text-xs text-stone-700 hover:text-amber-600 font-medium truncate flex-1 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300 group-hover:bg-amber-500"></span>
                    <span className="truncate">{idx + 1}. {s.title}</span>
                  </a>

                  {/* Reorder & Delete controls */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                    <button
                      onClick={() => handleMoveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMoveSection(idx, 'down')}
                      disabled={idx === currentNote.sections.length - 1}
                      className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(s.id)}
                      className="p-1 text-rose-400 hover:text-rose-600"
                      title="Delete Section"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {currentNote.formulas && currentNote.formulas.length > 0 && (
                <a
                  href="#sec-formulas"
                  className="block text-xs font-semibold text-stone-700 hover:text-amber-600 hover:bg-amber-50/50 p-2 rounded-lg transition-colors truncate"
                >
                  ∑ Formulas & Equations
                </a>
              )}

              {currentNote.exam_important && currentNote.exam_important.length > 0 && (
                <a
                  href="#sec-exam-important"
                  className="block text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50/70 p-2 rounded-lg transition-colors truncate"
                >
                  ★ Exam Important Points
                </a>
              )}

              {currentNote.quick_revision && currentNote.quick_revision.length > 0 && (
                <a
                  href="#sec-quick-revision"
                  className="block text-xs font-semibold text-emerald-800 hover:text-emerald-900 bg-emerald-50/60 p-2 rounded-lg transition-colors truncate"
                >
                  ✓ Quick Revision Sheet
                </a>
              )}
            </nav>
          </div>

          {/* Source video information */}
          {currentNote.youtubeUrl && (
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs text-xs space-y-2">
              <span className="font-bold text-stone-600 uppercase tracking-wider block">Source Lecture</span>
              <a
                href={currentNote.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-blue-600 hover:underline break-all font-medium"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          )}

        </div>

        {/* Center Column: The Authentic Notebook Sheet */}
        <div className="lg:col-span-6 flex flex-col items-center">
          
          {/* Note Page container */}
          <div
            ref={notebookRef}
            className={`w-full max-w-2xl rounded-2xl shadow-xl border-2 border-stone-300 p-6 sm:p-10 ${currentTheme.bgClass} ${currentTheme.textColor} ${currentFont.fontClass} transition-all duration-300 print-area`}
          >
            
            {/* Student Header */}
            <div className={`border-b-2 border-dashed ${currentTheme.accentColor} pb-5 mb-8 flex flex-wrap items-baseline justify-between gap-4`}>
              <div>
                <div className="flex items-center gap-2 mb-2 font-sans">
                  <span className="text-xs uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-md bg-amber-500 text-stone-950">
                    {currentNote.subject}
                  </span>
                  <span className="text-xs font-semibold text-stone-500">
                    Difficulty: {currentNote.difficulty}
                  </span>
                </div>
                
                <h1 
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => pushChange({ ...currentNote, title: e.currentTarget.textContent || currentNote.title })}
                  className="text-3xl sm:text-4xl font-bold tracking-tight cursor-text focus:outline-none focus:ring-1 focus:ring-amber-400 rounded px-1"
                >
                  {currentNote.title}
                </h1>
              </div>

              <div className="text-right text-xs opacity-75 font-sans">
                <div>Date: {new Date(currentNote.createdAt).toLocaleDateString()}</div>
                <div className="text-amber-700 font-bold mt-1">Page 1 of 1</div>
              </div>
            </div>

            {/* Introduction */}
            <div id="sec-intro" className="mb-8 text-base sm:text-lg leading-relaxed">
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => pushChange({ ...currentNote, introduction: e.currentTarget.textContent || currentNote.introduction })}
                className="cursor-text focus:outline-none focus:ring-1 focus:ring-amber-400 rounded p-1"
              >
                <span className="highlight-yellow font-bold mr-1">Overview:</span>
                {currentNote.introduction}
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-6 mb-8">
              {currentNote.sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  id={sec.id}
                  className="relative p-5 rounded-xl border-2 border-dashed border-stone-400/50 bg-white/40 backdrop-blur-xs page-break-inside-avoid"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdateSectionTitle(sec.id, e.currentTarget.textContent || sec.title)}
                      className="text-xl sm:text-2xl font-bold tracking-wide cursor-text focus:outline-none focus:ring-1 focus:ring-amber-400 rounded px-1"
                    >
                      {idx + 1}. {sec.title}
                    </h3>
                    <NoteDoodle type={sec.doodle_type} className="w-8 h-8 text-amber-600 shrink-0" />
                  </div>

                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleUpdateSectionContent(sec.id, e.currentTarget.textContent || sec.content)}
                    className="text-base sm:text-lg leading-relaxed cursor-text focus:outline-none focus:ring-1 focus:ring-amber-400 rounded p-1 mb-3"
                  >
                    {sec.content}
                  </div>

                  {/* Bullet points */}
                  {sec.key_points && sec.key_points.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-sm sm:text-base opacity-90 pl-1 border-t border-stone-300/40 pt-2">
                      {sec.key_points.map((kp, kpIdx) => (
                        <li key={kpIdx} className="leading-snug">
                          {kp}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Optional formula in section */}
                  {sec.formula && (
                    <div className="mt-3 p-2.5 rounded-lg bg-amber-50/90 border border-amber-300 font-sans font-bold text-stone-950 text-center tracking-wide text-base sm:text-lg">
                      {sec.formula}
                    </div>
                  )}

                  {/* Optional example in section */}
                  {sec.example && (
                    <div className="mt-3 p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-xs sm:text-sm text-stone-800 font-sans leading-relaxed">
                      <span className="font-bold text-blue-900 block mb-0.5">Example Application:</span>
                      {sec.example}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Formulas Section */}
            {currentNote.formulas && currentNote.formulas.length > 0 && (
              <div id="sec-formulas" className="mb-8 p-5 rounded-xl border-2 border-stone-400/50 bg-white/40 page-break-inside-avoid">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl sm:text-2xl font-bold">Formula & Equation Box</span>
                  <NoteDoodle type="math" className="w-7 h-7 text-blue-600" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentNote.formulas.map((f, fIdx) => (
                    <div key={fIdx} className="p-3 rounded-lg bg-stone-50 border border-stone-300 text-xs font-sans">
                      <p className="font-bold text-stone-900 text-sm mb-1">{f.name}</p>
                      <p className="font-mono text-sm font-extrabold text-amber-700 bg-amber-50/80 p-1.5 rounded border border-amber-200 text-center mb-1">
                        {f.formula}
                      </p>
                      {f.where && <p className="text-stone-600 text-[11px]">Where: {f.where}</p>}
                      {f.units && <p className="text-stone-500 text-[11px] font-semibold">Units: {f.units}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exam Important Sticky Note */}
            {currentNote.exam_important && currentNote.exam_important.length > 0 && (
              <div id="sec-exam-important" className="mb-8 hand-box p-6 bg-amber-200/90 text-stone-950 shadow-md border border-amber-300 page-break-inside-avoid">
                <div className="flex items-center gap-1.5 text-xs font-sans uppercase font-extrabold text-amber-900 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>EXAM IMPORTANT FLASH SHEET</span>
                </div>
                <div className="space-y-3">
                  {currentNote.exam_important.map((item, eIdx) => (
                    <div key={eIdx} className="border-b border-amber-300/80 pb-2 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-base">{item.topic}</span>
                        <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded bg-amber-300 text-amber-900">
                          {item.probability} Priority
                        </span>
                      </div>
                      <p className="text-sm mt-0.5 leading-relaxed font-medium">
                        {item.tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Revision Checklist */}
            {currentNote.quick_revision && currentNote.quick_revision.length > 0 && (
              <div id="sec-quick-revision" className="mb-8 p-5 rounded-xl border-2 border-stone-400/40 bg-white/40 page-break-inside-avoid">
                <h4 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>Quick 60-Second Revision Checklist</span>
                </h4>
                <div className="space-y-1.5 text-sm sm:text-base">
                  {currentNote.quick_revision.map((qr, qIdx) => (
                    <div key={qIdx} className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                      <span>{qr}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Questions with click-to-reveal answers */}
            {currentNote.questions && currentNote.questions.length > 0 && (
              <div className="mb-8 p-5 rounded-xl border-2 border-dashed border-stone-400/50 bg-white/30 page-break-inside-avoid">
                <h4 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                  <span>Self-Check Practice Questions</span>
                </h4>
                <div className="space-y-2">
                  {currentNote.questions.map((q, qIdx) => (
                    <div key={qIdx} className="p-3 rounded-lg bg-stone-50/90 border border-stone-200 text-xs sm:text-sm font-sans">
                      <div 
                        onClick={() => setExpandedQuestionIndex(expandedQuestionIndex === qIdx ? null : qIdx)}
                        className="flex items-center justify-between cursor-pointer font-bold text-stone-900"
                      >
                        <span>Q{qIdx + 1}: {q.question}</span>
                        <span className="text-xs text-amber-700 underline shrink-0 ml-2">
                          {expandedQuestionIndex === qIdx ? 'Hide Answer' : 'Show Answer'}
                        </span>
                      </div>
                      {expandedQuestionIndex === qIdx && (
                        <div className="mt-2 pt-2 border-t border-stone-200 text-stone-700 leading-relaxed font-normal bg-amber-50/50 p-2 rounded">
                          <strong>Answer:</strong> {q.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Revision Summary */}
            {currentNote.final_revision && (
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 text-sm leading-relaxed page-break-inside-avoid">
                <strong className="block text-amber-900 font-sans uppercase tracking-wider text-xs font-bold mb-1">
                  Final Takeaway Note:
                </strong>
                <p>{currentNote.final_revision}</p>
              </div>
            )}

            {/* Footer Watermark */}
            <div className="mt-10 pt-4 border-t border-stone-400/40 text-center text-xs font-sans text-stone-400">
              Generated by ReviseKaro • Watch Less. Revise Better.
            </div>

          </div>
        </div>

        {/* Right Column: Customization & Export Panel */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Note Style / Customizer */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-4">
            <span className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-amber-600" />
              <span>Theme & Style</span>
            </span>

            {/* Paper Themes */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">Paper Style</label>
              <div className="grid grid-cols-1 gap-1.5">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => pushChange({ ...currentNote, theme: t.id })}
                    className={`text-xs px-3 py-2 rounded-xl text-left font-medium transition-all flex items-center justify-between border cursor-pointer ${
                      currentNote.theme === t.id
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-600 shadow-xs'
                        : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                    }`}
                  >
                    <span>{t.name}</span>
                    {currentNote.theme === t.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Fonts */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">Handwriting Font</label>
              <div className="grid grid-cols-1 gap-1.5">
                {fonts.map(f => (
                  <button
                    key={f.id}
                    onClick={() => pushChange({ ...currentNote, font: f.id })}
                    className={`text-xs px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between border cursor-pointer ${
                      currentNote.font === f.id
                        ? 'bg-stone-900 text-amber-400 font-bold border-stone-900 shadow-xs'
                        : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                    }`}
                  >
                    <span className={f.fontClass}>{f.label}</span>
                    {currentNote.font === f.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-2">
            <span className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1.5 mb-2">
              <Download className="w-4 h-4 text-amber-600" />
              <span>Export & Share</span>
            </span>

            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-stone-900 text-xs font-bold transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-700" />
                <span>High-Resolution PDF</span>
              </div>
              <Download className="w-3.5 h-3.5 text-amber-700" />
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-medium transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-stone-500" />
                <span>Copy Markdown</span>
              </div>
            </button>

            <button
              onClick={handleCopyPlainText}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-medium transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-stone-500" />
                <span>Copy Plain Text</span>
              </div>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs text-stone-600 space-y-1.5">
            <div className="flex justify-between">
              <span>Sections:</span>
              <span className="font-bold text-stone-900">{currentNote.sections.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Formulas:</span>
              <span className="font-bold text-stone-900">{currentNote.formulas?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Practice Questions:</span>
              <span className="font-bold text-stone-900">{currentNote.questions?.length || 0}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Add Custom Section Modal */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-3">Add Custom Note Section</h3>
            <form onSubmit={handleAddSection} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Section Title</label>
                <input
                  type="text"
                  required
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="e.g. Special Case: Friction on Slopes"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Content</label>
                <textarea
                  rows={4}
                  value={newSectionContent}
                  onChange={(e) => setNewSectionContent(e.target.value)}
                  placeholder="Write concepts, examples, or your personal remarks..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSectionModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 text-xs font-semibold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold"
                >
                  Insert Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
