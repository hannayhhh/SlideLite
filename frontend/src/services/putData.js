import axios from 'axios';

const baseUrl = 'http://localhost:5005/store';

export const upgradeData = async (token, data) => {
  try {
    await axios.put(baseUrl, { store: data }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};
