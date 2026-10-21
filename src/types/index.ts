export type WordCategory =
  | 'greetings'
  | 'daily_verbs'
  | 'food_dining'
  | 'family'
  | 'home_objects'
  | 'colors_clothes'
  | 'numbers_time'
  | 'feelings_health'
  | 'travel_places'
  | 'work_study';

export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'phrase' | 'pronoun' | 'adverb';

export interface VocabularyWord {
  id: string;
  english: string;
  urdu: string;
  romanUrdu: string;
  partOfSpeech: PartOfSpeech;
  category: WordCategory;
  phonetic: string;
  meaningUrdu: string;
  meaningEnglish: string;
  exampleEnglish: string;
  exampleUrdu: string;
  exampleRomanUrdu: string;
  memoryTip?: string;
  difficulty: 'beginner' | 'elementary';
}

export type QuizQuestionType =
  | 'urdu_to_english'
  | 'english_to_urdu'
  | 'fill_blank'
  | 'audio_listen'
  | 'match_pair';

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  promptUrdu: string;
  targetWord: VocabularyWord;
  options: string[];
  correctAnswer: string;
  explanationUrdu: string;
  explanationEnglish: string;
  audioPromptText?: string;
}

export interface UserProgress {
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  quizzesCompletedToday: number;
  totalQuizzesTaken: number;
  totalScore: number;
  totalQuestionsAnswered: number;
  masteredWordIds: string[];
  learningWordIds: string[];
  starredWordIds: string[];
  recentQuizScores: {
    date: string;
    score: number;
    total: number;
    categoryTitle?: string;
  }[];
}

export interface GrammarRule {
  id: string;
  titleEnglish: string;
  titleUrdu: string;
  explanationEnglish: string;
  explanationUrdu: string;
  keyDifference: string;
  urduPattern: string;
  englishPattern: string;
  examples: {
    english: string;
    urdu: string;
    romanUrdu: string;
    note?: string;
  }[];
}
