// Open dialog and Delete the current presentation
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '../context/StoreContext';

function useDeletePPT (presentationId) {
  const [deleteOpen, setOpen] = useState(false);
  const navigate = useNavigate();
  const { updateStoreData } = useStoreContext();

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await updateStoreData((latestStore) => {
        const newPresentations = { ...(latestStore.presentations || {}) };
        delete newPresentations[presentationId];
        return { ...latestStore, presentations: newPresentations };
      });
      navigate('/dashboard'); // back to dashboard after delete
    } catch (error) {
      console.error('Failed to delete presentation:', error);
    }
  };

  return { deleteOpen, handleOpenModal, handleCloseModal, handleDelete };
}

export default useDeletePPT;
