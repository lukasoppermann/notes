/**
 * Utility functions for managing favorites in localStorage
 */

const FAVORITES_KEY = 'notes-favorites';

export interface Favorite {
  url: string;
  title: string;
  category: string;
  addedAt: number;
}

/**
 * Get all favorites from localStorage
 */
export function getFavorites(): Favorite[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Add a page to favorites
 */
export function addFavorite(url: string, title: string, category: string): void {
  if (typeof window === 'undefined') return;
  
  const favorites = getFavorites();
  
  // Don't add if already exists
  if (favorites.some(fav => fav.url === url)) {
    return;
  }
  
  const newFavorite: Favorite = {
    url,
    title,
    category,
    addedAt: Date.now()
  };
  
  favorites.push(newFavorite);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  
  // Dispatch custom event for other components to listen to
  window.dispatchEvent(new CustomEvent('favoritesChanged', { detail: favorites }));
}

/**
 * Remove a page from favorites
 */
export function removeFavorite(url: string): void {
  if (typeof window === 'undefined') return;
  
  const favorites = getFavorites();
  const filtered = favorites.filter(fav => fav.url !== url);
  
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  
  // Dispatch custom event for other components to listen to
  window.dispatchEvent(new CustomEvent('favoritesChanged', { detail: filtered }));
}

/**
 * Check if a page is favorited
 */
export function isFavorite(url: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const favorites = getFavorites();
  return favorites.some(fav => fav.url === url);
}

/**
 * Get favorites grouped by category
 */
export function getFavoritesByCategory(): Record<string, Favorite[]> {
  const favorites = getFavorites();
  const grouped: Record<string, Favorite[]> = {};
  
  favorites.forEach(fav => {
    if (!grouped[fav.category]) {
      grouped[fav.category] = [];
    }
    grouped[fav.category].push(fav);
  });
  
  // Sort favorites within each category by title
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => a.title.localeCompare(b.title));
  });
  
  return grouped;
}
