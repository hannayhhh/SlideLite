import { getStore } from './store';
import { getCachedStore, setCachedStore } from './storeCache';

export const fetchData = async (token, options = {}) => {
  const { preferCache = false } = options;
  const cachedStore = getCachedStore();

  if (preferCache && cachedStore) {
    return cachedStore;
  }

  try {
    const response = await getStore();
    const latestStore = response.data.store.store || {};
    setCachedStore(latestStore);
    return latestStore;
  } catch (error) {
    console.error('Error fetching data:', error);
    return cachedStore || {};
  }
};
