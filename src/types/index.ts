export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  photoURL?: string | null;
  createdAt?: any;
}

export interface VocabularyItem {
  id: string;
  word: string;
  englishMeaning: string;
  tamilMeaning?: string | null;
  createdAt: any;
  updatedAt: any;
}

export interface VocabularyStats {
  totalWords: number;
  recentlyAdded: number; // last 7 days
  tamilMeaningsCount: number;
}

export type SortOption = 'newest' | 'oldest' | 'alpha-asc' | 'alpha-desc';

export type FilterOption = 'all' | 'with-tamil' | 'without-tamil';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
