import { updateStore } from './store';
import { getCachedStore, setCachedStore } from './storeCache';

export const upgradeData = async (token, data) => {
  const previousStore = getCachedStore();
  try {
    setCachedStore(data);
    await updateStore(data);
  } catch (error) {
    setCachedStore(previousStore);
    console.error('Error updating data:', error);
    throw error;
  }
};
