import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function useLogout () {
  const navigate = useNavigate();
  const logout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.post('http://localhost:5005/admin/auth/logout', {}, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
        });
        console.log('Logout successful');
      } catch (error) {
        if (error.response) {
          console.error('Logout failed', error.response.data);
        } else if (error.request) {
          console.error('Logout failed', error.request);
        } else {
          console.error('Error', error.message);
        }
      }
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return logout;
}
