let cachedStore = null;

export const getCachedStore = () => cachedStore;

export const setCachedStore = (store) => {
  cachedStore = store || null;
  return cachedStore;
};

export const clearCachedStore = () => {
  cachedStore = null;
};
