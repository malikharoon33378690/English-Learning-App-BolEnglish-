import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  Volume2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Snail,
  Layers,
  Check
} from 'lucide-react';
import { VocabularyWord, UserProgress, WordCategory } from '../types';
import { VOCABULARY_LIST, CATEGORY_LABELS } from '../data/vocabulary';
import { speakText, sounds } from '../utils/audio';
import { toggleWordMastery } from '../utils/storage';

interface FlashcardsViewProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  progress,
  onUpdateProgress
}) => {
  const [selectedCategory, setSelectedCategory] = useState<WordCategory | 'all'>('all');
  const [direction, setDirection] = useState<'ur_to_en' | 'en_to_ur'>('ur_to_en');
  const [showRomanUrdu, setShowRomanUrdu] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Filter cards by category
  const cards = selectedCategory === 'all'
    ? VOCABULARY_LIST
    : VOCABULARY_LIST.filter(w => w.category === selectedCategory);

  const currentWord: VocabularyWord = cards[currentIndex] || cards[0];

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex, selectedCategory, direction]);

  const handleFlip = () => {
    sounds.playTap();
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    sounds.playTap();
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  const handlePrev = () => {
    sounds.playTap();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(cards.length - 1);
    }
  };

  const handleMarkMastered = () => {
    sounds.playCorrect();
    const updated = toggleWordMastery(currentWord.id, true);
    onUpdateProgress(updated);
    handleNext();
  };

  const handleMarkLearning = () => {
    sounds.playTap();
    const updated = toggleWordMastery(currentWord.id, false);
    onUpdateProgress(updated);
    handleNext();
  };

  const isWordMastered = progress.masteredWordIds.includes(currentWord.id);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Top Filter and Mode Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Card Front:</span>
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg">
              <button
                onClick={() => setDirection('ur_to_en')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  direction === 'ur_to_en'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Urdu → English
              </button>
              <button
                onClick={() => setDirection('en_to_ur')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  direction === 'en_to_ur'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English → Urdu
              </button>
            </div>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
            <input
              type="checkbox"
              checked={showRomanUrdu}
              onChange={e => setShowRomanUrdu(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Show Roman Urdu</span>
          </label>
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentIndex(0);
            }}
            className={`px-2.5 py-1 rounded whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white font-medium'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Words
          </button>
          {Object.entries(CATEGORY_LABELS).slice(0, 5).map(([catKey, item]) => (
            <button
              key={catKey}
              onClick={() => {
                setSelectedCategory(catKey as WordCategory);
                setCurrentIndex(0);
              }}
              className={`px-2.5 py-1 rounded whitespace-nowrap transition-colors ${
                selectedCategory === catKey
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {item.en}
            </button>
          ))}
        </div>
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>Card {currentIndex + 1} of {cards.length}</span>
        <span className="capitalize">{currentWord.category.replace('_', ' ')}</span>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === ' ' || e.key === 'Enter') handleFlip();
        }}
        className="cursor-pointer select-none perspective min-h-[300px] w-full bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-300 shadow-md p-8 flex flex-col items-center justify-center text-center transition-all duration-300 relative group"
      >
        <span className="absolute top-4 right-4 text-[11px] text-slate-400 flex items-center gap-1">
          <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
          Click or Space to flip
        </span>

        {/* Front Side */}
        {!isFlipped ? (
          <div className="space-y-4 max-w-sm animate-fadeIn">
            <span className="text-xs uppercase tracking-wider text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md">
              {direction === 'ur_to_en' ? 'Urdu Prompt (اردو)' : 'English Prompt'}
            </span>

            {direction === 'ur_to_en' ? (
              <div className="space-y-2">
                <h3 className="text-4xl font-urdu font-bold text-slate-900 leading-normal">
                  {currentWord.urdu}
                </h3>
                {showRomanUrdu && (
                  <p className="text-sm text-slate-500 italic">
                    Roman: {currentWord.romanUrdu}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-slate-900 font-sans">
                  {currentWord.english}
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {currentWord.phonetic}
                </span>
              </div>
            )}

            <p className="text-xs text-slate-400 pt-3">
              Tap to reveal meaning & pronunciation
            </p>
          </div>
        ) : (
          /* Back Side */
          <div className="space-y-4 max-w-sm animate-fadeIn">
            <span className="text-xs uppercase tracking-wider text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-md">
              {direction === 'ur_to_en' ? 'English Translation' : 'Urdu Meaning (معنی)'}
            </span>

            {direction === 'ur_to_en' ? (
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-slate-900 font-sans">
                  {currentWord.english}
                </h3>
                <p className="text-sm font-mono text-emerald-700">
                  {currentWord.phonetic}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-3xl font-urdu font-bold text-slate-900 leading-normal">
                  {currentWord.urdu}
                </h3>
                {showRomanUrdu && (
                  <p className="text-sm text-slate-500 italic">
                    Roman: {currentWord.romanUrdu}
                  </p>
                )}
              </div>
            )}

            {/* Example sentence */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-left space-y-1">
              <p className="font-semibold text-slate-900">"{currentWord.exampleEnglish}"</p>
              <p className="font-urdu text-slate-600">{currentWord.exampleUrdu}</p>
            </div>

            {/* Audio pronunciation button */}
            <div className="pt-2">
              <button
                onClick={e => {
                  e.stopPropagation();
                  speakText(currentWord.english);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Pronunciation</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Spaced Repetition Actions */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handlePrev}
          className="p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
          title="Previous Card"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkLearning}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Still Learning</span>
          </button>

          <button
            onClick={handleMarkMastered}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mastered Word!</span>
          </button>
        </div>

        <button
          onClick={handleNext}
          className="p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
          title="Next Card"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
