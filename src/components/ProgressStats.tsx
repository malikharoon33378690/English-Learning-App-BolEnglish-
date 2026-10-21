import React from 'react';
import { Flame, Trophy, Award, CheckCircle2, RotateCcw, BookOpen, Volume2 } from 'lucide-react';
import { UserProgress } from '../types';
import { VOCABULARY_LIST } from '../data/vocabulary';
import { speakText } from '../utils/audio';

interface ProgressStatsProps {
  progress: UserProgress;
  onStartQuiz: () => void;
  onOpenFlashcards: () => void;
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({
  progress,
  onStartQuiz,
  onOpenFlashcards
}) => {
  const accuracy = progress.totalQuestionsAnswered > 0
    ? Math.round((progress.totalScore / progress.totalQuestionsAnswered) * 100)
    : 0;

  const masteredWords = VOCABULARY_LIST.filter(w => progress.masteredWordIds.includes(w.id));
  const learningWords = VOCABULARY_LIST.filter(w => progress.learningWordIds.includes(w.id));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Study Streak
            </span>
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 tabular-nums">
            {progress.streak} <span className="text-sm font-medium text-slate-400">Days</span>
          </div>
          <p className="text-xs text-amber-700 font-urdu mt-1 font-semibold">
            شاباش! روزانہ سیکھنے کی عادت قائم رکھیں۔
          </p>
        </div>

        {/* Mastered */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Mastered Words
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 mt-2 tabular-nums">
            {progress.masteredWordIds.length} <span className="text-sm font-medium text-slate-400">/ {VOCABULARY_LIST.length}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {Math.round((progress.masteredWordIds.length / VOCABULARY_LIST.length) * 100)}% of beginner vocabulary
          </p>
        </div>

        {/* Quizzes Taken */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Quizzes Taken
            </span>
            <Trophy className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 tabular-nums">
            {progress.totalQuizzesTaken}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {progress.quizzesCompletedToday} completed today
          </p>
        </div>

        {/* Accuracy */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Quiz Accuracy
            </span>
            <Award className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 tabular-nums">
            {accuracy}%
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Across {progress.totalQuestionsAnswered} answered questions
          </p>
        </div>
      </div>

      {/* Words Needing Practice */}
      {learningWords.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Words Needing Practice
              </h3>
              <p className="font-urdu text-xs text-slate-500">
                وہ الفاظ جن کی مزید مشق کی ضرورت ہے
              </p>
            </div>
            <button
              onClick={onOpenFlashcards}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Practice in Flashcards →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {learningWords.slice(0, 6).map(w => (
              <div
                key={w.id}
                className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {w.english}
                  </div>
                  <div className="font-urdu text-xs font-semibold text-emerald-900">
                    {w.urdu}
                  </div>
                </div>
                <button
                  onClick={() => speakText(w.english)}
                  className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-md"
                  title="Listen"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Quiz Scores */}
      {progress.recentQuizScores.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-base">
            Recent Daily Quiz Performance
          </h3>
          <div className="divide-y divide-slate-100 text-xs">
            {progress.recentQuizScores.slice(0, 5).map((q, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800">{q.categoryTitle || 'Daily Quiz'}</span>
                  <span className="text-slate-400 ml-2">{q.date}</span>
                </div>
                <div className="font-bold tabular-nums text-emerald-700">
                  {q.score} / {q.total} ({Math.round((q.score / q.total) * 100)}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
