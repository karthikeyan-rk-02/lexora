import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../../types/index.ts';
import { useVocabulary } from '../../context/VocabularyContext.tsx';
import { X, Save, AlertCircle } from 'lucide-react';

interface EditWordModalProps {
  item: VocabularyItem | null;
  onClose: () => void;
}

export const EditWordModal: React.FC<EditWordModalProps> = ({ item, onClose }) => {
  const { updateWord } = useVocabulary();

  const [word, setWord] = useState('');
  const [englishMeaning, setEnglishMeaning] = useState('');
  const [tamilMeaning, setTamilMeaning] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setWord(item.word);
      setEnglishMeaning(item.englishMeaning);
      setTamilMeaning(item.tamilMeaning || '');
      setError(null);
    }
  }, [item]);

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!word.trim()) {
      setError('English word cannot be empty.');
      return;
    }
    if (!englishMeaning.trim()) {
      setError('English meaning cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateWord(item.id, word, englishMeaning, tamilMeaning);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update vocabulary entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-word-title"
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 id="edit-word-title" className="text-xl font-bold text-slate-900">
              Edit Vocabulary Entry
            </h2>
            <p className="text-xs text-slate-500">Update word definition and translations</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
            aria-label="Close edit dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Word Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase text-slate-600 tracking-wider">
                  English Word <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">{word.length}/100</span>
              </div>
              <input
                type="text"
                required
                maxLength={100}
                value={word}
                onChange={(e) => setWord(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 text-sm outline-none transition-all"
              />
            </div>

            {/* English Meaning Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase text-slate-600 tracking-wider">
                  English Meaning <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">{englishMeaning.length}/2000</span>
              </div>
              <textarea
                rows={3}
                required
                maxLength={2000}
                value={englishMeaning}
                onChange={(e) => setEnglishMeaning(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 text-sm outline-none transition-all resize-y"
              />
            </div>

            {/* Tamil Meaning Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase text-slate-600 tracking-wider">
                  Tamil Meaning <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <span className="text-[11px] text-slate-400">{tamilMeaning.length}/2000</span>
              </div>
              <textarea
                rows={3}
                maxLength={2000}
                value={tamilMeaning}
                onChange={(e) => setTamilMeaning(e.target.value)}
                placeholder="எ.கா. எதிர்பாராத மகிழ்ச்சியான நிகழ்வு"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 text-sm font-tamil outline-none transition-all resize-y placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
