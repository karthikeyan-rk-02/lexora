import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVocabulary } from '../../context/VocabularyContext.tsx';
import {
  BookOpen,
  Languages,
  PlusCircle,
  RotateCcw,
  Volume2,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const AddWordPage: React.FC = () => {
  const navigate = useNavigate();
  const { addWord, speakWord } = useVocabulary();

  const [word, setWord] = useState('');
  const [englishMeaning, setEnglishMeaning] = useState('');
  const [tamilMeaning, setTamilMeaning] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const curatedInspirations = [
    {
      word: 'Serendipity',
      english: 'The occurrence and development of events by chance in a happy or beneficial way.',
      tamil: 'எதிர்பாராத விதமாக கிடைக்கும் மகிழ்ச்சியான அல்லது அதிர்ஷ்டமான நிகழ்வு.',
    },
    {
      word: 'Eloquent',
      english: 'Fluent or persuasive in speaking or writing.',
      tamil: 'தெளிவாகவும் வசீகரமாகவும் பேசும் ஆற்றல் கொண்ட.',
    },
    {
      word: 'Petrichor',
      english: 'A pleasant, earthy scent that frequently accompanies the first rain after a long period of warm, dry weather.',
      tamil: 'மழை பெய்யும்போது மண்ணிலிருந்து எழும் நறுமணம் (மண் வாசனை).',
    },
    {
      word: 'Resilience',
      english: 'The capacity to recover quickly from difficulties; toughness.',
      tamil: 'இடர்களை எதிர்கொண்டு மீண்டு வரும் திறன்.',
    },
  ];

  const handleUseInspiration = (item: (typeof curatedInspirations)[0]) => {
    setWord(item.word);
    setEnglishMeaning(item.english);
    setTamilMeaning(item.tamil);
    setErrorMessage(null);
  };

  const handleClear = () => {
    setWord('');
    setEnglishMeaning('');
    setTamilMeaning('');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent, navigateAfter = false) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedWord = word.trim();
    const trimmedEnglish = englishMeaning.trim();
    const trimmedTamil = tamilMeaning.trim();

    if (!trimmedWord) {
      setErrorMessage('Please enter an English word.');
      return;
    }
    if (!trimmedEnglish) {
      setErrorMessage('Please provide an English meaning.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addWord(trimmedWord, trimmedEnglish, trimmedTamil);
      handleClear();
      if (navigateAfter) {
        navigate('/vocabulary');
      }
    } catch (err: any) {
      console.error('Failed to add word:', err);
      setErrorMessage(err?.message || 'Failed to save word. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <PlusCircle className="w-6 h-6 text-indigo-600" />
            <span>Add New Vocabulary</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Enrich your lexicon by saving English words with English and Tamil definitions.
          </p>
        </div>

        <button
          onClick={() => navigate('/vocabulary')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors self-start sm:self-auto"
        >
          <span>View all saved words</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
              {/* Field 1: English Word (Required) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="vocab-word"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    1. English Word <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {word.trim() && (
                      <button
                        type="button"
                        onClick={() => speakWord(word)}
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                        title="Pronounce word"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen</span>
                      </button>
                    )}
                    <span className="text-[11px] text-slate-400">{word.length}/100</span>
                  </div>
                </div>
                <input
                  id="vocab-word"
                  type="text"
                  required
                  maxLength={100}
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="e.g. Serendipity"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 text-base font-semibold outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>

              {/* Field 2: English Meaning (Required) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="vocab-meaning"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    2. English Meaning <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">{englishMeaning.length}/2000</span>
                </div>
                <textarea
                  id="vocab-meaning"
                  rows={4}
                  required
                  maxLength={2000}
                  value={englishMeaning}
                  onChange={(e) => setEnglishMeaning(e.target.value)}
                  placeholder="e.g. The occurrence and development of events by chance in a happy or beneficial way."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 text-sm leading-relaxed outline-none transition-all placeholder:text-slate-400 resize-y"
                />
              </div>

              {/* Field 3: Tamil Meaning (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="vocab-tamil"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    3. Tamil Meaning <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <span className="text-[11px] text-slate-400">{tamilMeaning.length}/2000</span>
                </div>
                <textarea
                  id="vocab-tamil"
                  rows={3}
                  maxLength={2000}
                  value={tamilMeaning}
                  onChange={(e) => setTamilMeaning(e.target.value)}
                  placeholder="e.g. எதிர்பாராத விதமாக கிடைக்கும் மகிழ்ச்சியான அல்லது அதிர்ஷ்டமான நிகழ்வு."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 text-sm font-tamil leading-relaxed outline-none transition-all placeholder:text-slate-400 resize-y"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  You can type in Tamil Unicode or paste translations directly.
                </p>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isSubmitting || (!word && !englishMeaning && !tamilMeaning)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors disabled:opacity-40"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Form</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    Save & View Collection
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4" />
                        <span>Save Word</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar: Quick Inspirations & Helpful Tips */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Word Inspiration</span>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Need inspiration? Click any word below to automatically populate the form:
            </p>

            <div className="space-y-2.5">
              {curatedInspirations.map((item) => (
                <button
                  key={item.word}
                  type="button"
                  onClick={() => handleUseInspiration(item)}
                  className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                      {item.word}
                    </span>
                    <span className="text-[10px] text-indigo-500 font-semibold group-hover:underline">
                      Use &rarr;
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-tamil">
                    {item.tamil}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <Languages className="w-4 h-4" />
              <span>Lexora Tip</span>
            </div>
            <h4 className="text-sm font-bold">Bilingual Retention</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pairing complex English concepts with native Tamil equivalents creates dual synaptic connections, improving active recall by up to 40%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
