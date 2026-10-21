import React, { useState } from 'react';
import { BookOpen, Volume2, ArrowRight, HelpCircle, Lightbulb } from 'lucide-react';
import { GRAMMAR_RULES } from '../data/grammarRules';
import { speakText, sounds } from '../utils/audio';

export const GrammarLessons: React.FC = () => {
  const [selectedRuleId, setSelectedRuleId] = useState<string>(GRAMMAR_RULES[0].id);

  const activeRule = GRAMMAR_RULES.find(r => r.id === selectedRuleId) || GRAMMAR_RULES[0];

  const handleSpeak = (text: string) => {
    sounds.playTap();
    speakText(text, { rate: 0.9 });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          English Grammar for Urdu Speakers
        </h2>
        <p className="font-urdu text-sm text-emerald-800 font-semibold mt-1">
          اردو بولنے والوں کے لیے آسان انگریزی گرامر کے رہنما اصول
        </p>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Learn how English sentences are built differently from Urdu. Master sentence structure, helping verbs, and asking questions with ease.
        </p>

        {/* Rule Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1 text-xs">
          {GRAMMAR_RULES.map((rule, idx) => (
            <button
              key={rule.id}
              onClick={() => {
                sounds.playTap();
                setSelectedRuleId(rule.id);
              }}
              className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors text-left flex items-center gap-2 ${
                selectedRuleId === rule.id
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{idx + 1}.</span>
              <span className="truncate max-w-[180px]">{rule.titleEnglish.split(':')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Selected Rule Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 font-sans">
            {activeRule.titleEnglish}
          </h3>
          <p className="font-urdu text-xl text-emerald-900 font-bold mt-1">
            {activeRule.titleUrdu}
          </p>
        </div>

        {/* Visual Sentence Structure Diagram */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Structural Comparison (ساخت کا موازنہ)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Urdu Box */}
            <div className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Urdu Pattern (SOV)
              </span>
              <p className="font-urdu text-lg font-bold text-slate-900">
                {activeRule.urduPattern}
              </p>
              <p className="text-xs text-slate-500">
                فاعل (Subject) + مفعول (Object) + فعل (Verb آخر میں)
              </p>
            </div>

            {/* English Box */}
            <div className="bg-emerald-50/70 rounded-lg p-4 border border-emerald-200/80 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                English Pattern (SVO)
              </span>
              <p className="text-base font-bold text-emerald-950 font-sans">
                {activeRule.englishPattern}
              </p>
              <p className="text-xs text-emerald-700">
                Subject + Action Verb (درمیان میں) + Object
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-white rounded-lg p-3 border border-slate-200/60">
            <span className="font-bold text-slate-900">Rule Insight: </span>
            {activeRule.keyDifference}
          </div>
        </div>

        {/* Detailed Explanation */}
        <div className="space-y-3">
          <div className="text-slate-700 text-sm leading-relaxed">
            {activeRule.explanationEnglish}
          </div>
          <div className="font-urdu text-base text-slate-800 leading-loose bg-amber-50/50 p-4 rounded-xl border border-amber-100">
            {activeRule.explanationUrdu}
          </div>
        </div>

        {/* Examples Section */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Interactive Examples & Audio Pronunciation
          </h4>

          <div className="space-y-3">
            {activeRule.examples.map((eg, idx) => (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-slate-100/70 rounded-xl p-4 border border-slate-200 transition-colors flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900 font-sans">
                      {eg.english}
                    </span>
                    <button
                      onClick={() => handleSpeak(eg.english)}
                      className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                      title="Listen"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="font-urdu text-sm font-semibold text-emerald-900">
                    {eg.urdu}
                  </p>
                  <p className="text-xs text-slate-500 italic">
                    Roman: {eg.romanUrdu}
                  </p>
                  {eg.note && (
                    <p className="text-xs text-amber-800 font-urdu pt-1">
                      {eg.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
