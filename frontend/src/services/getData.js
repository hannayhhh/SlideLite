import { getStore } from './store';

export const fetchData = async (token) => {
  try {
    const response = await getStore();
    return response.data.store.store;
  } catch (error) {
    console.error('Error fetching data:', error);
    return {};
  }
};
