import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config.ts';
import { useAuth } from './AuthContext.tsx';
import {
  VocabularyItem,
  VocabularyStats,
  SortOption,
  FilterOption,
  ToastMessage,
} from '../types/index.ts';
import {
  calculateVocabularyStats,
  filterAndSortVocabulary,
  validateWordInput,
  isDuplicateWord,
} from '../utils/vocabulary.ts';

interface VocabularyContextType {
  items: VocabularyItem[];
  filteredItems: VocabularyItem[];
  stats: VocabularyStats;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  filterOption: FilterOption;
  setFilterOption: (option: FilterOption) => void;
  addWord: (word: string, englishMeaning: string, tamilMeaning?: string) => Promise<string>;
  updateWord: (id: string, word: string, englishMeaning: string, tamilMeaning?: string) => Promise<void>;
  deleteWord: (id: string) => Promise<void>;
  speakWord: (word: string) => void;
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

export const VocabularyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Text-to-speech pronunciation
  const speakWord = (word: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Attach Firestore onSnapshot listener for the authenticated user
  useEffect(() => {
    if (!currentUser) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const vocabColRef = collection(db, 'users', currentUser.uid, 'vocabulary');
    const vocabQuery = query(vocabColRef);

    const unsubscribe = onSnapshot(
      vocabQuery,
      (snapshot) => {
        const loaded: VocabularyItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loaded.push({
            id: docSnap.id,
            word: data.word,
            englishMeaning: data.englishMeaning,
            tamilMeaning: data.tamilMeaning ?? null,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        });
        setItems(loaded);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        handleFirestoreError(error, OperationType.LIST, `users/${currentUser.uid}/vocabulary`);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const stats = useMemo(() => calculateVocabularyStats(items), [items]);

  const filteredItems = useMemo(
    () => filterAndSortVocabulary(items, searchQuery, sortOption, filterOption),
    [items, searchQuery, sortOption, filterOption]
  );

  const addWord = async (rawWord: string, rawEnglish: string, rawTamil?: string): Promise<string> => {
    if (!currentUser) throw new Error('You must be signed in to add words.');

    const validation = validateWordInput(rawWord, rawEnglish, rawTamil);
    if (!validation.isValid) {
      const firstErr = Object.values(validation.errors)[0];
      throw new Error(firstErr || 'Invalid vocabulary input');
    }

    const { word, englishMeaning, tamilMeaning } = validation.sanitized;

    // Check duplicate
    if (isDuplicateWord(items, word)) {
      throw new Error(`"${word}" is already in your vocabulary collection.`);
    }

    const path = `users/${currentUser.uid}/vocabulary`;
    try {
      const docRef = await addDoc(collection(db, 'users', currentUser.uid, 'vocabulary'), {
        word,
        englishMeaning,
        tamilMeaning: tamilMeaning || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      addToast(`"${word}" added to your vocabulary!`, 'success');
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateWord = async (
    id: string,
    rawWord: string,
    rawEnglish: string,
    rawTamil?: string
  ): Promise<void> => {
    if (!currentUser) throw new Error('You must be signed in to update words.');

    const validation = validateWordInput(rawWord, rawEnglish, rawTamil);
    if (!validation.isValid) {
      const firstErr = Object.values(validation.errors)[0];
      throw new Error(firstErr || 'Invalid vocabulary input');
    }

    const { word, englishMeaning, tamilMeaning } = validation.sanitized;

    // Check duplicate against other items
    if (isDuplicateWord(items, word, id)) {
      throw new Error(`Another entry for "${word}" already exists.`);
    }

    const path = `users/${currentUser.uid}/vocabulary/${id}`;
    try {
      const wordDocRef = doc(db, 'users', currentUser.uid, 'vocabulary', id);
      await updateDoc(wordDocRef, {
        word,
        englishMeaning,
        tamilMeaning: tamilMeaning || null,
        updatedAt: serverTimestamp(),
      });
      addToast(`"${word}" updated successfully!`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deleteWord = async (id: string): Promise<void> => {
    if (!currentUser) throw new Error('You must be signed in to delete words.');

    const targetItem = items.find((i) => i.id === id);
    const path = `users/${currentUser.uid}/vocabulary/${id}`;
    try {
      const wordDocRef = doc(db, 'users', currentUser.uid, 'vocabulary', id);
      await deleteDoc(wordDocRef);
      addToast(`"${targetItem?.word || 'Word'}" removed from vocabulary.`, 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  return (
    <VocabularyContext.Provider
      value={{
        items,
        filteredItems,
        stats,
        loading,
        searchQuery,
        setSearchQuery,
        sortOption,
        setSortOption,
        filterOption,
        setFilterOption,
        addWord,
        updateWord,
        deleteWord,
        speakWord,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </VocabularyContext.Provider>
  );
};

export const useVocabulary = () => {
  const context = useContext(VocabularyContext);
  if (!context) {
    throw new Error('useVocabulary must be used within a VocabularyProvider');
  }
  return context;
};
