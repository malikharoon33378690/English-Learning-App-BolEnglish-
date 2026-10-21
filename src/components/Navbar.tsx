import React from 'react';
import { Sparkles, Flame, Volume2 } from 'lucide-react';
import { UserProgress } from '../types';

interface NavbarProps {
  activeTab: 'quiz' | 'vocab' | 'flashcards' | 'grammar' | 'tutor';
  setActiveTab: (tab: 'quiz' | 'vocab' | 'flashcards' | 'grammar' | 'tutor') => void;
  progress: UserProgress;
  onOpenTutor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  progress,
  onOpenTutor
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <button
            onClick={() => setActiveTab('quiz')}
            className="flex items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              ب
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none whitespace-nowrap">
                BolEnglish
              </span>
              <span className="text-xs text-slate-500 font-medium">بول انگلش</span>
            </div>
          </button>

          {/* Zone 2: Single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'quiz' ? 'border-emerald-600 text-emerald-800 font-semibold' : 'border-transparent'
              }`}
            >
              Daily Quiz
            </button>
            <button
              onClick={() => setActiveTab('vocab')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'vocab' ? 'border-emerald-600 text-emerald-800 font-semibold' : 'border-transparent'
              }`}
            >
              Vocabulary List
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'flashcards' ? 'border-emerald-600 text-emerald-800 font-semibold' : 'border-transparent'
              }`}
            >
              Flashcards
            </button>
            <button
              onClick={() => setActiveTab('grammar')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'grammar' ? 'border-emerald-600 text-emerald-800 font-semibold' : 'border-transparent'
              }`}
            >
              Grammar Insights
            </button>
            <button
              onClick={onOpenTutor}
              className="text-slate-600 hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI English Tutor</span>
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action & Streak Metric */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1.5 rounded-lg">
              <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span className="tabular-nums">{progress.streak}</span>
              <span className="hidden sm:inline text-amber-800">Day Streak</span>
            </div>

            <button
              onClick={() => setActiveTab('quiz')}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50/90 px-2 py-2 text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-2 py-1 rounded ${activeTab === 'quiz' ? 'bg-emerald-100 text-emerald-800 font-semibold' : ''}`}
        >
          Quiz
        </button>
        <button
          onClick={() => setActiveTab('vocab')}
          className={`px-2 py-1 rounded ${activeTab === 'vocab' ? 'bg-emerald-100 text-emerald-800 font-semibold' : ''}`}
        >
          Words
        </button>
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`px-2 py-1 rounded ${activeTab === 'flashcards' ? 'bg-emerald-100 text-emerald-800 font-semibold' : ''}`}
        >
          Flashcards
        </button>
        <button
          onClick={() => setActiveTab('grammar')}
          className={`px-2 py-1 rounded ${activeTab === 'grammar' ? 'bg-emerald-100 text-emerald-800 font-semibold' : ''}`}
        >
          Grammar
        </button>
        <button
          onClick={onOpenTutor}
          className="px-2 py-1 rounded text-amber-800 font-medium flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3 text-amber-600" />
          AI Tutor
        </button>
      </div>
    </header>
  );
};
