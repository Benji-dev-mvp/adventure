/**
 * Offline Storage
 * IndexedDB wrapper for offline data and sync queue
 */

const DB_NAME = 'artisan_offline_db';
const DB_VERSION = 1;
const STORES = {
  SYNC_QUEUE: 'sync_queue',
  CACHE: 'cache',
  DRAFTS: 'drafts',
};

/**
 * Open IndexedDB database
 */
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create sync queue store
      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        syncStore.createIndex('type', 'type', { unique: false });
      }

      // Create cache store
      if (!db.objectStoreNames.contains(STORES.CACHE)) {
        const cacheStore = db.createObjectStore(STORES.CACHE, {
          keyPath: 'key',
        });
        cacheStore.createIndex('expiresAt', 'expiresAt', { unique: false });
      }

      // Create drafts store
      if (!db.objectStoreNames.contains(STORES.DRAFTS)) {
        const draftsStore = db.createObjectStore(STORES.DRAFTS, {
          keyPath: 'id',
        });
        draftsStore.createIndex('type', 'type', { unique: false });
        draftsStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };
  });
};

/**
 * Sync Queue Operations
 */
export const syncQueue = {
  /**
   * Add operation to sync queue
   */
  async add(operation) {
    const db = await openDB();
    const transaction = db.transaction([STORES.SYNC_QUEUE], 'readwrite');
    const store = transaction.objectStore(STORES.SYNC_QUEUE);

    const item = {
      ...operation,
      timestamp: Date.now(),
      status: 'pending',
    };

    return new Promise((resolve, reject) => {
      const request = store.add(item);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Get all pending operations
   */
  async getPending() {
    const db = await openDB();
    const transaction = db.transaction([STORES.SYNC_QUEUE], 'readonly');
    const store = transaction.objectStore(STORES.SYNC_QUEUE);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const items = request.result.filter((item) => item.status === 'pending');
        resolve(items);
      };
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Mark operation as synced
   */
  async markSynced(id) {
    const db = await openDB();
    const transaction = db.transaction([STORES.SYNC_QUEUE], 'readwrite');
    const store = transaction.objectStore(STORES.SYNC_QUEUE);

    return new Promise((resolve, reject) => {
      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.status = 'synced';
          item.syncedAt = Date.now();
          const updateRequest = store.put(item);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  },

  /**
   * Clear synced operations older than specified days
   */
  async clearOld(days = 7) {
    const db = await openDB();
    const transaction = db.transaction([STORES.SYNC_QUEUE], 'readwrite');
    const store = transaction.objectStore(STORES.SYNC_QUEUE);
    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;

    return new Promise((resolve, reject) => {
      const request = store.openCursor();
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const item = cursor.value;
          if (item.status === 'synced' && item.syncedAt < cutoffTime) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  },
};

/**
 * Cache Operations
 */
export const cache = {
  /**
   * Set cache item with TTL
   */
  async set(key, value, ttlSeconds = 3600) {
    const db = await openDB();
    const transaction = db.transaction([STORES.CACHE], 'readwrite');
    const store = transaction.objectStore(STORES.CACHE);

    const item = {
      key,
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    };

    return new Promise((resolve, reject) => {
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Get cache item
   */
  async get(key) {
    const db = await openDB();
    const transaction = db.transaction([STORES.CACHE], 'readonly');
    const store = transaction.objectStore(STORES.CACHE);

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        const item = request.result;
        if (item && item.expiresAt > Date.now()) {
          resolve(item.value);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Clear expired cache items
   */
  async clearExpired() {
    const db = await openDB();
    const transaction = db.transaction([STORES.CACHE], 'readwrite');
    const store = transaction.objectStore(STORES.CACHE);
    const now = Date.now();

    return new Promise((resolve, reject) => {
      const request = store.openCursor();
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.expiresAt <= now) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  },
};

/**
 * Drafts Operations
 */
export const drafts = {
  /**
   * Save draft
   */
  async save(type, id, data) {
    const db = await openDB();
    const transaction = db.transaction([STORES.DRAFTS], 'readwrite');
    const store = transaction.objectStore(STORES.DRAFTS);

    const item = {
      id: `${type}_${id}`,
      type,
      data,
      updatedAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Get draft
   */
  async get(type, id) {
    const db = await openDB();
    const transaction = db.transaction([STORES.DRAFTS], 'readonly');
    const store = transaction.objectStore(STORES.DRAFTS);

    return new Promise((resolve, reject) => {
      const request = store.get(`${type}_${id}`);
      request.onsuccess = () => resolve(request.result?.data || null);
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Delete draft
   */
  async delete(type, id) {
    const db = await openDB();
    const transaction = db.transaction([STORES.DRAFTS], 'readwrite');
    const store = transaction.objectStore(STORES.DRAFTS);

    return new Promise((resolve, reject) => {
      const request = store.delete(`${type}_${id}`);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Get all drafts of a type
   */
  async getByType(type) {
    const db = await openDB();
    const transaction = db.transaction([STORES.DRAFTS], 'readonly');
    const store = transaction.objectStore(STORES.DRAFTS);
    const index = store.index('type');

    return new Promise((resolve, reject) => {
      const request = index.getAll(type);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
};

export default {
  syncQueue,
  cache,
  drafts,
};
