// Open dialog and Edit the PPT title
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { upgradeData } from '../services/putData';
import { fetchData } from '../services/getData';

function useEditTitle (pptName, editedName) {
  const [editOpen, setEditOpen] = useState(false);
  const navigate = useNavigate();

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
      const storeData = await fetchData(token); // Fetch current store
      if (pptName === editedName) {
        console.log('New name is the same as the old name.');
        setEditOpen(false);
        return;
      }
      const newPresentations = { ...storeData.presentations }; // Copy presentations
      if (newPresentations[pptName]) {
        newPresentations[editedName] = { ...newPresentations[pptName] }; // create new name & copy the old value
        delete newPresentations[pptName];
      } else {
        console.error('Presentation not found.');
        return;
      }
      await upgradeData(token, { ...storeData, presentations: newPresentations }); // Update the presentations
      navigate(`/presentation/${editedName}`);
      setEditOpen(false);
    } catch (error) {
      console.error('Failed to delete presentation:', error);
    }
  };

  return { editOpen, handleEditOpen, handleEditClose, handleEditTitle };
}

export default useEditTitle;
