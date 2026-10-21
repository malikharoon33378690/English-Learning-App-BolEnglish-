import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  CheckCircle2,
  Volume2,
  Calendar
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { DailyWordHero } from './components/DailyWordHero';
import { DailyQuiz } from './components/DailyQuiz';
import { VocabularyExplorer } from './components/VocabularyExplorer';
import { FlashcardsView } from './components/FlashcardsView';
import { GrammarLessons } from './components/GrammarLessons';
import { ProgressStats } from './components/ProgressStats';
import { AiTutorModal } from './components/AiTutorModal';
import { VOCABULARY_LIST } from './data/vocabulary';
import { UserProgress } from './types';
import { loadUserProgress, getTodayDateString } from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'vocab' | 'flashcards' | 'grammar' | 'tutor'>('quiz');
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress());
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  // Pick deterministic Word of the Day based on date
  const wordOfTheDay = React.useMemo(() => {
    const today = getTodayDateString();
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = (hash << 5) - hash + today.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % VOCABULARY_LIST.length;
    return VOCABULARY_LIST[index] || VOCABULARY_LIST[0];
  }, []);

  useEffect(() => {
    setProgress(loadUserProgress());
  }, []);

  const handleUpdateProgress = (updated: UserProgress) => {
    setProgress(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* 1-Row 3-Zone Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        progress={progress}
        onOpenTutor={() => setIsTutorOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Daily Word Showcase Hero */}
        <DailyWordHero
          word={wordOfTheDay}
          progress={progress}
          onStartQuiz={() => setActiveTab('quiz')}
          onOpenFlashcards={() => setActiveTab('flashcards')}
        />

        {/* Tab Navigation Segmented Bar (Desktop & Tablet) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'quiz'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily Quiz (روزانہ کوئز)
            </button>
            <button
              onClick={() => setActiveTab('vocab')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'vocab'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vocabulary List (ذخیرہ الفاظ)
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'flashcards'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Flashcards (فلیش کارڈز)
            </button>
            <button
              onClick={() => setActiveTab('grammar')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'grammar'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Grammar (آسان گرامر)
            </button>
          </div>

          <button
            onClick={() => setIsTutorOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 rounded-lg text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Ask AI Tutor</span>
          </button>
        </div>

        {/* Tab View Switcher */}
        {activeTab === 'quiz' && (
          <section className="space-y-8 animate-fadeIn">
            <DailyQuiz
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
              onExploreWords={() => setActiveTab('vocab')}
              onOpenFlashcards={() => setActiveTab('flashcards')}
            />

            {/* Progress & Stats summary below quiz */}
            <div className="pt-4 border-t border-slate-200/80">
              <ProgressStats
                progress={progress}
                onStartQuiz={() => setActiveTab('quiz')}
                onOpenFlashcards={() => setActiveTab('flashcards')}
              />
            </div>
          </section>
        )}

        {activeTab === 'vocab' && (
          <section className="animate-fadeIn">
            <VocabularyExplorer
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
            />
          </section>
        )}

        {activeTab === 'flashcards' && (
          <section className="animate-fadeIn">
            <FlashcardsView
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
            />
          </section>
        )}

        {activeTab === 'grammar' && (
          <section className="animate-fadeIn">
            <GrammarLessons />
          </section>
        )}
      </main>

      {/* AI Tutor Dialog Modal */}
      <AiTutorModal
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
      />

      {/* Clean Human Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">BolEnglish</span>
            <span aria-hidden="true">·</span>
            <span>Urdu to English Language Learning Platform</span>
            <span aria-hidden="true">·</span>
            <span className="font-urdu text-sm text-slate-700">اردو سے انگریزی سیکھیں</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Audio Pronunciation via Web Speech API</span>
            <span aria-hidden="true">·</span>
            <span>Daily Spaced Practice</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
