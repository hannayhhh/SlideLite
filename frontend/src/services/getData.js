import axios from 'axios';

const baseUrl = 'http://localhost:5005/store';

export const fetchData = async (token) => {
  try {
    const response = await axios.get(baseUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.store.store;
  } catch (error) {
    console.error('Error fetching data:', error);
    return {};
  }
};
