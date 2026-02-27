import { LRUCache } from "lru-cache";

interface RouteCacheValue {
  trafficSec: number;
  freeflowSec: number;
}

const cache = new LRUCache<string, RouteCacheValue>({
  max: 500,
  ttl: 1000 * 60 * 10
});

export function getFromCache(key: string): RouteCacheValue | undefined {
  return cache.get(key);
}

export function setInCache(key: string, value: RouteCacheValue): void {
  cache.set(key, value);
}
