/**
 * Système de cache simple pour les requêtes API
 * Réduit la charge sur Supabase et améliore les performances
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class APICache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Génère une clé de cache à partir d'une requête
   */
  private generateKey(key: string, params?: Record<string, any>): string {
    if (!params) return key;
    const sortedParams = Object.keys(params)
      .sort()
      .map(k => `${k}=${JSON.stringify(params[k])}`)
      .join('&');
    return `${key}?${sortedParams}`;
  }

  /**
   * Vérifie si une entrée de cache est valide
   */
  private isValid<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < entry.expiresIn;
  }

  /**
   * Récupère une valeur du cache
   */
  get<T>(key: string, params?: Record<string, any>): T | null {
    const cacheKey = this.generateKey(key, params);
    const entry = this.cache.get(cacheKey);

    if (!entry) return null;

    if (this.isValid(entry)) {
      console.log('✅ Cache HIT:', cacheKey);
      return entry.data as T;
    }

    // Supprimer l'entrée expirée
    this.cache.delete(cacheKey);
    console.log('❌ Cache MISS (expired):', cacheKey);
    return null;
  }

  /**
   * Stocke une valeur dans le cache
   */
  set<T>(key: string, data: T, params?: Record<string, any>, ttl: number = this.DEFAULT_TTL): void {
    const cacheKey = this.generateKey(key, params);
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      expiresIn: ttl,
    });
    console.log('💾 Cache SET:', cacheKey, `(TTL: ${ttl}ms)`);
  }

  /**
   * Invalide une clé de cache spécifique
   */
  invalidate(key: string, params?: Record<string, any>): void {
    const cacheKey = this.generateKey(key, params);
    this.cache.delete(cacheKey);
    console.log('🗑️ Cache INVALIDATED:', cacheKey);
  }

  /**
   * Invalide toutes les clés qui commencent par un préfixe
   */
  invalidatePrefix(prefix: string): void {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    console.log(`🗑️ Cache INVALIDATED (prefix: ${prefix}): ${count} entries`);
  }

  /**
   * Vide tout le cache
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`🗑️ Cache CLEARED: ${size} entries`);
  }

  /**
   * Nettoie les entrées expirées
   */
  cleanup(): void {
    let count = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (!this.isValid(entry)) {
        this.cache.delete(key);
        count++;
      }
    }
    if (count > 0) {
      console.log(`🧹 Cache CLEANED: ${count} expired entries`);
    }
  }

  /**
   * Retourne les statistiques du cache
   */
  getStats() {
    let valid = 0;
    let expired = 0;

    for (const entry of this.cache.values()) {
      if (this.isValid(entry)) {
        valid++;
      } else {
        expired++;
      }
    }

    return {
      total: this.cache.size,
      valid,
      expired,
      memoryEstimate: `~${Math.round(this.cache.size * 1024 / 1024 * 100) / 100} MB`,
    };
  }
}

// Export singleton
export const apiCache = new APICache();

// Nettoyer le cache toutes les 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    apiCache.cleanup();
  }, 10 * 60 * 1000);
}

/**
 * Helper pour wrapper une fonction asynchrone avec du caching
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: {
    params?: Record<string, any>;
    ttl?: number;
    forceRefresh?: boolean;
  }
): Promise<T> {
  const { params, ttl, forceRefresh = false } = options || {};

  // Vérifier le cache sauf si forceRefresh
  if (!forceRefresh) {
    const cached = apiCache.get<T>(key, params);
    if (cached !== null) {
      return cached;
    }
  }

  // Fetch et cache
  const data = await fetcher();
  apiCache.set(key, data, params, ttl);
  return data;
}
