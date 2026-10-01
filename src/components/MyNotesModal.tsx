import React, { useState } from 'react';
import { 
  FolderHeart, Search, Filter, Trash2, ExternalLink, 
  Download, Eye, Calendar, Sparkles, BookOpen, X, AlertTriangle 
} from 'lucide-react';
import { NoteData } from '../types/note';

interface MyNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: NoteData[];
  onOpenNote: (note: NoteData) => void;
  onDeleteNote: (id: string) => void;
  onDownloadNote: (note: NoteData) => void;
}

export const MyNotesModal: React.FC<MyNotesModalProps> = ({
  isOpen,
  onClose,
  notes,
  onOpenNote,
  onDeleteNote,
  onDownloadNote
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Extract unique subjects
  const subjects = ['All', ...Array.from(new Set(notes.map(n => n.subject).filter(Boolean)))];

  // Filter & sort
  const filteredNotes = notes.filter(n => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.introduction && n.introduction.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'All' || n.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const uniqueSubjectsCount = new Set(notes.map(n => n.subject)).size;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <FolderHeart className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">My ReviseKaro Library</h2>
              <p className="text-xs text-stone-400">All your saved notes & revisions in one place</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dashboard Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-6 bg-stone-50 border-b border-stone-200 text-xs">
          <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
            <span className="text-stone-500 font-semibold block">Total Notes</span>
            <span className="text-2xl font-extrabold text-stone-900 mt-1 block">{notes.length}</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
            <span className="text-stone-500 font-semibold block">This Month</span>
            <span className="text-2xl font-extrabold text-amber-600 mt-1 block">{notes.length}</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
            <span className="text-stone-500 font-semibold block">Subjects Covered</span>
            <span className="text-2xl font-extrabold text-stone-900 mt-1 block">{uniqueSubjectsCount}</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
            <span className="text-stone-500 font-semibold block">Format</span>
            <span className="text-sm font-bold text-emerald-700 mt-2 block">Handwritten + PDF</span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 sm:p-6 border-b border-stone-200 bg-white space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Search input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by title, topic, or keyword..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-stone-500 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="text-xs font-semibold px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedSubject === sub
                    ? 'bg-stone-900 text-amber-400 font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-stone-700">No notes found</h4>
              <p className="text-xs text-stone-500 mt-1">Try another search or paste a new lecture link.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((n) => (
                <div
                  key={n.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: Subject & Date */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="font-extrabold uppercase px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        {n.subject}
                      </span>
                      <span className="text-stone-400 flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3" />
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Note Title */}
                    <h3 
                      onClick={() => {
                        onOpenNote(n);
                        onClose();
                      }}
                      className="font-bold text-base text-stone-900 group-hover:text-amber-600 transition-colors line-clamp-2 cursor-pointer mb-2"
                    >
                      {n.title}
                    </h3>

                    {/* Snippet */}
                    <p className="text-xs text-stone-500 line-clamp-3 mb-4 leading-relaxed">
                      {n.introduction || 'Comprehensive study note with key formulas and concepts.'}
                    </p>
                  </div>

                  {/* Footer stats & Actions */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-100 pt-3 mb-3">
                      <span>{n.sections.length} Sections</span>
                      <span>{n.formulas?.length || 0} Formulas</span>
                      <span>Font: {n.font}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          onOpenNote(n);
                          onClose();
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Open & Edit</span>
                      </button>

                      <button
                        onClick={() => setConfirmDeleteId(n.id)}
                        className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {confirmDeleteId && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200">
              <div className="flex items-center gap-3 text-rose-600 mb-3">
                <AlertTriangle className="w-6 h-6" />
                <h4 className="font-bold text-base text-stone-900">Delete this note?</h4>
              </div>
              <p className="text-xs text-stone-600 mb-5 leading-relaxed">
                This will permanently delete this handwritten note from your local storage. This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-4 py-2 rounded-xl text-stone-600 text-xs font-semibold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteNote(confirmDeleteId);
                    setConfirmDeleteId(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
