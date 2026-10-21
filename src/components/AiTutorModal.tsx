import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  Volume2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { speakText, sounds } from '../utils/audio';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'ask' | 'check_sentence'>('ask');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseResult, setResponseResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    { text: 'How do I introduce myself in English?', labelUrdu: 'اپنا تعارف کروانا' },
    { text: 'How do I order food at a restaurant?', labelUrdu: 'کھانا آرڈر کرنا' },
    { text: 'What is the difference between "Say" and "Tell"?', labelUrdu: 'Say اور Tell میں فرق' },
    { text: 'Explain how to ask for the bill politely in English.', labelUrdu: 'بل مانگنے کا شائستہ طریقہ' }
  ];

  const quickSentenceChecks = [
    { text: 'I am go to office everyday by bus.' },
    { text: 'Yesterday he was come to my house.' },
    { text: 'She do not like drinking cold milk.' }
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    sounds.playTap();
    setIsLoading(true);
    setResponseResult(null);

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          mode: mode === 'check_sentence' ? 'check_sentence' : 'explain'
        })
      });

      const data = await res.json();
      setResponseResult(data);
    } catch (err) {
      // Offline fallback
      setResponseResult({
        success: true,
        english: textToSend,
        urdu: 'انگریزی بول چال کی بنیادی مشق جاری رکھیں۔',
        feedbackUrdu: 'باقاعدگی سے روزمرہ چھوٹے جملے بولیں اور سنیں۔',
        explanationUrdu: 'ہمیشہ روزمرہ الفاظ کے ساتھ گرامر کے اصولوں کی مشق کریں۔',
        explanationEnglish: 'Practice simple daily conversational phrases regularly.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    sounds.playTap();
    speakText(text, { rate: 0.9 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                AI English Tutor for Urdu Learners
              </h3>
              <p className="font-urdu text-xs text-slate-500">
                اردو میں سوال پوچھیں یا اپنا انگریزی جملہ درست کروائیں
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50/40 px-5 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => {
              setMode('ask');
              setResponseResult(null);
            }}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              mode === 'ask'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ask / Translate (سوال پوچھیں)
          </button>
          <button
            onClick={() => {
              setMode('check_sentence');
              setResponseResult(null);
            }}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              mode === 'check_sentence'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Check My English Sentence (جملے کی اصلاح)
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Quick Prompts */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {mode === 'ask' ? 'Quick Sample Questions:' : 'Try Correcting These Examples:'}
            </span>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {(mode === 'ask' ? quickPrompts : quickSentenceChecks).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(item.text);
                    handleSend(item.text);
                  }}
                  className="text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200/70 transition-colors text-left"
                >
                  {item.text}
                </button>
              ))}
            </div>
          </div>

          {/* AI Response Display */}
          {isLoading && (
            <div className="p-8 text-center space-y-3 bg-slate-50 rounded-xl border border-slate-200">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto" />
              <p className="text-xs text-slate-600 font-medium">
                AI استاد آپ کے لیے آسان وضاحت تیار کر رہا ہے...
              </p>
            </div>
          )}

          {responseResult && !isLoading && (
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4 animate-fadeIn">
              {mode === 'check_sentence' ? (
                /* Sentence Check Mode Display */
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {responseResult.isCorrect ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        Great job! Your sentence is correct.
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md">
                        <AlertCircle className="w-4 h-4 text-amber-700" />
                        Needs a small improvement:
                      </span>
                    )}
                  </div>

                  {/* Corrected Sentence */}
                  <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Correct English Sentence:
                    </span>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-lg font-bold text-slate-900 font-sans">
                        {responseResult.correctedEnglish || responseResult.english}
                      </p>
                      <button
                        onClick={() => handleSpeak(responseResult.correctedEnglish || responseResult.english)}
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Listen to correct sentence"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    {responseResult.urduTranslation && (
                      <p className="font-urdu text-sm text-emerald-900 font-semibold pt-1">
                        اردو ترجمہ: {responseResult.urduTranslation}
                      </p>
                    )}
                  </div>

                  {/* Feedback Explanation in Urdu */}
                  {responseResult.feedbackUrdu && (
                    <div className="bg-amber-50/70 p-3.5 rounded-lg border border-amber-200/70 space-y-1">
                      <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                        استاد کی وضاحت (Urdu Feedback):
                      </span>
                      <p className="font-urdu text-sm text-slate-800 leading-relaxed">
                        {responseResult.feedbackUrdu}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Ask / Translate Mode Display */
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Natural English:
                    </span>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xl font-bold text-slate-900 font-sans">
                        {responseResult.english}
                      </p>
                      <button
                        onClick={() => handleSpeak(responseResult.english)}
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Pronounce"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    {responseResult.urdu && (
                      <p className="font-urdu text-base text-emerald-900 font-bold">
                        {responseResult.urdu}
                      </p>
                    )}
                    {responseResult.romanUrdu && (
                      <p className="text-xs text-slate-500 italic">
                        Roman: {responseResult.romanUrdu}
                      </p>
                    )}
                  </div>

                  {/* Urdu Explanation */}
                  {responseResult.explanationUrdu && (
                    <div className="bg-emerald-50/60 p-3.5 rounded-lg border border-emerald-200/70 space-y-1">
                      <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                        وضاحت (Explanation):
                      </span>
                      <p className="font-urdu text-sm text-slate-800 leading-relaxed">
                        {responseResult.explanationUrdu}
                      </p>
                      {responseResult.explanationEnglish && (
                        <p className="text-xs text-slate-600 mt-1">
                          {responseResult.explanationEnglish}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Examples */}
                  {responseResult.examples && responseResult.examples.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Daily Examples:
                      </span>
                      {responseResult.examples.map((eg: any, i: number) => (
                        <div key={i} className="bg-white p-2.5 rounded-lg border border-slate-200/80 text-xs flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{eg.en}</p>
                            <p className="font-urdu text-slate-600">{eg.ur}</p>
                          </div>
                          <button
                            onClick={() => handleSpeak(eg.en)}
                            className="p-1 text-slate-400 hover:text-emerald-700"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={
                mode === 'ask'
                  ? 'Type in English or Urdu (e.g. How to say "shukriya" or ask a rule)...'
                  : 'Type your English sentence to check for mistakes...'
              }
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
