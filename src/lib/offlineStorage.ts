/**
 * Offline Storage Service
 * IndexedDB wrapper for offline support and data persistence
 */

const DB_NAME = 'artisan_offline_db';
const DB_VERSION = 1;

// Store names
export const STORES = {
  LEADS: 'leads',
  CAMPAIGNS: 'campaigns',
  TEMPLATES: 'templates',
  DRAFTS: 'drafts',
  SYNC_QUEUE: 'sync_queue',
  CACHE: 'cache',
} as const;

type StoreName = (typeof STORES)[keyof typeof STORES];

// Sync queue item
export interface SyncQueueItem {
  id: string;
  store: StoreName;
  action: 'create' | 'update' | 'delete';
  data: unknown;
  timestamp: number;
  retries: number;
  lastError?: string;
}

let db: IDBDatabase | null = null;

/**
 * Initialize IndexedDB
 */
export function initializeOfflineStorage(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('[OfflineStorage] Failed to open database:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      console.log('[OfflineStorage] Database opened successfully');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      console.log('[OfflineStorage] Upgrading database schema');

      // Create object stores
      if (!database.objectStoreNames.contains(STORES.LEADS)) {
        const leadsStore = database.createObjectStore(STORES.LEADS, { keyPath: 'id' });
        leadsStore.createIndex('email', 'email', { unique: true });
        leadsStore.createIndex('status', 'status', { unique: false });
        leadsStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      if (!database.objectStoreNames.contains(STORES.CAMPAIGNS)) {
        const campaignsStore = database.createObjectStore(STORES.CAMPAIGNS, { keyPath: 'id' });
        campaignsStore.createIndex('status', 'status', { unique: false });
        campaignsStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      if (!database.objectStoreNames.contains(STORES.TEMPLATES)) {
        const templatesStore = database.createObjectStore(STORES.TEMPLATES, { keyPath: 'id' });
        templatesStore.createIndex('type', 'type', { unique: false });
      }

      if (!database.objectStoreNames.contains(STORES.DRAFTS)) {
        const draftsStore = database.createObjectStore(STORES.DRAFTS, { keyPath: 'id' });
        draftsStore.createIndex('type', 'type', { unique: false });
        draftsStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      if (!database.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        const syncStore = database.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id' });
        syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        syncStore.createIndex('store', 'store', { unique: false });
      }

      if (!database.objectStoreNames.contains(STORES.CACHE)) {
        const cacheStore = database.createObjectStore(STORES.CACHE, { keyPath: 'key' });
        cacheStore.createIndex('expiresAt', 'expiresAt', { unique: false });
      }
    };
  });
}

/**
 * Get database instance
 */
async function getDB(): Promise<IDBDatabase> {
  if (!db) {
    return initializeOfflineStorage();
  }
  return db;
}

/**
 * Generic get operation
 */
export async function get<T>(store: StoreName, key: string): Promise<T | undefined> {
  const database = await getDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(store, 'readonly');
    const objectStore = transaction.objectStore(store);
    const request = objectStore.get(key);

    request.onsuccess = () => resolve(request.result as T);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Generic getAll operation
 */
export async function getAll<T>(store: StoreName): Promise<T[]> {
  const database = await getDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(store, 'readonly');
    const objectStore = transaction.objectStore(store);
    const request = objectStore.getAll();

    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Generic put operation
 */
export async function put<T>(store: StoreName, data: T): Promise<void> {
  const database = await getDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(store, 'readwrite');
    const objectStore = transaction.objectStore(store);
    const request = objectStore.put(data);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Generic delete operation
 */
export async function remove(store: StoreName, key: string): Promise<void> {
  const database = await getDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(store, 'readwrite');
    const objectStore = transaction.objectStore(store);
    const request = objectStore.delete(key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clear all data in a store
 */
export async function clear(store: StoreName): Promise<void> {
  const database = await getDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(store, 'readwrite');
    const objectStore = transaction.objectStore(store);
    const request = objectStore.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// ============================================
// Sync Queue Operations
// ============================================

/**
 * Add item to sync queue
 */
export async function addToSyncQueue(
  store: StoreName,
  action: SyncQueueItem['action'],
  data: unknown
): Promise<void> {
  const item: SyncQueueItem = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    store,
    action,
    data,
    timestamp: Date.now(),
    retries: 0,
  };

  await put(STORES.SYNC_QUEUE, item);
}

/**
 * Get pending sync items
 */
export async function getPendingSyncItems(): Promise<SyncQueueItem[]> {
  return getAll<SyncQueueItem>(STORES.SYNC_QUEUE);
}

/**
 * Remove item from sync queue
 */
export async function removeSyncItem(id: string): Promise<void> {
  return remove(STORES.SYNC_QUEUE, id);
}

/**
 * Update sync item (e.g., increment retries)
 */
export async function updateSyncItem(item: SyncQueueItem): Promise<void> {
  return put(STORES.SYNC_QUEUE, item);
}

// ============================================
// Cache Operations
// ============================================

interface CacheItem<T> {
  key: string;
  data: T;
  expiresAt: number;
}

/**
 * Set cache item with TTL
 */
export async function setCache<T>(
  key: string,
  data: T,
  ttlMs: number = 5 * 60 * 1000 // 5 minutes default
): Promise<void> {
  const item: CacheItem<T> = {
    key,
    data,
    expiresAt: Date.now() + ttlMs,
  };

  await put(STORES.CACHE, item);
}

/**
 * Get cache item (returns undefined if expired)
 */
export async function getCache<T>(key: string): Promise<T | undefined> {
  const item = await get<CacheItem<T>>(STORES.CACHE, key);
  
  if (!item) return undefined;
  
  if (Date.now() > item.expiresAt) {
    // Expired, remove it
    await remove(STORES.CACHE, key);
    return undefined;
  }
  
  return item.data;
}

/**
 * Clear expired cache items
 */
export async function clearExpiredCache(): Promise<void> {
  const database = await getDB();
  const now = Date.now();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORES.CACHE, 'readwrite');
    const objectStore = transaction.objectStore(STORES.CACHE);
    const index = objectStore.index('expiresAt');
    const range = IDBKeyRange.upperBound(now);
    const request = index.openCursor(range);

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// ============================================
// React Hooks
// ============================================

import { useState, useEffect } from 'react';

/**
 * Hook to check if app is offline
 */
export function useOfflineStatus(): boolean {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
}

/**
 * Hook to get pending sync count
 */
export function usePendingSyncCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const checkPending = async () => {
      try {
        const items = await getPendingSyncItems();
        setCount(items.length);
      } catch (error) {
        console.error('[OfflineStorage] Failed to get pending sync count:', error);
      }
    };

    checkPending();
    
    // Check periodically
    const interval = setInterval(checkPending, 30000);
    return () => clearInterval(interval);
  }, []);

  return count;
}

export default {
  initializeOfflineStorage,
  get,
  getAll,
  put,
  remove,
  clear,
  addToSyncQueue,
  getPendingSyncItems,
  removeSyncItem,
  updateSyncItem,
  setCache,
  getCache,
  clearExpiredCache,
  useOfflineStatus,
  usePendingSyncCount,
  STORES,
};
