import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini client safely
let geminiClient: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({});
  }
} catch (err) {
  console.warn('Could not initialize Gemini client:', err);
}

// API: AI English Tutor for Urdu Speakers
app.post('/api/ai-tutor', async (req: Request, res: Response) => {
  const { query, mode } = req.body;

  if (!query || typeof query !== 'string') {
    res.status(400).json({ error: 'Query is required.' });
    return;
  }

  // Fallback responses if no API key is available
  const getFallbackResponse = () => {
    return {
      success: true,
      mode: mode || 'explain',
      input: query,
      english: `Practice translation for: "${query}"`,
      urdu: `سیکھنے کے لیے رہنمائی: روزانہ بول چال میں چھوٹے جملے استعمال کریں۔`,
      romanUrdu: 'Rozana bol-chal mein chotay jumlay istemal karein.',
      explanationUrdu: 'انگریزی سیکھنے کا بہترین طریقہ یہ ہے کہ آپ بنیادی الفاظ یاد کریں، روزانہ ایک کوئز حل کریں اور بلند آواز سے دہرائیں۔',
      explanationEnglish: 'The best way to learn English from Urdu is through daily bite-sized vocabulary and active audio listening.',
      examples: [
        { en: 'I am learning English step by step.', ur: 'میں قدم بہ قدم انگریزی سیکھ رہا ہوں۔' },
        { en: 'Practice makes a person perfect.', ur: 'مشق انسان کو کامل بناتی ہے۔' }
      ]
    };
  };

  if (!geminiClient) {
    res.json(getFallbackResponse());
    return;
  }

  try {
    const prompt = mode === 'check_sentence'
      ? `You are an expert, encouraging English teacher for Urdu native speakers.
A beginner learner wrote this English sentence: "${query}".
Analyze the sentence. If there are grammar, tense, or spelling mistakes, point them out gently in clear Urdu and English.
Return JSON with the following structure:
{
  "isCorrect": boolean,
  "correctedEnglish": string,
  "urduTranslation": string,
  "romanUrduTranslation": string,
  "feedbackUrdu": string (kind explanation in Urdu Nastaliq font suitable prose),
  "feedbackEnglish": string,
  "grammarTipUrdu": string,
  "exampleSentence": { "en": string, "ur": string }
}`
      : `You are a patient English tutor teaching Urdu speakers.
The user asked: "${query}".
Explain how to say or use this in English.
Provide clear English translation, Roman Urdu pronunciation, Urdu explanation, and 2 beginner-friendly example sentences.
Return JSON with the following structure:
{
  "english": string,
  "urdu": string,
  "romanUrdu": string,
  "phonetic": string,
  "explanationUrdu": string,
  "explanationEnglish": string,
  "examples": [
    { "en": string, "ur": string, "romanUrdu": string },
    { "en": string, "ur": string, "romanUrdu": string }
  ]
}`;

    const response = await geminiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    res.json({ success: true, ...parsed });
  } catch (err: unknown) {
    console.error('Gemini error:', err);
    res.json(getFallbackResponse());
  }
});

// Setup dev server with Vite or production static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`BolEnglish server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
