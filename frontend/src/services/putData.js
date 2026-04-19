import { updateStore } from './store';

export const upgradeData = async (token, data) => {
  try {
    await updateStore(data);
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};
