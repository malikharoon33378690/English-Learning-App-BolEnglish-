import React, { useState, useMemo } from 'react';
import {
  Search,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Check,
  RotateCcw,
  Sparkles,
  Snail,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { VocabularyWord, WordCategory, UserProgress } from '../types';
import { VOCABULARY_LIST, CATEGORY_LABELS } from '../data/vocabulary';
import { speakText, sounds } from '../utils/audio';
import { toggleWordMastery, toggleStarWord } from '../utils/storage';

interface VocabularyExplorerProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
}

export const VocabularyExplorer: React.FC<VocabularyExplorerProps> = ({
  progress,
  onUpdateProgress
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WordCategory | 'all'>('all');
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [expandedWordId, setExpandedWordId] = useState<string | null>(null);

  // Filter words
  const filteredWords = useMemo(() => {
    return VOCABULARY_LIST.filter(word => {
      // Category filter
      if (selectedCategory !== 'all' && word.category !== selectedCategory) {
        return false;
      }

      // Starred filter
      if (onlyStarred && !progress.starredWordIds.includes(word.id)) {
        return false;
      }

      // Search query in English, Urdu, or Roman Urdu
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchEnglish = word.english.toLowerCase().includes(q);
        const matchUrdu = word.urdu.includes(q);
        const matchRoman = word.romanUrdu.toLowerCase().includes(q);
        const matchMeaning = word.meaningEnglish.toLowerCase().includes(q);
        return matchEnglish || matchUrdu || matchRoman || matchMeaning;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, onlyStarred, progress.starredWordIds]);

  const handleToggleStar = (wordId: string) => {
    sounds.playTap();
    const result = toggleStarWord(wordId);
    onUpdateProgress(result.progress);
  };

  const handleToggleMastery = (wordId: string, currentStatus: boolean) => {
    sounds.playTap();
    const updated = toggleWordMastery(wordId, !currentStatus);
    onUpdateProgress(updated);
  };

  const handleSpeak = (text: string, slow: boolean = false) => {
    sounds.playTap();
    speakText(text, { rate: slow ? 0.7 : 0.95 });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Beginner Vocabulary Library
            </h2>
            <p className="text-xs text-slate-500 font-urdu text-right sm:text-left">
              بنیادی انگریزی ذخیرہ الفاظ اور تلفظ
            </p>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyStarred(!onlyStarred)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                onlyStarred
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>Starred Words ({progress.starredWordIds.length})</span>
            </button>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search word in English, Urdu (پانی), or Roman Urdu (pani)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white font-medium'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Categories ({VOCABULARY_LIST.length})
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as WordCategory)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === key
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {item.en}
            </button>
          ))}
        </div>
      </div>

      {/* Words Grid */}
      {filteredWords.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <p className="text-base font-medium">No vocabulary words found matching "{searchQuery}".</p>
          <p className="text-xs font-urdu text-slate-400 mt-1">کوئی لفظ نہیں ملا۔ نیا لفظ تلاش کریں۔</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWords.map(word => {
            const isMastered = progress.masteredWordIds.includes(word.id);
            const isStarred = progress.starredWordIds.includes(word.id);
            const isExpanded = expandedWordId === word.id;

            return (
              <div
                key={word.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm p-5 space-y-3 transition-all"
              >
                {/* Word Top Bar */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-xl font-bold text-slate-900 font-sans">
                        {word.english}
                      </h3>
                      <span className="text-xs font-mono text-emerald-700">
                        {word.phonetic}
                      </span>
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                      {word.partOfSpeech} · {word.category.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Actions: Audio, Star */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleSpeak(word.english, false)}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Pronounce English word"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSpeak(word.english, true)}
                      className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Slow pronunciation"
                    >
                      <Snail className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleStar(word.id)}
                      className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                      title={isStarred ? 'Remove from starred' : 'Bookmark word'}
                    >
                      {isStarred ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Urdu Meaning & Roman Urdu */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-urdu text-lg font-bold text-emerald-900 leading-tight">
                      {word.urdu}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      <span className="font-medium text-slate-600">Roman:</span> {word.romanUrdu}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleMastery(word.id, isMastered)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${
                      isMastered
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200/80 hover:bg-slate-300 text-slate-700'
                    }`}
                  >
                    {isMastered ? <Check className="w-3 h-3" /> : <RotateCcw className="w-3 h-3" />}
                    <span>{isMastered ? 'Mastered' : 'Practice'}</span>
                  </button>
                </div>

                {/* Toggle details / Example sentence */}
                <div>
                  <button
                    onClick={() => setExpandedWordId(isExpanded ? null : word.id)}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
                  >
                    <span>{isExpanded ? 'Hide Example' : 'Show Example Sentence'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 text-xs bg-emerald-50/50 rounded-lg p-3 border border-emerald-100/80 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-slate-900 font-medium">"{word.exampleEnglish}"</p>
                        <button
                          onClick={() => handleSpeak(word.exampleEnglish)}
                          className="text-emerald-700 hover:text-emerald-900 shrink-0"
                          title="Listen to sentence"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-urdu text-sm text-slate-700">{word.exampleUrdu}</p>
                      {word.memoryTip && (
                        <p className="text-[11px] text-amber-800 font-urdu pt-1 border-t border-emerald-100">
                          نصیحت: {word.memoryTip}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
