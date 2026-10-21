import React, { useState } from 'react';
import { Volume2, Sparkles, BookOpen, CheckCircle, ArrowRight, Snail } from 'lucide-react';
import { VocabularyWord, UserProgress } from '../types';
import { speakText, sounds } from '../utils/audio';

interface DailyWordHeroProps {
  word: VocabularyWord;
  progress: UserProgress;
  onStartQuiz: () => void;
  onOpenFlashcards: () => void;
}

export const DailyWordHero: React.FC<DailyWordHeroProps> = ({
  word,
  progress,
  onStartQuiz,
  onOpenFlashcards
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingSlow, setIsPlayingSlow] = useState(false);

  const handleSpeak = (slow: boolean = false) => {
    sounds.playTap();
    if (slow) {
      setIsPlayingSlow(true);
      speakText(word.english, {
        rate: 0.7,
        onEnd: () => setIsPlayingSlow(false)
      });
    } else {
      setIsPlayingAudio(true);
      speakText(word.english, {
        rate: 0.95,
        onEnd: () => setIsPlayingAudio(false)
      });
    }
  };

  const handleSpeakExample = () => {
    sounds.playTap();
    speakText(word.exampleEnglish, { rate: 0.9 });
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 text-white shadow-xl border border-emerald-800/40">
      {/* Background Decorative Scrim */}
      <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
        <img
          src="/src/assets/images/hero_urdu_english_study_1792602815687.jpg"
          alt="Urdu and English Study Desk"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          
          {/* Left Column: Word of the Day */}
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-3 text-xs tracking-wider uppercase font-semibold text-emerald-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                Word of the Day
              </span>
              <span aria-hidden="true" className="text-emerald-700">·</span>
              <span className="font-urdu text-sm normal-case text-emerald-200">آج کا نیا لفظ</span>
              <span aria-hidden="true" className="text-emerald-700">·</span>
              <span className="text-slate-300 capitalize">{word.category.replace('_', ' ')}</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-4">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-sans">
                {word.english}
              </h1>
              <span className="text-lg text-emerald-300/90 font-mono">
                {word.phonetic}
              </span>
              <span className="text-xs uppercase px-2 py-0.5 rounded bg-emerald-800/60 border border-emerald-700/50 text-emerald-200">
                {word.partOfSpeech}
              </span>
            </div>

            {/* Urdu Meaning & Roman Urdu */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-2xl sm:text-3xl font-urdu font-bold text-amber-300 tracking-wide text-right sm:text-left">
                  {word.urdu}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  <span className="text-slate-400 font-medium">Roman Urdu:</span> {word.romanUrdu}
                </p>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <button
                  onClick={() => handleSpeak(false)}
                  disabled={isPlayingAudio}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg shadow transition-all active:scale-95"
                  title="Listen to standard pronunciation"
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                  <span>Pronounce</span>
                </button>

                <button
                  onClick={() => handleSpeak(true)}
                  disabled={isPlayingSlow}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-emerald-200 text-xs rounded-lg border border-emerald-600/40 transition-all active:scale-95"
                  title="Slow pronunciation for beginners"
                >
                  <Snail className={`w-3.5 h-3.5 ${isPlayingSlow ? 'text-amber-400' : ''}`} />
                  <span>Slow</span>
                </button>
              </div>
            </div>

            {/* Example in Context */}
            <div className="space-y-1.5 text-sm text-slate-200 pt-1">
              <div className="flex items-start gap-2">
                <button
                  onClick={handleSpeakExample}
                  className="mt-0.5 text-emerald-400 hover:text-emerald-300 shrink-0"
                  title="Listen to example sentence"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <div>
                  <p className="font-medium text-white italic">"{word.exampleEnglish}"</p>
                  <p className="text-slate-300 font-urdu text-sm mt-0.5">{word.exampleUrdu}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Daily Goals & Quick Actions */}
          <div className="lg:w-80 shrink-0 bg-slate-900/90 backdrop-blur-md rounded-xl p-5 border border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-200">Daily Study Target</span>
              <span className="font-urdu text-slate-300">روزانہ کا ہدف</span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/40">
                <div className="text-2xl font-bold text-white tabular-nums">
                  {progress.quizzesCompletedToday}/1
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Quiz Done Today</div>
              </div>

              <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/40">
                <div className="text-2xl font-bold text-emerald-400 tabular-nums">
                  {progress.masteredWordIds.length}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Words Mastered</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={onStartQuiz}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm shadow-md transition-all active:scale-[0.98]"
              >
                <span>Take Daily Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenFlashcards}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-xs transition-colors border border-slate-700"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Practice with Flashcards</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
