import { VocabularyItem, VocabularyStats, SortOption, FilterOption } from '../types/index.ts';

/**
 * Calculates statistics for vocabulary entries:
 * 1. totalWords: count of words
 * 2. recentlyAdded: entries added in the last 7 days
 * 3. tamilMeaningsCount: entries having non-empty Tamil translation
 */
export function calculateVocabularyStats(
  items: VocabularyItem[],
  referenceDate: Date = new Date()
): VocabularyStats {
  const sevenDaysAgo = new Date(referenceDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  let recentlyAdded = 0;
  let tamilMeaningsCount = 0;

  for (const item of items) {
    // Check tamil meaning
    if (item.tamilMeaning && item.tamilMeaning.trim().length > 0) {
      tamilMeaningsCount++;
    }

    // Check date added
    const itemDate = parseItemDate(item.createdAt);
    if (itemDate && itemDate >= sevenDaysAgo) {
      recentlyAdded++;
    }
  }

  return {
    totalWords: items.length,
    recentlyAdded,
    tamilMeaningsCount,
  };
}

/**
 * Helper to safely extract a Javascript Date from Firestore Timestamp or string or number
 */
export function parseItemDate(dateVal: any): Date | null {
  if (!dateVal) return null;
  if (dateVal instanceof Date) return dateVal;
  // Firestore Timestamp with toDate()
  if (typeof dateVal === 'object' && typeof dateVal.toDate === 'function') {
    try {
      return dateVal.toDate();
    } catch {
      return null;
    }
  }
  // Firestore Timestamp with seconds
  if (typeof dateVal === 'object' && typeof dateVal.seconds === 'number') {
    return new Date(dateVal.seconds * 1000);
  }
  if (typeof dateVal === 'string' || typeof dateVal === 'number') {
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/**
 * Filters and sorts vocabulary entries based on query, filter type, and sort order.
 * Scans English word, English meaning, and Tamil meaning.
 */
export function filterAndSortVocabulary(
  items: VocabularyItem[],
  searchQuery: string = '',
  sortOption: SortOption = 'newest',
  filterOption: FilterOption = 'all'
): VocabularyItem[] {
  const query = searchQuery.trim().toLowerCase();

  let filtered = items.filter((item) => {
    // Filter by Tamil presence
    if (filterOption === 'with-tamil') {
      if (!item.tamilMeaning || item.tamilMeaning.trim().length === 0) return false;
    } else if (filterOption === 'without-tamil') {
      if (item.tamilMeaning && item.tamilMeaning.trim().length > 0) return false;
    }

    // Search query matching English word, English meaning, or Tamil meaning
    if (!query) return true;

    const wordMatch = item.word.toLowerCase().includes(query);
    const meaningMatch = item.englishMeaning.toLowerCase().includes(query);
    const tamilMatch = item.tamilMeaning ? item.tamilMeaning.toLowerCase().includes(query) : false;

    return wordMatch || meaningMatch || tamilMatch;
  });

  // Sorting
  filtered.sort((a, b) => {
    switch (sortOption) {
      case 'alpha-asc':
        return a.word.localeCompare(b.word, undefined, { sensitivity: 'base' });
      case 'alpha-desc':
        return b.word.localeCompare(a.word, undefined, { sensitivity: 'base' });
      case 'oldest': {
        const timeA = parseItemDate(a.createdAt)?.getTime() ?? 0;
        const timeB = parseItemDate(b.createdAt)?.getTime() ?? 0;
        return timeA - timeB;
      }
      case 'newest':
      default: {
        const timeA = parseItemDate(a.createdAt)?.getTime() ?? 0;
        const timeB = parseItemDate(b.createdAt)?.getTime() ?? 0;
        return timeB - timeA;
      }
    }
  });

  return filtered;
}

export interface ValidationResult {
  isValid: boolean;
  errors: {
    word?: string;
    englishMeaning?: string;
    tamilMeaning?: string;
  };
  sanitized: {
    word: string;
    englishMeaning: string;
    tamilMeaning: string | null;
  };
}

/**
 * Validates and trims vocabulary form inputs according to requirements and schema boundaries
 */
export function validateWordInput(
  rawWord: string,
  rawEnglishMeaning: string,
  rawTamilMeaning?: string
): ValidationResult {
  const word = (rawWord || '').trim();
  const englishMeaning = (rawEnglishMeaning || '').trim();
  const tamilMeaning = (rawTamilMeaning || '').trim();

  const errors: {
    word?: string;
    englishMeaning?: string;
    tamilMeaning?: string;
  } = {};

  if (!word) {
    errors.word = 'English word is required.';
  } else if (word.length > 100) {
    errors.word = 'English word must be 100 characters or less.';
  }

  if (!englishMeaning) {
    errors.englishMeaning = 'English meaning is required.';
  } else if (englishMeaning.length > 2000) {
    errors.englishMeaning = 'English meaning must be 2000 characters or less.';
  }

  if (tamilMeaning && tamilMeaning.length > 2000) {
    errors.tamilMeaning = 'Tamil meaning must be 2000 characters or less.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      word,
      englishMeaning,
      tamilMeaning: tamilMeaning.length > 0 ? tamilMeaning : null,
    },
  };
}

/**
 * Checks if a word is already in the user's vocabulary (case-insensitive)
 */
export function isDuplicateWord(items: VocabularyItem[], newWord: string, excludeId?: string): boolean {
  const target = newWord.trim().toLowerCase();
  return items.some((item) => {
    if (excludeId && item.id === excludeId) return false;
    return item.word.trim().toLowerCase() === target;
  });
}
