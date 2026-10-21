import React from 'react';
import { VocabularyItem } from '../../types/index.ts';
import { parseItemDate } from '../../utils/vocabulary.ts';
import { useVocabulary } from '../../context/VocabularyContext.tsx';
import {
  X,
  Volume2,
  Calendar,
  Clock,
  Languages,
  Edit3,
  Trash2,
  BookOpen,
} from 'lucide-react';

interface WordDetailModalProps {
  item: VocabularyItem | null;
  onClose: () => void;
  onEdit: (item: VocabularyItem) => void;
  onDelete: (item: VocabularyItem) => void;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  item,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { speakWord } = useVocabulary();

  if (!item) return null;

  const createdDate = parseItemDate(item.createdAt);
  const updatedDate = parseItemDate(item.updatedAt);

  const formatDate = (date: Date | null) => {
    if (!date) return 'Just now';
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="word-detail-title"
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 id="word-detail-title" className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {item.word}
              </h2>
              <button
                type="button"
                onClick={() => speakWord(item.word)}
                className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                title="Pronounce word"
                aria-label={`Pronounce ${item.word}`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 font-medium">Vocabulary Detail</p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* English Meaning */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>English Meaning</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
              {item.englishMeaning}
            </div>
          </div>

          {/* Tamil Meaning */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              <Languages className="w-4 h-4 text-indigo-600" />
              <span>Tamil Meaning (தமிழ் பொருள்)</span>
            </div>
            {item.tamilMeaning && item.tamilMeaning.trim().length > 0 ? (
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100/80 text-indigo-950 font-tamil text-sm leading-relaxed whitespace-pre-wrap">
                {item.tamilMeaning}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-xs italic">
                No Tamil translation provided for this word.
              </div>
            )}
          </div>

          {/* Meta timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Added: {formatDate(createdDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Updated: {formatDate(updatedDate)}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete(item);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(item);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Word</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
