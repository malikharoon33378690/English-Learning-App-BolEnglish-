import { UserProgress } from '../types';

const STORAGE_KEY = 'bolenglish_user_progress_v1';

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getDefaultProgress(): UserProgress {
  return {
    streak: 1,
    lastActiveDate: getTodayDateString(),
    quizzesCompletedToday: 0,
    totalQuizzesTaken: 0,
    totalScore: 0,
    totalQuestionsAnswered: 0,
    masteredWordIds: [],
    learningWordIds: ['w-1', 'w-2', 'w-13', 'w-26'],
    starredWordIds: [],
    recentQuizScores: []
  };
}

export function loadUserProgress(): UserProgress {
  if (typeof window === 'undefined') return getDefaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    const data = JSON.parse(raw) as UserProgress;

    // Check streak logic based on dates
    const today = getTodayDateString();
    if (data.lastActiveDate !== today) {
      const last = new Date(data.lastActiveDate);
      const curr = new Date(today);
      const diffTime = Math.abs(curr.getTime() - last.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        data.streak += 1;
      } else if (diffDays > 1) {
        // Streak broken
        data.streak = 1;
      }
      data.lastActiveDate = today;
      data.quizzesCompletedToday = 0;
      saveUserProgress(data);
    }

    return data;
  } catch {
    return getDefaultProgress();
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function recordQuizCompletion(
  score: number,
  totalQuestions: number,
  categoryTitle: string = 'Daily Quiz'
): UserProgress {
  const current = loadUserProgress();
  const today = getTodayDateString();

  current.quizzesCompletedToday += 1;
  current.totalQuizzesTaken += 1;
  current.totalScore += score;
  current.totalQuestionsAnswered += totalQuestions;
  current.lastActiveDate = today;

  current.recentQuizScores.unshift({
    date: today,
    score,
    total: totalQuestions,
    categoryTitle
  });

  if (current.recentQuizScores.length > 20) {
    current.recentQuizScores = current.recentQuizScores.slice(0, 20);
  }

  saveUserProgress(current);
  return current;
}

export function toggleWordMastery(wordId: string, isMastered: boolean): UserProgress {
  const current = loadUserProgress();
  if (isMastered) {
    if (!current.masteredWordIds.includes(wordId)) {
      current.masteredWordIds.push(wordId);
    }
    current.learningWordIds = current.learningWordIds.filter(id => id !== wordId);
  } else {
    current.masteredWordIds = current.masteredWordIds.filter(id => id !== wordId);
    if (!current.learningWordIds.includes(wordId)) {
      current.learningWordIds.push(wordId);
    }
  }
  saveUserProgress(current);
  return current;
}

export function toggleStarWord(wordId: string): { progress: UserProgress; isStarred: boolean } {
  const current = loadUserProgress();
  let isStarred = false;
  if (current.starredWordIds.includes(wordId)) {
    current.starredWordIds = current.starredWordIds.filter(id => id !== wordId);
    isStarred = false;
  } else {
    current.starredWordIds.push(wordId);
    isStarred = true;
  }
  saveUserProgress(current);
  return { progress: current, isStarred };
}
