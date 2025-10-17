import type { Screenshot } from '@/types/profile';

/**
 * Глобальный кеш для скриншотов
 * Позволяет избежать повторных запросов к API
 */
class ScreenshotCache {
  private cache = new Map<string, Screenshot[]>();
  private loadingCache = new Map<string, boolean>();

  getCacheKey(profileId: string, platform: string): string {
    return `${profileId}-${platform}`;
  }

  get(profileId: string, platform: string): Screenshot[] | undefined {
    const key = this.getCacheKey(profileId, platform);
    return this.cache.get(key);
  }

  set(profileId: string, platform: string, screenshots: Screenshot[]): void {
    const key = this.getCacheKey(profileId, platform);
    this.cache.set(key, screenshots);
  }

  delete(profileId: string, platform: string): void {
    const key = this.getCacheKey(profileId, platform);
    this.cache.delete(key);
    this.loadingCache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.loadingCache.clear();
  }

  isLoading(profileId: string, platform: string): boolean {
    const key = this.getCacheKey(profileId, platform);
    return this.loadingCache.get(key) || false;
  }

  setLoading(profileId: string, platform: string, loading: boolean): void {
    const key = this.getCacheKey(profileId, platform);
    this.loadingCache.set(key, loading);
  }

  addToCache(profileId: string, platform: string, screenshot: Screenshot): void {
    const key = this.getCacheKey(profileId, platform);
    const current = this.cache.get(key) || [];
    this.cache.set(key, [screenshot, ...current]);
  }

  removeFromCache(profileId: string, platform: string, screenshotId: number): void {
    const key = this.getCacheKey(profileId, platform);
    const current = this.cache.get(key);
    if (current) {
      this.cache.set(
        key,
        current.filter((s) => s.id !== screenshotId)
      );
    }
  }
}

export const screenshotCache = new ScreenshotCache();
