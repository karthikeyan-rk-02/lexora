import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVocabulary } from '../../context/VocabularyContext.tsx';
import { VocabularyItem, SortOption, FilterOption } from '../../types/index.ts';
import { parseItemDate } from '../../utils/vocabulary.ts';
import { WordDetailModal } from './WordDetailModal.tsx';
import { EditWordModal } from './EditWordModal.tsx';
import { DeleteConfirmModal } from './DeleteConfirmModal.tsx';
import {
  Search,
  Plus,
  ArrowUpDown,
  Volume2,
  Eye,
  Edit3,
  Trash2,
  BookOpen,
  Filter,
  X,
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react';

export const VocabularyPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    filteredItems,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    filterOption,
    setFilterOption,
    speakWord,
    loading,
  } = useVocabulary();

  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
  const [editingWord, setEditingWord] = useState<VocabularyItem | null>(null);
  const [deletingWord, setDeletingWord] = useState<VocabularyItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>My Vocabulary</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold">
              {items.length} {items.length === 1 ? 'word' : 'words'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse, search, edit, and organize all your saved English and Tamil vocabulary.
          </p>
        </div>

        <button
          onClick={() => navigate('/add')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Word</span>
        </button>
      </div>

      {/* Control Bar: Search, Filters, Sorters, View Switcher */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by English word, English meaning, or Tamil..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sorter & View Toggle */}
          <div className="flex items-center gap-2">
            {/* Sort Selector */}
            <div className="relative flex items-center">
              <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="appearance-none pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold focus:bg-white focus:border-indigo-500 outline-none transition-all cursor-pointer"
                aria-label="Sort vocabulary"
              >
                <option value="newest">Recently Added</option>
                <option value="oldest">Oldest First</option>
                <option value="alpha-asc">Alphabetical (A – Z)</option>
                <option value="alpha-desc">Alphabetical (Z – A)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
                aria-label="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            Filter:
          </span>
          <button
            type="button"
            onClick={() => setFilterOption('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterOption === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Words ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterOption('with-tamil')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterOption === 'with-tamil'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Has Tamil Meaning ({items.filter((i) => i.tamilMeaning && i.tamilMeaning.trim()).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterOption('without-tamil')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterOption === 'without-tamil'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            English Only ({items.filter((i) => !i.tamilMeaning || !i.tamilMeaning.trim()).length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs animate-pulse space-y-3"
            >
              <div className="h-5 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        /* Empty state */
        <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          {items.length === 0 ? (
            <>
              <h3 className="text-lg font-bold text-slate-900">No vocabulary entries yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Begin compiling your words! Every word you add is permanently saved to your account.
              </p>
              <button
                onClick={() => navigate('/add')}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Word</span>
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-slate-900">No matching words found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No entries match your search query "{searchQuery}" or selected filter. Try adjusting your search term.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterOption('all');
                }}
                className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Search & Filters</span>
              </button>
            </>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Word & Audio & Date */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {item.word}
                    </h3>
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

                {/* English meaning */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                  {item.englishMeaning}
                </p>

                {/* Tamil meaning tag */}
                {item.tamilMeaning && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50/70 border border-indigo-100/60 text-indigo-950 text-xs font-tamil mb-3">
                    <span className="text-[10px] uppercase font-bold text-indigo-600">தமிழ்:</span>
                    <span className="truncate max-w-[220px]">{item.tamilMeaning}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-2">
                <button
                  onClick={() => setSelectedWord(item)}
                  className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingWord(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Edit word"
                    aria-label={`Edit ${item.word}`}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingWord(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete word"
                    aria-label={`Delete ${item.word}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Word</th>
                  <th className="py-3.5 px-4">English Meaning</th>
                  <th className="py-3.5 px-4">Tamil Meaning</th>
                  <th className="py-3.5 px-4">Added</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span>{item.word}</span>
                        <button
                          onClick={() => speakWord(item.word)}
                          className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Pronounce"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {item.englishMeaning}
                    </td>
                    <td className="py-3.5 px-4 font-tamil text-indigo-900 max-w-xs truncate">
                      {item.tamilMeaning || <span className="text-slate-300 italic">-</span>}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedWord(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingWord(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingWord(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
