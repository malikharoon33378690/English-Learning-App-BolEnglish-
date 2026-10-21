import { QuizQuestion, VocabularyWord, WordCategory } from '../types';
import { VOCABULARY_LIST } from '../data/vocabulary';

// Helper to shuffle array
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate random distractors from other words
function getDistractors(
  target: VocabularyWord,
  pool: VocabularyWord[],
  field: 'english' | 'urdu',
  count: number = 3
): string[] {
  const candidates = pool
    .filter(w => w.id !== target.id)
    .map(w => (field === 'english' ? w.english : w.urdu.split('/')[0].trim()));
  
  const uniqueCandidates = Array.from(new Set(candidates));
  const shuffled = shuffle(uniqueCandidates);
  return shuffled.slice(0, count);
}

/**
 * Generate a curated 5-question Daily Beginner Quiz
 */
export function generateDailyQuiz(categoryFilter?: WordCategory): QuizQuestion[] {
  const pool = categoryFilter
    ? VOCABULARY_LIST.filter(w => w.category === categoryFilter)
    : VOCABULARY_LIST;

  const shuffledPool = shuffle(pool);
  const selectedWords = shuffledPool.slice(0, Math.min(5, shuffledPool.length));

  const questions: QuizQuestion[] = [];

  selectedWords.forEach((word, idx) => {
    // Alternate question types to provide rich learning variety
    const questionTypeIndex = idx % 4;

    if (questionTypeIndex === 0) {
      // Urdu to English
      const targetEnglish = word.english;
      const distractors = getDistractors(word, VOCABULARY_LIST, 'english', 3);
      const options = shuffle([targetEnglish, ...distractors]);

      questions.push({
        id: `q-${idx}-${word.id}`,
        type: 'urdu_to_english',
        prompt: `What is the English word for "${word.urdu.split('/')[0].trim()}"?`,
        promptUrdu: `اس لفظ کا درست انگریزی ترجمہ کیا ہے؟`,
        targetWord: word,
        options,
        correctAnswer: targetEnglish,
        explanationUrdu: `درست جواب "${word.english}" ہے۔ اس کا تلفظ "${word.phonetic}" ہے۔ مثال: ${word.exampleUrdu}`,
        explanationEnglish: `"${word.english}" means "${word.urdu}". Example: ${word.exampleEnglish}`
      });
    } else if (questionTypeIndex === 1) {
      // English to Urdu
      const targetUrdu = word.urdu.split('/')[0].trim();
      const distractors = getDistractors(word, VOCABULARY_LIST, 'urdu', 3);
      const options = shuffle([targetUrdu, ...distractors]);

      questions.push({
        id: `q-${idx}-${word.id}`,
        type: 'english_to_urdu',
        prompt: `What does the English word "${word.english}" mean in Urdu?`,
        promptUrdu: `لفظ "${word.english}" کا اردو میں کیا مطلب ہے؟`,
        targetWord: word,
        options,
        correctAnswer: targetUrdu,
        explanationUrdu: `درست جواب: "${word.english}" کو اردو میں "${word.urdu}" کہتے ہیں۔ رومن اردو: ${word.romanUrdu}`,
        explanationEnglish: `Correct! "${word.english}" translates to "${word.urdu}".`
      });
    } else if (questionTypeIndex === 2) {
      // Audio Listen Quiz
      const targetUrdu = word.urdu.split('/')[0].trim();
      const distractors = getDistractors(word, VOCABULARY_LIST, 'urdu', 3);
      const options = shuffle([targetUrdu, ...distractors]);

      questions.push({
        id: `q-${idx}-${word.id}`,
        type: 'audio_listen',
        prompt: `Listen to the pronunciation and select the correct Urdu meaning:`,
        promptUrdu: `انگریزی تلفظ سنیں اور درست اردو معنی منتخب کریں:`,
        targetWord: word,
        options,
        correctAnswer: targetUrdu,
        audioPromptText: word.english,
        explanationUrdu: `آپ نے "${word.english}" سنا، جس کا مطلب "${word.urdu}" ہے۔`,
        explanationEnglish: `You heard "${word.english}" which means "${word.urdu}".`
      });
    } else {
      // Sentence Fill in the Blank
      // e.g. Replace target word in example sentence with blank: ______
      const sentence = word.exampleEnglish;
      const regex = new RegExp(`\\b${word.english}\\b`, 'i');
      const blankedSentence = regex.test(sentence)
        ? sentence.replace(regex, '_______')
        : `${sentence} (Select "${word.english}")`;

      const targetEnglish = word.english;
      const distractors = getDistractors(word, VOCABULARY_LIST, 'english', 3);
      const options = shuffle([targetEnglish, ...distractors]);

      questions.push({
        id: `q-${idx}-${word.id}`,
        type: 'fill_blank',
        prompt: `Complete the sentence: "${blankedSentence}"`,
        promptUrdu: `خالی جگہ پر کریں: (${word.urdu})`,
        targetWord: word,
        options,
        correctAnswer: targetEnglish,
        explanationUrdu: `مکمل جملہ ہے: "${word.exampleEnglish}"۔ ترجمہ: ${word.exampleUrdu}`,
        explanationEnglish: `Complete sentence: "${word.exampleEnglish}"`
      });
    }
  });

  return questions;
}
