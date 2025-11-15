// Enhanced Search History Management
const SEARCH_HISTORY_KEY = 'ibedes_search_history';
const SEARCH_HISTORY_LIMIT = 10;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  type?: 'all' | 'article' | 'service' | 'project';
  results?: number;
}

/**
 * Get search history from localStorage
 */
export const getSearchHistory = (): SearchHistoryItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Save search query to history
 */
export const saveSearchToHistory = (query: string, type: 'all' | 'article' | 'service' | 'project' = 'all', results: number = 0): void => {
  if (typeof window === 'undefined' || !query.trim()) return;
  
  const history = getSearchHistory();
  
  // Remove existing entry if query already exists
  const existingIndex = history.findIndex(item => item.query.toLowerCase() === query.toLowerCase());
  if (existingIndex > -1) {
    history.splice(existingIndex, 1);
  }
  
  // Add new entry at the beginning
  history.unshift({
    query: query.trim(),
    timestamp: Date.now(),
    type,
    results
  });
  
  // Keep only the last N entries
  const trimmedHistory = history.slice(0, SEARCH_HISTORY_LIMIT);
  
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.warn('Failed to save search history:', error);
  }
};

/**
 * Clear search history
 */
export const clearSearchHistory = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.warn('Failed to clear search history:', error);
  }
};

/**
 * Get popular search terms (most searched)
 */
export const getPopularSearchTerms = (limit: number = 5): string[] => {
  const history = getSearchHistory();
  
  // Count frequency of search terms
  const termCounts: Record<string, number> = {};
  
  history.forEach(item => {
    const query = item.query.toLowerCase().trim();
    termCounts[query] = (termCounts[query] || 0) + 1;
  });
  
  // Sort by frequency and return top terms
  return Object.entries(termCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([term]) => term);
};

/**
 * Search suggestions based on history and popular terms
 */
export const getSearchSuggestions = (input: string, limit: number = 5): SearchHistoryItem[] => {
  if (!input.trim()) return [];
  
  const history = getSearchHistory();
  const inputLower = input.toLowerCase();
  
  // Filter history that matches the input
  const matches = history.filter(item => 
    item.query.toLowerCase().includes(inputLower)
  );
  
  // Sort by timestamp (most recent first) and limit results
  return matches
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
};

/**
 * Generate mock popular terms for demo
 */
export const getMockPopularTerms = (): string[] => [
  'belajar bahasa',
  'produktivitas',
  'tips karir',
  'mindset growth',
  'self improvement',
  'teknologi',
  'kehidupan',
  'motivasi',
  'skill development',
  'work life balance'
];

/**
 * Initialize search history functionality
 */
export const initSearchHistory = (): void => {
  if (typeof window === 'undefined') return;
  
  // Add some mock popular terms if no history exists
  const history = getSearchHistory();
  if (history.length === 0) {
    const mockHistory: SearchHistoryItem[] = [
      { query: 'belajar bahasa', timestamp: Date.now() - 3600000, type: 'article', results: 5 },
      { query: 'produktivitas', timestamp: Date.now() - 7200000, type: 'article', results: 8 },
      { query: 'mindset', timestamp: Date.now() - 10800000, type: 'article', results: 3 }
    ];
    
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(mockHistory));
    } catch (error) {
      console.warn('Failed to initialize mock search history:', error);
    }
  }
};

// Initialize on load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initSearchHistory);
}