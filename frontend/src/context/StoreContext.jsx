import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchData } from '../services/getData';
import { upgradeData } from '../services/putData';
import { clearCachedStore, getCachedStore } from '../services/storeCache';
import { normalizeStoreShape } from '../utils/presentations';

const StoreContext = createContext(null);

export function StoreProvider ({ children }) {
  const location = useLocation();
  const [store, setStore] = useState(() => {
    const cachedStore = getCachedStore();
    return cachedStore ? normalizeStoreShape(cachedStore).store : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const clearStoreData = useCallback(() => {
    clearCachedStore();
    setStore(null);
    setIsLoading(false);
  }, []);

  const refreshStore = useCallback(async (options = {}) => {
    const { background = false } = options;
    const token = localStorage.getItem('token');

    if (!token) {
      clearStoreData();
      return null;
    }

    if (!background || !store) {
      setIsLoading(true);
    }

    try {
      const fetchedStore = await fetchData(token);
      const { store: normalizedStore, changed } = normalizeStoreShape(fetchedStore);
      setStore(normalizedStore);
      if (changed) {
        await upgradeData(token, normalizedStore);
      }
      return normalizedStore;
    } finally {
      setIsLoading(false);
    }
  }, [clearStoreData, store]);

  const updateStoreData = useCallback(async (storeOrUpdater, options = {}) => {
    const { refresh = false } = options;
    const token = localStorage.getItem('token');

    if (!token) {
      clearStoreData();
      return null;
    }

    const previousStore = normalizeStoreShape(getCachedStore() || store || {}).store;
    const rawNextStore = typeof storeOrUpdater === 'function'
      ? storeOrUpdater(previousStore)
      : storeOrUpdater;
    const nextStore = normalizeStoreShape(rawNextStore || {}).store;

    try {
      setStore(nextStore);
      await upgradeData(token, nextStore);
    } catch (error) {
      setStore(previousStore);
      throw error;
    }

    if (refresh) {
      return refreshStore({ background: true });
    }

    return nextStore;
  }, [clearStoreData, refreshStore, store]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      clearStoreData();
      return;
    }

    if (!store) {
      refreshStore();
    }
  }, [clearStoreData, location.pathname, refreshStore, store]);

  const value = useMemo(() => ({
    store,
    isLoading,
    refreshStore,
    updateStoreData,
    clearStoreData,
  }), [clearStoreData, isLoading, refreshStore, store, updateStoreData]);

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStoreContext () {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }

  return context;
}
