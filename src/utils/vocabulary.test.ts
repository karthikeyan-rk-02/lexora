import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateVocabularyStats,
  filterAndSortVocabulary,
  validateWordInput,
  isDuplicateWord,
} from './vocabulary.ts';
import { VocabularyItem } from '../types/index.ts';

const mockItems: VocabularyItem[] = [
  {
    id: '1',
    word: 'Serendipity',
    englishMeaning: 'Finding good things without looking for them by chance',
    tamilMeaning: 'எதிர்பாராத அதிர்ஷ்ட நிகழ்வு',
    createdAt: new Date('2026-10-18T10:00:00Z'),
    updatedAt: new Date('2026-10-18T10:00:00Z'),
  },
  {
    id: '2',
    word: 'Ephemeral',
    englishMeaning: 'Lasting for a very short time',
    tamilMeaning: 'நிலையற்ற, குறுகிய காலம் நீடிக்கும்',
    createdAt: new Date('2026-10-10T10:00:00Z'), // More than 7 days from Oct 20
    updatedAt: new Date('2026-10-10T10:00:00Z'),
  },
  {
    id: '3',
    word: 'Petrichor',
    englishMeaning: 'A pleasant smell that frequently accompanies the first rain',
    tamilMeaning: null, // No Tamil meaning
    createdAt: new Date('2026-10-19T10:00:00Z'),
    updatedAt: new Date('2026-10-19T10:00:00Z'),
  },
  {
    id: '4',
    word: 'Aubade',
    englishMeaning: 'A poem or piece of music appropriate to the dawn or morning',
    tamilMeaning: 'காலைப்பாடல்',
    createdAt: new Date('2026-10-20T08:00:00Z'),
    updatedAt: new Date('2026-10-20T08:00:00Z'),
  },
];

test('calculateVocabularyStats calculates total, recent within 7 days, and tamil count correctly', () => {
  const refDate = new Date('2026-10-20T22:00:00Z');
  const stats = calculateVocabularyStats(mockItems, refDate);

  assert.equal(stats.totalWords, 4);
  // Serendipity (Oct 18), Petrichor (Oct 19), Aubade (Oct 20) are within 7 days
  // Ephemeral (Oct 10) is 10 days ago
  assert.equal(stats.recentlyAdded, 3);
  // Serendipity, Ephemeral, Aubade have Tamil meanings
  assert.equal(stats.tamilMeaningsCount, 3);
});

test('filterAndSortVocabulary searches by English word', () => {
  const results = filterAndSortVocabulary(mockItems, 'seren');
  assert.equal(results.length, 1);
  assert.equal(results[0].word, 'Serendipity');
});

test('filterAndSortVocabulary searches by English meaning keyword', () => {
  const results = filterAndSortVocabulary(mockItems, 'pleasant smell');
  assert.equal(results.length, 1);
  assert.equal(results[0].word, 'Petrichor');
});

test('filterAndSortVocabulary searches by Tamil meaning unicode characters', () => {
  const results = filterAndSortVocabulary(mockItems, 'அதிர்ஷ்ட');
  assert.equal(results.length, 1);
  assert.equal(results[0].word, 'Serendipity');
});

test('filterAndSortVocabulary sorts alphabetically A-Z and Z-A', () => {
  const sortedAsc = filterAndSortVocabulary(mockItems, '', 'alpha-asc');
  assert.deepEqual(
    sortedAsc.map((i) => i.word),
    ['Aubade', 'Ephemeral', 'Petrichor', 'Serendipity']
  );

  const sortedDesc = filterAndSortVocabulary(mockItems, '', 'alpha-desc');
  assert.deepEqual(
    sortedDesc.map((i) => i.word),
    ['Serendipity', 'Petrichor', 'Ephemeral', 'Aubade']
  );
});

test('filterAndSortVocabulary filters by Tamil availability', () => {
  const withTamil = filterAndSortVocabulary(mockItems, '', 'newest', 'with-tamil');
  assert.equal(withTamil.length, 3);

  const withoutTamil = filterAndSortVocabulary(mockItems, '', 'newest', 'without-tamil');
  assert.equal(withoutTamil.length, 1);
  assert.equal(withoutTamil[0].word, 'Petrichor');
});

test('validateWordInput enforces required fields and trims input', () => {
  const emptyRes = validateWordInput('', '');
  assert.equal(emptyRes.isValid, false);
  assert.ok(emptyRes.errors.word);
  assert.ok(emptyRes.errors.englishMeaning);

  const validRes = validateWordInput('  Eloquent  ', '  Fluent in speaking  ', '  பேச்சாற்றல்மிக்க  ');
  assert.equal(validRes.isValid, true);
  assert.equal(validRes.sanitized.word, 'Eloquent');
  assert.equal(validRes.sanitized.englishMeaning, 'Fluent in speaking');
  assert.equal(validRes.sanitized.tamilMeaning, 'பேச்சாற்றல்மிக்க');
});

test('isDuplicateWord detects existing words case-insensitively', () => {
  assert.equal(isDuplicateWord(mockItems, 'serendipity'), true);
  assert.equal(isDuplicateWord(mockItems, 'SERENDIPITY'), true);
  assert.equal(isDuplicateWord(mockItems, 'Ubiquitous'), false);
  // Exclude current id when editing
  assert.equal(isDuplicateWord(mockItems, 'Serendipity', '1'), false);
});
