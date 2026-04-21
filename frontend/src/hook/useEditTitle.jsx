// Open dialog and Edit the PPT title
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '../context/StoreContext';

function useEditTitle (presentationId, editedName) {
  const [editOpen, setEditOpen] = useState(false);
  const navigate = useNavigate();
  const { store, updateStoreData } = useStoreContext();

  const handleEditOpen = () => {
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleEditTitle = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const trimmedName = editedName.trim();
      const currentName = store?.presentations?.[presentationId]?.name || '';
      if (!trimmedName || currentName === trimmedName) {
        console.log('New name is the same as the old name.');
        setEditOpen(false);
        return;
      }

      await updateStoreData((latestStore) => {
        const newPresentations = { ...(latestStore.presentations || {}) };
        if (!newPresentations[presentationId]) {
          console.error('Presentation not found.');
          return latestStore;
        }

        newPresentations[presentationId] = {
          ...newPresentations[presentationId],
          name: trimmedName
        };
        return { ...latestStore, presentations: newPresentations };
      });

      navigate(`/presentation/${presentationId}`);
      setEditOpen(false);
    } catch (error) {
      console.error('Failed to delete presentation:', error);
    }
  };

  return { editOpen, handleEditOpen, handleEditClose, handleEditTitle };
}

export default useEditTitle;
