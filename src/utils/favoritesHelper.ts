/**
 * Helpers pour gérer les favoris Omra
 * - Sauvegarde locale (localStorage)
 * - Events custom pour synchronisation UI
 */

export const FAVORITES_STORAGE_KEY = 'omra_favorites';

/**
 * Récupère tous les IDs favoris
 */
export const getFavorites = (): string[] => {
  try {
    const favorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error reading favorites:', error);
    return [];
  }
};

/**
 * Vérifie si une offre est favorite
 */
export const isFavorite = (offerId: string): boolean => {
  const favorites = getFavorites();
  return favorites.includes(offerId);
};

/**
 * Ajoute une offre aux favoris
 */
export const addFavorite = (offerId: string): void => {
  try {
    const favorites = getFavorites();
    
    if (!favorites.includes(offerId)) {
      favorites.push(offerId);
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      
      // Dispatch event pour mettre à jour le compteur
      window.dispatchEvent(new Event('favorites-updated'));
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
  }
};

/**
 * Retire une offre des favoris
 */
export const removeFavorite = (offerId: string): void => {
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(id => id !== offerId);
    
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(filtered));
    
    // Dispatch event pour mettre à jour le compteur
    window.dispatchEvent(new Event('favorites-updated'));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
};

/**
 * Toggle favori (ajoute si absent, retire si présent)
 */
export const toggleFavorite = (offerId: string): boolean => {
  const isCurrentlyFavorite = isFavorite(offerId);
  
  if (isCurrentlyFavorite) {
    removeFavorite(offerId);
    return false;
  } else {
    addFavorite(offerId);
    return true;
  }
};

/**
 * Compte le nombre de favoris
 */
export const getFavoritesCount = (): number => {
  return getFavorites().length;
};

/**
 * Efface tous les favoris
 */
export const clearAllFavorites = (): void => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new Event('favorites-updated'));
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
};
