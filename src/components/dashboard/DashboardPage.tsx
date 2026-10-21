import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVocabulary } from '../../context/VocabularyContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { VocabularyItem } from '../../types/index.ts';
import { parseItemDate } from '../../utils/vocabulary.ts';
import { WordDetailModal } from '../vocabulary/WordDetailModal.tsx';
import { EditWordModal } from '../vocabulary/EditWordModal.tsx';
import { DeleteConfirmModal } from '../vocabulary/DeleteConfirmModal.tsx';
import {
  BookOpen,
  Calendar,
  Languages,
  Plus,
  ArrowRight,
  Volume2,
  Eye,
  Sparkles,
  Library,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, currentUser } = useAuth();
  const { items, stats, loading, speakWord } = useVocabulary();

  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
  const [editingWord, setEditingWord] = useState<VocabularyItem | null>(null);
  const [deletingWord, setDeletingWord] = useState<VocabularyItem | null>(null);

  const displayName = userProfile?.fullName || currentUser?.displayName || 'Learner';

  // Sort items newest first for the recent section (top 6)
  const recentItems = [...items]
    .sort((a, b) => {
      const timeA = parseItemDate(a.createdAt)?.getTime() ?? 0;
      const timeB = parseItemDate(b.createdAt)?.getTime() ?? 0;
      return timeB - timeA;
    })
    .slice(0, 6);

  const formatDate = (dateVal: any) => {
    const d = parseItemDate(dateVal);
    if (!d) return 'Just now';
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to Lexora</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Build your personal lexicon, {displayName}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Review your vocabulary statistics, expand your repertoire with bilingual definitions, and keep your words accessible across all your devices.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/add')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Word</span>
            </button>
            <button
              onClick={() => navigate('/vocabulary')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/10 transition-colors"
            >
              <Library className="w-4 h-4" />
              <span>Explore All Words</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Words */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Words
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {stats.totalWords}
            </span>
            <span className="text-xs text-slate-500 font-medium">entries in vault</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Synchronized with your personal account
          </p>
        </div>

        {/* Recently Added (7 days) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recently Added
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {stats.recentlyAdded}
            </span>
            <span className="text-xs text-slate-500 font-medium">in past 7 days</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Active additions this week
          </p>
        </div>

        {/* Tamil Meanings */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tamil Meanings
            </span>
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Languages className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {stats.tamilMeaningsCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {stats.totalWords > 0
                ? `${Math.round((stats.tamilMeaningsCount / stats.totalWords) * 100)}% coverage`
                : '0% coverage'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Words enriched with Tamil translations
          </p>
        </div>
      </div>

      {/* Recent Vocabulary Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Recently Added Vocabulary
            </h3>
            <p className="text-xs text-slate-500">Latest words saved to your personal library</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => navigate('/vocabulary')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <span>View all ({items.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs animate-pulse space-y-3"
              >
                <div className="h-5 bg-slate-200 rounded w-1/3" />
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : recentItems.length === 0 ? (
          /* Empty state */
          <div className="p-10 text-center rounded-2xl bg-white border border-dashed border-slate-200">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Your vocabulary vault is empty</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Start building your vocabulary by adding your first English word with its definitions and Tamil meaning.
            </p>
            <button
              onClick={() => navigate('/add')}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Word</span>
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentItems.map((item) => (
              <div
                key={item.id}
                className="group p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.word}
                      </h4>
                      <button
                        onClick={() => speakWord(item.word)}
                        className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Pronounce word"
                        aria-label={`Pronounce ${item.word}`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {item.englishMeaning}
                  </p>

                  {item.tamilMeaning && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50/70 border border-indigo-100/60 text-indigo-900 text-xs font-tamil mb-2">
                      <span className="text-[10px] uppercase font-bold text-indigo-600">தமிழ்:</span>
                      <span className="truncate max-w-[200px]">{item.tamilMeaning}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-2">
                  <span className="text-[11px] text-slate-400">English vocabulary</span>
                  <button
                    onClick={() => setSelectedWord(item)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <WordDetailModal
        item={selectedWord}
        onClose={() => setSelectedWord(null)}
        onEdit={(item) => setEditingWord(item)}
        onDelete={(item) => setDeletingWord(item)}
      />

      <EditWordModal
        item={editingWord}
        onClose={() => setEditingWord(null)}
      />

      <DeleteConfirmModal
        item={deletingWord}
        onClose={() => setDeletingWord(null)}
      />
    </div>
  );
};
