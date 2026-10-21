import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Trophy,
  BookOpen,
  Award,
  HelpCircle,
  Snail
} from 'lucide-react';
import { QuizQuestion, UserProgress, WordCategory } from '../types';
import { generateDailyQuiz } from '../utils/quizGenerator';
import { speakText, sounds } from '../utils/audio';
import { recordQuizCompletion, toggleWordMastery } from '../utils/storage';
import { CATEGORY_LABELS } from '../data/vocabulary';

interface DailyQuizProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onExploreWords: () => void;
  onOpenFlashcards: () => void;
}

export const DailyQuiz: React.FC<DailyQuizProps> = ({
  progress,
  onUpdateProgress,
  onExploreWords,
  onOpenFlashcards,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<WordCategory | 'all'>('all');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{
    question: QuizQuestion;
    userAnswer: string;
    isCorrect: boolean;
  }[]>([]);

  // Initialize or reset quiz
  const startNewQuiz = (category: WordCategory | 'all' = selectedCategory) => {
    const qList = generateDailyQuiz(category === 'all' ? undefined : category);
    setQuestions(qList);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
    setUserAnswers([]);
  };

  useEffect(() => {
    startNewQuiz('all');
  }, []);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (isAnswerSubmitted) return;
    sounds.playTap();
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isAnswerSubmitted || !currentQ) return;

    const isCorrect = selectedAnswer.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
    setIsAnswerSubmitted(true);

    if (isCorrect) {
      sounds.playCorrect();
      setScore(prev => prev + 1);
      // Auto mark word as mastered if user got it right
      toggleWordMastery(currentQ.targetWord.id, true);
    } else {
      sounds.playIncorrect();
      // Mark as learning
      toggleWordMastery(currentQ.targetWord.id, false);
    }

    setUserAnswers(prev => [
      ...prev,
      {
        question: currentQ,
        userAnswer: selectedAnswer,
        isCorrect
      }
    ]);
  };

  const handleNextQuestion = () => {
    sounds.playTap();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz finished
      const finalScore = score + (selectedAnswer?.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase() ? 0 : 0);
      const updated = recordQuizCompletion(score, questions.length, selectedCategory === 'all' ? 'Daily Mixed Quiz' : CATEGORY_LABELS[selectedCategory]?.en);
      onUpdateProgress(updated);
      setQuizCompleted(true);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback
      }
    }
  };

  const handlePlayWordAudio = (slow: boolean = false) => {
    if (!currentQ) return;
    speakText(currentQ.targetWord.english, { rate: slow ? 0.7 : 0.95 });
  };

  if (!currentQ && !quizCompleted) {
    return (
      <div className="p-12 text-center text-slate-500">
        Loading today's beginner vocabulary quiz...
      </div>
    );
  }

  // QUIZ COMPLETED VIEW
  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPassing = percentage >= 60;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {isPassing ? 'Daily Quiz Completed!' : 'Keep Practicing!'}
            </h2>
            <p className="font-urdu text-xl text-emerald-800 font-semibold mt-1">
              {isPassing ? 'شاباش! آپ نے آج کا کوئز کامیابی سے مکمل کر لیا ہے۔' : 'بہت اچھے! تھوڑی اور مشق سے آپ مزید بہتر ہو جائیں گے۔'}
            </p>
          </div>

          {/* Score Display */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/80 max-w-sm mx-auto">
            <div className="text-4xl font-extrabold text-slate-900 tabular-nums">
              {score} <span className="text-slate-400 text-2xl font-normal">/ {questions.length}</span>
            </div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">
              {percentage}% Correct Accuracy
            </div>
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200/80 rounded-md py-1 px-2 mt-3 font-semibold">
              + {score * 10} XP Vocabulary Earned
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => startNewQuiz(selectedCategory)}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Take Another Quiz</span>
            </button>

            <button
              onClick={onOpenFlashcards}
              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-lg border border-slate-300 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Review Flashcards</span>
            </button>
          </div>
        </div>

        {/* Breakdown of Tested Words */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">
              Words Reviewed in this Quiz
            </h3>
            <span className="font-urdu text-sm text-slate-500">آج دہرائے گئے الفاظ</span>
          </div>

          <div className="divide-y divide-slate-100">
            {userAnswers.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {item.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">
                        {item.question.targetWord.english}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {item.question.targetWord.phonetic}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      <span className="font-urdu font-medium text-slate-800">
                        {item.question.targetWord.urdu}
                      </span>
                      <span className="text-slate-400 ml-1.5">
                        ({item.question.targetWord.romanUrdu})
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => speakText(item.question.targetWord.english)}
                  className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors shrink-0"
                  title="Listen to pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE QUIZ QUESTION VIEW
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Category selector row */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-medium whitespace-nowrap">Quiz Category:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => {
              setSelectedCategory('all');
              startNewQuiz('all');
            }}
            className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-slate-200/70 hover:bg-slate-300 text-slate-700'
            }`}
          >
            All Topics (Mix)
          </button>
          <button
            onClick={() => {
              setSelectedCategory('greetings');
              startNewQuiz('greetings');
            }}
            className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === 'greetings'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-slate-200/70 hover:bg-slate-300 text-slate-700'
            }`}
          >
            Greetings
          </button>
          <button
            onClick={() => {
              setSelectedCategory('daily_verbs');
              startNewQuiz('daily_verbs');
            }}
            className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === 'daily_verbs'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-slate-200/70 hover:bg-slate-300 text-slate-700'
            }`}
          >
            Daily Verbs
          </button>
          <button
            onClick={() => {
              setSelectedCategory('food_dining');
              startNewQuiz('food_dining');
            }}
            className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === 'food_dining'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-slate-200/70 hover:bg-slate-300 text-slate-700'
            }`}
          >
            Food & Dining
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Progress bar */}
        <div className="bg-slate-100 h-1.5 w-full">
          <div
            className="bg-emerald-500 h-1.5 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header & Question Counter */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="tabular-nums font-semibold text-emerald-700">
              Score: {score}
            </span>
          </div>

          {/* Urdu Prompt & English Instruction */}
          <div className="space-y-2 text-center py-2">
            <p className="font-urdu text-2xl sm:text-3xl font-bold text-slate-900 leading-relaxed">
              {currentQ.promptUrdu}
            </p>
            <p className="text-sm font-medium text-slate-600">
              {currentQ.prompt}
            </p>
          </div>

          {/* Audio Prompt Button (For listening questions or general audio aid) */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handlePlayWordAudio(false)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200 transition-colors active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>Listen to English Word</span>
            </button>
            <button
              onClick={() => handlePlayWordAudio(true)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition-colors"
              title="Slow speed"
            >
              <Snail className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((option, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
              const isSelected = selectedAnswer === option;
              const isCorrect = option.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

              let cardStyle = 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50 text-slate-800';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-2 ring-emerald-400';
                } else if (isSelected) {
                  cardStyle = 'border-rose-400 bg-rose-50 text-rose-900 line-through';
                } else {
                  cardStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                cardStyle = 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500 font-semibold';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(option)}
                  disabled={isAnswerSubmitted}
                  className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${cardStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-200/80 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
                      {letter}
                    </span>
                    <span className="text-base font-medium">
                      {option}
                    </span>
                  </div>

                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Explanation Box (Appears after submission) */}
          {isAnswerSubmitted && (
            <div className="rounded-xl p-4 border transition-all animate-fadeIn bg-slate-50 border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                {selectedAnswer?.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase() ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer! درست جواب
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                    <XCircle className="w-3.5 h-3.5" /> Incorrect غلط جواب
                  </span>
                )}
              </div>

              <p className="font-urdu text-base text-slate-800 leading-relaxed">
                {currentQ.explanationUrdu}
              </p>
              <p className="text-xs text-slate-600 font-medium">
                {currentQ.explanationEnglish}
              </p>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={() => speakText(currentQ.targetWord.exampleEnglish)}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen Sentence</span>
            </button>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg shadow-sm transition-all"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-all"
              >
                <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
