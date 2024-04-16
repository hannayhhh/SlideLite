// Open dialog and Delete the current presentation
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { upgradeData } from '../services/putData';
import { fetchData } from '../services/getData';

function useDeletePPT (pptName) {
  const [deleteOpen, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const storeData = await fetchData(token); // Fetch current store
      const newPresentations = { ...storeData.presentations }; // Copy presentations
      delete newPresentations[pptName];
      await upgradeData(token, { ...storeData, presentations: newPresentations }); // Update the presentations
      navigate('/dashboard'); // back to dashboard after delete
    } catch (error) {
      console.error('Failed to delete presentation:', error);
    }
  };

  return { deleteOpen, handleOpenModal, handleCloseModal, handleDelete };
}

export default useDeletePPT;
